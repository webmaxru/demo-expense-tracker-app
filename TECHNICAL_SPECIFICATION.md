# Technical Specification - Personal Expense Tracker App

## Project Overview

A comprehensive expense tracking application built with TypeScript frontend and JavaScript backend, deployed on Azure cloud infrastructure. The application provides real-time financial insights, budget tracking, and transaction management with enterprise-grade security.

## Technology Stack

### Frontend (TypeScript)

#### Core Framework
- **React 18.2+** with TypeScript 5+
- **Vite 4.4+** - Build tool and development server
- **Node.js 18+** - Development runtime

#### UI Framework & Styling
```typescript
// Package dependencies
"react": "^18.2.0",
"typescript": "^5.0.0",
"vite": "^4.4.0",
"tailwindcss": "^3.3.0",
"@headlessui/react": "^1.7.0",
"framer-motion": "^10.16.0",
"phosphor-react": "^1.4.1"
```

#### State Management & Data
```typescript
// State and data management
"zustand": "^4.4.0",
"@tanstack/react-query": "^4.32.0",
"axios": "^1.5.0",
"decimal.js": "^10.4.3",
"date-fns": "^2.30.0"
```

#### Data Visualization
```typescript
// Charting libraries
"recharts": "^2.8.0",
"d3": "^7.8.5",
"@types/d3": "^7.4.0"
```

#### Development & Testing
```typescript
// Development tools
"eslint": "^8.48.0",
"prettier": "^3.0.0",
"vitest": "^0.34.0",
"@playwright/test": "^1.37.0"
```

### Backend (JavaScript)

#### Core Framework
```javascript
// Package dependencies
"node": ">=18.0.0",
"express": "^4.18.2",
"helmet": "^7.0.0",
"cors": "^2.8.5",
"express-rate-limit": "^6.10.0"
```

#### Database & ORM
```javascript
// Database tools
"@prisma/client": "^5.2.0",
"prisma": "^5.2.0",
"pg": "^8.11.3",
"ioredis": "^5.3.2"
```

#### Authentication & Security
```javascript
// Security packages
"jsonwebtoken": "^9.0.2",
"bcrypt": "^5.1.1",
"joi": "^17.9.2",
"uuid": "^9.0.0"
```

#### Utilities
```javascript
// Utility packages
"multer": "^1.4.5",
"sharp": "^0.32.5",
"winston": "^3.10.0",
"dotenv": "^16.3.1"
```

### Cloud Infrastructure (Azure)

#### Hosting & Compute
- **Azure Static Web Apps** - Frontend hosting with CDN
- **Azure App Service** - Backend API hosting (Linux, Node.js 18)
- **Azure Application Gateway** - Load balancing and SSL termination

#### Database & Storage
- **Azure Database for PostgreSQL** - Flexible Server (General Purpose, 2 vCores)
- **Azure Cache for Redis** - Basic tier for session management
- **Azure Blob Storage** - Hot tier for receipt images

#### Security & Networking
- **Azure Key Vault** - Secrets and certificate management
- **Azure Private Endpoints** - Secure database connections
- **Azure Web Application Firewall** - DDoS and attack protection

#### Monitoring & DevOps
- **Azure Application Insights** - APM and logging
- **Azure Monitor** - Infrastructure monitoring
- **GitHub Actions** - CI/CD pipelines

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │    │   PostgreSQL    │
│   (Static Web   │◄──►│   (App Service) │◄──►│   (Managed DB)  │
│    Apps)        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Azure CDN     │    │   Redis Cache   │    │   Blob Storage  │
│                 │    │                 │    │   (Receipts)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture

```typescript
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── charts/         # Chart components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and Tailwind config
```

### Backend Architecture

```javascript
src/
├── controllers/        # Request handlers
├── middlewares/       # Express middlewares
├── services/          # Business logic
├── models/            # Database models (Prisma)
├── routes/            # API route definitions
├── utils/             # Utility functions
├── config/            # Configuration files
└── tests/             # Test files
```

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(20) CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Specification

### Authentication Endpoints

```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Transaction Endpoints

```javascript
GET    /api/transactions              # Get user transactions (paginated)
POST   /api/transactions              # Create new transaction
GET    /api/transactions/:id          # Get specific transaction
PUT    /api/transactions/:id          # Update transaction
DELETE /api/transactions/:id          # Delete transaction
POST   /api/transactions/upload       # Upload receipt
```

### Category Endpoints

```javascript
GET    /api/categories               # Get user categories
POST   /api/categories               # Create category
PUT    /api/categories/:id           # Update category
DELETE /api/categories/:id           # Delete category
```

### Budget Endpoints

```javascript
GET    /api/budgets                  # Get user budgets
POST   /api/budgets                  # Create budget
PUT    /api/budgets/:id              # Update budget
DELETE /api/budgets/:id              # Delete budget
GET    /api/budgets/:id/progress     # Get budget progress
```

### Analytics Endpoints

```javascript
GET /api/analytics/dashboard         # Dashboard data
GET /api/analytics/spending-trends   # Spending analysis
GET /api/analytics/category-breakdown # Category analysis
GET /api/analytics/monthly-report    # Monthly reports
```

## Security Implementation

### Authentication Flow

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Refresh Token Strategy
const accessTokenExpiry = '15m';
const refreshTokenExpiry = '7d';
```

### Input Validation

```javascript
// Transaction validation schema
const transactionSchema = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  description: Joi.string().max(500),
  categoryId: Joi.string().uuid().required(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('income', 'expense').required()
});
```

### Security Headers

```javascript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Performance Considerations

### Frontend Optimization

```typescript
// Code splitting
const TransactionList = lazy(() => import('./components/TransactionList'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Memoization for expensive calculations
const budgetProgress = useMemo(() => 
  calculateBudgetProgress(transactions, budgets), 
  [transactions, budgets]
);

// Virtual scrolling for large transaction lists
import { FixedSizeList as List } from 'react-window';
```

### Backend Optimization

```javascript
// Database indexing
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, start_date, end_date);

// Redis caching strategy
const cacheKey = `user:${userId}:dashboard`;
const cachedData = await redis.get(cacheKey);
if (!cachedData) {
  const data = await generateDashboardData(userId);
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min cache
}
```

## Deployment Configuration

### Frontend (Azure Static Web Apps)

```yaml
# staticwebapp.config.json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

### Backend (Azure App Service)

```javascript
// Production configuration
const config = {
  port: process.env.PORT || 8000,
  database: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET
  }
};
```

### Environment Variables

```bash
# Frontend (.env)
VITE_API_BASE_URL=https://your-api.azurewebsites.net
VITE_APP_INSIGHTS_KEY=your-app-insights-key

# Backend (.env)
DATABASE_URL=postgresql://user:pass@server:5432/db
REDIS_HOST=your-redis.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=your-redis-password
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection
BLOB_CONTAINER_NAME=receipts
```

## Testing Strategy

### Frontend Testing

```typescript
// Component testing with Vitest
import { render, screen } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';

test('submits transaction with valid data', async () => {
  render(<TransactionForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/amount/i), '25.50');
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    amount: 25.50,
    type: 'expense'
  });
});
```

### Backend Testing

```javascript
// API testing with Jest/Supertest
describe('POST /api/transactions', () => {
  test('creates transaction with valid data', async () => {
    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 25.50,
        description: 'Coffee',
        categoryId: 'category-uuid',
        type: 'expense',
        date: '2023-08-07'
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe('25.50');
  });
});
```

### E2E Testing

```typescript
// Playwright tests
test('complete transaction flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="add-transaction"]');
  await page.fill('[data-testid="amount-input"]', '15.99');
  await page.selectOption('[data-testid="category-select"]', 'food');
  await page.click('[data-testid="save-button"]');
  
  await expect(page.locator('[data-testid="transaction-list"]'))
    .toContainText('15.99');
});
```

## Monitoring & Logging

### Application Insights Configuration

```typescript
// Frontend monitoring
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.VITE_APP_INSIGHTS_KEY,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true
  }
});

appInsights.loadAppInsights();
```

### Backend Logging

```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'expense-tracker-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});
```

## Development Workflow

### Local Development Setup

```bash
# Clone and setup
git clone <repository>
cd expense-tracker-app

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd ../backend
npm install
npx prisma migrate dev
npm run dev
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install and build
        run: |
          cd frontend
          npm ci
          npm run build
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: '/frontend'
          api_location: ''
          output_location: 'dist'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'expense-tracker-api'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: './backend'
```

## Scalability Considerations

### Database Scaling
- Read replicas for analytics queries
- Connection pooling with PgBouncer
- Partitioning for transaction tables by date

### Application Scaling
- Horizontal scaling with Azure App Service
- CDN for static assets
- Redis clustering for high availability

### Cost Optimization
- Azure Reserved Instances for predictable workloads
- Blob Storage lifecycle policies
- Application Insights sampling for high-volume applications

---

This technical specification provides a comprehensive foundation for building the Personal Expense Tracker App with the recommended technology stack. Each section can be expanded based on specific implementation requirements and business needs.
