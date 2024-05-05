# Next.js App with Stripe Integration, Admin Dashboard & Image Upload

This project is a Next.js application that utilizes both server-side rendering (SSR) and client-side rendering (CSR) for optimal performance and user experience. It integrates with Stripe for secure payment processing, offers an admin dashboard with sales information, allows store detail modification, and provides product image upload functionality.

![app_render](Admin%20Dashboard.jpeg)

## Prerequisites

Node.js and npm (or yarn) installed on your system.
A Stripe account with API keys (test or live depending on your needs)
Installation

```bash
# Clone this repository:
git clone git@github.com:rameskum/ecommerce-admin.git

# Navigate to the project directory:
cd ecommerce-admin

# Install dependencies:

pnpm install

# Configuration
# Create a .env.local file in the project root directory.

# Add the following environment variables to .env.local:

CLERK_SECRET_KEY=clerk
DATABASE_URL=database url supports postgres
FRONTEND_STORE_URL=front end url
STRIPE_API_KEY=stripe api key
STRIPE_WEBHOOK_SECRET=stripe webhook secret

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloudinary could name
```

### Important Note:

Do not commit the .env.local file to your version control system.

#### Development

Start the development server:

```bash
pnpm dev
```

This will start the server on http://localhost:3000 by default.

Open http://localhost:3000 in your browser to access the application.

## Features

- **Stripe Integration**: The application integrates with Stripe for secure payment processing.
- **Admin Dashboard**: The admin dashboard provides an overview of sales information.
  Store Detail Modification: Authorized users can modify store details within the admin panel.
- **Image Upload**: Products can have images uploaded for display.

#### Building for Production

Build an optimized production version of the application:

```bash
pnpm run build

pnpm run start
```

## Additional Documentations

This README provides a general overview of the project setup and functionality.
For detailed implementation specifics, refer to the project's codebase.

Additional documentations:

Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
Stripe: [https://docs.stripe.com/](https://docs.stripe.com/)
Clerk: [https://clerk.com/docs](https://clerk.com/docs)
Clodinary: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
Neon: [https://neon.tech/docs/introduction](https://neon.tech/docs/introduction)
