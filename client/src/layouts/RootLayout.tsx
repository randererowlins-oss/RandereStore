import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { BagDrawer } from '../components/BagDrawer.js';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#F4F4F2]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <BagDrawer />
      <Footer />
    </div>
  );
};
