# Sheedech

A community platform for hosting and attending meaningful gatherings and dinners. Connect with others, host events, and build lasting relationships.

## Features

- **User Authentication** - Secure sign-in/sign-up powered by Clerk
- **Dashboard** - Personalized user dashboard with event management
- **Community Events** - Discover and attend local gatherings
- **Host Events** - Open your home and create connections
- **Connections** - Track your community friendships
- **Modern UI** - Built with responsive SCSS modules and reusable components

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Clerk** - Authentication and user management
- **SCSS Modules** - Component-scoped styling
- **ESLint + Prettier** - Code quality and formatting

## Getting Started

1. **Install dependencies:**

```bash
npm install
# or
pnpm install
```

2. **Set up environment variables:**

Create a `.env.local` file with your Clerk credentials:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

3. **Run the development server:**

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── sign-in/          # Authentication pages
│   └── sign-up/
├── components/            # Reusable components
│   ├── Auth/             # Authentication components
│   ├── Header/           # Header component
│   ├── Footer/           # Footer component
│   └── UI/               # UI components (Button, Input, Text, Loading)
├── pages/                # Page components
├── providers/            # React context providers
├── lib/                  # Utilities and auth helpers
└── middleware.ts         # Next.js middleware
```

## Components

### UI Components
- **Button** - Styled button component with variants
- **Input** - Form input component
- **Text** - Typography components (Title, Text)
- **Loading** - Loading states and spinners

### Layout Components
- **Header** - Navigation header with user menu
- **Footer** - Site footer
- **UserMenu** - Authenticated user dropdown menu

## Development

The project uses:
- **TypeScript** for type safety
- **SCSS Modules** for component styling
- **ESLint** with custom rules for code quality
- **Prettier** for consistent formatting
- **Clerk** for authentication middleware

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [React Documentation](https://react.dev)

## Deploy

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sheedech)

Remember to configure your environment variables in your deployment settings.
