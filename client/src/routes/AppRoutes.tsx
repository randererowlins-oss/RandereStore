import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout.js';
import { AdminLayout } from '../layouts/AdminLayout.js';

// Public Pages
import { HomePage } from '../pages/HomePage.js';
import { ShopPage } from '../pages/ShopPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage.js';
import { CustomPage } from '../pages/CustomPage.js';
import { StylePage } from '../pages/StylePage.js';
import { StoriesPage } from '../pages/StoriesPage.js';
import { StoryDetailPage } from '../pages/StoryDetailPage.js';
import { TransformationsPage } from '../pages/TransformationsPage.js';
import { AboutPage } from '../pages/AboutPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';

// Admin Pages
import { AdminDashboardPage } from '../pages/AdminDashboardPage.js';
import { AdminProductsPage } from '../pages/AdminProductsPage.js';
import { AdminOrdersPage } from '../pages/AdminOrdersPage.js';
import { AdminRequestsPage } from '../pages/AdminRequestsPage.js';
import { AdminStoriesPage } from '../pages/AdminStoriesPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Storefront Layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="/style" element={<StylePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />
        <Route path="/transformations" element={<TransformationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="custom-requests" element={<AdminRequestsPage />} />
        <Route path="styling-requests" element={<AdminRequestsPage />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="transformations" element={<TransformationsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
