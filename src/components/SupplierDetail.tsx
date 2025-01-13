import React from 'react';
import { Supplier } from '../types';

interface SupplierDetailProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({
  supplier,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{supplier.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Contact Person</label>
                <p className="text-gray-900 font-medium">{supplier.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <p className="text-gray-900 font-medium">
                  <a href={`tel:${supplier.phoneNumber}`} className="hover:text-blue-600">
                    {supplier.phoneNumber}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-900 font-medium">
                  <a href={`mailto:${supplier.emailAddress}`} className="text-blue-600 hover:text-blue-800">
                    {supplier.emailAddress}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Location Details</h3>
            <div>
              <label className="text-sm text-gray-600">Address</label>
              <p className="text-gray-900">{supplier.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Edit Supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;