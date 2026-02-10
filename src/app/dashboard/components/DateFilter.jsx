import { useState } from 'react';

export default function DateFilter({ dateRange, setDateRange, setTimeRange }) {
  const handleDateChange = (type, value) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    setTimeRange('custom');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        তারিখ নির্বাচন করুন
      </label>
      <div className="flex space-x-4">
        <div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}