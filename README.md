# VIT Academic Certificate Verification System

This project upgrades the original portal into a role-based academic verification platform with:

- Supabase authentication with `student`, `admin`, and `employer` roles
- role-aware dashboards at `/dashboard/student`, `/dashboard/admin`, and `/dashboard/employer`
- student certificate submissions with local SHA-256 hashing
- admin approval and rejection workflow
- server-side blockchain storage on Sepolia through Next.js API routes
- employer-facing verified certificate lookup with Etherscan proof links
- VIT GPA and CGPA calculators retained inside the student workflow

## Required Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://npnjnhdajfjqunfvzith.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## Supabase Setup

1. Create the `certificates` table by running [certificates.sql](/C:/Users/varun/OneDrive/Desktop/Blockchain%20Stuff/software%20engineering/supabase/certificates.sql).
2. Keep user roles in Supabase auth `user_metadata.role`.
3. Make sure signup users choose one of:
   - `student`
   - `admin`
   - `employer`
4. If email confirmation is enabled, confirm the email before first login.

## Role Flows

### Student

- Upload certificate
- Generate SHA-256 hash
- Create `PENDING` certificate record
- View certificate history and status
- Use GPA and CGPA calculators

### Admin

- View all student submissions
- Approve or reject pending records
- On approve, call `POST /api/blockchain/store`
- Persist `tx_hash`, `block_number`, and `timestamp`

### Employer

- Search verified student certificates
- View institution verification status
- Open Sepolia transaction and block proof links

## API Routes

- `POST /api/certificates`
- `GET /api/certificates`
- `PATCH /api/certificates/:id/status`
- `POST /api/blockchain/store`
- `GET /api/blockchain/verify?hash=...`

## Blockchain Notes

- Contract address and full ABI live in [blockchain.ts](/C:/Users/varun/OneDrive/Desktop/Blockchain%20Stuff/software%20engineering/lib/blockchain.ts).
- Hashes are normalized to `bytes32` before contract calls.
- The private key is used only on the server and never exposed to the client.

## Install / Run

```bash
npm install
npm run dev
```

## Vercel Deployment

1. Import the repository into Vercel.
2. Add all four environment variables in Project Settings.
3. Redeploy after any env change.
4. In Supabase `Authentication -> URL Configuration`, include your deployed domain.

## Important

The database policies in [certificates.sql](/C:/Users/varun/OneDrive/Desktop/Blockchain%20Stuff/software%20engineering/supabase/certificates.sql) assume role data is present in the Supabase JWT under `user_metadata.role`.
