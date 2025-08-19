import { DatabaseEvent } from '../types';

class DatabaseService {
  private events: DatabaseEvent[] = [];

  async logEvent(event: Omit<DatabaseEvent, 'id' | 'timestamp'>): Promise<DatabaseEvent> {
    const dbEvent: DatabaseEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.events.push(dbEvent);
    console.log('Database event logged:', dbEvent);
    
    return dbEvent;
  }

  async getEvents(limit: number = 100): Promise<DatabaseEvent[]> {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getEventsByTable(table: string): Promise<DatabaseEvent[]> {
    return this.events.filter(event => event.table === table);
  }

  async getEventsByType(type: DatabaseEvent['type']): Promise<DatabaseEvent[]> {
    return this.events.filter(event => event.type === type);
  }

  async getMetrics(): Promise<any> {
    const total = this.events.length;
    const errors = this.events.filter(e => e.status === 'ERROR').length;
    const avgDuration = this.events.reduce((sum, e) => sum + e.duration, 0) / total || 0;

    return {
      totalEvents: total,
      errorRate: total > 0 ? (errors / total) * 100 : 0,
      avgResponseTime: avgDuration,
      successRate: total > 0 ? ((total - errors) / total) * 100 : 0
    };
  }
}

export const databaseService = new DatabaseService();
