import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { trafficService } from './trafficService';
import { CustomerMessage } from './types';

// Create Express app
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: '*', // In production, specify your frontend URL
  methods: ['GET', 'POST'],
}));

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // In production, specify your frontend URL
    methods: ['GET', 'POST'],
  }
});

// Parse JSON request body
app.use(express.json());

// API routes
app.get('/api/traffic/current/:storeId', (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const traffic = trafficService.getCurrentTraffic(storeId);
  
  if (!traffic) {
    return res.status(404).json({ error: 'Store not found' });
  }
  
  res.json(traffic);
});

app.get('/api/traffic/current', (req, res) => {
  const allTraffic = trafficService.getAllCurrentTraffic();
  res.json(allTraffic);
});

app.get('/api/traffic/history/:storeId', (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const history = trafficService.getTrafficHistory(storeId);
  res.json(history);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data to the client
  const allTraffic = trafficService.getAllCurrentTraffic();
  socket.emit('initialTraffic', allTraffic);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulate Kafka consumer
function simulateKafkaMessages() {
  // Generate a random message every 2-5 seconds
  const interval = 2000 + Math.floor(Math.random() * 3000);
  
  setTimeout(() => {
    const message = trafficService.generateTestData();
    console.log('Received Kafka message:', message);
    
    // Process the message
    const updatedTraffic = trafficService.processMessage(message);
    
    // Broadcast the update to all connected clients
    io.emit('trafficUpdate', updatedTraffic);
    
    // Schedule the next message
    simulateKafkaMessages();
  }, interval);
}

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start simulating Kafka messages
  simulateKafkaMessages();
});

// In a real application, you would set up a Kafka consumer here
// For example:
/*
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'store-dashboard',
  brokers: ['kafka-broker:9092']
});

const consumer = kafka.consumer({ groupId: 'store-dashboard-group' });

async function setupKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'store-traffic', fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value?.toString();
      if (messageValue) {
        try {
          const customerMessage: CustomerMessage = JSON.parse(messageValue);
          const updatedTraffic = trafficService.processMessage(customerMessage);
          io.emit('trafficUpdate', updatedTraffic);
        } catch (error) {
          console.error('Error processing Kafka message:', error);
        }
      }
    },
  });
}

setupKafkaConsumer().catch(console.error);
*/
