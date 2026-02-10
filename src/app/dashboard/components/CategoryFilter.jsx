export default function CategoryFilter({ categories, selectedCategories, setSelectedCategories }) {
  const toggleCategory = (key) => {
    if (selectedCategories.includes(key)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== key));
    } else {
      setSelectedCategories([...selectedCategories, key]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ক্যাটাগরি নির্বাচন করুন
      </label>
      <div className="flex gap-7">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => toggleCategory(cat.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategories.includes(cat.key)
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              borderLeft: `4px solid ${cat.color}`
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}