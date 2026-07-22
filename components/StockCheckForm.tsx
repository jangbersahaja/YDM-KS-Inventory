"use client";

import { useState } from "react";
import { InventoryItem, INVENTORY_CATEGORIES } from "@/lib/inventory-items";
import { StockCount } from "@/app/page";

interface StockCheckFormProps {
  items: InventoryItem[];
  onStockUpdate: (itemId: string, quantity: number, notes?: string) => void;
  stockCounts: StockCount[];
}

export default function StockCheckForm({
  items,
  onStockUpdate,
  stockCounts,
}: StockCheckFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group items by category
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, InventoryItem[]>
  );

  // Filter items based on search term
  const filteredGroups = Object.entries(groupedItems).reduce(
    (acc, [category, categoryItems]) => {
      const filtered = categoryItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, InventoryItem[]>
  );

  const getStockValue = (itemId: string) => {
    const stock = stockCounts.find((s) => s.itemId === itemId);
    return stock?.quantity || "";
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {Object.entries(filteredGroups).map(([category, categoryItems]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Category Header */}
            <div
              className="bg-blue-600 text-white p-4 cursor-pointer hover:bg-blue-700 transition"
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            >
              <h2 className="text-lg font-semibold flex justify-between items-center">
                <span>{INVENTORY_CATEGORIES[category as keyof typeof INVENTORY_CATEGORIES]}</span>
                <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                  {categoryItems.length} items
                </span>
              </h2>
            </div>

            {/* Category Items */}
            {selectedCategory === category && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      getStockValue(item.id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 flex-1">
                        {item.name}
                        {item.isUrgent && <span className="ml-2 text-red-500">‼️</span>}
                      </h3>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-gray-500 mb-3">📝 {item.notes}</p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={getStockValue(item.id)}
                        onChange={(e) =>
                          onStockUpdate(
                            item.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-600 min-w-12">
                        {item.unit}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Additional notes..."
                      onChange={(e) =>
                        onStockUpdate(
                          item.id,
                          parseInt(getStockValue(item.id) as string) || 0,
                          e.target.value || undefined
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
