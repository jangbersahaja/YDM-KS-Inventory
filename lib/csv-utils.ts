import { StockCount } from "@/app/page";
import { InventoryItem } from "@/lib/inventory-items";

export const generateCSV = (
  stockCounts: StockCount[],
  items: InventoryItem[],
  staffName: string,
): string => {
  const today = new Date().toISOString().split("T")[0];
  const itemsMap = new Map(items.map((item) => [item.id, item]));

  let csv = "Stock Check Report\n";
  csv += `Date: ${today}\n`;
  csv += `Prepared by: ${staffName}\n\n`;
  csv += "Item Name,Category,Quantity,Unit,Urgent,Notes\n";

  stockCounts.forEach((count) => {
    const item = itemsMap.get(count.itemId);
    if (item) {
      csv += `"${item.name}","${item.category}","${count.quantity}","${item.unit}","${item.isUrgent ? "Yes" : "No"}","${count.notes || ""}"\n`;
    }
  });

  return csv;
};

export const downloadCSV = (content: string, filename: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(content),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const parseCSV = (
  csvContent: string,
): { stockCounts: Record<string, number>; staffName: string } => {
  const lines = csvContent.split("\n");
  const stockCounts: Record<string, number> = {};
  let staffName = "";

  // Parse header info
  for (const line of lines) {
    if (line.includes("Prepared by:")) {
      staffName = line.split("Prepared by:")[1].trim();
    }
  }

  // Skip header rows until we find the column headers
  let dataStartIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Item Name,Category")) {
      dataStartIndex = i + 1;
      break;
    }
  }

  // Parse data rows
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handle quoted fields)
    const parts = line.match(/("(?:[^"]|"")*"|[^,]*)/g) || [];
    if (parts.length >= 3) {
      const itemName = (parts[0] ?? "")
        .replace(/^"|"$/g, "")
        .replace(/""/g, '"');
      const quantity = parseInt((parts[2] ?? "0").replace(/^"|"$/g, "")) || 0;

      // We'll store by item name since we might not have IDs
      stockCounts[itemName] = quantity;
    }
  }

  return { stockCounts, staffName };
};
