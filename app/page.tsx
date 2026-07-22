"use client";

import QuickEntryMode from "@/components/QuickEntryMode";
import StockCheckForm from "@/components/StockCheckForm";
import StockSummary from "@/components/StockSummary";
import { INVENTORY_ITEMS } from "@/lib/inventory-items";
import { useEffect, useState } from "react";

export interface StockCount {
  itemId: string;
  quantity: number;
  notes?: string;
}

const STORAGE_KEY = "inventory_stock_counts";
const STORAGE_KEY_STAFF = "inventory_staff_name";
const STORAGE_KEY_MODE = "inventory_mode";

export default function Home() {
  const [stockCounts, setStockCounts] = useState<StockCount[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [entryMode, setEntryMode] = useState<"normal" | "quick">("normal");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCounts = localStorage.getItem(STORAGE_KEY);
    const savedStaff = localStorage.getItem(STORAGE_KEY_STAFF);
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);

    if (savedCounts) {
      setStockCounts(JSON.parse(savedCounts));
    }
    if (savedStaff) {
      setStaffName(savedStaff);
    }
    if (savedMode) {
      setEntryMode(savedMode as "normal" | "quick");
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when counts change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockCounts));
    }
  }, [stockCounts, isHydrated]);

  // Save staff name to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_STAFF, staffName);
    }
  }, [staffName, isHydrated]);

  // Save entry mode to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_MODE, entryMode);
    }
  }, [entryMode, isHydrated]);

  const handleStockUpdate = (
    itemId: string,
    quantity: number,
    notes?: string,
  ) => {
    setStockCounts((prev) => {
      const existing = prev.find((s) => s.itemId === itemId);
      if (existing) {
        return prev.map((s) =>
          s.itemId === itemId ? { ...s, quantity, notes } : s,
        );
      }
      return [...prev, { itemId, quantity, notes }];
    });
  };

  const handleReset = () => {
    setStockCounts([]);
    setShowSummary(false);
    setStaffName("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_STAFF);
  };

  const handleClearData = () => {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      handleReset();
    }
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📦 Inventory Management System
            </h1>
            <p className="text-gray-600">
              Daily Stock Check & WhatsApp Report Generator
            </p>
          </div>
          {!showSummary && isHydrated && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setEntryMode(entryMode === "normal" ? "quick" : "normal")
                }
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  entryMode === "quick"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
              >
                {entryMode === "normal" ? "⚡ Quick Mode" : "📝 Normal Mode"}
              </button>
              {stockCounts.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-400 hover:bg-red-500 text-white transition"
                  title="Clear all data"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>

        {/* Staff Name Input */}
        {!showSummary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prepared by (Staff Name)
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Enter staff name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Main Content */}
        {!showSummary ? (
          <>
            {entryMode === "normal" ? (
              <StockCheckForm
                items={INVENTORY_ITEMS}
                onStockUpdate={handleStockUpdate}
                stockCounts={stockCounts}
              />
            ) : (
              <QuickEntryMode
                items={INVENTORY_ITEMS}
                onStockUpdate={handleStockUpdate}
                stockCounts={stockCounts}
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={() => {
                  if (stockCounts.length === 0) {
                    alert("Please add at least one stock count");
                    return;
                  }
                  if (!staffName.trim()) {
                    alert("Please enter staff name");
                    return;
                  }
                  setShowSummary(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              >
                Generate Report
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              >
                Reset All
              </button>
            </div>
          </>
        ) : (
          <StockSummary
            stockCounts={stockCounts}
            items={INVENTORY_ITEMS}
            staffName={staffName}
            onBack={handleReset}
          />
        )}
      </div>
    </main>
  );
}
