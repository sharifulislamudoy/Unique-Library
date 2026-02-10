export default function StatsCard({ title, value, change, changeValue, color, icon }) {
  const colorClasses = {
    green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
    red: 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 text-rose-700',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
    rose: 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 text-rose-700'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-6 transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {change && (
        <div className="text-sm opacity-75">
          <span className={changeValue.includes('লাভ') ? 'text-emerald-600' : 'text-rose-600'}>
            {change}{changeValue}
          </span>
        </div>
      )}
    </div>
  );
}