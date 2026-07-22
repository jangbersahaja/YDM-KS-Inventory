"use client";

import { StockCount } from "@/app/page";
import { INVENTORY_CATEGORIES, InventoryItem } from "@/lib/inventory-items";
import { useState } from "react";

interface QuickEntryModeProps {
  items: InventoryItem[];
  onStockUpdate: (itemId: string, quantity: number, notes?: string) => void;
  stockCounts: StockCount[];
}

export default function QuickEntryMode({
  items,
  onStockUpdate,
  stockCounts,
}: QuickEntryModeProps) {
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(true);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);

  // Filter items based on mode
  let displayItems = items;

  if (showOnlyUrgent) {
    displayItems = items.filter((item) => item.isUrgent);
  }

  if (showOnlyMissing) {
    displayItems = items.filter((item) => {
      const count = stockCounts.find((c) => c.itemId === item.id);
      return !count; // Show items not yet counted
    });
  }

  const getStockValue = (itemId: string) => {
    const stock = stockCounts.find((s) => s.itemId === itemId);
    return stock?.quantity || "";
  };

  const countedItems = stockCounts.length;
  const totalItems = items.length;
  const progress = Math.round((countedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
          <span className="text-2xl font-bold text-blue-600">
            {countedItems}/{totalItems}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setShowOnlyUrgent(!showOnlyUrgent);
              setShowOnlyMissing(false);
            }}
            className={`px-4 py-3 rounded-lg font-semibold transition ${
              showOnlyUrgent
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            🚨 Only Urgent Items ({items.filter((i) => i.isUrgent).length})
          </button>
          <button
            onClick={() => {
              setShowOnlyMissing(!showOnlyMissing);
              setShowOnlyUrgent(false);
            }}
            className={`px-4 py-3 rounded-lg font-semibold transition ${
              showOnlyMissing
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            ⏳ Not Yet Counted ({items.length - countedItems})
          </button>
        </div>
      </div>

      {/* Quick Entry Items */}
      <div className="space-y-3">
        {displayItems.map((item) => {
          const stockValue = getStockValue(item.id);
          const isCounted = stockValue !== "";

          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md p-4 transition border-l-4 ${
                isCounted
                  ? "border-green-500 bg-green-50"
                  : item.isUrgent
                    ? "border-red-500"
                    : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    {item.name}
                    {item.isUrgent && (
                      <span className="text-red-600 font-bold">‼️</span>
                    )}
                    {isCounted && (
                      <span className="text-green-600 text-sm">✓</span>
                    )}
                  </h4>
                  {item.notes && (
                    <p className="text-xs text-gray-600 mt-1">
                      📝 {item.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      INVENTORY_CATEGORIES[
                        item.category as keyof typeof INVENTORY_CATEGORIES
                      ]
                    }
                  </p>
                </div>

                {/* Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stockValue}
                    onChange={(e) =>
                      onStockUpdate(item.id, parseInt(e.target.value) || 0)
                    }
                    autoFocus={!isCounted}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-600 min-w-16">
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {displayItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              {showOnlyMissing
                ? "🎉 All items counted!"
                : "No items to display with current filter"}
            </p>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-linear-to-r from-purple-100 to-blue-100 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Urgent Items</p>
            <p className="text-2xl font-bold text-red-600">
              {items.filter((i) => i.isUrgent).length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Counted</p>
            <p className="text-2xl font-bold text-green-600">{countedItems}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Remaining</p>
            <p className="text-2xl font-bold text-orange-600">
              {totalItems - countedItems}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Progress</p>
            <p className="text-2xl font-bold text-blue-600">{progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
