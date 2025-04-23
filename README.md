# IOU - Receipt Splitting app

**IOU** is a mobile application that makes splitting receipts simple, transparent, and fair. Designed for roommates, friends, or anyone sharing expenses, it allows one person (the main payer) to upload a receipt and invite others to select their items or opt for an even split. The app handles tax distribution, shared item logic, and payment tracking with daily reminders.

---

## Features

### Account Creation
- Sign up and log in with phone number and password

### Receipt Uploading
- Upload receipts manually or by taking a photo
- OCR parsing via AWS Textract to extract item data
- Users can edit the parsed receipt before confirming

### Split Options
- Even split option (simple toggle)
- Manual split: co-payers select items, including shared items
- Tax split options: evenly, proportionally, or not at all
- Main payer must assign their own portion if split is manual

### Main Payer Workflow
- Upload and confirm receipt
- Choose tax and split settings
- Select preferred payment method (e.g., Venmo handle)
- Invite users via group or link
- Lock receipt after all item selections are complete
- Confirm payment from each co-payer
- Manual override of item splits if needed
- View and manage receipt archive

### Co-Payer Workflow
- Join via invite link or in-app group notification
- Select items or view even split
- View final total and main payer’s payment method
- Confirm payment after sending
- Removed from reminder list upon confirmation

### Notifications
- Notifications when invited, when receipt is locked, and when payment is confirmed
- Daily reminders for unpaid users (AWS SNS or Lambda-based)

### Group Management
- Create persistent groups for recurring use
- Invite group members to new receipts without sending a link
- View active and past groups
- Leave or delete groups as needed

### Receipt History
- Full archive of past receipts and payment statuses
- Filter receipts by group or date
- Duplicate past receipts for reuse

---

## Tech Stack

**Frontend**
- React Native (via Expo or CLI)
- Redux Toolkit or Zustand for state management
- React Navigation for routing
- react-native-image-picker for receipt photos

**Backend (AWS)**
- AWS Cognito for authentication
- AWS S3 for image storage
- AWS Textract for OCR parsing
- AWS Lambda + API Gateway for backend logic
- AWS DynamoDB for database
- AWS SNS for notifications (or Firebase Cloud Messaging as fallback)
