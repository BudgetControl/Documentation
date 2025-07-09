---
sidebar_position: 2
---

# Development Environment Setup

This guide will help you set up your local development environment for contributing to BudgetControl.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Docker & Docker Compose**: For containerization (version 20.10+)
- **Git**: For version control (version 2.30+)
- **Node.js**: For frontend development (version 18+)
- **PHP**: For backend development (version 8.2+)
- **Composer**: PHP dependency manager

### Recommended Tools
- **VS Code**: With PHP, Docker, and Vue.js extensions
- **Postman**: For API testing
- **DBeaver** or **pgAdmin**: For database management

## Initial Setup

### 1. Clone the Main Repository

```bash
git clone https://github.com/BudgetControl/BudgetControl.git
cd BudgetControl
```

### 2. Environment Configuration

Copy and customize the environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your local settings:

```bash
# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=budget_control
DB_USERNAME=budget_control
DB_PASSWORD=your_password

# Application Settings
APP_ENV=local
APP_DEBUG=true
APP_URL=https://dev.app.budgetcontrol.lan

# AWS Cognito (for authentication)
AWS_COGNITO_REGION=eu-west-1
AWS_COGNITO_USER_POOL_ID=your_pool_id
AWS_COGNITO_CLIENT_ID=your_client_id

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 3. Host File Configuration

Add the following to your `/etc/hosts` file:

```
127.0.0.1 dev.app.budgetcontrol.lan
```

### 4. Run Installation Script

```bash
chmod +x install.sh
./install.sh
```

This script will:
- Clone all microservice repositories
- Set up Docker containers
- Initialize databases
- Install dependencies

## Frontend Setup

### 1. Clone PWA Repository

```bash
git clone https://github.com/BudgetControl/Pwa.git
cd Pwa
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
# For Node.js development
docker-compose up -d

# For Apache development
docker-compose -f docker-compose.apache.yml up -d
```

## Development Workflow

### Microservices Development

Each microservice can be developed independently:

```bash
# Navigate to specific microservice
cd microservices/stats

# Install PHP dependencies
composer install

# Run migrations
php artisan migrate

# Start development server
php artisan serve --port=8084
```

### Database Setup

#### PostgreSQL (Primary Database)
```bash
# Start PostgreSQL container
docker run --name budget_postgres -e POSTGRES_DB=budget_control -e POSTGRES_USER=budget_control -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Run migrations for all microservices
docker exec budgetcontrol-ms-jobs bash -c="vendor/bin/phinx migrate"
```

#### Redis (Caching)
```bash
# Start Redis container
docker run --name budget_redis -p 6379:6379 -d redis:7-alpine
```

### Testing Setup

#### Unit Testing
```bash
# Run tests for specific microservice
cd microservices/entries
composer test

# Run all tests
./scripts/test-all.sh
```

#### Integration Testing
```bash
# Set up test database
docker run --name budget_test_db -e POSTGRES_DB=budget_test -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -p 5433:5432 -d postgres:15

# Run integration tests
./scripts/integration-tests.sh
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
    "php.validate.executablePath": "/usr/bin/php",
    "php.suggest.basic": false,
    "typescript.preferences.quoteStyle": "single",
    "editor.formatOnSave": true,
    "files.associations": {
        "*.vue": "vue"
    },
    "emmet.includeLanguages": {
        "vue-html": "html",
        "vue": "html"
    }
}
```

### Recommended Extensions

- PHP Intelephense
- Docker
- Vue Language Features
- Laravel Blade Snippets
- GitLens

## Debugging

### PHP Debugging with Xdebug

The Docker containers include Xdebug for debugging:

1. Configure your IDE to listen on port 9003
2. Set breakpoints in your PHP code
3. Make requests to trigger debugging

### Frontend Debugging

```bash
# Start Vue.js in development mode with source maps
npm run serve

# Use Vue DevTools browser extension for debugging
```

## Common Issues and Solutions

### Port Conflicts
```bash
# Check which processes are using ports
sudo lsof -i :8080
sudo lsof -i :5432

# Kill conflicting processes
sudo kill -9 <PID>
```

### Permission Issues
```bash
# Fix Docker permissions
sudo usermod -a -G docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER ./
```

### Container Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View container logs
docker-compose logs -f <service_name>
```

## Performance Optimization

### Development Optimizations
```bash
# Use Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Enable Docker layer caching
docker-compose build --parallel

# Use volumes for faster file sync
# Already configured in docker-compose.yml
```

## Next Steps

Once your environment is set up:

1. Read the [Architecture Documentation](../../Infrastructure/Intro.md)
2. Review [Coding Standards](./coding-standards.md)
3. Check the [API Documentation](/api)
4. Join our [Discord community](https://discord.gg/TtMTeUbSpW)

## Need Help?

- Check our [FAQ](../../faq.md)
- Open an issue on GitHub
- Ask on Discord
- Review existing documentation
