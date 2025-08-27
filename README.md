# TaskMon 🐾

A gamified to-do app where users complete quests to feed and evolve their virtual monster companions.

## 🎮 Overview

TaskMon transforms mundane task management into an engaging adventure. Users create and complete quests (tasks) to gain XP, level up, and feed their virtual monster. As the monster grows, it evolves through different stages, providing visual motivation and a sense of progression.

## ✨ Features

### 🎯 Quest System

- Create, edit, and delete quests
- Different difficulty levels (Easy, Normal, Hard)
- Quest types (Normal, Daily, Weekly)
- XP rewards and due dates
- Quest completion tracking

### 🐾 Monster Companion

- Virtual monster that grows with your progress
- Three evolution stages with visual changes
- Hunger and mood system
- Feeding mechanics
- Real-time status updates

### 🏆 Gamification

- XP and leveling system
- Achievement system with unlockable rewards
- **Daily login streaks** with visual feedback
- Progress visualization
- Real-time notifications

### 📊 Dashboard

- Monster status and feeding
- XP progress bar
- **Streak display** with animations and progress
- Quest statistics
- Recent activity overview
- Achievement progress

## 🛠 Tech Stack

### Backend

- **Node.js** with **Express** and **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **JWT** authentication with refresh tokens
- **Socket.io** for real-time features
- **Zod** for validation
- **bcryptjs** for password hashing

### Frontend

- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **React Router** for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time updates

### Development Tools

- **ESLint** and **Prettier** for code quality
- **TypeScript** for type safety
- **Monorepo** structure with workspaces
- **Concurrently** for running multiple services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd taskmon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

#### Backend (.env)

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmon"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (.env)

Create `apps/web/.env`:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:api    # Backend on http://localhost:3000
npm run dev:web    # Frontend on http://localhost:5173
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/health

## 📁 Project Structure

```
taskmon/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── types/       # TypeScript types
│   │   ├── prisma/          # Database schema
│   │   └── src/scripts/     # Database scripts
│   └── web/                 # Frontend React app
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── contexts/    # React contexts
│       │   ├── services/    # API services
│       │   └── types/       # TypeScript types
├── packages/
│   └── config/              # Shared configuration
└── package.json             # Root package.json
```

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (updates streak)
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/streak` - Get streak information

### Quests

- `GET /api/quests` - Get all quests
- `POST /api/quests` - Create new quest
- `GET /api/quests/:id` - Get specific quest
- `PATCH /api/quests/:id` - Update quest
- `DELETE /api/quests/:id` - Delete quest
- `POST /api/quests/:id/complete` - Complete quest

### Monster

- `GET /api/monster` - Get monster status
- `POST /api/monster/feed` - Feed monster

### Achievements

- `GET /api/achievements` - Get achievement progress
- `GET /api/achievements/unlocked` - Get unlocked achievements

## 🎮 Game Mechanics

### XP System

- Each quest awards XP based on difficulty
- Level up every 100 XP
- XP is shared between user and monster

### Monster Evolution

- **Stage 1**: Slime (0-199 XP)
- **Stage 2**: Slime Warrior (200-499 XP)
- **Stage 3**: Slime King (500+ XP)

### Streak System

- **Daily Login Tracking**: Automatically tracks consecutive days of login
- **Visual Feedback**: Animated streak display with fire emojis
- **Streak Levels**: Different colors and messages based on streak length
- **Reset Logic**: Streak resets to 1 if a day is missed
- **Progress Bar**: Visual progress towards milestone streaks

### Hunger System

- Monster hunger decreases over time
- Feeding restores hunger and improves mood
- Mood affects monster animations

### Achievements

- First Steps: Complete your first quest
- Week Warrior: Maintain a 7-day streak
- Quest Master: Complete 10 quests
- Evolution Champion: Evolve monster to stage 2
- Level 10 Hero: Reach level 10

## 🚀 Deployment

### Backend (Render/Fly.io)

1. Set environment variables
2. Run database migrations
3. Build and deploy

### Frontend (Vercel)

1. Connect repository
2. Set environment variables
3. Deploy automatically

### Database (Neon)

1. Create PostgreSQL database
2. Update DATABASE_URL
3. Run migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by Tamagotchi and modern gamification principles
- Built with modern web technologies for optimal performance
- Designed for both productivity and entertainment

---

**Happy questing! 🐾✨**
