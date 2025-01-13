import React, { useState } from 'react';
import { format } from 'date-fns';
import { Invoice } from '../types';
import InvoiceForm from './InvoiceForm';

const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 500.00,
    status: "pending",
    machineId: "M001",
    supplierId: 1,
    notes: "Monthly maintenance service",
    photos: []
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    amount: 750.00,
    status: "paid",
    machineId: "M002",
    supplierId: 2,
    notes: "Parts replacement",
    photos: []
  }
];

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();

  const handleAddInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Math.max(...invoices.map(i => i.id)) + 1
    };
    setInvoices([...invoices, newInvoice]);
    setIsFormOpen(false);
  };

  const handleEditInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    if (!selectedInvoice) return;
    
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === selectedInvoice.id
        ? { ...invoiceData, id: invoice.id }
        : invoice
    );
    
    setInvoices(updatedInvoices);
    setIsFormOpen(false);
    setSelectedInvoice(undefined);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage machine-related invoices</p>
        </div>
        <button
          onClick={() => {
            setSelectedInvoice(undefined);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create Invoice
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-600">Machine {invoice.machineId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Amount:</span>{' '}
                {formatCurrency(invoice.amount)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{' '}
                {format(new Date(invoice.date), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Due Date:</span>{' '}
                {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
              </p>
              {invoice.notes && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {invoice.notes}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(invoice.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <InvoiceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInvoice(undefined);
        }}
        onSubmit={selectedInvoice ? handleEditInvoice : handleAddInvoice}
        editingInvoice={selectedInvoice}
      />
    </div>
  );
};

export default InvoiceList;