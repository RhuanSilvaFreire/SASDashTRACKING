import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  source: 'DATABASE' | 'QUEUE' | 'EMAIL' | 'SYSTEM';
}

const RealTimeMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isActive, setIsActive] = useState(true);

  const generateLogEntry = (): LogEntry => {
    const sources: LogEntry['source'][] = ['DATABASE', 'QUEUE', 'EMAIL', 'SYSTEM'];
    const levels: LogEntry['level'][] = ['INFO', 'WARN', 'ERROR', 'SUCCESS'];
    const messages = {
      DATABASE: [
        'New connection established',
        'Query executed successfully',
        'Transaction committed',
        'Index optimization completed',
        'Backup process started'
      ],
      QUEUE: [
        'Message published to queue',
        'Consumer connected',
        'Queue depth threshold reached',
        'Dead letter queue processed',
        'Message acknowledgment received'
      ],
      EMAIL: [
        'Email delivery confirmed',
        'Template rendered successfully',
        'Bounce notification received',
        'Unsubscribe request processed',
        'Campaign analytics updated'
      ],
      SYSTEM: [
        'Service health check passed',
        'Memory usage optimized',
        'API rate limit applied',
        'Configuration updated',
        'Monitoring alert triggered'
      ]
    };

    const source = sources[Math.floor(Math.random() * sources.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[source][Math.floor(Math.random() * messages[source].length)];

    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      source
    };
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newLog = generateLogEntry();
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return 'text-green-400 bg-green-900/20';
      case 'INFO': return 'text-blue-400 bg-blue-900/20';
      case 'WARN': return 'text-yellow-400 bg-yellow-900/20';
      case 'ERROR': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return Activity;
      case 'INFO': return Zap;
      case 'WARN': return Clock;
      case 'ERROR': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time System Monitor
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isActive ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div className="bg-gray-900 rounded-lg shadow-sm border h-96 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">System Log Stream</h3>
        </div>
        <div className="h-full overflow-y-auto p-4 space-y-2 font-mono text-sm">
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const Icon = getLevelIcon(log.level);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-2 rounded border border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)} flex items-center gap-1`}>
                    <Icon className="w-3 h-3" />
                    {log.level}
                  </span>
                  <span className="text-gray-400 text-xs px-2 py-1 bg-gray-800 rounded">
                    {log.source}
                  </span>
                  <span className="text-gray-300 flex-1">
                    {log.message}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900">45%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Memory</p>
              <p className="text-2xl font-bold text-gray-900">2.4GB</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Connections</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
