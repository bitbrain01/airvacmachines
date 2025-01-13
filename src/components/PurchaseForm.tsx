import React, { useState } from 'react';
import { Machine, Supplier, Purchase } from '../types';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchase: Omit<Purchase, 'id'>) => void;
  machines: Machine[];
  suppliers: Supplier[];
  editingPurchase?: Purchase;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  machines,
  suppliers,
  editingPurchase
}) => {
  const [formData, setFormData] = useState({
    machineId: editingPurchase?.machineId || '',
    supplierId: editingPurchase?.supplierId || 0,
    purchaseDate: editingPurchase?.purchaseDate || '',
    purchasePrice: editingPurchase?.purchasePrice || 0,
    warrantyStartDate: editingPurchase?.warrantyStartDate || '',
    warrantyEndDate: editingPurchase?.warrantyEndDate || '',
    financingDetails: editingPurchase?.financingDetails || {
      financedAmount: 0,
      downPayment: 0,
      monthlyPayment: 0,
      interestRate: 5.9,
      termMonths: 24,
      startDate: ''
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateMonthlyPayment = (financed: number, months: number, rate: number) => {
    const monthlyRate = rate / 1200; // Convert annual rate to monthly decimal
    const payment = financed * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100; // Round to 2 decimal places
  };

  const handleFinancingChange = (field: keyof typeof formData.financingDetails, value: number | string) => {
    const newFinancingDetails = { ...formData.financingDetails, [field]: value };

    // Auto-calculate monthly payment when relevant fields change
    if (['financedAmount', 'termMonths', 'interestRate'].includes(field)) {
      const monthlyPayment = calculateMonthlyPayment(
        newFinancingDetails.financedAmount,
        newFinancingDetails.termMonths,
        newFinancingDetails.interestRate
      );
      newFinancingDetails.monthlyPayment = monthlyPayment;
    }

    setFormData({
      ...formData,
      financingDetails: newFinancingDetails
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingPurchase ? 'Edit Purchase' : 'New Purchase'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Machine</label>
            <select
              value={formData.machineId}
              onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Machine</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  Machine {machine.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Price ($)</label>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => {
                const price = Number(e.target.value);
                setFormData({ 
                  ...formData, 
                  purchasePrice: price,
                  financingDetails: {
                    ...formData.financingDetails,
                    financedAmount: price - formData.financingDetails.downPayment
                  }
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financing Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
                <input
                  type="number"
                  value={formData.financingDetails.downPayment}
                  onChange={(e) => {
                    const downPayment = Number(e.target.value);
                    handleFinancingChange('downPayment', downPayment);
                    handleFinancingChange('financedAmount', formData.purchasePrice - downPayment);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Financed Amount ($)</label>
                <input
                  type="number"
                  value={formData.financingDetails.financedAmount}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  value={formData.financingDetails.interestRate}
                  onChange={(e) => handleFinancingChange('interestRate', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Term (Months)</label>
                <input
                  type="number"
                  value={formData.financingDetails.termMonths}
                  onChange={(e) => handleFinancingChange('termMonths', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Payment ($)</label>
                <input
                  type="number"
                  value={formData.financingDetails.monthlyPayment}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.financingDetails.startDate}
                  onChange={(e) => handleFinancingChange('startDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Warranty Start Date</label>
            <input
              type="date"
              value={formData.warrantyStartDate}
              onChange={(e) => setFormData({ ...formData, warrantyStartDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Warranty End Date</label>
            <input
              type="date"
              value={formData.warrantyEndDate}
              onChange={(e) => setFormData({ ...formData, warrantyEndDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {editingPurchase ? 'Save Changes' : 'Create Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;