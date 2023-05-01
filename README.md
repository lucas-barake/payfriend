# Introduction

This document provides an overview of the project, including its architecture, technologies, and features.

# Architecture

The project is structured as follows:

- [`src/components`](./src/components) contains all reusable and atomic components. It is divided into three subdirectories:
  - [`src/components/layouts`](./src/components/layouts) contains components such as navbars, headers, and footers.
  - [`src/components/pages`](./src/components/pages) contains components that render entire pages (protected views, loading screens, etc.).
  - [`src/components/ui`](./src/components/ui) contains components such as buttons, sheets, and dialogs.
- [`src/pages`](./src/pages) contains the pages themselves. Some recommendations:
  - Each page must be exported with default and have the .page.tsx extension for them to be recognized as pages.
  - Each page may have a `(page-lib)` directory, which contains all the logic for the page. This directory is not required, but is recommended for pages that require code and components that are specific to them. If a page has a `(page-lib)` directory, it must follow the convention of having subdirectories for `components`, `hooks`, `utils`, etc. (if applicable).
  - Components created in the `(page-lib)` directory should be imported into the page itself and used there. They should not be shared with other pages unless the page is a child of the page that created the component.
  - Components must be exported with `default` as Next.js does not support named exports within the `/pages` directory (**this only applies for `.tsx` files**).
- [`/src/pages/api`](./src/pages/api) contains all API routes.
- [`/src/server`](./src/server) contains all server-side code, specially `tRPC` mutations and queries (note that `tRPC` procedures are mapped via HTTPS routes through the `/src/pages/api` directory).
- [`/src/types`](./src/types) contains all utility typescript types.
- [`/src/styles`](./src/styles) contains the global styles for the application, such as color variables.
- [`/prisma`](./prisma) contains the Prisma schema and migrations.

# Technologies

The project uses the following technologies:

- [Next.js](https://nextjs.org/) as the React framework.
- [tRPC](https://trpc.io/) as the API framework.
- [TailwindCSS](https://tailwindcss.com/) as the CSS framework.
- [Prisma](https://www.prisma.io/) as the ORM.
- [next-auth](https://next-auth.js.org/) as the authentication framework.
