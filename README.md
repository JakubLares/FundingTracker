# PropFirm Challenge Tracker

A comprehensive web application for traders to track their prop firm challenges, costs, payouts, and analyze their trading performance.

## Features

- **User Authentication**: Secure signup/login system with JWT-based authentication
- **Challenge Tracking**: Track all your prop firm challenges with detailed information
  - Prop firm selection
  - Account size, phase, purchase price
  - Status tracking (in progress, passed, failed)
  - Start and end dates
  - Notes for each challenge
- **Payout Management**: Record and track payouts from successful challenges
  - Link payouts to specific challenges or prop firms
  - Date and amount tracking
  - Notes for each payout
- **Analytics Dashboard**: Comprehensive overview of your trading performance
  - Total challenges (passed, failed, in progress)
  - Total costs vs total earnings
  - Profit/Loss calculation
  - ROI percentage
  - Success rate
  - Monthly costs vs earnings charts
  - Monthly profit/loss visualization
- **Filtering & Sorting**: Filter challenges by status and prop firm
- **15+ Pre-loaded Prop Firms**: Including FTMO, The5ers, TopStep, and more

## Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and builds
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **CSS3** for styling

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FundingTracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/fundingtracker?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
# PORT=3001

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with prop firms
npm run seed

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Configure environment variables
# The .env file is already created with:
# VITE_API_URL=http://localhost:3001/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Setup

### Setting up PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE fundingtracker;
   ```
3. Update the `DATABASE_URL` in `backend/.env` with your credentials

### Running Migrations

```bash
cd backend
npm run prisma:migrate
```

### Seeding Prop Firms

```bash
cd backend
npm run seed
```

This will populate the database with 15 popular prop firms.

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Dashboard**: View your trading analytics and performance metrics
4. **Add Challenges**: Track new prop firm challenges
5. **Record Payouts**: Log payouts from successful challenges
6. **Analyze Performance**: Review charts and statistics on the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Challenges
- `GET /api/challenges` - Get all challenges (with filters)
- `GET /api/challenges/:id` - Get single challenge
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### Payouts
- `GET /api/payouts` - Get all payouts (with filters)
- `GET /api/payouts/:id` - Get single payout
- `POST /api/payouts` - Create new payout
- `PUT /api/payouts/:id` - Update payout
- `DELETE /api/payouts/:id` - Delete payout

### Prop Firms
- `GET /api/propfirms` - Get all prop firms
- `POST /api/propfirms` - Create new prop firm

### Analytics
- `GET /api/analytics` - Get analytics data

## Development

### Backend Development

```bash
cd backend
npm run dev  # Starts with hot reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Starts with hot reload
```

### Database Management

```bash
cd backend
npm run prisma:studio  # Opens Prisma Studio for database management
```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# The build files will be in the 'dist' directory
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/fundingtracker?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Project Structure

```
FundingTracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub
