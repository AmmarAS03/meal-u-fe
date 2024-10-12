import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  lastWeekValue: number;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, lastWeekValue, isCurrency = false }) => {
  const percentageChange = ((value - lastWeekValue) / lastWeekValue) * 100;
  const isPositive = percentageChange > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between w-full sm:w-48">
      <div>
        <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold">
          {isCurrency ? '$' : ''}{value.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">vs Last Week</span>
        <div className={`px-2 py-1 rounded-full text-xs ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {Math.abs(percentageChange).toFixed(1)}% {isPositive ? '↗' : '↘'}
        </div>
      </div>
    </div>
  );
};

export default StatCard;