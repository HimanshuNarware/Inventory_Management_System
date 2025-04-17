/** @format */

import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import AuthContext from '../AuthContext';
import NotificationContext from '../NotificationContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StoresList from '../components/StoresList';

ChartJS.register(ArcElement, Tooltip, Legend);
// Chart colors
const backgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(201, 203, 207, 0.2)',
  'rgba(255, 159, 243, 0.2)',
  'rgba(99, 255, 132, 0.2)',
];

const borderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(201, 203, 207, 1)',
  'rgba(255, 159, 243, 1)',
  'rgba(99, 255, 132, 1)',
];

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add state for growth percentages
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [purchaseGrowth, setPurchaseGrowth] = useState(0);
  const [productGrowth, setProductGrowth] = useState(0);
  const [storeGrowth, setStoreGrowth] = useState(0);

  // Add state for previous values to calculate growth
  const [prevSaleAmount, setPrevSaleAmount] = useState(0);
  const [prevPurchaseAmount, setPrevPurchaseAmount] = useState(0);
  const [prevProductCount, setPrevProductCount] = useState(0);
  const [prevStoreCount, setPrevStoreCount] = useState(0);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: 'sales-bar',
        toolbar: {
          show: true,
        },
      },
      title: {
        text: 'Monthly Sales',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      colors: ['#4f46e5'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
    },
    series: [
      {
        name: 'Monthly Sales',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Default empty data
      },
    ],
  });

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: 'Monthly Sales Amount',
          data: [...salesData],
        },
      ],
    });
  };

  const authContext = useContext(AuthContext);
  const notificationContext = useContext(NotificationContext);

  // Prepare pie chart data based on products
  const preparePieChartData = () => {
    if (products.length === 0) return null;

    // Group products by category
    const categories = {};
    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    // Limit to 9 categories max (for colors)
    const maxCategories = 9;
    if (labels.length > maxCategories) {
      const otherCount = data
        .slice(maxCategories - 1)
        .reduce((sum, val) => sum + val, 0);
      const limitedLabels = labels.slice(0, maxCategories - 1);
      limitedLabels.push('Other');
      const limitedData = data.slice(0, maxCategories - 1);
      limitedData.push(otherCount);

      return {
        labels: limitedLabels,
        datasets: [
          {
            label: 'Products by Category',
            data: limitedData,
            backgroundColor: backgroundColors.slice(0, maxCategories),
            borderColor: borderColors.slice(0, maxCategories),
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: 'Products by Category',
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTotalSaleAmount(),
          fetchTotalPurchaseAmount(),
          fetchStoresData(),
          fetchProductsData(),
          fetchMonthlySalesData(),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        authContext.notify('Failed to load dashboard data', 'error');
        setIsLoading(false);
      }
    };

    loadData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchTotalSaleAmount();
      fetchTotalPurchaseAmount();
      fetchStoresData();
      fetchProductsData();
      fetchMonthlySalesData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetching total sales amount
  const fetchTotalSaleAmount = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/sales/get/${authContext.user}/totalsaleamount`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch sales amount');
          }
          return response.json();
        })
        .then((datas) => {
          // Save previous value for growth calculation
          setPrevSaleAmount(saleAmount);

          // Set new value
          const newAmount = datas.totalSaleAmount || 0;
          setSaleAmount(newAmount);

          // Calculate growth percentage
          if (prevSaleAmount > 0) {
            const growth =
              ((newAmount - prevSaleAmount) / prevSaleAmount) * 100;
            setSalesGrowth(parseFloat(growth.toFixed(2)));
          } else {
            setSalesGrowth(100); // First time data, assume 100% growth
          }

          resolve(datas);
        })
        .catch((err) => {
          console.error('Error fetching sales amount:', err);
          reject(err);
        });
    });
  };

  // Fetching total purchase amount
  const fetchTotalPurchaseAmount = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/purchase/get/${authContext.user}/totalpurchaseamount`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch purchase amount');
          }
          return response.json();
        })
        .then((datas) => {
          // Save previous value for growth calculation
          setPrevPurchaseAmount(purchaseAmount);

          // Set new value
          const newAmount = datas.totalPurchaseAmount || 0;
          setPurchaseAmount(newAmount);

          // Calculate growth percentage
          if (prevPurchaseAmount > 0) {
            const growth =
              ((newAmount - prevPurchaseAmount) / prevPurchaseAmount) * 100;
            setPurchaseGrowth(parseFloat(growth.toFixed(2)));
          } else {
            setPurchaseGrowth(100); // First time data, assume 100% growth
          }

          resolve(datas);
        })
        .catch((err) => {
          console.error('Error fetching purchase amount:', err);
          reject(err);
        });
    });
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/store/get/${authContext.user}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch stores data');
          }
          return response.json();
        })
        .then((datas) => {
          // Save previous count for growth calculation
          setPrevStoreCount(stores.length);

          // Set new stores data
          setStores(datas || []);

          // Calculate growth percentage
          if (prevStoreCount > 0) {
            const growth =
              ((datas.length - prevStoreCount) / prevStoreCount) * 100;
            setStoreGrowth(parseFloat(growth.toFixed(2)));
          } else if (datas.length > 0) {
            setStoreGrowth(100); // First time data, assume 100% growth
          }

          // If new stores were added, show notification
          if (datas.length > prevStoreCount && prevStoreCount > 0) {
            const newCount = datas.length - prevStoreCount;
            notificationContext.addNotification(
              `${newCount} new store${newCount > 1 ? 's' : ''} added`,
              'success'
            );
          }

          resolve(datas);
        })
        .catch((err) => {
          console.error('Error fetching stores data:', err);
          reject(err);
        });
    });
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    return new Promise((resolve, reject) => {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/product/get/${authContext.user}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch products data');
          }
          return response.json();
        })
        .then((datas) => {
          // Save previous count for growth calculation
          setPrevProductCount(products.length);

          // Set new products data
          setProducts(datas || []);
          setChartData(preparePieChartData());

          // Calculate growth percentage
          if (prevProductCount > 0) {
            const growth =
              ((datas.length - prevProductCount) / prevProductCount) * 100;
            setProductGrowth(parseFloat(growth.toFixed(2)));
          } else if (datas.length > 0) {
            setProductGrowth(100); // First time data, assume 100% growth
          }

          // If new products were added, show notification
          if (datas.length > prevProductCount && prevProductCount > 0) {
            const newCount = datas.length - prevProductCount;
            notificationContext.addNotification(
              `${newCount} new product${newCount > 1 ? 's' : ''} added`,
              'success'
            );
          }

          resolve(datas);
        })
        .catch((err) => {
          console.error('Error fetching products data:', err);
          reject(err);
        });
    });
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}api/sales/getmonthly`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch monthly sales data');
          }
          return response.json();
        })
        .then((datas) => {
          updateChartData(datas.salesAmount);
          resolve(datas);
        })
        .catch((err) => {
          console.error('Error fetching monthly sales data:', err);
          reject(err);
        });
    });
  };

  // Prepare chart data when products change
  useEffect(() => {
    if (products.length > 0) {
      setChartData(preparePieChartData());
    } else {
      // Set default chart data if no products
      setChartData({
        labels: ['No Data'],
        datasets: [
          {
            label: 'No Products',
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.2)'],
            borderColor: ['rgba(200, 200, 200, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="col-span-12 lg:col-span-10 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <strong className="block text-sm font-medium text-gray-500">
                Sales
              </strong>
              <p className="mt-1">
                <span className="text-2xl font-medium text-gray-900">
                  ₹{saleAmount.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="w-16 h-16">
              <CircularProgressbar
                value={Math.abs(salesGrowth)}
                maxValue={100}
                text={`${salesGrowth > 0 ? '+' : ''}${salesGrowth}%`}
                styles={buildStyles({
                  textSize: '25px',
                  pathColor: salesGrowth >= 0 ? '#10b981' : '#ef4444',
                  textColor: salesGrowth >= 0 ? '#10b981' : '#ef4444',
                  trailColor: '#f3f4f6',
                })}
              />
            </div>
          </div>

          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {salesGrowth >= 0 ? 'Increased' : 'Decreased'} by{' '}
              {Math.abs(salesGrowth)}% from previous period
            </span>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <strong className="block text-sm font-medium text-gray-500">
                Purchase
              </strong>
              <p className="mt-1">
                <span className="text-2xl font-medium text-gray-900">
                  ₹{purchaseAmount.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="w-16 h-16">
              <CircularProgressbar
                value={Math.abs(purchaseGrowth)}
                maxValue={100}
                text={`${purchaseGrowth > 0 ? '+' : ''}${purchaseGrowth}%`}
                styles={buildStyles({
                  textSize: '25px',
                  pathColor: purchaseGrowth >= 0 ? '#10b981' : '#ef4444',
                  textColor: purchaseGrowth >= 0 ? '#10b981' : '#ef4444',
                  trailColor: '#f3f4f6',
                })}
              />
            </div>
          </div>

          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {purchaseGrowth >= 0 ? 'Increased' : 'Decreased'} by{' '}
              {Math.abs(purchaseGrowth)}% from previous period
            </span>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <strong className="block text-sm font-medium text-gray-500">
                Total Products
              </strong>
              <p className="mt-1">
                <span className="text-2xl font-medium text-gray-900">
                  {products.length}
                </span>
              </p>
            </div>

            <div className="w-16 h-16">
              <CircularProgressbar
                value={Math.abs(productGrowth)}
                maxValue={100}
                text={`${productGrowth > 0 ? '+' : ''}${productGrowth}%`}
                styles={buildStyles({
                  textSize: '25px',
                  pathColor: productGrowth >= 0 ? '#10b981' : '#ef4444',
                  textColor: productGrowth >= 0 ? '#10b981' : '#ef4444',
                  trailColor: '#f3f4f6',
                })}
              />
            </div>
          </div>

          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {products.length} products in inventory
            </span>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <strong className="block text-sm font-medium text-gray-500">
                Total Stores
              </strong>
              <p className="mt-1">
                <span className="text-2xl font-medium text-gray-900">
                  {stores.length}
                </span>
              </p>
            </div>

            <div className="w-16 h-16">
              <CircularProgressbar
                value={Math.abs(storeGrowth)}
                maxValue={100}
                text={`${storeGrowth > 0 ? '+' : ''}${storeGrowth}%`}
                styles={buildStyles({
                  textSize: '25px',
                  pathColor: storeGrowth >= 0 ? '#10b981' : '#ef4444',
                  textColor: storeGrowth >= 0 ? '#10b981' : '#ef4444',
                  trailColor: '#f3f4f6',
                })}
              />
            </div>
          </div>

          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {stores.length} active stores
            </span>
          </div>
        </article>

        {/* Stores List Section */}
        <div className="bg-white rounded-lg py-6 px-4 col-span-full">
          <StoresList stores={stores} />
        </div>

        {/* Charts Section - Made responsive */}
        <div className="bg-white rounded-lg py-6 px-4 col-span-full mt-6">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full overflow-x-auto">
            <div className="min-w-[300px] w-full lg:w-1/2">
              <Chart
                options={chart.options}
                series={chart.series}
                type="bar"
                width="100%"
                height="350"
              />
            </div>
            <div className="min-w-[250px] w-full lg:w-1/3 max-w-[400px]">
              {chartData ? (
                <div>
                  <h3 className="text-center font-medium mb-2">
                    Products by Category
                  </h3>
                  <Doughnut
                    data={chartData}
                    options={{
                      maintainAspectRatio: true,
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: {
                              size: 11,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No product data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
