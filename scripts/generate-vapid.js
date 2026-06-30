// Run with: npm run gen:vapid
// Prints a public/private key pair to paste into your .env file for web push notifications.
const webpush = require("web-push");
const keys = webpush.generateVAPIDKeys();
console.log("\nAdd these to your .env file:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}\n`);
