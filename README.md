# IOU — Receipt Splitting Made Easy

IOU is a full-stack web app that lets a group split a bill by just uploading a receipt. The main payer uploads and edits the receipt, invites co-payers, and once everyone has picked their items, each person gets a text with how much they owe — tax included.

## Features

- **Upload Receipts**: Image uploads supported (JPEG, PNG, HEIC)
- **Auto Parsing**: Uses AWS Textract + OpenAI to extract and clean receipt items
- **Main Payer Control**: Edit items and select which ones you're paying for
- **Co-Payer Flow**: Friends choose items, enter their name and phone
- **SMS Totals**: Everyone gets a text with their total when all co-payers are done

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **OCR**: AWS Textract
- **AI Cleanup**: OpenAI (function calling)
- **Database**: AWS DynamoDB
- **Messaging**: Twilio SMS

## How It Works

1. Main payer uploads a receipt
2. Textract extracts text → OpenAI cleans and formats it
3. Main payer reviews and submits
4. Co-payers pick their items via shared link
5. Once all co-payers submit, everyone gets a text with what they owe

## Getting Started

### Prerequisites

- Node.js 20+
- AWS account with Textract & DynamoDB
- OpenAI API key
- Twilio account with verified number

### Setup

```bash
git clone https://github.com/aldriebarcena/IOU.git
cd IOU
cp .env.example .env.local  # Fill in your API keys
npm install
npm run dev
