# Personal Expense Tracker App

A comprehensive expense tracking application built with TypeScript frontend and JavaScript backend, designed for Azure cloud deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for production) or Prisma local dev server

### Development Setup

1. **Clone and setup the project:**
```bash
git clone <repository>
cd demo-expense-tracker-app
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Health check: http://localhost:8000/health

## 📁 Project Structure

```
demo-expense-tracker-app/
├── PRD.md                          # Product Requirements Document
├── TECHNICAL_SPECIFICATION.md      # Technical Specification
├── frontend/                       # React TypeScript Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── stores/                 # Zustand state stores
│   │   ├── services/               # API service functions
│   │   ├── types/                  # TypeScript type definitions
│   │   └── utils/                  # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── backend/                        # Node.js JavaScript Backend
    ├── src/
    │   ├── controllers/            # Request handlers
    │   ├── middlewares/           # Express middlewares
    │   ├── services/              # Business logic
    │   ├── routes/                # API route definitions
    │   ├── utils/                 # Utility functions
    │   └── config/                # Configuration files
    ├── prisma/                     # Database schema and migrations
    ├── logs/                       # Application logs
    ├── package.json
    └── .env.example
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** with Express.js
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Winston** - Logging
- **Helmet** - Security middleware

### Development Tools
- **ESLint** & **Prettier** - Code quality
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## 🎯 Current Status

### ✅ Completed
- [x] Project structure setup
- [x] Backend server with Express.js
- [x] Frontend React app with Vite
- [x] Tailwind CSS configuration
- [x] TypeScript types definition
- [x] API service layer
- [x] Authentication store (Zustand)
- [x] Prisma database schema
- [x] Mock data service for development
- [x] Transaction management (CRUD operations)
- [x] CSV export functionality for transactions
- [x] Dashboard with real-time calculations
- [x] Error handling middleware
- [x] Logging configuration
- [x] Route protection and authentication flow

### 🚧 In Progress
- [ ] Real JWT authentication (currently using mock auth)
- [ ] Database integration (Prisma configured, using mock service)
- [ ] Category management UI
- [ ] Budget tracking features

### 📋 Next Steps
1. **Authentication**: Replace mock auth with real JWT implementation
2. **Database**: Connect to PostgreSQL and replace mock service
3. **Categories**: Build category management interface
4. **Budgets**: Implement budget tracking and alerts
5. **Reports**: Advanced analytics and data visualization
6. **Testing**: Add comprehensive test coverage
7. **Deployment**: Configure Azure deployment pipeline

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/export` - Export transactions as CSV (with optional filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

#### CSV Export Endpoint
**Endpoint:** `GET /api/transactions/export`
**Authentication:** Required (Bearer token)
**Query Parameters:**
- `category` (optional) - Filter by category ID
- `type` (optional) - Filter by transaction type ('income' or 'expense')

**Response:** CSV file with headers: `id,date,description,category,type,amount`
**Filename format:** `transactions-YYYY-MM-DD.csv`

**UI Feature:** The TransactionList component includes an "Export CSV" button in the header. The button:
- Is disabled when there are no transactions
- Shows "Exporting..." state during download
- Automatically triggers file download with proper filename

**Example Usage:**
```bash
# Export all transactions
GET /api/transactions/export

# Export only expenses
GET /api/transactions/export?type=expense

# Export specific category
GET /api/transactions/export?category=food-category-id
```

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/spending-trends` - Spending analysis
- `GET /api/analytics/category-breakdown` - Category analysis

## 🎨 Design System

The app follows a sophisticated design system with:
- **Primary Color**: Deep Teal (`oklch(0.45 0.15 180)`)
- **Accent Color**: Warm Orange (`oklch(0.70 0.15 50)`)
- **Typography**: Inter font family
- **Spacing**: 4px base unit system
- **Components**: Cards, buttons, forms with consistent styling

## 🚀 Future Enhancements
- Receipt scanning with OCR
- AI-powered expense categorization
- Recurring transaction automation
- Multi-currency support
- Expense splitting
- Advanced reporting and insights
- Mobile app (React Native)

## 📝 License

This project is for demonstration purposes.

---

For detailed technical specifications, see [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md)
For product requirements, see [PRD.md](./PRD.md)
