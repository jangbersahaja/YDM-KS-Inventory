"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  warningLevel: number;
  reorderQuantity: number;
  supplier?: { id: string; name: string };
  lastUpdated: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function ItemsManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "PRIORITY_RESTOCK",
    unit: "piece",
    supplierId: "",
    warningLevel: "10",
    reorderQuantity: "50",
  });

  const categories = [
    "PRIORITY_RESTOCK",
    "PACKAGING",
    "POWDER",
    "FLAVOUR",
    "OTHERS",
    "KITCHEN",
    "PASTE",
    "BARANG_BASAH",
    "CLEANING",
    "MERCH",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, suppliersRes] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/suppliers"),
        ]);
        const itemsData = await itemsRes.json();
        const suppliersData = await suppliersRes.json();
        setItems(itemsData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        warningLevel: parseInt(formData.warningLevel),
        reorderQuantity: parseInt(formData.reorderQuantity),
      };

      if (editingId) {
        await fetch(`/api/items/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // Refresh items
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`/api/items/${id}`, { method: "DELETE" });
        // Refresh items
        const res = await fetch("/api/items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "PRIORITY_RESTOCK",
      unit: "piece",
      supplierId: "",
      warningLevel: "10",
      reorderQuantity: "50",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              📦 Manage Inventory Items
            </h1>
            <p className="text-gray-600">Add, edit, and configure items</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {showForm ? "Cancel" : "+ Add New Item"}
        </button>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Pati Kopi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., bottle, rolls, piece"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a supplier...</option>
                    {suppliers.map((supp) => (
                      <option key={supp.id} value={supp.id}>
                        {supp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warning Level
                  </label>
                  <input
                    type="number"
                    value={formData.warningLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, warningLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reorder Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.reorderQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reorderQuantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  {editingId ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4">
          <input
            type="text"
            placeholder="🔍 Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left font-semibold">Item Name</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Warning</th>
                <th className="px-6 py-3 text-left font-semibold">Supplier</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {item.category}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        item.currentStock === 0
                          ? "bg-red-100 text-red-700"
                          : item.currentStock <= item.warningLevel
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {item.warningLevel} {item.unit}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {item.supplier?.name || "None"}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => {
                        setFormData({
                          name: item.name,
                          description: item.description || "",
                          category: item.category,
                          unit: item.unit,
                          supplierId: item.supplier?.id || "",
                          warningLevel: item.warningLevel.toString(),
                          reorderQuantity: item.reorderQuantity.toString(),
                        });
                        setEditingId(item.id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>
    </main>
  );
}
