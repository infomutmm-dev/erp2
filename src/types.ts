/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  accountNumber: string;
  email: string;
  name: string;
  role: string;
  department: string;
  avatarUrl?: string;
}

export interface ERPItem {
  id: string;
  sku: string;
  name: string;
  category: 'Electronics' | 'Hardware' | 'Office Supplies' | 'Raw Materials' | 'Software Licenses';
  stock: number;
  minStockLevel: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
