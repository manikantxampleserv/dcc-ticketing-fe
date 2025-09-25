import React from 'react';
import { Activity, CheckCircle, Clock, Ticket } from 'lucide-react';

interface UserActivityStatsProps {
  activeTickets?: number;
  resolvedTickets?: number;
  avgResponse?: number; // in hours or minutes
  slaCompliance?: number; // percentage
}

const UserActivityStats: React.FC<UserActivityStatsProps> = ({
  activeTickets = 0,
  resolvedTickets = 0,
  avgResponse = 0,
  slaCompliance = 0
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Tickets */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <Ticket className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-blue-600">Active Tickets</p>
            <p className="text-2xl font-bold text-blue-900">{activeTickets}</p>
          </div>
        </div>
      </div>

      {/* Resolved Tickets */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-green-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
          </div>
        </div>
      </div>

      {/* Average Response */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-yellow-600">Avg Response</p>
            <p className="text-2xl font-bold text-yellow-600">{avgResponse}</p>
          </div>
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-purple-600">SLA Compliance</p>
            <p className="text-2xl font-bold text-purple-600">{slaCompliance}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityStats;
