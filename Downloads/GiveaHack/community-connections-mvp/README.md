# Community Connections — Hackathon MVP

A tiny end-to-end demo where a user shares a need (text form), a Lambda ingests it, stores to DynamoDB, and (optionally) sends SMS to helpers via SNS.

## Stack
- **Frontend**: React + Vite (no Tailwind; simple CSS)
- **Backend**: AWS SAM, API Gateway + Lambda (Node.js 18 with `aws-sdk` v2), DynamoDB, SNS (for SMS)

## One-time AWS setup
1. Install AWS SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
2. `cd backend` → `sam build` → `sam deploy --guided`
3. Copy the output `ApiBaseUrl` and set it in `frontend/.env` as `VITE_API_BASE`.

> **SMS note**: If your account is in SNS SMS sandbox, only verified numbers can receive SMS.

## Run frontend
```
cd frontend
npm install
cp .env.example .env   # then set VITE_API_BASE
npm run dev
```
Open http://localhost:5173

## API summary
- `POST /needs` → { id }
- future: `POST /helpers`, `GET /needs?status=open`, `POST /needs/{id}/accept`

## DynamoDB tables
- `cc-Needs-<stage>` (PK: id)
- `cc-Helpers-<stage>` (PK: phone)
