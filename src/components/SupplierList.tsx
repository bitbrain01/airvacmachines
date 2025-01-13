import React, { useState } from 'react';
import { Supplier } from '../types';
import SupplierForm from './SupplierForm';

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "AirVac Solutions",
    contactPerson: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    emailAddress: "john.smith@airvac.com",
    address: "123 Industrial Park, Suite 100, Chicago, IL 60601",
    websiteUrl: "https://airvac-solutions.example.com"
  },
  {
    id: 2,
    name: "PressureMax Systems",
    contactPerson: "Sarah Johnson",
    phoneNumber: "+1 (555) 987-6543",
    emailAddress: "sarah.j@pressuremax.com",
    address: "456 Tech Boulevard, Detroit, MI 48201",
    websiteUrl: "https://pressuremax.example.com"
  }
];

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Math.max(...suppliers.map(s => s.id)) + 1
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsFormOpen(false);
  };

  const handleEditSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    if (!editingSupplier) return;
    
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === editingSupplier.id
        ? { ...supplierData, id: supplier.id }
        : supplier
    );
    
    setSuppliers(updatedSuppliers);
    setIsFormOpen(false);
    setEditingSupplier(undefined);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setEditingSupplier(undefined);
            setIsFormOpen(true);
          }}
        >
          Add Supplier
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
              <p className="text-sm text-gray-600">Contact: {supplier.contactPerson}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span>{' '}
                <a href={`tel:${supplier.phoneNumber}`} className="text-blue-600 hover:text-blue-800">
                  {supplier.phoneNumber}
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${supplier.emailAddress}`} className="text-blue-600 hover:text-blue-800">
                  {supplier.emailAddress}
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {supplier.address}
              </p>
              {supplier.websiteUrl && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Website:</span>{' '}
                  <a 
                    href={supplier.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Visit Website
                  </a>
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingSupplier(supplier);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <SupplierForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSupplier(undefined);
        }}
        onSubmit={editingSupplier ? handleEditSupplier : handleAddSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
};

export default SupplierList;