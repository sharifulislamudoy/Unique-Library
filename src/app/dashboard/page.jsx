'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Dashboard Components
import StatsCard from './components/StatsCard';
import DateFilter from './components/DateFilter';
import CategoryFilter from './components/CategoryFilter';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedCategories, setSelectedCategories] = useState(['dokanSells', 'dokanKhoroch', 'computerSells', 'bkashSells']);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const categories = [
    { key: 'dokanSells', name: 'দোকান বিক্রয়', color: '#8884d8' },
    { key: 'dokanKhoroch', name: 'দোকান খরচ', color: '#82ca9d' },
    { key: 'computerSells', name: 'কম্পিউটার বিক্রয়', color: '#ffc658' },
    { key: 'bkashSells', name: 'বিকাশ বিক্রয়', color: '#ff8042' }
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, timeRange, selectedMonth, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch daily data
      const dailyRes = await fetch(`/api/dashboard/daily?date=${format(new Date(), 'yyyy-MM-dd')}`);
      const daily = await dailyRes.json();

      // Fetch monthly data
      const [year, month] = selectedMonth.split('-');
      const monthlyRes = await fetch(`/api/dashboard/monthly?year=${year}&month=${month}`);
      const monthly = await monthlyRes.json();

      // Fetch yearly data
      const yearlyRes = await fetch(`/api/dashboard/yearly?year=${new Date().getFullYear()}`);
      const yearly = await yearlyRes.json();

      // Fetch date range data
      const rangeRes = await fetch(`/api/dashboard/range?start=${dateRange.start}&end=${dateRange.end}`);
      const rangeData = await rangeRes.json();

      setDailyData(daily);
      setMonthlyData(monthly);
      setYearlyData(yearly);

      // Prepare chart data
      if (timeRange === 'weekly' || timeRange === 'custom') {
        setDailyData(rangeData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (range === 'today') {
      setDateRange({
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      });
    } else if (range === 'weekly') {
      setDateRange({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
      });
    } else if (range === 'monthly') {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      setDateRange({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">লোড হচ্ছে...</div>
      </div>
    );
  }

  // Prepare data for charts
  const prepareBarChartData = () => {
    if (timeRange === 'today' && dailyData.details) {
      return dailyData.details.filter(d => selectedCategories.includes(d.category));
    }

    if (Array.isArray(dailyData) && dailyData.length > 0) {
      return dailyData.map(day => ({
        date: day.date,
        ...categories.reduce((acc, cat) => {
          acc[cat.name] = day[cat.key] || 0;
          return acc;
        }, {})
      }));
    }

    return [];
  };

  const prepareLineChartData = () => {
    if (Array.isArray(dailyData) && dailyData.length > 0) {
      return dailyData.map(day => ({
        date: day.date,
        মোট_বিক্রয়: (day.dokanSells || 0) + (day.computerSells || 0) + (day.bkashSells || 0),
        মোট_খরচ: day.dokanKhoroch || 0
      }));
    }
    return [];
  };

  const preparePieChartData = () => {
    if (dailyData.details) {
      return categories
        .filter(cat => selectedCategories.includes(cat.key))
        .map(cat => ({
          name: cat.name,
          value: dailyData[cat.key] || 0,
          color: cat.color
        }));
    }
    return [];
  };

  const barChartData = prepareBarChartData();
  const lineChartData = prepareLineChartData();
  const pieChartData = preparePieChartData();

  // Calculate totals
  const totalSell = (dailyData.dokanSells || 0) + (dailyData.computerSells || 0) + (dailyData.bkashSells || 0);
  const totalKhoroch = dailyData.dokanKhoroch || 0;
  const netProfit = totalSell - totalKhoroch;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                স্বাগতম, {session?.user?.name}
              </h1>
              <p className="text-gray-600">
                আপনার ব্যবসার সম্পূর্ণ বিশ্লেষণ ও রিপোর্ট
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-500 mb-2">
                {format(new Date(), 'dd MMMM yyyy, EEEE')}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="মোট বিক্রয়"
              value={`৳${totalSell.toLocaleString()}`}
              change={netProfit > 0 ? "+" : ""}
              changeValue={`${netProfit.toLocaleString()}`}
              color="green"
              icon="💰"
            />
            <StatsCard
              title="মোট খরচ"
              value={`৳${totalKhoroch.toLocaleString()}`}
              change="-"
              changeValue={`${totalKhoroch.toLocaleString()}`}
              color="red"
              icon="📉"
            />
            <StatsCard
              title="দোকান বিক্রয়"
              value={`৳${(dailyData.dokanSells || 0).toLocaleString()}`}
              color="blue"
              icon="🏪"
            />
            <StatsCard
              title="নিট লাভ"
              value={`৳${netProfit.toLocaleString()}`}
              change={netProfit > 0 ? "+" : ""}
              changeValue={`${netProfit > 0 ? 'লাভ' : 'লোকসান'}`}
              color={netProfit > 0 ? "emerald" : "rose"}
              icon={netProfit > 0 ? "📈" : "⚠️"}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                সময় পরিসীমা
              </label>
              <div className="flex space-x-2">
                {['today', 'weekly', 'monthly', 'yearly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {range === 'today' ? 'আজ' :
                      range === 'weekly' ? 'সাপ্তাহিক' :
                        range === 'monthly' ? 'মাসিক' : 'বার্ষিক'}
                  </button>
                ))}
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </div>


        {/* Detailed Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            বিস্তারিত রিপোর্ট
          </h2>
          <div className="overflow-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    তারিখ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    দোকান বিক্রয়
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    দোকান খরচ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কম্পিউটার বিক্রয়
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বিকাশ বিক্রয়
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মোট বিক্রয়
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    নিট লাভ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(Array.isArray(dailyData) ? dailyData.slice(0, 10) : [dailyData]).map((day, index) => {
                  const daySell = (day.dokanSells || 0) + (day.computerSells || 0) + (day.bkashSells || 0);
                  const net = daySell - (day.dokanKhoroch || 0);

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day.date || format(new Date(), 'yyyy-MM-dd')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        ৳{(day.dokanSells || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ৳{(day.dokanKhoroch || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                        ৳{(day.computerSells || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                        ৳{(day.bkashSells || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ৳{daySell.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${net > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {net > 0 ? '+' : ''}৳{Math.abs(net).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">


          {/* Pie Chart - Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              বিভাগ অনুযায়ী বণ্টন
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'মূল্য']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              মাসিক সারসংক্ষেপ
            </h2>
            <div className="space-y-4">
              {yearlyData.monthlyData?.slice(0, 6).map((month, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {month.name} {yearlyData.year}
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      ৳{month.totalSell.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>খরচ: ৳{month.totalKhoroch.toLocaleString()}</span>
                    <span className={`font-medium ${month.totalSell - month.totalKhoroch > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                      }`}>
                      {month.totalSell - month.totalKhoroch > 0 ? 'লাভ' : 'লোকসান'}:
                      ৳{Math.abs(month.totalSell - month.totalKhoroch).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}