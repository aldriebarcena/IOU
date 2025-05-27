# IOU - Receipt Splitting Service

**IOU** is a lightweight web application that simplifies the process of splitting receipts between friends or roommates. One person (the main payer) uploads a receipt, configures the split, and shares a unique link with others (co-payers) who select their items or accept an even split. The app handles tax logic, shared item tracking, and sends SMS reminders and confirmations using AWS services.

---

## Features

### Receipt Uploading
- Upload receipts manually or with a photo
- OCR parsing via [insert here]
- Editable item list before confirmation

### Split Options
- Manual split: co-payers select items (supporting shared items)
- Tax options: evenly or proportionally

### Main Payer Workflow
- Upload and confirm receipt
- Choose tax handling split method
- Share receipt link with co-payers (no login or group required)
- View submissions and mark co-payers as paid
- Archive past receipts (optional)

### Co-Payer Workflow
- Visit shared receipt link
- Input name and phone number
- Select items
- Submit selection and receive total via SMS when all users have selected
- Confirm payment through a second unique link
- Removed from reminder list upon confirmation

### Notifications
- SMS sent via AWS SNS when:
  - A user is invited to a receipt
  - Their split is calculated
  - Payment is confirmed
- Daily reminders sent to unpaid co-payers (via AWS Lambda)

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TailwindCSS
- TypeScript

### AWS Services
- **S3** – Receipt image uploads
- **DynamoDB** – Store receipt, item, and co-payer data
- **SNS** – SMS notifications
- **Lambda** – Scheduled reminders and backend logic (as needed)
