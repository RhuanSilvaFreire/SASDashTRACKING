import React from 'react';
import { EmailEvent } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Eye, MousePointer, AlertTriangle, CheckCircle } from 'lucide-react';

interface EmailTrackerProps {
  emails: EmailEvent[];
}

const EmailTracker: React.FC<EmailTrackerProps> = ({ emails }) => {
  const getStatusColor = (status: EmailEvent['status']) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'OPENED': return 'bg-purple-100 text-purple-800';
      case 'CLICKED': return 'bg-indigo-100 text-indigo-800';
      case 'BOUNCED': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: EmailEvent['status']) => {
    switch (status) {
      case 'DELIVERED': return CheckCircle;
      case 'OPENED': return Eye;
      case 'CLICKED': return MousePointer;
      case 'BOUNCED': 
      case 'FAILED': return AlertTriangle;
      default: return Mail;
    }
  };

  const emailStats = {
    total: emails.length,
    delivered: emails.filter(e => e.status === 'DELIVERED').length,
    opened: emails.filter(e => e.status === 'OPENED' || e.opens > 0).length,
    clicked: emails.filter(e => e.status === 'CLICKED' || e.clicks > 0).length,
    bounced: emails.filter(e => e.status === 'BOUNCED').length,
    failed: emails.filter(e => e.status === 'FAILED').length
  };

  return (
    <div className="space-y-6">
      {/* Email Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{emailStats.total}</p>
            </div>
            <Mail className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{emailStats.delivered}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opened</p>
              <p className="text-2xl font-bold text-purple-600">{emailStats.opened}</p>
            </div>
            <Eye className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clicked</p>
              <p className="text-2xl font-bold text-indigo-600">{emailStats.clicked}</p>
            </div>
            <MousePointer className="w-6 h-6 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounced</p>
              <p className="text-2xl font-bold text-yellow-600">{emailStats.bounced}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{emailStats.failed}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Events
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.slice(0, 10).map((email) => {
                const StatusIcon = getStatusIcon(email.status);
                return (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{email.to}</div>
                      <div className="text-sm text-gray-500">{email.messageId.slice(0, 12)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{email.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(email.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {email.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-400" />
                        {email.opens}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MousePointer className="w-3 h-3 text-gray-400" />
                        {email.clicks}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(email.timestamp, { addSuffix: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailTracker;
