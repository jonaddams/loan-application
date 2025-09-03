This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Before deploying, ensure you have the following environment variables configured:

```env
NEXT_PUBLIC_NUTRIENT_API_URL=https://api.xtractflow.com/
NUTRIENT_AUTH_TOKEN=your_auth_token_here
NEXT_PUBLIC_WEB_SDK_VERSION=1.6.0
```

## Deploy on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_NUTRIENT_API_URL`: Set to `https://api.xtractflow.com/`
   - `NUTRIENT_AUTH_TOKEN`: Set to your actual Nutrient API token
   - `NEXT_PUBLIC_WEB_SDK_VERSION`: Set to `1.6.0`
4. Deploy

The project includes a `vercel.json` configuration file optimized for deployment with the following timeouts:
- Process Package API: 300 seconds (5 minutes) - for handling multiple document processing
- Other APIs: 60 seconds - for individual operations

## Performance Optimizations

The application includes several optimizations for production deployment:

- **Request Timeouts**: Individual API calls have 60-second timeouts to prevent hanging
- **Template Registration Timeout**: 30-second timeout for template registration
- **Graceful Error Handling**: Proper timeout and error handling for all external API calls
- **Production Build**: Optimized bundle sizes and static page generation
