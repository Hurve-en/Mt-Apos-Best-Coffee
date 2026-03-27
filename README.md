# ☕ Mt. Apos Best Coffee - Ordering System

A full-featured, production-grade coffee ordering and management system built with modern web technologies. This application provides customers with an intuitive interface to browse, order, and track coffee products, while offering administrators comprehensive tools for order and inventory management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 Overview

**Mt. Apos Best Coffee** is a comprehensive coffee ordering and management system designed for both customers and administrative staff. The platform enables customers to:

- Browse a curated selection of premium coffee products
- View detailed product information (roast levels, grind types, sizes)
- Add items to cart and proceed to checkout
- Track order status in real-time
- Create accounts and manage user profiles
- View order history

Meanwhile, administrators can:

- Manage product inventory and pricing
- View and process customer orders
- Monitor order statuses
- Authenticate securely with role-based access control
- Track real-time updates via Socket.IO

---

## ✨ Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse coffee products with detailed information (description, price, roast level, grind type, size)
- **Shopping Cart**: Add/remove items with real-time cart management
- **Order Management**: Place orders and view order history with status tracking
- **Real-time Updates**: Live order status updates via WebSocket connections
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **User Profile**: Manage account information and view order history

### Admin Features
- **Admin Authentication**: Secure admin login with role-based access control
- **Product Management**: Create, update, and delete coffee products
- **Order Management**: View all orders, update order statuses
- **Inventory Management**: Track product stock levels
- **Dashboard**: Comprehensive admin dashboard with key metrics
- **Real-time Order Notifications**: WebSocket-based live updates on new orders

### Technical Features
- **Database Migrations**: Version-controlled database schema with Prisma migrations
- **API Security**: CORS protection, helmet headers, input validation with Zod
- **Error Handling**: Comprehensive error handling and logging
- **Type Safety**: Full TypeScript support across backend and frontend
- **Docker Support**: containerized deployment with Docker Compose
- **JWT Authentication**: Secure token-based authentication with refresh tokens

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js/Express** | 18.x | RESTful API framework |
| **TypeScript** | 5.3.3 | Type-safe development |
| **Prisma** | 5.8.0 | ORM & database management |
| **PostgreSQL** | 16-alpine | Production database |
| **Socket.IO** | 4.7.2 | Real-time bidirectional communication |
| **Multer** | 1.4.5 | Secure multipart uploads for product images |
| **JWT** | 9.0.2 | Token-based authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Zod** | 3.22.4 | TypeScript-first schema validation |
| **Helmet** | 7.1.0 | Security headers middleware |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.2.2 | Type-safe development |
| **Vite** | 5.0.8 | Build tool & dev server |
| **React Router** | 6.20.0 | Client-side routing |
| **Redux Toolkit** | 1.9.7 | State management |
| **Axios** | 1.6.2 | HTTP client |
| **classnames** | 2.5.1 | Conditional class utility |
| **Socket.IO Client** | 4.5.4 | Real-time communication |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Leaflet** | 1.9.4 | Map visualization |
| **React Leaflet** | 4.2.1 | React wrapper for Leaflet |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| **Docker** | Container management |
| **Docker Compose** | Multi-container orchestration |
| **ESLint** | Code quality & linting |
| **ts-node** | TypeScript execution in Node.js |

---

## 🏗 Project Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Port 5173)        │
└──────────┬──────────┘
           │ HTTP/WebSocket
           ▼
┌─────────────────────────────────┐
│  Express.js Backend API         │
│  (Port 5000)                    │
│  ├── Routes (Auth, Products)    │
│  ├── Controllers                │
│  ├── Services                   │
│  └── Middleware                 │
└──────────┬──────────────────────┘
           │ SQL
           ▼
┌─────────────────────┐
│  PostgreSQL         │
│  (Port 5432)        │
└─────────────────────┘
```

### Architecture Patterns
- **MVC Architecture**: Controllers handle requests, Services contain business logic
- **Middleware Pattern**: Authentication, CORS, error handling as middleware layers
- **Repository Pattern**: Prisma Client as data access layer
- **JWT Authentication**: Token-based stateless authentication with refresh tokens
- **Real-time Communication**: Socket.IO for bi-directional updates
- **State Management**: Redux for predictable client-side state

---

## 📁 Project Structure

```
Mt-Apos-Best-Coffee/
├── README.md
├── coffee-app/
│   ├── docker-compose.yml          # Docker orchestration
│   ├── backend/
│   │   ├── Dockerfile              # Backend container configuration
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app.ts              # Express app setup (middleware, routes)
│   │   │   ├── index.ts            # Server bootstrap & seeding
│   │   │   ├── config/
│   │   │   │   ├── prisma.ts       # Shared Prisma client
│   │   │   │   └── multer.config.ts# Upload validation & storage
│   │   │   ├── controllers/        # Request handlers
│   │   │   │   ├── authController.ts
│   │   │   │   ├── adminAuthController.ts
│   │   │   │   ├── orderController.ts
│   │   │   │   ├── adminOrdersController.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── adminProductsController.ts
│   │   │   │   └── userController.ts
│   │   │   ├── services/          # Business logic
│   │   │   │   ├── authService.ts
│   │   │   │   ├── orderService.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── userService.ts
│   │   │   ├── repositories/      # Data access helpers
│   │   │   │   └── product.repository.ts
│   │   │   ├── routes/            # API endpoints
│   │   │   │   ├── auth.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── product.routes.ts
│   │   │   │   ├── users.ts
│   │   │   │   └── index.ts
│   │   │   ├── middleware/        # Middleware functions
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── adminMiddleware.ts
│   │   │   │   ├── cors.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── schemas/           # Zod validation schemas
│   │   │   │   └── product.schema.ts
│   │   │   ├── types/             # TypeScript type definitions
│   │   │   │   ├── user.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── product.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/             # Utility functions
│   │   │       ├── errorHandler.ts
│   │   │       ├── logger.ts
│   │   │       └── index.ts
│   │   └── prisma/
│   │       ├── schema.prisma       # Database schema
│   │       ├── seed.ts            # Database seeding
│   │       ├── seed-data.ts
│   │       ├── migrations/        # Database migrations
│   │       │   ├── migration_lock.toml
│   │       │   ├── 20260102054356_init/
│   │       │   ├── 20260102062013_make_role_optional/
│   │       │   └── 20260122062611_add_product_fields/
│   │       └── migrate.lock
│   │
│   └── frontend/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── src/
│       │   ├── main.tsx            # React entry point
│       │   ├── App.tsx
│       │   ├── index.css
│       │   ├── vite-env.d.ts
│       │   ├── components/         # Reusable components
│       │   │   ├── Auth/
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── RegisterForm.tsx
│       │   │   │   └── ProtectedRoute.tsx
│       │   │   ├── Cart/
│       │   │   ├── Common/
│       │   │   ├── Home/
│       │   │   ├── Menu/
│       │   │   └── Order/
│       │   ├── pages/              # Page components
│       │   │   ├── Home.tsx
│       │   │   ├── Menu.tsx
│       │   │   ├── Cart.tsx
│       │   │   ├── Checkout.tsx
│       │   │   ├── Orders.tsx
│       │   │   ├── OrderDetail.tsx
│       │   │   ├── Profile.tsx
│       │   │   ├── AdminDashboard.tsx
│       │   │   ├── AdminLogin.tsx
│       │   │   ├── AdminOrders.tsx
│       │   │   ├── AdminProducts.tsx
│       │   │   ├── Login.tsx
│       │   │   ├── Register.tsx
│       │   │   └── NotFound.tsx
│       │   ├── hooks/              # Custom React hooks
│       │   │   ├── useAuth.ts
│       │   │   ├── useCart.ts
│       │   │   ├── useApi.ts
│       │   │   ├── useRedux.ts
│       │   │   └── index.ts
│       │   ├── redux/              # State management
│       │   │   ├── store.ts
│       │   │   ├── slices/
│       │   │   └── index.ts
│       │   ├── services/           # API services
│       │   │   ├── api.ts
│       │   │   ├── auth.ts
│       │   │   └── socket.ts
│       │   ├── types/              # TypeScript definitions
│       │   │   ├── user.ts
│       │   │   ├── order.ts
│       │   │   ├── product.ts
│       │   │   ├── api.ts
│       │   │   └── index.ts
│       │   ├── utils/              # Utility functions
│       │   │   ├── api.ts
│       │   │   ├── constants.ts
│       │   │   ├── helpers.ts
│       │   │   └── index.ts
│       │   ├── styles/             # Global styles
│       │   │   ├── index.css
│       │   │   ├── premium.css
│       │   │   ├── menu-editorial.css  # New editorial menu theme
│       │   │   └── variables.css
│       │   ├── assets/             # Static assets
│       │   └── Images/
│       └── postcss.config.mjs
```

---

## 🗄 Database Schema

The application uses PostgreSQL with Prisma ORM. Here's the complete schema:

### User Model
```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  name      String
  role      String? @default("customer")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}
```
**Purpose**: Stores user account information with role-based access (customer/admin)

### Product Model
```prisma
model Product {
  id          String     @id @default(uuid()) @db.Uuid
  name        String     @unique
  description String?    @db.Text
  price       Decimal    @db.Decimal(10, 2)
  stock       Int        @default(0)
  imageUrl    String?
  roastLevel  String?
  grind       String?
  size        String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?
  orderItems  OrderItem[]
}
```
**Purpose**: Stores coffee product information with soft-delete support and precise pricing

### Order Model
```prisma
model Order {
  id        Int     @id @default(autoincrement())
  userId    Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     OrderItem[]
  total     Float
  status    String  @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Purpose**: Tracks customer orders with status management (pending, processing, completed, cancelled)

### OrderItem Model
```prisma
model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  createdAt DateTime @default(now())
}
```
**Purpose**: Junction table storing individual items within each order with quantity and pricing

### Key Features:
- ✅ Cascading deletes for data integrity
- ✅ Timestamps for audit trails
- ✅ Proper indexing with unique constraints
- ✅ Role-based user differentiation

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 16.x (or Docker)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Mt-Apos-Best-Coffee.git
cd Mt-Apos-Best-Coffee
```

### Step 2: Backend Setup

```bash
cd coffee-app/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update DATABASE_URL and JWT secrets in .env
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update API and Socket URLs in .env
```

### Alternative: Docker Setup (Recommended)

```bash
cd coffee-app

# Ensure .env file is present with necessary variables
docker-compose up -d

# Run migrations in the docker container
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

---

## 🏃 Running the Application

### Local Development

**Terminal 1 - Backend:**
```bash
cd coffee-app/backend
npm run dev
# Server runs on http://localhost:3000 by default (set PORT to override)
```

**Terminal 2 - Frontend:**
```bash
cd coffee-app/frontend
npm run dev
# App runs on http://localhost:5173
```

### With Docker

```bash
cd coffee-app
docker-compose up

# Access:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
```

### Build for Production

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: Configure as needed

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/admin-login` | Admin login |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/logout` | User logout |

#### Products Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

#### Orders Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id` | Update order status (admin) |
| DELETE | `/api/orders/:id` | Cancel order |

#### Users Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/:id` | Get user by ID (admin) |

### WebSocket Events

Connected clients receive real-time updates for:
- `order:created` - New order placed
- `order:updated` - Order status changed
- `product:updated` - Product inventory changed

---

## 👨‍💻 Development Workflow

### Branching Strategy
```bash
# Feature development
git checkout -b feature/feature-name

# Bug fixes
git checkout -b bugfix/bug-name

# Hotfixes
git checkout -b hotfix/issue-name
```

### Code Standards

**TypeScript**:
- Use strict mode: `strict: true` in tsconfig.json
- Define all types explicitly
- Avoid `any` type

**Prettier Formatting**:
```bash
npm run lint
```

**Pre-commit Checks**:
```bash
npm run type-check
npm run lint
```

### Database Migrations

Create a migration after schema changes:
```bash
npx prisma migrate dev --name <migration_name>
```

Example:
```bash
npx prisma migrate dev --name add_discount_field
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coffee_ordering_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Mt. Apos Best Coffee
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** following the branching strategy
3. **Make your changes** with clear commit messages
4. **Write/update tests** for new functionality
5. **Run linting and type checks**:
   ```bash
   npm run lint
   npm run type-check
   ```
6. **Submit a Pull Request** with a clear description

### Code Review Process
- Pull requests require at least 1 approval
- All tests must pass
- No ESLint warnings
- TypeScript strict mode must pass

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:
- `feat(auth): add JWT refresh token endpoint`
- `fix(orders): resolve cart total calculation bug`
- `docs(readme): update installation instructions`

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- Single database instance (no read replicas)
- Basic error logging (no external service integration)
- Limited payment gateway integration

### Planned Features
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for order updates
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Customer reviews and ratings
- [ ] Subscription-based ordering
- [ ] Multiple location support

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Support

For support, email: support@mtaposbest.coffee or open an issue on GitHub.

---

## 📞 Contact & Social

- **Website**: www.mtaposbest.coffee
- **Email**: info@mtaposbest.coffee
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/Mt-Apos-Best-Coffee/issues)

---

**Last Updated**: March 27, 2026  
**Version**: 1.0.0  
**Maintainers**: Mt. Apos Best Coffee Team
