# 📅 Google Calendar Clone

A high-fidelity, full-stack Google Calendar clone built with modern web technologies. Features include event CRUD operations, recurring events, conflict detection, real-time synchronization, and a pixel-perfect UI that mirrors Google Calendar's design.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## ✨ Features

### Core Functionality
- ✅ **Multiple Calendar Views**: Month, Week, and Day views with smooth transitions
- ✅ **Event Management**: Full CRUD operations for events
- ✅ **Recurring Events**: Support for daily, weekly, and monthly recurrence patterns
- ✅ **Conflict Detection**: Automatic detection of overlapping events
- ✅ **Real-time Sync**: WebSocket-based real-time updates across clients
- ✅ **User Authentication**: JWT-based secure authentication
- ✅ **Drag & Drop**: (In Progress) Intuitive event creation and rescheduling
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices

### UI/UX Highlights
- 🎨 Google Calendar-inspired design with Tailwind CSS
- ⚡ Smooth animations using Framer Motion
- 🔔 Toast notifications for user feedback
- ⌨️ Keyboard shortcuts for quick navigation
- 🎯 Optimistic UI updates for instant feedback
- 📱 Mobile-responsive interface

## 🛠️ Tech Stack

### Frontend
```
├── React 18 + TypeScript
├── Vite (Build tool)
├── Tailwind CSS (Styling)
├── Framer Motion (Animations)
├── Zustand (State management)
├── TanStack React Query (Data fetching & caching)
├── Axios (HTTP client)
├── date-fns (Date utilities)
├── Socket.io Client (Real-time sync)
└── Lucide React (Icons)
```

### Backend
```
├── Node.js + Express
├── TypeScript
├── MongoDB + Mongoose (Database)
├── Socket.io (WebSockets)
├── JWT (Authentication)
├── bcryptjs (Password hashing)
├── date-fns (Date operations)
└── Express Validator (Input validation)
```

### Development Tools
```
├── ESLint + Prettier (Code quality)
├── Jest + React Testing Library (Testing)
├── Cypress (E2E testing - In Progress)
├── Concurrently (Multi-process runner)
└── Husky (Git hooks - In Progress)
```

## 📁 Project Structure

```
google-calendar-clone/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts              # User model
│   │   │   └── Event.ts             # Event model with recurrence
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth endpoints
│   │   │   └── eventsController.ts  # Event CRUD
│   │   ├── services/
│   │   │   ├── recurrenceService.ts # Recurring event logic
│   │   │   └── conflictService.ts   # Conflict detection
│   │   ├── routes/
│   │   │   ├── auth.ts              # Auth routes
│   │   │   └── events.ts            # Event routes
│   │   ├── middleware/
│   │   │   └── auth.ts              # JWT authentication
│   │   ├── config.ts                # Configuration
│   │   ├── socket.ts                # Socket.io setup
│   │   └── server.ts                # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarShell.tsx    # Main layout
│   │   │   ├── Toolbar.tsx          # Navigation toolbar
│   │   │   ├── MonthView/
│   │   │   │   ├── MonthView.tsx    # Month grid view
│   │   │   │   └── DayCell.tsx      # Individual day cell
│   │   │   ├── WeekView/
│   │   │   │   ├── WeekView.tsx     # Week view
│   │   │   │   └── EventBlock.tsx   # Event display block
│   │   │   ├── DayView/
│   │   │   │   └── DayView.tsx      # Day view
│   │   │   ├── EventModal.tsx       # Event creation/edit modal
│   │   │   ├── EventSidePanel.tsx   # Event details panel
│   │   │   └── ConfirmDialog.tsx    # Delete confirmation
│   │   ├── hooks/
│   │   │   └── useCalendar.ts       # Calendar data hook
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   ├── dateUtils.ts         # Date utilities
│   │   │   ├── store.ts             # Zustand store
│   │   │   └── socket.ts            # Socket.io client
│   │   ├── pages/
│   │   │   └── App.tsx              # Root component
│   │   ├── styles/
│   │   │   └── tailwind.css         # Global styles
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── .env.example                      # Environment variables template
├── .gitignore
├── .prettierrc
├── package.json                      # Root scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/google-calendar-clone.git
cd google-calendar-clone
```

2. **Install all dependencies**
```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

3. **Environment Setup**

Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Update the variables:
```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/google-calendar-clone

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB**

Local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas and update `MONGODB_URI` in `.env`.

5. **Run the application**

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Event Endpoints

#### Get Events (with date range)
```http
GET /events?start=2024-01-01T00:00:00.000Z&end=2024-01-31T23:59:59.999Z
Authorization: Bearer <token>
```

Response:
```json
{
  "events": [
    {
      "_id": "...",
      "title": "Team Meeting",
      "description": "Weekly sync",
      "start": "2024-01-15T10:00:00.000Z",
      "end": "2024-01-15T11:00:00.000Z",
      "allDay": false,
      "color": "#1a73e8",
      "location": "Conference Room A",
      "recurrence": null,
      "isRecurring": false,
      "createdBy": "..."
    }
  ]
}
```

#### Get Single Event
```http
GET /events/:id
Authorization: Bearer <token>
```

#### Create Event
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T11:00:00.000Z",
  "allDay": false,
  "color": "#1a73e8",
  "location": "Conference Room A",
  "recurrence": {
    "freq": "WEEKLY",
    "interval": 1,
    "byWeekday": [1, 3, 5],
    "count": 10
  }
}
```

#### Update Event
```http
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Meeting Title",
  "start": "2024-01-15T11:00:00.000Z"
}
```

#### Delete Event
```http
DELETE /events/:id
Authorization: Bearer <token>
```

#### Check Conflicts
```http
POST /events/conflicts
Authorization: Bearer <token>
Content-Type: application/json

{
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T11:00:00.000Z",
  "excludeEventId": "optional_event_id"
}
```

Response:
```json
{
  "hasConflict": true,
  "conflicts": [...]
}
```

## 🧠 Architecture & Business Logic

### Data Flow
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React UI  │ ◄─────► │   Express   │ ◄─────► │   MongoDB   │
│  (Frontend) │  HTTP   │  (Backend)  │  ODM    │  (Database) │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │      WebSocket        │
       └───────────────────────┘
            Real-time Sync
```

### State Management

**Frontend State (Zustand)**:
- `currentView`: 'month' | 'week' | 'day'
- `selectedDate`: Current date in focus
- `eventModalOpen`: Modal visibility state
- `sidePanelOpen`: Side panel visibility
- `selectedEvent`: Currently selected event

**Server State (React Query)**:
- Automatic caching with 5-minute stale time
- Optimistic updates for instant UI feedback
- Automatic refetching on window focus
- Query invalidation on mutations

### Recurring Events Logic

#### Expansion Algorithm
```typescript
1. Fetch base recurring event from DB
2. Calculate date range for current view
3. Generate occurrences:
   - Start from event.start date
   - Apply frequency (DAILY/WEEKLY/MONTHLY)
   - Apply interval (every N days/weeks/months)
   - Filter by weekday (if specified)
   - Stop at count or until date
   - Skip exception dates
4. Return expanded events within range
```

#### Recurrence Schema
```typescript
interface IRecurrence {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
  interval: number;           // Every N days/weeks/months
  byWeekday?: number[];       // [0-6] for Sun-Sat
  count?: number;             // Total occurrences
  until?: Date;               // End date
}
```

#### Exception Handling
- Exceptions are stored as Date[] in the event document
- When expanding, dates in exceptions are skipped
- Allows individual occurrence deletion without affecting series

### Conflict Detection

#### Overlap Logic
Two events conflict if:
```typescript
event1.start < event2.end && event1.end > event2.start
```

#### Detection Flow
```typescript
1. User creates/updates event with time range
2. Backend queries all user events overlapping that range
3. Expands any recurring events in that range
4. Checks each expanded event for overlap
5. Returns conflicts if any found
```

### Real-time Synchronization

#### Socket.io Events
```typescript
// Server → Client
'event:created'  → New event created
'event:updated'  → Event modified
'event:deleted'  → Event removed

// Client response
Invalidates React Query cache
Triggers automatic refetch
UI updates automatically
```

#### Connection Flow
```typescript
1. Client authenticates with JWT token
2. Server validates token
3. Client joins user-specific room: `user:${userId}`
4. Server emits events only to that room
5. Auto-reconnection on disconnect
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New event |
| `M` | Month view |
| `W` | Week view |
| `D` | Day view |
| `T` | Today |

## 🎨 Design System

### Colors
```css
--gc-blue:   #1a73e8;  /* Primary blue */
--gc-red:    #ea4335;  /* Delete/danger */
--gc-green:  #34a853;  /* Success */
--gc-yellow: #fbbc04;  /* Warning */
```

### Shadows
```css
--shadow-sm: 0 1px 4px rgba(0,0,0,0.05);
--shadow-md: 0 2px 12px rgba(0,0,0,0.08);
--shadow-lg: 0 4px 20px rgba(0,0,0,0.12);
```

### Animations
- Modal open: Scale from 0.96 to 1, fade in
- Side panel: Slide from right with spring animation
- Event hover: Scale to 1.02
- Drag: Scale to 1.02 with shadow

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Watch mode
npm run test:watch

# E2E tests (Cypress)
npm run test:e2e
```

### Test Coverage

```bash
# Backend coverage
cd backend && npm test -- --coverage

# Frontend coverage
cd frontend && npm test -- --coverage
```

### Writing Tests

**Backend (Jest + Supertest)**:
```typescript
describe('POST /api/v1/events', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        start: new Date(),
        end: new Date(),
      });
    
    expect(res.status).toBe(201);
    expect(res.body.event).toHaveProperty('_id');
  });
});
```

**Frontend (React Testing Library)**:
```typescript
test('renders calendar shell', () => {
  render(<CalendarShell />);
  expect(screen.getByText('Calendar')).toBeInTheDocument();
});
```

## 🔧 Development

### Code Quality

```bash
# Lint
npm run lint

# Lint & fix
npm run lint:fix

# Format
npm run format
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately
cd backend && npm run build
cd frontend && npm run build
```

### Production Start

```bash
# Backend
cd backend && npm start

# Frontend (serve with static server)
cd frontend/dist && npx serve
```

## 🚀 Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variables
6. Deploy

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=<your-frontend-url>
```

## 🐛 Known Issues & Future Enhancements

### In Progress
- [ ] Drag & drop event creation
- [ ] Event resizing in week/day view
- [ ] Full recurring event editing (this/following/all)
- [ ] Multi-day event spanning
- [ ] Multiple calendars per user
- [ ] Calendar sharing & permissions
- [ ] Email notifications
- [ ] Time zone support
- [ ] Undo/redo functionality

### Known Limitations
- Recurring events: Only basic patterns supported
- Delete: Only single event deletion (not series)
- Mobile: Touch gestures not fully optimized
- Performance: Large recurrence rules may be slow

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Inspired by Google Calendar
- Built with modern React ecosystem
- Community-driven open source libraries

---

**⭐ Star this repo if you find it useful!**