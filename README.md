# IITR Productathon - Lead Management Application

## Project Structure

This project is organized as a monorepo with separate frontend and backend:

```
IITR-productathon/
├── client/          # Frontend React application
│   ├── src/         # React components, pages, and utilities
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
├── server/          # Backend Node.js/Express server
│   ├── src/         # Server source code
│   └── package.json # Backend dependencies
└── package.json     # Root package.json for managing both
```

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd IITR-productathon

# Step 3: Install dependencies for both client and server
npm run install:all

# Or install separately:
# npm run install:client
# npm run install:server
```

### Development

```sh
# Run both client and server concurrently
npm run dev

# Or run separately:
# npm run dev:client  # Start frontend dev server
# npm run dev:server  # Start backend dev server
```

### Building for Production

```sh
# Build the client
npm run build:client

# Start the production server
npm start
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
