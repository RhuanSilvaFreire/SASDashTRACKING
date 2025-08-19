import React from 'react';
import { SystemMetrics } from '../../types';
import { 
  Database, 
  MessageCircle, 
  Mail, 
  AlertTriangle,
  Clock,
  TrendingUp 
} from 'lucide-react';

interface MetricsGridProps {
  metrics: SystemMetrics;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Events',
      value: metrics.totalEvents.toLocaleString(),
      icon: Database,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Error Rate',
      value: `${metrics.errorRate.toFixed(1)}%`,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-2.3%'
    },
    {
      title: 'Avg Response Time',
      value: `${metrics.avgResponseTime.toFixed(0)}ms`,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-5.2%'
    },
    {
      title: 'Queue Depth',
      value: metrics.queueDepth.toString(),
      icon: MessageCircle,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Emails Sent',
      value: metrics.emailsSent.toLocaleString(),
      icon: Mail,
      color: 'bg-green-500',
      change: '+24%'
    },
    {
      title: 'Delivery Rate',
      value: `${metrics.emailDeliveryRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+1.2%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
