/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ERPItem, ActivityLog } from './types';

export const DEFAULT_CREDENTIALS = {
  accountNumber: 'ERP-88290',
  email: 'operator@nexus-erp.com',
  password: 'nexusPass2026',
};

export const INITIAL_ERP_ITEMS: ERPItem[] = [
  {
    id: '1',
    sku: 'EL-TX800',
    name: 'Transistor Array Board TX800',
    category: 'Electronics',
    stock: 142,
    minStockLevel: 50,
    unitPrice: 249.99,
    status: 'In Stock',
    lastUpdated: '2026-06-23 14:32',
  },
  {
    id: '2',
    sku: 'HW-M12BLT',
    name: 'M12 Industrial Steel Bolts (500pk)',
    category: 'Hardware',
    stock: 15,
    minStockLevel: 30,
    unitPrice: 45.50,
    status: 'Low Stock',
    lastUpdated: '2026-06-23 11:15',
  },
  {
    id: '3',
    sku: 'SW-CADPRO',
    name: '3D CAD Professional License',
    category: 'Software Licenses',
    stock: 8,
    minStockLevel: 5,
    unitPrice: 1250.00,
    status: 'In Stock',
    lastUpdated: '2026-06-22 09:00',
  },
  {
    id: '4',
    sku: 'RW-ALU500',
    name: 'Aluminum Sheet T6061 (5x5ft)',
    category: 'Raw Materials',
    stock: 0,
    minStockLevel: 10,
    unitPrice: 180.00,
    status: 'Out of Stock',
    lastUpdated: '2026-06-23 16:45',
  },
  {
    id: '5',
    sku: 'OF-ERGCHR',
    name: 'Ergonomic Task Chair V2',
    category: 'Office Supplies',
    stock: 45,
    minStockLevel: 10,
    unitPrice: 320.00,
    status: 'In Stock',
    lastUpdated: '2026-06-20 15:10',
  },
  {
    id: '6',
    sku: 'EL-SEN200',
    name: 'High-Precision Optical Sensor 200',
    category: 'Electronics',
    stock: 12,
    minStockLevel: 25,
    unitPrice: 89.95,
    status: 'Low Stock',
    lastUpdated: '2026-06-23 08:30',
  },
  {
    id: '7',
    sku: 'RW-COP250',
    name: 'Copper Wire Spool #12 (250ft)',
    category: 'Raw Materials',
    stock: 68,
    minStockLevel: 20,
    unitPrice: 115.00,
    status: 'In Stock',
    lastUpdated: '2026-06-23 10:05',
  },
  {
    id: '8',
    sku: 'SW-ERPVIP',
    name: 'Enterprise ERP Suite Admin Token',
    category: 'Software Licenses',
    stock: 50,
    minStockLevel: 15,
    unitPrice: 450.00,
    status: 'In Stock',
    lastUpdated: '2026-06-24 01:20',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '101',
    timestamp: '10 mins ago',
    user: 'M. Chen',
    action: 'Inventory Update',
    details: 'Adjusted Transistor Array stock from 120 to 142 units.',
    type: 'success',
  },
  {
    id: '102',
    timestamp: '1 hour ago',
    user: 'System Bot',
    action: 'Auto-Trigger Order',
    details: 'Triggered reorder proposal for Aluminum Sheets (Out of Stock).',
    type: 'warning',
  },
  {
    id: '103',
    timestamp: '3 hours ago',
    user: 'S. Patel',
    action: 'License Allocation',
    details: 'Assigned 2 ' + '3D CAD Professional Licenses' + ' to R&D team.',
    type: 'info',
  },
  {
    id: '104',
    timestamp: '5 hours ago',
    user: 'System Security',
    action: 'API Warning',
    details: 'Rate-limiting warning encountered on Shipping Endpoint API.',
    type: 'error',
  },
];
