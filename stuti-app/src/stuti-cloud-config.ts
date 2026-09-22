/* ============================================================
   STUTI — the few public values the server side needs
   Hand-authored. Everything here is safe to ship inside the app:
   a Supabase project URL and its anon (publishable) key are public
   by design, because every table sits behind row-level security
   (stuti-app/supabase/schema.sql); a Razorpay Payment Button id is
   printed on any page that embeds the button. No secret ever goes
   in this file.

   Blank means "not set up yet", and every feature that reads a
   blank value stays exactly as the beta has it: the account screen
   says so, nothing syncs, feedback falls back to mail, the lamp
   stays a preview. See stuti-app/docs/backend.md.
   ============================================================ */
export const STUTI_CLOUD_CONFIG = {
  supabaseUrl: "",        // https://<ref>.supabase.co
  supabaseAnonKey: "",    // Project Settings → API → anon / publishable key
  /* which sign-in doors are switched on in Supabase → Authentication → Providers.
     Phone needs an SMS provider (MSG91, Twilio…) configured there first. */
  providers: { email: true, phone: false, google: false },
};

/* One Payment Button per amount, created in Razorpay → Payment Pages →
   Payment Buttons for exactly that amount. Blank keeps that amount a preview. */
export const STUTI_RAZORPAY_IDS = { day: "", month: "", year: "", patron: "" };

/* Where the fetched corpus lives (stuti-app/docs/corpus-delivery.md): a
   static host with index.json and t/<id>.<hash>.json. Blank keeps the app
   on its bundled texts alone. For a test, the localStorage key
   "stuti-corpus-url" overrides this on one device. */
export const STUTI_CORPUS_URL = "";
