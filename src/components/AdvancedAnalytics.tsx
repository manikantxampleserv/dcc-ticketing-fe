import { Clock, Download, Star, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface AdvancedAnalyticsProps {
  tickets: any[];
  agents: any[];
}

export default function AdvancedAnalytics({ tickets, agents }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'frt' | 'art' | 'sla' | 'satisfaction'>('frt');

  // Calculate First Response Time (FRT)
  const calculateFRT = () => {
    const ticketsWithFRT = tickets.filter(t => t.firstResponseAt);
    if (ticketsWithFRT.length === 0) return 0;

    const totalFRT = ticketsWithFRT.reduce((acc, ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const firstResponse = new Date(ticket.firstResponseAt).getTime();
      return acc + (firstResponse - created) / (1000 * 60); // minutes
    }, 0);

    return totalFRT / ticketsWithFRT.length;
  };

  // Calculate Average Resolution Time (ART)
  const calculateART = () => {
    const resolvedTickets = tickets.filter(t => t.resolvedAt);
    if (resolvedTickets.length === 0) return 0;

    const totalART = resolvedTickets.reduce((acc, ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.resolvedAt).getTime();
      return acc + (resolved - created) / (1000 * 60 * 60); // hours
    }, 0);

    return totalART / resolvedTickets.length;
  };

  // Calculate SLA Adherence
  const calculateSLAAdherence = () => {
    if (tickets.length === 0) return 0;
    const slaCompliant = tickets.filter(t => t.slaStatus !== 'breached').length;
    return (slaCompliant / tickets.length) * 100;
  };

  // Generate trend data
  const generateTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTickets = tickets.filter(t => new Date(t.createdAt).toDateString() === date.toDateString());

      data.push({
        date: dateStr,
        created: dayTickets.length,
        resolved: dayTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        frt: dayTickets.length > 0 ? calculateFRT() : 0,
        art: dayTickets.length > 0 ? calculateART() : 0
      });
    }

    return data;
  };

  // Agent performance data
  const agentPerformanceData = agents.map(agent => ({
    name: agent.name,
    totalTickets: agent.performance.totalTickets,
    resolvedTickets: agent.performance.resolvedTickets,
    avgResolutionTime: agent.performance.avgResolutionTime,
    slaCompliance: agent.performance.slaCompliance,
    customerSatisfaction: agent.performance.customerSatisfaction,
    responseTime: agent.performance.responseTime
  }));

  // Priority distribution
  const priorityData = [
    {
      name: 'High',
      value: tickets.filter(t => t.priority === 'high').length,
      color: '#ef4444'
    },
    {
      name: 'Medium',
      value: tickets.filter(t => t.priority === 'medium').length,
      color: '#f59e0b'
    },
    {
      name: 'Low',
      value: tickets.filter(t => t.priority === 'low').length,
      color: '#22c55e'
    }
  ];

  // Ticket trends by hour
  const hourlyTrends = Array.from({ length: 24 }, (_, hour) => {
    const hourTickets = tickets.filter(t => {
      const ticketHour = new Date(t.createdAt).getHours();
      return ticketHour === hour;
    });

    return {
      hour: `${hour}:00`,
      tickets: hourTickets.length,
      avgResponseTime:
        hourTickets.length > 0 ? hourTickets.reduce((acc, t) => acc + (t.timeSpent || 0), 0) / hourTickets.length : 0
    };
  });

  const trendData = generateTrendData();
  const frt = calculateFRT();
  const art = calculateART();
  const slaAdherence = calculateSLAAdherence();

  const kpiCards = [
    {
      title: 'First Response Time',
      value: `${frt} min`,
      change: '-12%',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Avg Resolution Time',
      value: `${art}h`,
      change: '-8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'SLA Adherence',
      value: `${slaAdherence}%`,
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.6/5',
      change: '+0.3',
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                <p className={`text-sm mt-1 ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last period
                </p>
              </div>
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ticket Trends</h2>
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="frt">First Response Time</option>
              <option value="art">Avg Resolution Time</option>
              <option value="sla">SLA Compliance</option>
              <option value="satisfaction">Customer Satisfaction</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="created"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Created"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
                name="Resolved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="resolvedTickets" fill="#3b82f6" name="Resolved Tickets" />
              <Bar dataKey="slaCompliance" fill="#22c55e" name="SLA Compliance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Ticket Volume */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Ticket Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#f59e0b" strokeWidth={2} name="Tickets Created" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Agent Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Agent Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Resolution Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentPerformanceData.map((agent, index) => {
                const performanceScore =
                  agent.slaCompliance * 0.4 +
                  agent.customerSatisfaction * 20 * 0.3 +
                  Math.max(0, 100 - agent.responseTime) * 0.3;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.totalTickets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.resolvedTickets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.avgResolutionTime}h</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            agent.slaCompliance >= 90
                              ? 'text-green-600'
                              : agent.slaCompliance >= 80
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {agent.slaCompliance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{agent.customerSatisfaction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.responseTime} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (performanceScore || 0) >= 80
                            ? 'bg-green-100 text-green-800'
                            : (performanceScore || 0) >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {performanceScore || 0}
                      </span>
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
}
