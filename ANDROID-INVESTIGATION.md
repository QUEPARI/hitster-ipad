# Android Start investigation

Baseline: v44, commit 27b099a139af896c7ca9c35e704b2b93b61d334c. Main was v53 (3de8105a1440a26a258d6faac9bb12e9d340ec2d) when inspected. This branch deliberately starts at v44; it must not be merged into main as a routine small fix because that would revert later visual changes.

v44 is a preserved reference baseline, not a claim of verified Android reliability.

## Finding and minimal candidate fix
Four expressions use optional chaining or nullish coalescing. Chrome before 80 cannot parse these operators, so none of app.js executes and the Start onclick handler is never attached. Replace these expressions with equivalent explicit checks. Reference: https://v8.dev/features/optional-chaining and https://v8.dev/features/nullish-coalescing.

This explains the symptom on older engines only. The reported Android device/browser version and exact URL are unknown; its root cause remains unconfirmed. v53 already removes these operators, so a failure with verified v53 needs separate investigation of script errors, cache and browser environment.

No CSS, logo, visible wording, questions, player colors or game rules changed relative to v44. Cache and asset query version use v44-android1 so a future test deployment does not reuse the original v44 app.js cache. No production deployment performed.

## Validation
Node VM with a mocked DOM passed on original and patched v44 for 2, 3 and 4 players: Start enters open phase, setup hides, game shows, names persist, winner/question transitions, fixed 2-second winner setting, 30-second default, settings pause/resume and reset. Syntax check passed on Node. This is not a rendering test or an Android browser test.

## Device acceptance still needed
Record device model, Android version, browser name/version, exact URL and installed-PWA versus browser versus in-app browser. Test the candidate on an isolated HTTPS preview and record console errors. Verify fresh load and a cached/offline reload; 2/3/4 players; first buzzer wins; question, timeout, next round and settings. Compare appearance with v44 on iPad/Windows as well. Do not replace main or publish until the intended baseline and device result are reviewed.
