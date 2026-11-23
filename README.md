# SlacWave Music Group

**SlacWave Music Group — a division of Mid Ama Distribution.**

This project is configured for a dedicated Render service, a dedicated Neon PostgreSQL database, Cloudflare R2 object storage, and Resend email OTP authentication.

## Fresh database isolation
The application uses the dedicated Neon tables `slacwave_mg_app_state` and `slacwave_mg_email_otps`. It does not read or migrate the previous Mid-Ama database tables. Create a NEW Neon database for this deployment and do not point `SLACWAVE_DATABASE_URL` at the existing Mid-Ama database. Production refuses to start without Neon when `REQUIRE_NEON_DATABASE=true`.

## Render environment
Copy `.env.example` into the Render service environment and replace every placeholder. Set `NODE_ENV=production`, `REQUIRE_NEON_DATABASE=true`, a dedicated Neon `SLACWAVE_DATABASE_URL`, session/OTP/download secrets, Resend credentials, and dedicated R2 bucket credentials. Use a verified sender domain in `EMAIL_FROM`.

Build command: `npm install && npm run build`
Start command: `npm start`
Node: 20.19+

## R2
Create a private bucket named `slacwave-mg-assets` (or change `R2_BUCKET_NAME` to your dedicated bucket). Create an R2 access key with read/write access to this bucket only.

## Admin access
The only administrator emails are `mogaursa4@gmail.com` and `remoabetswemolefi@gmail.com`. Both are seeded into a fresh database and use email OTP via Resend. Ensure the Resend sender domain is verified and both addresses can receive mail.

Set the Render environment variable `ADMIN_NOTIFICATION_EMAIL` to `mogaursa4@gmail.com,remoabetswemolefi@gmail.com` (comma-separated, no quotes) so both administrators receive submission, enquiry, VEVO, video, and takedown notifications. The public/client support email is `djyslactrumpza@gmail.com`; this does not change either administrator login email.

## Important launch checks
- Verify the 300+ music stores / 100+ video stores and free YouTube OAC / Content ID / video-distribution offers against the actual external distribution agreement before publishing those promises.
- Platform delivery and VEVO / OAC / Content ID acceptance remain subject to third-party eligibility and approval.
- The video workflow accepts metadata and cover artwork in the portal; artists send the actual master separately to WhatsApp `078 629 5032`.
- Audio release submission is rebuilt for Single / EP / Album, WAV/FLAC uploads, square artwork, metadata, selected DSPs and a 7-day minimum release window. Confirm all platform-specific bit-depth/sample-rate metadata before delivery; this build checks the file type and artwork dimensions but does not parse every audio codec property.
- YouTube OAC and Content ID requests are sent to both SlacWave MG administrators for manual eligibility review; YouTube and distribution partners make the final decision.
- Have a South African attorney review the artist agreement and payout clauses before collecting signatures or handling royalty payments.
- Card numbers, CVVs, PINs and OTPs are deliberately not collected. Bank account details are sufficient for EFT payouts.

## Artist library
- Each client account has a persistent artist library stored in the authoritative Neon application state. Names entered in audio or video submissions are saved when the client clicks Add Primary/Featured Artist or submits the release.
- The same saved artist can be selected as either a primary or featured artist in future audio and video submissions. Duplicate names are merged case-insensitively. Existing artist names from that client's historical audio releases and video submissions are imported into the library the first time it is loaded.

## Artist terms and royalty handling
- Artist agreements are required before audio or video submission. A generated artist-name electronic signature and timestamp are saved on the user record; the signed plain-text agreement is downloadable by the artist and administrator.
- Administrators enter gross royalties received for audio releases and video submissions. The portal allocates 80% to the artist and 20% to SlacWave MG. Only the artist's 80% share is credited after an audio release is marked Completed or a video submission is marked Delivered.
- A withdrawal starts as Pending. The administrator sends the EFT and attaches the actual proof screenshot in WhatsApp, then moves it to Awaiting Client Confirmation. The client must confirm receipt in their dashboard before the administrator can mark the request Paid.
- Banking account details, artist-name payment reference and WhatsApp number are collected for EFT handling. Card numbers, CVVs, PINs, OTPs and online banking passwords are not collected or stored.
- Video artists submit metadata and 16:9 artwork in the portal, then send the video master separately to WhatsApp `078 629 5032`. No VEVO channel application is required before submitting a video.
