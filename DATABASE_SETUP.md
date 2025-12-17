# Database Setup Guide

## Error: "Tenant or user not found"

If you're seeing this error, it means your database is not properly configured. Follow these steps:

### 1. Set up your database

This application uses PostgreSQL, recommended with Neon or similar providers:

1. Create a new PostgreSQL database (recommended: [Neon](https://neon.tech))
2. Copy your connection strings

### 2. Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the following variables in `.env.local`:
   ```env
   POSTGRES_PRISMA_URL="your-pooling-connection-string"
   POSTGRES_URL_NON_POOLING="your-direct-connection-string"
   ```

### 3. Run Prisma migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Seed the database with initial data
npm run seed
```

### 4. Verify the setup

Run the development server:
```bash
npm run dev
```

## Deployment (Vercel/Production)

Make sure to set the environment variables in your deployment platform:

### Required Variables:
- `POSTGRES_PRISMA_URL` - Your database pooling connection string
- `POSTGRES_URL_NON_POOLING` - Your database direct connection string
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `OPENAI_API_KEY` - Your OpenAI API key

### For Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required variables
4. Redeploy your application

## Troubleshooting

### "Tenant or user not found"
- Verify your database URLs are correct
- Check that your database provider (Neon) is accessible
- Ensure you've run `npx prisma db push` to create tables
- Verify the database user has proper permissions

### Connection timeout
- Check your database provider's status
- Verify network connectivity
- Ensure connection string includes proper timeout parameters

### Missing tables
- Run `npx prisma db push` to create all tables
- Verify migrations are applied correctly
