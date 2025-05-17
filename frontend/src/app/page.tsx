'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Store Customer Traffic Dashboard</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Welcome to the Store Dashboard</h2>
          <p className="mb-4">
            This dashboard provides real-time and historical data about customer traffic in your stores.
          </p>
          
          <div className="mt-6">
            <Link 
              href="/dashboard" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Live Traffic Table</h2>
            <p>
              View real-time updates of customers entering and exiting the store.
              Data is updated instantly as customers move in and out.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Historical Traffic Data</h2>
            <p>
              Analyze customer traffic patterns over the last 24 hours.
              Data is aggregated hourly to help identify peak times and trends.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
