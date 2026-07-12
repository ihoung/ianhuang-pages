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

## Private project content

Project metadata and project Markdown are intentionally not committed. In GitHub Actions they are downloaded from Google Drive before the static build. Configure these repository secrets:

- `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`: the complete JSON credential for a Google service account.
- `GOOGLE_DRIVE_CONTENT_FOLDER_ID`: the ID of the Drive folder that contains `index.yml`.

Share that Drive folder with the service account email as a Viewer. Its structure must be:

```text
content/
������ index.yml
������ content/
��   ������ <file>_en.md
��   ������ <file>_cn.md
������ <thumbnail-relative-path>
```

`index.yml` has a `projects` array. Each project requires `slug`, `title`, `description`, `thumbnail`, and extensionless `file`; `title` and `description` can be a common string or `{ en, cn }`. `featured` defaults to `false`, and optional comma-separated `tags` are retained for search data.

```yml
projects:
  - slug: neon-dashboard
    title:
      en: Neon Dashboard
      cn: �޺��Ǳ���
    description: A real-time analytics dashboard.
    thumbnail: images/neon-dashboard.jpg
    file: neon-dashboard
    featured: true
    tags: Web App, Data Viz
```

Place local content in the ignored `content/` directory before running `npm run dev` or `npm run build`. A project needs at least one of `content/<file>_en.md` and `content/<file>_cn.md`; the other locale falls back to the available Markdown file.
