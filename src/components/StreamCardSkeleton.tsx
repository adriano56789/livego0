import React from 'react';

const StreamCardSkeleton: React.FC = () => {
  return (
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#2a2a2a] animate-pulse">
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default StreamCardSkeleton;