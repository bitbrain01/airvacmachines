import React from 'react';
import { format } from 'date-fns';
import { MachineFinancials, PaymentRecord, IncomeRecord } from '../types';

interface FinancialDetailsProps {
  financials: MachineFinancials;
  onAddPayment: (amount: number, type: 'Monthly Payment' | 'Extra Payment') => void;
  onAddIncome: (amount: number, type: 'Cash' | 'Card' | 'Other') => void;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  financials,
  onAddPayment,
  onAddIncome,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = () => {
    const totalPayments = financials.financedAmount;
    const paid = financials.paidAmount;
    return (paid / totalPayments) * 100;
  };

  const calculateROI = () => {
    const totalInvested = financials.downPayment + financials.paidAmount;
    const totalIncome = financials.incomeHistory.reduce((sum, record) => sum + record.amount, 0);
    const totalCosts = financials.maintenanceCosts + totalInvested;
    return ((totalIncome - totalCosts) / totalCosts) * 100;
  };

  // Create a combined array of transactions with a unique identifier for each type
  const combinedTransactions = [
    ...financials.paymentHistory.map((payment): (PaymentRecord & { transactionType: 'payment' }) => ({
      ...payment,
      transactionType: 'payment'
    })),
    ...financials.incomeHistory.map((income): (IncomeRecord & { transactionType: 'income' }) => ({
      ...income,
      transactionType: 'income'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h3>
      
      {/* Financing Details */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Financing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Purchase Price</p>
            <p className="text-lg font-medium">{formatCurrency(financials.purchasePrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Financed Amount</p>
            <p className="text-lg font-medium">{formatCurrency(financials.financedAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Payment</p>
            <p className="text-lg font-medium">{formatCurrency(financials.monthlyPayment)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining Balance</p>
            <p className="text-lg font-medium">{formatCurrency(financials.remainingBalance)}</p>
          </div>
        </div>

        {/* Payment Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Payment Progress</span>
            <span>{calculateProgress().toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Income & ROI */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Performance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-lg font-medium">{formatCurrency(financials.monthlyIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Income</p>
            <p className="text-lg font-medium">{formatCurrency(financials.netIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Maintenance Costs</p>
            <p className="text-lg font-medium">{formatCurrency(financials.maintenanceCosts)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">ROI</p>
            <p className="text-lg font-medium">{calculateROI().toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Recent Transactions</h4>
        <div className="space-y-2">
          {combinedTransactions.map((record) => (
            <div
              key={`${record.transactionType}-${record.id}`}
              className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium">
                  {format(new Date(record.date), 'MMM d, yyyy')}
                </span>
                <span className="text-gray-600 ml-2">{record.type}</span>
              </div>
              <span className={`font-medium ${
                record.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(record.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialDetails;