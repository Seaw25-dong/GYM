# Android releases

## 1.0.3 (versionCode 4)

- Registration now opens a verification screen with resend and login actions.
- Displays an explicit message when the account was created but verification email failed.
- Android frontend export command now works on Windows and Linux.
- Update builds require the original signing key to preserve Android upgrade compatibility.

Deploy the matching backend changes for email delivery status and the 15-second
email timeout. SMTP delivery still requires a reachable email service.

This release requires a new bundled frontend export and APK build. Device testing
and actual email delivery must be verified separately.
