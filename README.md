# Sheedech

A community platform for hosting and attending meaningful gatherings and dinners. Connect with others, host events, and build lasting relationships.

## Features

- **Authentication** – Secure sign-in/sign-up powered by Clerk
- **Onboarding wizard** – Personal info, family, pets, guest & host preferences, address capture with autocomplete
- **Event creation** – Rich event editor with address, menu, dietary info, rules, contribution, and photo uploads
- **Event discovery** – Browse active and upcoming events with host profile and dining photos
- **Dashboard** – Manage your events and onboarding status
- **Modern UI** – Responsive layout built with SCSS modules and reusable components

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Clerk** - Authentication and user management
- **Prisma + PostgreSQL** - Type-safe ORM and relational database
- **SCSS Modules** - Component-scoped styling
- **ESLint + Prettier** - Code quality and formatting

## Third-Party Services & Libraries

- **Clerk** – Authentication and user management ([clerk.com](https://clerk.com))
- **Prisma** – Type-safe database ORM and tooling ([prisma.io](https://www.prisma.io))
- **PostgreSQL** – Relational database engine ([postgresql.org](https://www.postgresql.org))
- **Cloudinary** – Image storage, optimization, and transformation ([cloudinary.com](https://cloudinary.com))
- **Geoapify** – Address autocomplete and geocoding API ([geoapify.com](https://www.geoapify.com))
- **TanStack Query** – Data fetching and caching for React ([tanstack.com/query](https://tanstack.com/query/latest))
- **React Hook Form** – Form state management and validation ([react-hook-form.com](https://react-hook-form.com))
- **Zod** – Schema validation and parsing ([zod.dev](https://zod.dev))
- **date-fns** – Date utilities for formatting and manipulation ([date-fns.org](https://date-fns.org))
- **React Easy Crop** – Image cropping React component ([github.com/ValentinH/react-easy-crop](https://github.com/ValentinH/react-easy-crop))
- **react-phone-input-2** – International phone number input component ([github.com/bl00mber/react-phone-input-2](https://github.com/bl00mber/react-phone-input-2))
- **Sass** – CSS preprocessor used via SCSS modules ([sass-lang.com](https://sass-lang.com))
- **ESLint** – Linting and code quality tooling ([eslint.org](https://eslint.org))
- **Prettier** – Code formatter ([prettier.io](https://prettier.io))
- **Next.js** – React framework and runtime ([nextjs.org](https://nextjs.org))
- **React** – UI library ([react.dev](https://react.dev))
- **Vercel** – Hosting and deployment platform ([vercel.com](https://vercel.com))

## Getting Started

1. **Install dependencies**

```bash
npm install
# or
pnpm install
```

2. **Set up environment variables**

Create a `.env.local` file with at least:

```bash
DATABASE_URL="postgresql://user:password@host:5432/sheedech"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_GEOAPIFY_KEY="your_geoapify_browser_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

3. **Set up the database**

```bash
npm run db:migrate
# or, for an initial push:
npm run db:push
```

4. **Run the development server**

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint
- `npm run format` – Format code with Prettier
- `npm run db:generate` – Generate Prisma client
- `npm run db:push` – Push schema changes to the database
- `npm run db:migrate` – Create and apply a development migration
- `npm run db:studio` – Open Prisma Studio

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── onboarding/           # Onboarding wizard
│   ├── events/               # Event create + list pages
│   ├── dashboard/            # Dashboard page
│   ├── sign-in/              # Authentication pages
│   └── sign-up/
├── components/               # Reusable components
│   ├── Auth/                 # Auth UI (user menu)
│   ├── Header/               # Header
│   ├── Footer/               # Footer
│   ├── Event/                # Event creation form
│   ├── EventCard/            # Event card grid + carousel
│   ├── Onboarding/           # Onboarding wizard + steps
│   └── UI/                   # Shared UI (Button, Input, Text, etc.)
├── api/                      # Client-side API helpers
├── db/                       # Prisma client setup
├── lib/                      # Utilities and auth helpers
├── providers/                # React context providers (Clerk, React Query)
├── types/                    # Shared TypeScript types
├── validations/              # Zod validation schemas
└── middleware.ts             # Auth + routing middleware
```

## Components

- **Onboarding** – Multi-step onboarding wizard (personal info, preferences, address, photos)
- **EventCreate** – Event creation flow with photo uploads and validations
- **EventCard** – Event list/grid and carousel components
- **UI** – Shared primitives (`Button`, `Input`, `Text`, `CheckboxGroup`, `RadioGroup`, `Select`, `Range`, `Textarea`, `Loading`, `FileUpload`, etc.)
- **Layout** – `Header`, `Footer`, `UserMenu` and other layout elements

## Development

The project uses:
- **TypeScript** for type safety
- **SCSS Modules** for component styling
- **ESLint** with custom rules for code quality
- **Prettier** for consistent formatting
- **Clerk** for authentication middleware
 - **Prisma** for database access and migrations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [React Documentation](https://react.dev)
 - [Prisma Documentation](https://www.prisma.io/docs)

## Deploy

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sheedech)

Remember to configure your environment variables in your deployment settings.
