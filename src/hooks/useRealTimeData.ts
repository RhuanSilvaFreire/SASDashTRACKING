import { useState, useEffect, useCallback } from 'react';
import { DatabaseEvent, QueueMessage, EmailEvent, SystemMetrics } from '../types';
import { databaseService } from '../services/database';
import { rabbitMQService } from '../services/rabbitmq';
import { faker } from '@faker-js/faker';

export const useRealTimeData = () => {
  const [dbEvents, setDbEvents] = useState<DatabaseEvent[]>([]);
  const [queueMessages, setQueueMessages] = useState<QueueMessage[]>([]);
  const [emailEvents, setEmailEvents] = useState<EmailEvent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalEvents: 0,
    errorRate: 0,
    avgResponseTime: 0,
    queueDepth: 0,
    emailsSent: 0,
    emailDeliveryRate: 0
  });

  const generateMockData = useCallback(() => {
    // Generate mock database events
    const mockDbEvent: Omit<DatabaseEvent, 'id' | 'timestamp'> = {
      type: faker.helpers.arrayElement(['INSERT', 'UPDATE', 'DELETE', 'SELECT']),
      table: faker.helpers.arrayElement(['users', 'orders', 'products', 'payments']),
      userId: faker.string.uuid(),
      rowsAffected: faker.number.int({ min: 1, max: 100 }),
      duration: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(['SUCCESS', 'ERROR', 'PENDING'])
    };

    databaseService.logEvent(mockDbEvent);

    // Generate mock queue messages
    const mockQueueMessage: QueueMessage = {
      id: faker.string.uuid(),
      queue: faker.helpers.arrayElement(['email-queue', 'notification-queue', 'processing-queue']),
      exchange: 'default',
      routingKey: faker.lorem.word(),
      payload: { data: faker.lorem.sentence() },
      timestamp: new Date(),
      status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
      retryCount: faker.number.int({ min: 0, max: 3 }),
      priority: faker.number.int({ min: 1, max: 10 })
    };

    setQueueMessages(prev => [mockQueueMessage, ...prev.slice(0, 49)]);

    // Generate mock email events
    const mockEmailEvent: EmailEvent = {
      id: faker.string.uuid(),
      to: faker.internet.email(),
      from: 'noreply@trackingsystem.com',
      subject: faker.lorem.sentence(),
      timestamp: new Date(),
      status: faker.helpers.arrayElement(['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED']),
      messageId: faker.string.uuid(),
      opens: faker.number.int({ min: 0, max: 10 }),
      clicks: faker.number.int({ min: 0, max: 5 })
    };

    setEmailEvents(prev => [mockEmailEvent, ...prev.slice(0, 49)]);
  }, []);

  const updateMetrics = useCallback(async () => {
    const dbMetrics = await databaseService.getMetrics();
    const emailDelivered = emailEvents.filter(e => e.status === 'DELIVERED').length;
    const emailDeliveryRate = emailEvents.length > 0 ? (emailDelivered / emailEvents.length) * 100 : 0;

    setMetrics({
      totalEvents: dbMetrics.totalEvents,
      errorRate: dbMetrics.errorRate,
      avgResponseTime: dbMetrics.avgResponseTime,
      queueDepth: queueMessages.filter(q => q.status === 'PENDING').length,
      emailsSent: emailEvents.length,
      emailDeliveryRate
    });
  }, [emailEvents, queueMessages]);

  useEffect(() => {
    const loadInitialData = async () => {
      const events = await databaseService.getEvents();
      setDbEvents(events);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(generateMockData, 3000);
    return () => clearInterval(interval);
  }, [generateMockData]);

  useEffect(() => {
    const updateInterval = setInterval(updateMetrics, 2000);
    return () => clearInterval(updateInterval);
  }, [updateMetrics]);

  useEffect(() => {
    const loadDbEvents = async () => {
      const events = await databaseService.getEvents();
      setDbEvents(events);
    };

    loadDbEvents();
  }, [metrics.totalEvents]);

  return {
    dbEvents,
    queueMessages,
    emailEvents,
    metrics,
    refreshData: generateMockData
  };
};
