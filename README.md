# Nex 

A modern, enterprise-grade Next.js application for business queue management.

**Author:** Abhiraj Marne

## Local Setup and Testing

Follow these steps to set up the project locally:

1. **Clone the repository (if applicable):**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and ensure you add your Supabase connection strings (if needed):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Bypassing Login/Registration for Testing

If you need to test the application logic without setting up Supabase authentication or registering an account, you can quickly bypass the login/registration flow using one of these methods:

**Method 1: Direct Navigation**
Since there isn't strict server-side middleware enforcing the route in development, you can directly navigate to the dashboard bypassing the auth forms by manually altering the URL:
```text
http://localhost:3000/dashboard
```

**Method 2: Force Authentication in Code**
You can alter the authentication form directly to immediately redirect to the dashboard without checking connection or credentials.

1. Open `src/components/auth/auth-form.tsx`
2. Locate the `handleSubmit` function.
3. Replace the function logic to redirect directly:
   ```tsx
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     // Bypass auth logic and enter dashboard directly
     router.push("/dashboard");
   };
   ```
4. Click the "Enter Command Center" button on the UI, and it will push you directly to the dashboard without waiting for remote validation.

*(Make sure to revert this change before deploying to production!)*

## Learn More

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
