
# Catalyst Extension - Quick Guide

## Install locally (Developer mode)
1. Download and unzip the extension.
2. Open Chrome -> Extensions -> Developer mode -> Load unpacked.
3. Select the folder containing the extension files.
4. Open the extension popup, paste your OpenAI API key, and save.
5. Click 'Toggle Sidebar' to open the chat sidebar on any page.
6. Use messages to ask the assistant (e.g., "Create a prefilled passport form" or "Remind me to drink water after 30 minutes").

## Notes
- The extension stores the API key in extension local storage. For production, a better secrets approach is recommended.
- Captchas and OTPs must be completed by a human; automation is limited to autofill guidance in this demo.
