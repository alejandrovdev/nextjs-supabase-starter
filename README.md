# Next.js Supabase Starter

A modern web application built with Next.js 16, tailored for scalability and performance. This repository uses a modular architecture to ensure code maintainability and separation of concerns.

## Tech Stack

The project is built using the following core technologies:

| Category       | Technology                                                | Version | Description                                        |
| :------------- | :-------------------------------------------------------- | :------ | :------------------------------------------------- |
| **Framework**  | [Next.js](https://nextjs.org/)                            | 16.1.0  | React Framework for Production (App Router)        |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)             | 5.x     | Typed JavaScript at Any Scale                      |
| **Styling**    | [Tailwind CSS](https://tailwindcss.com/)                  | 4.1.17  | Utility-first CSS framework                        |
| **Database**   | [Supabase](https://supabase.com/)                         | -       | Open Source Firebase Alternative (PostgreSQL)      |
| **Migrations** | [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | 0.44.7  | TypeScript-based SQL migration generator           |
| **API**        | [oRPC](https://orpc.unnoq.com/)                           | 1.12.2  | End-to-end safe API client                         |
| **Validation** | [Zod](https://zod.dev/)                                   | 3.x     | TypeScript-first schema declaration and validation |
| **Forms**      | [React Hook Form](https://react-hook-form.com/)           | 7.x     | Performant, flexible and extensible forms          |

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v20+ (Starting with v24.11.1 recommended via `.nvmrc`)
- **Package Manager**: `pnpm` (Corepack enabled or explicitly installed)
- **Docker**: Required for running the local Supabase instance.

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nextjs-supabase-starter
    ```

2.  **Install dependencies**

    ```bash
    pnpm run install
    ```

3.  **Environment Setup**

    Copy the example environment file to create your local configuration:

    ```bash
    cp .env.example .env
    ```

4.  **Start Local Database**

    Make sure Docker is running, then start the Supabase/Postgres stack:

    ```bash
    pnpm run db:start
    ```

    This command spins up the database, studio, object storage, and other Supabase services.

5.  **Sync Storage Buckets**

    Initialize the storage buckets:

    ```bash
    pnpm run storage:sync
    ```

6.  **Run Migrations**

    Apply the database schema to your local instance:

    ```bash
    pnpm run db:migrations:up
    ```

7.  **Start Development Server**

    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The codebase is organized using a feature-based modular architecture within `src/modules`. Each module is self-contained and typically includes:

- `client/`: React components and hooks specific to the application client.
- `server/`: Server-side logic, procedures (API endpoints), and services.
- `db/`: Drizzle schema definitions used for migration generation (Drizzle is not used as a runtime ORM).
- `shared/`: Types and schemas shared between client and server (e.g., Zod schemas for validation).

Common utilities and globally shared components are located in `src/components`, `src/lib`, and `src/hooks`.

## Available Scripts

| Script                            | Description                                                               |
| :-------------------------------- | :------------------------------------------------------------------------ |
| `pnpm run dev`                    | Starts the Next.js development server.                                    |
| `pnpm run build`                  | Builds the application for production.                                    |
| `pnpm run start`                  | Starts the production server.                                             |
| `pnpm run lint`                   | Runs ESLint to check for code quality issues.                             |
| `pnpm run lint:fix`               | Runs ESLint and automatically fixes fixable issues.                       |
| `pnpm run format`                 | Checks code formatting with Prettier.                                     |
| `pnpm run format:fix`             | Formats all code using Prettier.                                          |
| `pnpm run db:start`               | Starts the local Supabase instance.                                       |
| `pnpm run db:stop`                | Stops the local Supabase instance.                                        |
| `pnpm run db:status`              | Checks the status of the Supabase local instance.                         |
| `pnpm run db:studio`              | Opens a simplified Drizzle studio or Supabase studio for data management. |
| `pnpm run db:reset`               | Resets the database (Warning: Deletes all data).                          |
| `pnpm run db:push`                | Pushes schema changes directly to the database (prototyping).             |
| `pnpm run db:migrations:generate` | Generates SQL migrations based on Drizzle schema changes.                 |
| `pnpm run db:migrations:list`     | Lists all migrations.                                                     |
| `pnpm run db:migrations:up`       | Applies pending migrations to the database.                               |
| `pnpm run db:migrations:down`     | Reverts the last migration.                                               |
| `pnpm run db:types`               | Generates TypeScript types from the Supabase database.                    |
| `pnpm run mailpit`                | Opens the local Mailpit interface to view captured emails.                |
| `pnpm run openapi`                | Opens the OpenAPI documentation.                                          |
| `pnpm run storage:sync`           | Seeds storage buckets.                                                    |

## Development Guidelines

### Database Changes

Drizzle is used **only for migration generation**, not as a runtime ORM. The schema files in `src/modules/*/db/schemas/*.ts` define the database structure in TypeScript, and Drizzle Kit generates the corresponding SQL migrations. All runtime database access goes through the Supabase client.

1.  Modify the schema files in `src/modules/*/db/schemas/*.ts`.
2.  Generate a new migration:
    ```bash
    pnpm run db:migrations:generate
    ```
3.  Apply the migration:
    ```bash
    pnpm run db:migrations:up
    ```

### Code Quality

- **Prettier**: Used for code formatting. Run `pnpm run format` before committing.
- **ESLint**: Used for linting. Run `pnpm run lint` to check for errors.
- **Commit Convention**: We follow [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are linted by `commitlint` via husky hooks.
  - Example: `feat(auth): implement login flow`
  - Example: `fix(ui): correct button padding`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview) - Learn about Drizzle migration generation.
- [Supabase CLI](https://supabase.com/docs/guides/cli) - Learn about local Supabase development.
