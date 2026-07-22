"use client";

import { StockCount } from "@/app/page";
import { downloadCSV, generateCSV } from "@/lib/csv-utils";
import { INVENTORY_CATEGORIES, InventoryItem } from "@/lib/inventory-items";
import { useState } from "react";

interface StockSummaryProps {
  stockCounts: StockCount[];
  items: InventoryItem[];
  staffName: string;
  onBack: () => void;
}

export default function StockSummary({
  stockCounts,
  items,
  staffName,
  onBack,
}: StockSummaryProps) {
  const [copied, setCopied] = useState(false);

  // Generate WhatsApp formatted text
  const generateWhatsAppText = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Create a map of items by ID for quick lookup
    const itemsMap = new Map(items.map((item) => [item.id, item]));

    // Group stock counts by category
    const countsByCategory: Record<string, StockCount[]> = {};
    stockCounts.forEach((count) => {
      const item = itemsMap.get(count.itemId);
      if (item) {
        if (!countsByCategory[item.category]) {
          countsByCategory[item.category] = [];
        }
        countsByCategory[item.category].push(count);
      }
    });

    // Find urgent items
    const urgentItems = stockCounts
      .map((count) => {
        const item = itemsMap.get(count.itemId);
        return item && item.isUrgent ? { item, count } : null;
      })
      .filter(Boolean) as Array<{ item: InventoryItem; count: StockCount }>;

    let text = "📦 STOCK KOPI SAIGON NU SENTRAL\n\n";
    text += `Stock Check: ${dateStr}\n`;
    text += `Prepared by: ${staffName}\n\n`;
    text += "---\n\n";

    // Add urgent items section
    if (urgentItems.length > 0) {
      text += "🚨 PRIORITY RESTOCK\n\n";
      urgentItems.forEach((item, index) => {
        const urgentMarker = item.count.quantity === 0 ? " ‼️ URGENT" : "";
        text += `${index + 1}. ${item.item.name} – ${item.count.quantity} ${item.item.unit}${urgentMarker}\n`;
        if (item.count.notes) {
          text += `   📝 ${item.count.notes}\n`;
        }
      });
      text += "\n---\n\n";
    }

    // Add categories
    const categoryOrder = [
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

    categoryOrder.forEach((category) => {
      const categoryCounts = countsByCategory[category];
      if (categoryCounts && categoryCounts.length > 0) {
        const categoryLabel =
          INVENTORY_CATEGORIES[category as keyof typeof INVENTORY_CATEGORIES];
        text += `${categoryLabel}\n\n`;

        categoryCounts.forEach((count) => {
          const item = itemsMap.get(count.itemId);
          if (item) {
            const urgentMarker =
              item.isUrgent && count.quantity === 0 ? " ‼️" : "";
            text += `- ${item.name} – ${count.quantity} ${item.unit}${urgentMarker}\n`;
            if (count.notes) {
              text += `  📝 ${count.notes}\n`;
            }
          }
        });
        text += "\n";
      }
    });

    // Add final urgent restock list
    const criticalUrgent = urgentItems.filter((u) => u.count.quantity === 0);
    if (criticalUrgent.length > 0) {
      text += "---\n\n";
      text += "🚨 FINAL URGENT RESTOCK LIST\n\n";
      criticalUrgent.forEach((item, index) => {
        text += `${index + 1}. ${item.item.name}\n`;
      });
    }

    text += "\n______\n";
    return text;
  };

  const handleCopyToClipboard = async () => {
    const text = generateWhatsAppText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy to clipboard");
    }
  };

  const handleDownloadTxt = () => {
    const text = generateWhatsAppText();
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", `stock_check_${new Date().getTime()}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV(stockCounts, items, staffName);
    downloadCSV(csv, `stock_check_${new Date().getTime()}.csv`);
  };

  const whatsAppText = generateWhatsAppText();

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 pb-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            📋 Stock Report Preview
          </h2>
          <p className="text-gray-600">Ready to send via WhatsApp</p>
        </div>

        {/* WhatsApp Format Preview */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-6 font-mono text-sm whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
          {whatsAppText}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleCopyToClipboard}
            className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-200 ${
              copied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {copied ? "✓ Copied to Clipboard" : "📋 Copy to Clipboard"}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            💾 Download as Text
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            📊 Download as CSV
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-gray-600">Total Items Counted</p>
            <p className="text-2xl font-bold text-blue-600">
              {stockCounts.length}
            </p>
          </div>
          <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded">
            <p className="text-sm text-gray-600">Urgent Items (0 stock)</p>
            <p className="text-2xl font-bold text-red-600">
              {
                stockCounts.filter((c) => {
                  const item = items.find((i) => i.id === c.itemId);
                  return item?.isUrgent && c.quantity === 0;
                }).length
              }
            </p>
          </div>
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-sm text-gray-600">Prepared by</p>
            <p className="text-2xl font-bold text-purple-600">{staffName}</p>
          </div>
        </div>
      </div>

      {/* Detailed Table View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h3 className="text-lg font-semibold">📊 Detailed Stock Counts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stockCounts.map((count) => {
                const item = items.find((i) => i.id === count.itemId);
                if (!item) return null;
                const isLow = count.quantity === 0;
                return (
                  <tr key={count.itemId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                      {item.isUrgent && (
                        <span className="ml-2 text-red-600 font-bold">⚠️</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {
                        INVENTORY_CATEGORIES[
                          item.category as keyof typeof INVENTORY_CATEGORIES
                        ]
                      }
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded font-semibold ${
                          isLow
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {count.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {isLow ? (
                        <span className="text-red-600 font-bold">
                          🚨 URGENT
                        </span>
                      ) : (
                        <span className="text-green-600">✓ OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          ← Back to Input
        </button>
      </div>
    </div>
  );
}
