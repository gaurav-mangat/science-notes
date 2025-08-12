import { useState, useEffect } from 'react';
import Link from 'next/link';
import { chapters } from '../../data/chapters';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalChapters: 0,
    totalClasses: 0,
    totalSubjects: 0,
    recentUploads: 0,
    adRevenue: 0,
    pageViews: 0
  });

  useEffect(() => {
    // Calculate stats from chapters data
    const totalChapters = Object.keys(chapters).length;
    const totalClasses = [...new Set(Object.values(chapters).map(c => c.class))].length;
    const totalSubjects = [...new Set(Object.values(chapters).map(c => c.subject))].length;
    
    setStats({
      totalChapters,
      totalClasses,
      totalSubjects,
      recentUploads: Math.floor(Math.random() * 10) + 5, // Simulated data
      adRevenue: Math.floor(Math.random() * 1000) + 500, // Simulated data
      pageViews: Math.floor(Math.random() * 10000) + 5000 // Simulated data
    });
  }, []);

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, href, icon, color }) => (
    <Link href={href} className="block">
      <div className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${color}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  const RecentActivity = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {[
          { action: 'Chapter uploaded', details: 'Class 8 Science - Chapter 5', time: '2 hours ago', type: 'upload' },
          { action: 'Content updated', details: 'Class 7 Mathematics - Chapter 2', time: '1 day ago', type: 'update' },
          { action: 'New subject added', details: 'Class 6 Social Studies', time: '3 days ago', type: 'add' },
          { action: 'Ad performance', details: 'Revenue increased by 15%', time: '1 week ago', type: 'revenue' }
        ].map((item, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${
                item.type === 'upload' ? 'bg-green-400' :
                item.type === 'update' ? 'bg-blue-400' :
                item.type === 'add' ? 'bg-purple-400' : 'bg-yellow-400'
              }`} />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
              <div className="text-sm text-gray-400">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AdPerformance = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Ad Performance</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.adRevenue}</div>
            <div className="text-sm text-gray-500">Monthly Revenue (₹)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.pageViews}</div>
            <div className="text-sm text-gray-500">Page Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₹{(stats.adRevenue / stats.pageViews * 1000).toFixed(2)}</div>
            <div className="text-sm text-gray-500">RPM (₹ per 1000 views)</div>
          </div>
        </div>
        
        {/* Ad Placement Performance */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Ad Placement Performance</h4>
          <div className="space-y-3">
            {[
              { position: 'Header Banner', ctr: '2.3%', revenue: '₹180' },
              { position: 'Sidebar Top', ctr: '1.8%', revenue: '₹150' },
              { position: 'Mid Content', ctr: '3.1%', revenue: '₹220' },
              { position: 'Sidebar Bottom', ctr: '1.5%', revenue: '₹120' },
              { position: 'Footer Banner', ctr: '1.2%', revenue: '₹90' }
            ].map((ad, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{ad.position}</span>
                <div className="flex space-x-6">
                  <span className="text-sm text-gray-500">CTR: {ad.ctr}</span>
                  <span className="text-sm font-medium text-green-600">₹{ad.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Upload Content
              </Link>
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Chapters"
            value={stats.totalChapters}
            change={12}
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>}
            color="bg-blue-100"
          />
          <StatCard
            title="Active Classes"
            value={stats.totalClasses}
            change={0}
            icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>}
            color="bg-green-100"
          />
          <StatCard
            title="Subjects Covered"
            value={stats.totalSubjects}
            change={8}
            icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>}
            color="bg-purple-100"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.adRevenue}`}
            change={15}
            icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>}
            color="bg-yellow-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickAction
            title="Upload New Chapter"
            description="Add notes and solutions for any class"
            href="/admin/upload"
            icon={<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>}
            color="border-blue-500"
          />
          <QuickAction
            title="Manage Content"
            description="Edit, update, or remove existing chapters"
            href="/admin/content"
            icon={<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>}
            color="border-green-500"
          />
          <QuickAction
            title="Ad Analytics"
            description="Track performance and optimize revenue"
            href="/admin/analytics"
            icon={<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>}
            color="border-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Ad Performance */}
          <AdPerformance />
        </div>

        {/* Content Overview */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Content Overview by Class</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[6, 7, 8].map(cls => {
                  const classChapters = Object.values(chapters).filter(c => c.class === cls);
                  const subjects = [...new Set(classChapters.map(c => c.subject))];
                  
                  return (
                    <div key={cls} className="text-center p-4 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Class {cls}</h4>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{classChapters.length}</div>
                      <div className="text-sm text-gray-500">Chapters</div>
                      <div className="mt-3">
                        <div className="text-sm text-gray-600">Subjects:</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {subjects.join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


