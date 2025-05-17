# Store Customer Traffic Dashboard

A full-stack application for monitoring store customer traffic in real-time and viewing historical data.

## Features

- Real-time monitoring of customers entering and exiting stores
- Historical traffic data displayed hourly for the last 24 hours
- Interactive charts for visualizing traffic patterns
- Support for multiple stores

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO Client (for real-time updates)
- Chart.js (for data visualization)

### Backend
- Node.js
- Express.js
- TypeScript
- Socket.IO (for real-time updates)
- KafkaJS (for Kafka integration)

## Project Structure

```
store-dashboard/
├── backend/             # Express.js backend
│   ├── src/
│   │   ├── index.ts     # Main server file
│   │   ├── types.ts     # Type definitions
│   │   └── trafficService.ts  # Service for handling traffic data
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/            # Next.js frontend
    ├── src/
    │   ├── app/         # Next.js app directory
    │   │   ├── dashboard/  # Dashboard page
    │   │   ├── globals.css # Global styles
    │   │   ├── layout.tsx  # Root layout
    │   │   └── page.tsx    # Home page
    │   ├── components/  # React components
    │   ├── lib/         # Utility functions and services
    │   └── types/       # Type definitions
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd store-dashboard/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd store-dashboard/backend
npm run dev
```

2. In a separate terminal, start the frontend development server:

```bash
cd store-dashboard/frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Kafka Integration

The application is designed to consume customer traffic data from Kafka. In the current implementation, we're simulating Kafka messages for demonstration purposes.

To connect to a real Kafka cluster:

1. Update the Kafka configuration in `backend/src/index.ts`
2. Uncomment and configure the Kafka consumer code

## License

MIT
