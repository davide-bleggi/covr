# COVR - Test Management Platform

COVR is a comprehensive web application designed to help QA engineers and testers organize all aspects of application testing, from requirement writing to test tracking and application coverage.

## Overview

COVR is built with modern web technologies to provide an efficient and user-friendly platform for test management:

- **Frontend**: SvelteKit 5 with ShadCN UI components
- **Backend**: SvelteKit API routes
- **Database**: Microsoft SQL Server with Prisma ORM
- **Authentication**: JWT-based authentication system (extremely insecure -- all encryption methods are missing)

## Features

- **Project Management**: Create and organize projects with versioning
- **Requirements Management**: Track requirements for each feature
- **Test Cases**: Link test cases to requirements with detailed scenarios
- **Test Execution**: Record test execution results (manual and automatic)
- **Customer Installations**: Track which customers have which versions installed
- **Coverage Tracking**: Monitor test coverage across projects, features, and requirements
- **Activity Logging**: Track user activities within the system

## Data Model

COVR is built around the following core entities:

- **Projects**: The top-level entity representing a software project
- **Versions**: Different releases of a project
- **Features**: Functional components of a project version
- **Requirements**: Specific functional requirements within features
- **Scenarios**: Test scenarios that validate requirements
- **Tests**: Both manual and automatic tests linked to scenarios
- **Installations**: Deployment of versions to specific customers

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Microsoft SQL Server
- NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/davide-bleggi/covr.git
   cd covr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. After make a msql database, configure your environment variables by creating a `.env` file:
   ```
   DATABASE_URL="sqlserver://username:password@localhost:1433/covr?schema=dbo"
   ```

4. Initialize the database:
   ```bash
   # Generate the Prisma client
   npx prisma generate
   
   # Create and apply migrations to set up the database schema
   npx prisma migrate dev --name init
   # or
   npx prisma db push
   
   # If working with an existing database schema, use:
   # npx prisma db pull
   # npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

7. Start the production server:
   ```bash
   node build/index.js
   ```

## Docker Deployment

COVR can be deployed using Docker:

### For Windows:
```bash
docker build -f dockerfile.windows -t covr:latest .
docker run -p 3000:3000 -e DATABASE_URL="your-connection-string" covr:latest
```

### For Linux:
```bash
docker build -f dockerfile.linux -t covr:latest .
docker run -p 3000:3000 -e DATABASE_URL="your-connection-string" covr:latest
```

## Project Structure

- `/src`: Main source code
  - `/lib`: Shared libraries, components, and utilities
  - `/routes`: SvelteKit routes and API endpoints
  - `/hooks`: Authentication and server hooks
- `/prisma`: Database schema and migrations
- `/static`: Static assets
- `/build`: Compiled production build

## Technology Stack

- **SvelteKit 5**: Frontend framework
- **ShadCN/Svelte**: UI component library
- **Prisma**: ORM for database operations
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **D3.js**: Data visualization
- **TipTap**: Rich text editor for requirements and scenarios
- **JWT**: Authentication
- **Microsoft SQL Server**: Database

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots

(Add screenshots here when available)

## Contact

If you have any questions or suggestions, please open an issue on GitHub.
