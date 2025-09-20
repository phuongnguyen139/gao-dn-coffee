import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Orders from './pages/Orders';
import InventoryImport from './pages/Inventory/Import';
import InventoryExport from './pages/Inventory/Export';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import Sale from './pages/Sale';
import Revenue from './pages/Revenue';
import TableDetail from './pages/Sale/TableDetail';
import Product from './pages/Products';


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Sale />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/products" element={<Product />} />
          <Route path="orders" element={<Orders />} />
          <Route path="/table/:id" element={<TableDetail />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory-import" element={<InventoryImport />} />
          <Route path="inventory-export" element={<InventoryExport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
