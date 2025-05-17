import { io, Socket } from 'socket.io-client';
import { StoreTraffic } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  // Initialize socket connection
  connect() {
    if (this.socket) return;

    // Connect to the backend server
    this.socket = io('http://localhost:3001');

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Listen for traffic updates
    this.socket.on('trafficUpdate', (data: StoreTraffic) => {
      this.notifyListeners('trafficUpdate', data);
    });

    // Listen for initial traffic data
    this.socket.on('initialTraffic', (data: StoreTraffic[]) => {
      this.notifyListeners('initialTraffic', data);
    });
  }

  // Disconnect socket
  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  // Add event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // Remove event listener
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  // Notify all listeners for an event
  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        callback(data);
      });
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
