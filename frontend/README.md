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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Render

Local development uses `http://127.0.0.1:5000/api` by default. To use a
different backend locally, copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_API_URL` to its API base URL, including `/api`.

The repository's `render.yaml` defines both the Flask backend and the static
frontend. Deploy it on Render as a Blueprint from the repository root. Render
provides the backend hostname to the frontend as `NEXT_PUBLIC_API_HOST`; the
frontend builds its HTTPS API URL as `https://<backend-host>/api`.

The frontend is statically exported to `out/` and served from the domain root.
The backend currently allows cross-origin requests through Flask-CORS.
Character data is stored in a JSON file, so use persistent storage for the
backend if the data must survive service restarts or redeploys.
