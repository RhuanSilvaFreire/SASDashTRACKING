export interface DatabaseEvent {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  table: string;
  timestamp: Date;
  userId?: string;
  rowsAffected: number;
  duration: number;
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  metadata?: any;
}

export interface QueueMessage {
  id: string;
  queue: string;
  exchange: string;
  routingKey: string;
  payload: any;
  timestamp: Date;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  retryCount: number;
  priority: number;
}

export interface EmailEvent {
  id: string;
  to: string;
  from: string;
  subject: string;
  timestamp: Date;
  status: 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';
  messageId: string;
  templateId?: string;
  opens: number;
  clicks: number;
}

export interface SystemMetrics {
  totalEvents: number;
  errorRate: number;
  avgResponseTime: number;
  queueDepth: number;
  emailsSent: number;
  emailDeliveryRate: number;
}
