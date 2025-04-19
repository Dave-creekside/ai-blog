# AI Blog

A Next.js blog application with Supabase integration.

## Deployment Fix

This repository includes fixes for deployment issues on Vercel related to missing Supabase environment variables. The application now gracefully handles the absence of Supabase credentials by:

1. Checking for the presence of environment variables before initializing Supabase clients
2. Providing fallback behavior when Supabase is not available
3. Displaying appropriate error messages to users

These changes allow the application to build and deploy successfully even when environment variables are not properly configured, while still providing clear guidance on what needs to be fixed.

## Deployment Instructions

### Setting up Environment Variables in Vercel

This application requires Supabase environment variables to be set up in your Vercel project. Follow these steps to configure them:

1. Log in to your Vercel dashboard
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

You can find these values in your Supabase project dashboard under "Project Settings" > "API".

### Local Development

For local development, create a `.env.local` file in the root of your project with the same environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Running the Application

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```
