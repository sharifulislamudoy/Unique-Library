import clientPromise from "@/lib/db";

export async function getDailySummary(date) {
  try {
    const client = await clientPromise;
    const db = client.db("uniqueDB");
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Get all collections data for the day
    const collections = ["dokanSells", "dokanKhoroch", "computerSells", "bkashSells"];
    
    const promises = collections.map(async (collection) => {
      const data = await db
        .collection(collection)
        .find({ date: targetDate })
        .toArray();
      
      const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      return {
        collection,
        data,
        total: totalAmount,
        count: data.length
      };
    });

    const results = await Promise.all(promises);
    
    // Create summary object
    const summary = {
      date: targetDate,
      dokanSells: results.find(r => r.collection === "dokanSells").total,
      dokanKhoroch: results.find(r => r.collection === "dokanKhoroch").total,
      computerSells: results.find(r => r.collection === "computerSells").total,
      bkashSells: results.find(r => r.collection === "bkashSells").total,
      details: results.map(r => ({
        category: r.collection,
        total: r.total,
        count: r.count
      }))
    };

    return summary;
  } catch (error) {
    console.error("Error in getDailySummary:", error);
    throw error;
  }
}

export async function getDateRangeSummary(startDate, endDate) {
  try {
    const client = await clientPromise;
    const db = client.db("uniqueDB");
    
    const collections = ["dokanSells", "dokanKhoroch", "computerSells", "bkashSells"];
    
    const dailySummaries = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      
      const promises = collections.map(async (collection) => {
        const data = await db
          .collection(collection)
          .find({ date: dateStr })
          .toArray();
        
        return data.reduce((sum, item) => sum + (item.amount || 0), 0);
      });

      const [dokanSells, dokanKhoroch, computerSells, bkashSells] = await Promise.all(promises);
      
      dailySummaries.push({
        date: dateStr,
        dokanSells,
        dokanKhoroch,
        computerSells,
        bkashSells,
        totalSell: dokanSells + computerSells + bkashSells,
        totalKhoroch: dokanKhoroch
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailySummaries;
  } catch (error) {
    console.error("Error in getDateRangeSummary:", error);
    throw error;
  }
}

export async function getMonthlySummary(year, month) {
  try {
    const client = await clientPromise;
    const db = client.db("uniqueDB");
    
    const collections = ["dokanSells", "dokanKhoroch", "computerSells", "bkashSells"];
    
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    
    const promises = collections.map(async (collection) => {
      const data = await db
        .collection(collection)
        .find({
          date: {
            $gte: startDate,
            $lte: endDate
          }
        })
        .toArray();
      
      const dailyData = {};
      data.forEach(item => {
        if (!dailyData[item.date]) {
          dailyData[item.date] = 0;
        }
        dailyData[item.date] += item.amount || 0;
      });

      const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      return {
        collection,
        data,
        dailyData,
        total,
        count: data.length
      };
    });

    const results = await Promise.all(promises);
    
    const monthlySummary = {
      year,
      month,
      dokanSells: results.find(r => r.collection === "dokanSells").total,
      dokanKhoroch: results.find(r => r.collection === "dokanKhoroch").total,
      computerSells: results.find(r => r.collection === "computerSells").total,
      bkashSells: results.find(r => r.collection === "bkashSells").total,
      dailyBreakdown: results
    };

    return monthlySummary;
  } catch (error) {
    console.error("Error in getMonthlySummary:", error);
    throw error;
  }
}

export async function getYearlySummary(year) {
  try {
    const client = await clientPromise;
    const db = client.db("uniqueDB");
    
    const collections = ["dokanSells", "dokanKhoroch", "computerSells", "bkashSells"];
    const monthlyData = {};

    // Initialize all months
    for (let month = 1; month <= 12; month++) {
      monthlyData[month] = {
        dokanSells: 0,
        dokanKhoroch: 0,
        computerSells: 0,
        bkashSells: 0
      };
    }

    const promises = collections.map(async (collection) => {
      const data = await db
        .collection(collection)
        .find({
          date: {
            $gte: `${year}-01-01`,
            $lte: `${year}-12-31`
          }
        })
        .toArray();

      // Group by month
      data.forEach(item => {
        const month = parseInt(item.date.split('-')[1]);
        monthlyData[month][collection] += item.amount || 0;
      });

      const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      return {
        collection,
        total,
        count: data.length
      };
    });

    const results = await Promise.all(promises);
    
    const monthlyArray = Object.keys(monthlyData).map(month => ({
      month: parseInt(month),
      name: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' }),
      ...monthlyData[month],
      totalSell: monthlyData[month].dokanSells + monthlyData[month].computerSells + monthlyData[month].bkashSells,
      totalKhoroch: monthlyData[month].dokanKhoroch
    }));

    return {
      year,
      dokanSells: results.find(r => r.collection === "dokanSells").total,
      dokanKhoroch: results.find(r => r.collection === "dokanKhoroch").total,
      computerSells: results.find(r => r.collection === "computerSells").total,
      bkashSells: results.find(r => r.collection === "bkashSells").total,
      monthlyData: monthlyArray,
      totalSell: results.find(r => r.collection === "dokanSells").total + 
                 results.find(r => r.collection === "computerSells").total + 
                 results.find(r => r.collection === "bkashSells").total,
      totalKhoroch: results.find(r => r.collection === "dokanKhoroch").total
    };
  } catch (error) {
    console.error("Error in getYearlySummary:", error);
    throw error;
  }
}