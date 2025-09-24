import React from 'react';

const TicketDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div>
            <div className="w-48 h-8 bg-gray-300 rounded mb-2"></div>
            <div className="w-72 h-5 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-32 h-10 bg-gray-300 rounded-lg"></div>
          <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-32 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>

            {/* Attachments Skeleton */}
            <div className="mt-6">
              <div className="w-24 h-4 bg-gray-300 rounded mb-3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div>
                      <div className="w-24 h-3 bg-gray-300 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Card Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="w-32 h-6 bg-gray-300 rounded"></div>
            </div>

            {/* Messages Skeleton */}
            <div className="divide-y divide-gray-200">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-20 h-4 bg-gray-300 rounded"></div>
                        <div className="w-12 h-5 bg-gray-300 rounded-full"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-gray-300 rounded"></div>
                        <div className="w-4/5 h-4 bg-gray-300 rounded"></div>
                        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form Skeleton */}
            <div className="p-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="w-full h-24 bg-gray-300 rounded-md"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-16 h-10 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Ticket Actions Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-32 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
            </div>
          </div>

          {/* Ticket Information Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-40 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index}>
                  <div className="w-20 h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-44 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index}>
                  <div className="w-16 h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="w-40 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Satisfaction Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-36 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div>
                <div className="w-12 h-3 bg-gray-300 rounded mb-2"></div>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                  ))}
                  <div className="w-8 h-3 bg-gray-300 rounded ml-2"></div>
                </div>
              </div>
              <div>
                <div className="w-16 h-3 bg-gray-300 rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-300 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailSkeleton;
