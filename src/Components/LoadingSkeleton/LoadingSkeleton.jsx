import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Skeleton */}
      <div className="h-64 w-full bg-gray-200 rounded-xl mb-8 animate-pulse"></div>

      {/* Main Content Skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Tour Content Skeleton */}
        <div className="md:col-span-2 space-y-8">
          {/* Image Gallery Skeleton */}
          <div className="h-96 w-full bg-gray-200 rounded-xl animate-pulse"></div>

          {/* Highlights Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${100 - i * 10}%` }}></div>
              ))}
            </div>
          </div>

          {/* Accordion Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Booking & Contact Skeleton */}
        <div className="space-y-6">
          {/* Booking Card Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-6 space-y-4">
            <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Map Skeleton */}
          <div className="bg-white p-4 rounded-xl shadow-lg space-y-3">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Contact Form Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
            <div>
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-24 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="pt-6 border-t border-gray-200 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;