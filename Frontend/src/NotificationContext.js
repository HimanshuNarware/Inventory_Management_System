/** @format */

import React, { createContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);

      // Count unread notifications
      const unread = parsedNotifications.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(unread);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Update unread count
    const unread = notifications.filter(
      (notification) => !notification.read
    ).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Add a new notification
  const addNotification = (
    message,
    type = 'info',
    category = 'general',
    details = null
  ) => {
    const newNotification = {
      id: Date.now(),
      message,
      type, // 'info', 'success', 'warning', 'error'
      category, // 'general', 'product', 'store', 'sales', 'purchase', 'stock', 'profile'
      details, // Optional additional data related to the notification
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prevNotifications) => {
      // Limit to 50 notifications to prevent localStorage from getting too large
      if (prevNotifications.length >= 50) {
        const trimmedNotifications = prevNotifications.slice(0, 49);
        return [newNotification, ...trimmedNotifications];
      }
      return [newNotification, ...prevNotifications];
    });
  };

  // Add system notification for low stock
  const addLowStockNotification = (productName, currentStock) => {
    addNotification(
      `Low stock alert: ${productName} (${currentStock} remaining)`,
      'warning',
      'stock',
      { productName, currentStock }
    );
  };

  // Add system notification for new product
  const addNewProductNotification = (productName) => {
    addNotification(`New product added: ${productName}`, 'success', 'product', {
      productName,
    });
  };

  // Add system notification for product update
  const addProductUpdateNotification = (productName) => {
    addNotification(`Product updated: ${productName}`, 'info', 'product', {
      productName,
    });
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Add system notification for store operations
  const addStoreNotification = (storeName, action) => {
    addNotification(
      `Store ${action}: ${storeName}`,
      action === 'added' ? 'success' : 'info',
      'store',
      { storeName, action }
    );
  };

  // Add system notification for sales
  const addSaleNotification = (productName, quantity, amount) => {
    addNotification(
      `New sale: ${quantity} x ${productName} for $${amount}`,
      'success',
      'sales',
      { productName, quantity, amount }
    );
  };

  // Add system notification for purchases
  const addPurchaseNotification = (productName, quantity, amount) => {
    addNotification(
      `New purchase: ${quantity} x ${productName} for $${amount}`,
      'info',
      'purchase',
      { productName, quantity, amount }
    );
  };

  // Add system notification for profile updates
  const addProfileNotification = (action) => {
    addNotification(`Profile ${action} successfully`, 'success', 'profile', {
      action,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        // System notification helpers
        addLowStockNotification,
        addNewProductNotification,
        addProductUpdateNotification,
        addStoreNotification,
        addSaleNotification,
        addPurchaseNotification,
        addProfileNotification,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
