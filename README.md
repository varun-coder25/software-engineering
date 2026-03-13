# VIT Academic Certificate & GPA Portal

A frontend-focused academic portal built with Next.js App Router, React, Tailwind CSS, and Supabase Authentication. The current version provides:

- Email signup, login, logout, and session persistence with Supabase
- Protected student dashboard routing
- Certificate upload UI with drag-and-drop, preview, and removable browser-state storage
- VIT GPA calculator for up to 6 subjects
- CGPA calculator for up to 8 semesters
- Structure ready for future blockchain verification, admin tooling, employer access, and Supabase Storage integration

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase JavaScript client

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://npnjnhdajfjqunfvzith.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup Notes

- This app uses `supabase.auth.signUp()`, `supabase.auth.signInWithPassword()`, and `supabase.auth.signOut()`.
- Session persistence is enabled in the reusable client at [lib/supabaseClient.ts](/C:/Users/varun/OneDrive/Desktop/Blockchain%20Stuff/software%20engineering/lib/supabaseClient.ts).
- If email confirmation is enabled in your Supabase project, users must confirm their email before login.

## Deployment on Vercel

1. Push this project to a Git repository.
2. Import the repository into Vercel, or deploy from the CLI.
3. Add these environment variables in Vercel Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://npnjnhdajfjqunfvzith.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
```

4. Run a production deployment:

```bash
vercel deploy
```

5. For a production-ready deployment to the main domain, use:

```bash
vercel --prod
```

## Build Commands

- Development: `npm run dev`
- Production build: `npm run build`
- Production server: `npm run start`

## Project Structure

```text
app/
  dashboard/
  login/
  signup/

components/
  AuthProvider.tsx
  CertificateUpload.tsx
  CGPACalculator.tsx
  DashboardLayout.tsx
  GPACalculator.tsx
  LoginForm.tsx
  Navbar.tsx
  ProtectedRoute.tsx
  SignupForm.tsx

lib/
  supabaseClient.ts
```

## Future Extension Points

- Replace browser-only certificate state with Supabase Storage upload actions
- Add blockchain certificate verification flows
- Introduce admin verification and audit dashboards
- Add an employer verification portal

## Important Note

The codebase is deployable, but a public live URL requires:

- installing dependencies
- configuring the real Supabase publishable key
- deploying to Vercel from your account
