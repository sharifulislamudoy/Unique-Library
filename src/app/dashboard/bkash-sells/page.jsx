"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Calendar, Smartphone } from "lucide-react";

export default function BkashSellsPage() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchData = async () => {
    const res = await fetch("/api/dashboard/bkash-sells");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount) return;

    await fetch("/api/dashboard/bkash-sells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note }),
    });

    setAmount("");
    setNote("");
    fetchData();
  };

  const totalToday = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-sky-900">Bkash Sells</h1>
            <p className="text-sky-600">Track your mobile payment sales</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sky-700">
          <Calendar className="w-5 h-5" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl shadow-xl border border-sky-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-sky-900">Today's Summary</h3>
            <p className="text-sky-600 text-sm">Total sales for {today}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-sky-900">৳ {totalToday}</div>
            <div className="text-sky-600 text-sm">{data.length} transactions</div>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl shadow-xl border border-violet-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-violet-900 mb-6">Add New Sale</h2>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-violet-800 mb-2">
              Amount (৳)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-violet-900 placeholder-violet-400 transition-all duration-200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-violet-800 mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="Add a note"
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-violet-900 placeholder-violet-400 transition-all duration-200"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 px-5  py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          Add Sale
        </button>
      </div>



      {/* Transactions Table */}
      <div className="rounded-2xl shadow-xl border border-sky-100 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>

        {data.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="text-xl font-semibold text-violet-900 mb-2">
              No transactions yet
            </h4>
            <p className="text-violet-600">
              Add your first sale to see it listed here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-violet-50">
                <tr>
                  <th className="text-left p-4 text-violet-800 font-semibold">Amount</th>
                  <th className="text-left p-4 text-violet-800 font-semibold">Note</th>
                  <th className="text-left p-4 text-violet-800 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-violet-100 hover:bg-violet-50/50 transition-colors duration-150"
                  >
                    <td className="p-4">
                      <div className="font-bold text-violet-700">৳ {item.amount}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-violet-800">{item.note || "-"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-violet-600 text-sm">
                        {new Date(item.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}