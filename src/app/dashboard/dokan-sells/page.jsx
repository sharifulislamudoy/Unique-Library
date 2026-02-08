"use client";

import { useEffect, useState } from "react";

export default function DokanSellsPage() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    const res = await fetch("/api/dashboard/dokan-sells");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount) return;

    await fetch("/api/dashboard/dokan-sells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note })
    });

    setAmount("");
    setNote("");
    fetchData();
  };

  const totalToday = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dokan Sells</h1>

      {/* INPUT */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded w-1/3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Note (optional)"
            className="border p-2 rounded w-2/3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* TOTAL */}
      <div className="mb-4 font-semibold">
        Date: {today} | Total: ৳ {totalToday}
      </div>

      {/* PREVIEW TABLE */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">৳ {item.amount}</td>
              <td className="p-2">{item.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
