import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import MetricsGrid from './components/Dashboard/MetricsGrid';
import EventsTable from './components/Database/EventsTable';
import QueueMonitor from './components/Queue/QueueMonitor';
import EmailTracker from './components/Email/EmailTracker';
import RealTimeMonitor from './components/Monitoring/RealTimeMonitor';
import { useRealTimeData } from './hooks/useRealTimeData';
import { RefreshCw, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { dbEvents, queueMessages, emailEvents, metrics, refreshData } = useRealTimeData();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MetricsGrid metrics={metrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventsTable events={dbEvents} />
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {dbEvents.slice(0, 5).map((event, index) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'SUCCESS' ? 'bg-green-500' : 
                        event.status === 'ERROR' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.type} on {event.table}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.duration.toFixed(2)}ms • {event.rowsAffected} rows
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'database':
        return <EventsTable events={dbEvents} />;
      case 'queue':
        return <QueueMonitor messages={queueMessages} />;
      case 'email':
        return <EmailTracker emails={emailEvents} />;
      case 'monitoring':
        return <RealTimeMonitor />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">RabbitMQ Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connection URL
                    </label>
                    <input
                      type="text"
                      placeholder="amqp://localhost:5672"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Virtual Host
                    </label>
                    <input
                      type="text"
                      placeholder="/"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">SendGrid Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="SG.xxxx..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      placeholder="noreply@yourapp.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? 'System Overview' : activeTab.replace('_', ' ')}
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and track your system events, message queues, and email delivery
            </p>
          </div>
          
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
