-- Run this once in your Supabase project: Dashboard > SQL Editor > New query > paste > Run.

create extension if not exists "pgcrypto";

-- One row per signed-up person. Created automatically by the trigger below.
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  created_at timestamptz default now(),
  trial_ends_at timestamptz default (now() + interval '3 days'),
  is_subscribed boolean default false,
  plan text,                                   -- 'lifetime' or 'monthly'
  subscription_status text default 'trial',    -- trial | active | past_due | canceled
  chapa_tx_ref text
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- One row per wanted item / savings goal.
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  product_url text,
  image_url text,
  target_amount numeric not null,
  currency text default 'USD',
  saved_amount numeric default 0,
  status text default 'active',   -- active | reached | claimed | archived
  created_at timestamptz default now()
);

-- Every deposit a person logs toward a goal.
create table if not exists savings_logs (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals(id) on delete cascade,
  amount numeric not null,
  note text,
  created_at timestamptz default now()
);

-- Browser push subscriptions, so we can notify someone when a goal is reached.
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table goals enable row level security;
alter table savings_logs enable row level security;
alter table push_subscriptions enable row level security;

drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "manage own goals" on goals;
create policy "manage own goals" on goals for all using (auth.uid() = user_id);

drop policy if exists "manage own savings logs" on savings_logs;
create policy "manage own savings logs" on savings_logs for all using (
  goal_id in (select id from goals where user_id = auth.uid())
);

drop policy if exists "manage own push subs" on push_subscriptions;
create policy "manage own push subs" on push_subscriptions for all using (auth.uid() = user_id);
