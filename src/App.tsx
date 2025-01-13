import React, { useState } from 'react';
import MachineList from './components/MachineList';
import SupplierList from './components/SupplierList';
import PurchaseList from './components/PurchaseList';
import LocationList from './components/LocationList';
import FinancialDashboard from './components/FinancialDashboard';
import MaintenanceChecklistComponent from './components/MaintenanceChecklist';
import InventoryList from './components/InventoryList';
import ReportsDashboard from './components/ReportsDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PriceHistoryList from './components/PriceHistoryList';
import InvoiceList from './components/InvoiceList';
import WarrantyList from './components/WarrantyList';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [activeTab, setActiveTab] = useState<'machines' | 'suppliers' | 'purchases' | 'locations' | 'financials' | 'inventory' | 'checklists' | 'reports' | 'analytics' | 'prices' | 'invoices' | 'warranties'>('machines');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex-1 overflow-x-auto hide-scrollbar">
                <div className="flex space-x-8 px-4">
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'machines'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('machines')}
                  >
                    Machines
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'suppliers'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('suppliers')}
                  >
                    Suppliers
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'purchases'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('purchases')}
                  >
                    Purchases
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'locations'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('locations')}
                  >
                    Locations
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'inventory'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('inventory')}
                  >
                    Inventory
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'checklists'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('checklists')}
                  >
                    Checklists
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'warranties'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('warranties')}
                  >
                    Warranties
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'invoices'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('invoices')}
                  >
                    Invoices
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'prices'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('prices')}
                  >
                    Price History
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'financials'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('financials')}
                  >
                    Financials
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'reports'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('reports')}
                  >
                    Reports
                  </button>
                  <button
                    className={`whitespace-nowrap py-2 px-1 border-b-2 ${
                      activeTab === 'analytics'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    Analytics
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <main className="p-4 sm:p-6">
          {activeTab === 'machines' && <MachineList />}
          {activeTab === 'suppliers' && <SupplierList />}
          {activeTab === 'purchases' && <PurchaseList machines={[]} suppliers={[]} />}
          {activeTab === 'locations' && <LocationList />}
          {activeTab === 'inventory' && <InventoryList />}
          {activeTab === 'checklists' && <MaintenanceChecklistComponent />}
          {activeTab === 'warranties' && <WarrantyList />}
          {activeTab === 'invoices' && <InvoiceList />}
          {activeTab === 'prices' && <PriceHistoryList />}
          {activeTab === 'financials' && <FinancialDashboard />}
          {activeTab === 'reports' && <ReportsDashboard />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;