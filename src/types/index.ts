// Update the PriceHistory type to include more expense categories
export interface PriceHistory {
  id: number;
  date: string;
  amount: number;
  type: 'purchase' | 'maintenance' | 'part' | 'installation' | 'electrical' | 'handyman' | 'other';
  itemId: string;
  notes?: string;
  vendor?: string;
  receiptPhoto?: string;
  category?: string;
  paymentMethod?: string;
  status: 'paid' | 'pending' | 'overdue';
}