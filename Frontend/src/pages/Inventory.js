/** @format */

import React, { useState, useEffect, useContext, useMemo } from 'react';
import AddProduct from '../components/AddProduct';
import UpdateProduct from '../components/UpdateProduct';
import EditStock from '../components/EditStock';
import AuthContext from '../AuthContext';
import { toast } from 'react-toastify';

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [salesData, setSalesData] = useState([]);

  const authContext = useContext(AuthContext);
  console.log('====================================');
  console.log(authContext);
  console.log('====================================');

  useEffect(() => {
    fetchProductsData();
    fetchStoresData();
    fetchSalesData();
    fetchTotalSalesAmount();
  }, [updatePage]);

  // Fetching Data of All Products
  const fetchProductsData = () => {
    // Show loading toast for first load
    const loadingToastId = !products.length
      ? toast.loading('Loading products...')
      : null;

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/product/get/${
        authContext.user || 'guest-user-id'
      }`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Failed to fetch products');
          });
        }
        return response.json();
      })
      .then((data) => {
        setAllProducts(data);
        if (loadingToastId) toast.dismiss(loadingToastId);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        if (loadingToastId) toast.dismiss(loadingToastId);
        toast.error(
          err.message || 'Failed to load products. Please try again.'
        );
      });
  };

  // Fetching Data of Search Products
  const fetchSearchData = () => {
    if (!searchTerm) {
      toast.warning('Please enter a search term');
      return;
    }

    const loadingToastId = toast.loading('Searching products...');

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/product/search?searchTerm=${searchTerm}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Failed to search products');
          });
        }
        return response.json();
      })
      .then((data) => {
        setAllProducts(data);
        toast.dismiss(loadingToastId);
        if (data.length === 0) {
          toast.info('No products found matching your search');
        }
      })
      .catch((err) => {
        console.error('Error searching products:', err);
        toast.dismiss(loadingToastId);
        toast.error(
          err.message || 'Failed to search products. Please try again.'
        );
      });
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/store/get/${
        authContext.user || 'guest-user-id'
      }`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Failed to fetch stores');
          });
        }
        return response.json();
      })
      .then((data) => {
        setAllStores(data);
      })
      .catch((err) => {
        console.error('Error fetching stores:', err);
        // Don't show toast for this as it's not critical for the inventory page
      });
  };

  // Fetching sales data
  const fetchSalesData = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/sales/get/${
        authContext.user || 'guest-user-id'
      }`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Failed to fetch sales data');
          });
        }
        return response.json();
      })
      .then((data) => {
        setSalesData(data);
      })
      .catch((err) => {
        console.error('Error fetching sales data:', err);
      });
  };

  // Fetching total sales amount
  const fetchTotalSalesAmount = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/sales/get/${
        authContext.user || 'guest-user-id'
      }/totalsaleamount`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Failed to fetch total sales amount');
          });
        }
        return response.json();
      })
      .then((data) => {
        setTotalSalesAmount(data.totalSaleAmount || 0);
      })
      .catch((err) => {
        console.error('Error fetching total sales amount:', err);
      });
  };

  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    console.log('Clicked: edit');
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Modal for Edit Stock
  const editStockModalSetting = (product) => {
    console.log('Clicked: edit stock');
    setSelectedProduct(product);
    setShowEditStockModal(!showEditStockModal);
  };

  // Delete item
  const deleteItem = (id) => {
    console.log('Product ID: ', id);
    console.log(`${process.env.REACT_APP_BACKEND_URL}api/product/delete/${id}`);
    fetch(`${process.env.REACT_APP_BACKEND_URL}api/product/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  // Calculate top selling products
  const topSellingInfo = useMemo(() => {
    // Group sales by product ID and calculate total quantity sold
    const productSales = {};
    let totalSoldAmount = 0;

    salesData.forEach((sale) => {
      if (sale.ProductID && sale.ProductID._id) {
        const productId = sale.ProductID._id;
        if (!productSales[productId]) {
          productSales[productId] = {
            quantity: 0,
            amount: 0,
            name: sale.ProductID.name,
          };
        }
        productSales[productId].quantity += sale.StockSold;
        productSales[productId].amount += sale.TotalSaleAmount;
        totalSoldAmount += sale.TotalSaleAmount;
      }
    });

    // Convert to array and sort by quantity sold
    const sortedProducts = Object.values(productSales).sort(
      (a, b) => b.quantity - a.quantity
    );

    return {
      count: sortedProducts.length,
      totalAmount: totalSoldAmount,
    };
  }, [salesData]);

  // Calculate low stock products
  const lowStockInfo = useMemo(() => {
    const lowStockThreshold = 10; // Define what counts as "low stock"
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= lowStockThreshold
    ).length;

    return {
      lowStock,
      outOfStock,
    };
  }, [products]);

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className=" flex flex-col md:flex-row justify-center items-center  ">
            <div className="flex flex-col p-10  w-full  md:w-3/12  ">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {products.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span>
            </div>
            <div className="flex flex-col gap-3 p-10   w-full  md:w-3/12 sm:border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">
                Stores
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {stores.length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Last 7 days
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    ₹{totalSalesAmount.toLocaleString()}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Revenue
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">
                Top Selling
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {topSellingInfo.count}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Products Sold
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    ₹{topSellingInfo.totalAmount.toLocaleString()}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Revenue
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Low Stocks
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {lowStockInfo.lowStock}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Low Stock
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {lowStockInfo.outOfStock}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">
                    Not in Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}
        {showEditStockModal && selectedProduct && (
          <EditStock
            product={selectedProduct}
            onClose={() => setShowEditStockModal(false)}
            onStockUpdated={handlePageUpdate}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require('../assets/search-icon.png')}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProductModalSetting}>
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Products
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Manufacturer
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Price
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Description
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Availibility
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.price ? `₹${element.price}` : '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock > 0 ? 'In Stock' : 'Not in Stock'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateProductModalSetting(element)}>
                        Edit{' '}
                      </span>
                      <span
                        className="text-blue-600 px-2 cursor-pointer"
                        onClick={() => editStockModalSetting(element)}>
                        Edit Stock{' '}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element._id)}>
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
