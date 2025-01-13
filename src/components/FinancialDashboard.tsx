import React, { useState } from 'react';
import { Machine } from '../types';
import FinancialDetails from './FinancialDetails';
import AddTransactionForm from './AddTransactionForm';

const initialMachines: Machine[] = [
  {
    id: "M001",
    locationIds: [1],
    status: "Online",
    lastMaintenance: "2024-01-15",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-15",
    maintenanceHistory: [],
    financialDetails: {
      purchasePrice: 5000,
      financedAmount: 4000,
      downPayment: 1000,
      monthlyPayment: 250,
      interestRate: 5.9,
      termMonths: 24,
      startDate: "2024-01-01",
      remainingBalance: 3750,
      paidAmount: 250,
      monthlyIncome: 800,
      maintenanceCosts: 100,
      netIncome: 700,
      paymentHistory: [
        {
          id: 1,
          date: "2024-01-01",
          amount: 1000,
          type: "Down Payment"
        },
        {
          id: 2,
          date: "2024-01-15",
          amount: 250,
          type: "Monthly Payment"
        }
      ],
      incomeHistory: [
        {
          id: 1,
          date: "2024-01-15",
          amount: 400,
          type: "Cash"
        },
        {
          id: 2,
          date: "2024-01-30",
          amount: 400,
          type: "Card"
        }
      ]
    }
  },
  {
    id: "M002",
    locationIds: [2],
    status: "Offline",
    lastMaintenance: "2024-01-10",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-10",
    maintenanceHistory: [],
    financialDetails: {
      purchasePrice: 6000,
      financedAmount: 4800,
      downPayment: 1200,
      monthlyPayment: 300,
      interestRate: 5.9,
      termMonths: 24,
      startDate: "2024-01-05",
      remainingBalance: 4500,
      paidAmount: 300,
      monthlyIncome: 900,
      maintenanceCosts: 150,
      netIncome: 750,
      paymentHistory: [
        {
          id: 1,
          date: "2024-01-05",
          amount: 1200,
          type: "Down Payment"
        },
        {
          id: 2,
          date: "2024-01-20",
          amount: 300,
          type: "Monthly Payment"
        }
      ],
      incomeHistory: [
        {
          id: 1,
          date: "2024-01-20",
          amount: 450,
          type: "Cash"
        },
        {
          id: 2,
          date: "2024-01-31",
          amount: 450,
          type: "Card"
        }
      ]
    }
  },
  {
    id: "M003",
    locationIds: [1, 2],
    status: "Maintenance",
    lastMaintenance: "2024-01-05",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-05",
    maintenanceHistory: [],
    financialDetails: {
      purchasePrice: 7000,
      financedAmount: 5600,
      downPayment: 1400,
      monthlyPayment: 350,
      interestRate: 5.9,
      termMonths: 24,
      startDate: "2024-01-03",
      remainingBalance: 5250,
      paidAmount: 350,
      monthlyIncome: 1000,
      maintenanceCosts: 200,
      netIncome: 800,
      paymentHistory: [
        {
          id: 1,
          date: "2024-01-03",
          amount: 1400,
          type: "Down Payment"
        },
        {
          id: 2,
          date: "2024-01-18",
          amount: 350,
          type: "Monthly Payment"
        }
      ],
      incomeHistory: [
        {
          id: 1,
          date: "2024-01-18",
          amount: 500,
          type: "Cash"
        },
        {
          id: 2,
          date: "2024-01-29",
          amount: 500,
          type: "Card"
        }
      ]
    }
  }
];

const FinancialDashboard: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);

  const handleAddPayment = (machineId: string, amount: number, type: 'Monthly Payment' | 'Extra Payment', notes?: string) => {
    setMachines(machines.map(machine => {
      if (machine.id === machineId) {
        const newPayment = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          amount,
          type,
          notes
        };
        
        const newRemainingBalance = machine.financialDetails.remainingBalance - amount;
        const newPaidAmount = machine.financialDetails.paidAmount + amount;

        return {
          ...machine,
          financialDetails: {
            ...machine.financialDetails,
            remainingBalance: newRemainingBalance,
            paidAmount: newPaidAmount,
            paymentHistory: [...machine.financialDetails.paymentHistory, newPayment]
          }
        };
      }
      return machine;
    }));
  };

  const handleAddIncome = (machineId: string, amount: number, type: 'Cash' | 'Card' | 'Other', notes?: string) => {
    setMachines(machines.map(machine => {
      if (machine.id === machineId) {
        const newIncome = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          amount,
          type,
          notes
        };

        const newNetIncome = machine.financialDetails.netIncome + amount;

        return {
          ...machine,
          financialDetails: {
            ...machine.financialDetails,
            netIncome: newNetIncome,
            incomeHistory: [...machine.financialDetails.incomeHistory, newIncome]
          }
        };
      }
      return machine;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <div className="text-sm text-gray-600">
          Showing financial data for {machines.length} machines
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {machines.map((machine) => (
          <div key={machine.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Machine {machine.id}</h2>
                <p className="text-sm text-gray-600">
                  Installed at {machine.locationIds.length} location{machine.locationIds.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedMachine(machine);
                    setIsPaymentFormOpen(true);
                  }}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Payment
                </button>
                <button
                  onClick={() => {
                    setSelectedMachine(machine);
                    setIsIncomeFormOpen(true);
                  }}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Add Income
                </button>
              </div>
            </div>

            <FinancialDetails
              financials={machine.financialDetails}
              onAddPayment={(amount, type) => handleAddPayment(machine.id, amount, type)}
              onAddIncome={(amount, type) => handleAddIncome(machine.id, amount, type)}
            />
          </div>
        ))}
      </div>

      {selectedMachine && (
        <>
          <AddTransactionForm
            isOpen={isPaymentFormOpen}
            onClose={() => {
              setIsPaymentFormOpen(false);
              setSelectedMachine(null);
            }}
            onSubmit={(amount, type, notes) => {
              handleAddPayment(selectedMachine.id, amount, type as 'Monthly Payment' | 'Extra Payment', notes);
              setIsPaymentFormOpen(false);
              setSelectedMachine(null);
            }}
            transactionType="payment"
          />

          <AddTransactionForm
            isOpen={isIncomeFormOpen}
            onClose={() => {
              setIsIncomeFormOpen(false);
              setSelectedMachine(null);
            }}
            onSubmit={(amount, type, notes) => {
              handleAddIncome(selectedMachine.id, amount, type as 'Cash' | 'Card' | 'Other', notes);
              setIsIncomeFormOpen(false);
              setSelectedMachine(null);
            }}
            transactionType="income"
          />
        </>
      )}
    </div>
  );
};

export default FinancialDashboard;