/** @format */

import React, { useState, useEffect, useContext } from 'react';
import AddSale from '../components/AddSale';
import AuthContext from '../AuthContext';
import { toast } from 'react-toastify';

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    // Show loading toast for first load
    const loadingToastId = !sales.length
      ? toast.loading('Loading sales data...')
      : null;

    fetch(
      `http://localhost:4000/api/sales/get/${
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
        setAllSalesData(data);
        if (loadingToastId) toast.dismiss(loadingToastId);
      })
      .catch((err) => {
        console.error('Error fetching sales data:', err);
        if (loadingToastId) toast.dismiss(loadingToastId);
        toast.error(
          err.message || 'Failed to load sales data. Please try again.'
        );
      });
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(
      `http://localhost:4000/api/product/get/${
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
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        // Don't show toast for this as it's not the primary data for this page
      });
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    fetch(
      `http://localhost:4000/api/store/get/${
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
        // Don't show toast for this as it's not the primary data for this page
      });
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}>
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.ProductID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StoreID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.SaleDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.TotalSaleAmount}
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

export default Sales;
