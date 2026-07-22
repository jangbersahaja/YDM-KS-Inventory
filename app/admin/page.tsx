"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  warningLevel: number;
  unit: string;
}

interface DashboardStats {
  totalItems: number;
  warningItems: number;
  criticalItems: number;
  suppliers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    warningItems: 0,
    criticalItems: 0,
    suppliers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch("/api/items");
        const itemsData: InventoryItem[] = await itemsRes.json();
        setItems(itemsData);

        const suppliersRes = await fetch("/api/suppliers");
        const suppliersData = await suppliersRes.json();

        const warningItems = itemsData.filter(
          (item) => item.currentStock <= item.warningLevel && item.currentStock > 0
        );
        const criticalItems = itemsData.filter(
          (item) => item.currentStock === 0
        );

        setStats({
          totalItems: itemsData.length,
          warningItems: warningItems.length,
          criticalItems: criticalItems.length,
          suppliers: suppliersData.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📊 Admin Dashboard
            </h1>
            <p className="text-gray-600">Inventory Management System</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              ← Back to Stock Check
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm mb-2">Total Items</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm mb-2">⚠️ Warning Level</p>
            <p className="text-3xl font-bold text-orange-600">{stats.warningItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm mb-2">🚨 Critical (0 Stock)</p>
            <p className="text-3xl font-bold text-red-600">{stats.criticalItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm mb-2">Suppliers</p>
            <p className="text-3xl font-bold text-green-600">{stats.suppliers}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/admin/items"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-t-4 border-blue-600"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">📦 Manage Items</h3>
            <p className="text-gray-600">Add, edit, and configure inventory items</p>
          </Link>
          <Link
            href="/admin/suppliers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-t-4 border-green-600"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">🏭 Manage Suppliers</h3>
            <p className="text-gray-600">Manage supplier information and contacts</p>
          </Link>
          <Link
            href="/admin/restocks"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-t-4 border-purple-600"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">📥 Restock Log</h3>
            <p className="text-gray-600">View and record restock transactions</p>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-t-4 border-indigo-600"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">📈 Reports</h3>
            <p className="text-gray-600">View inventory analytics and reports</p>
          </Link>
        </div>

        {/* Critical Items Alert */}
        {stats.criticalItems > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-red-800 mb-3">
              🚨 URGENT: {stats.criticalItems} Items at Zero Stock
            </h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.currentStock === 0)
                .map((item) => (
                  <div key={item.id} className="text-red-700">
                    • {item.name} ({item.category})
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Warning Items Alert */}
        {stats.warningItems > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6">
            <h3 className="text-lg font-bold text-orange-800 mb-3">
              ⚠️ WARNING: {stats.warningItems} Items at Warning Level
            </h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.currentStock <= item.warningLevel && item.currentStock > 0)
                .map((item) => (
                  <div key={item.id} className="text-orange-700">
                    • {item.name} - {item.currentStock} {item.unit} (Warning level: {item.warningLevel})
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
