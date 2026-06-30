// One place that decides what a person is allowed to do, based on their profile row.

export function getAccessStatus(profile) {
  if (!profile) return "locked";
  if (profile.is_subscribed) return "active";
  if (profile.trial_ends_at && new Date() < new Date(profile.trial_ends_at)) {
    return "trial";
  }
  return "locked";
}

export function daysLeftInTrial(profile) {
  if (!profile?.trial_ends_at) return 0;
  const diffMs = new Date(profile.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function canCreateGoal(profile) {
  return getAccessStatus(profile) !== "locked";
}
