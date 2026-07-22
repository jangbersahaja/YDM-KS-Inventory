# 📦 Inventory Management System - Kopi Saigon Nu Sentral

A modern web-based inventory management system designed to streamline daily stock checks for Kopi Saigon Nu Sentral. This app helps staff quickly count inventory and automatically generates WhatsApp-ready reports for distribution.

## ✨ Features

### 📝 Two Input Modes

- **Normal Mode**: Browse through all items organized by category with search functionality
- **Quick Mode**: Focus on urgent items or items not yet counted with a progress tracker for faster input during closing time

### 📋 Smart Stock Reporting

- **WhatsApp Format**: Automatically formats stock data into WhatsApp-ready text with emojis and organization
- **Copy to Clipboard**: One-click copy of formatted report directly to clipboard
- **Text Export**: Download report as `.txt` file for manual distribution
- **CSV Export**: Export stock data as `.csv` for record-keeping and analysis

### 💾 Persistent Storage

- All stock counts are automatically saved to browser localStorage
- Staff can close browser or refresh page without losing data
- Prepared by (staff name) is remembered for convenience

### 📊 Detailed Views

- Summary card showing total items counted, urgent items flagged, and progress percentage
- Detailed table view showing all stock counts with status indicators
- Real-time progress tracker in Quick Mode showing completion percentage

### 🚨 Urgent Item Management

- Items marked as urgent are highlighted throughout the app
- Automatic identification of zero-stock items
- Priority restock list generated in WhatsApp report

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 Inventory Categories

The system tracks stock across 10 categories:

1. 🚨 **Priority Restock** - Critical items needed regularly
2. 📦 **Packaging** - Cups, boxes, bags, wrapping materials
3. 🧂 **Powder** - Coffee powders, flavoring powders
4. 🍯 **Flavour/Puree/Davinci** - Syrups, purees, flavorings
5. 📦 **Others** - Miscellaneous supplies
6. 🥘 **Kitchen Ingredients** - Food items and basics
7. 🥫 **Paste/Sauce** - Condiments and sauces
8. 🥬 **Barang Basah** - Fresh and refrigerated items
9. 🧼 **Cleaning** - Cleaning supplies and utilities
10. 🛍️ **Merch** - Branded merchandise and promotional items

## 💡 How to Use

### Step 1: Select Input Mode

- Choose between **Normal Mode** (browse all items) or **Quick Mode** (fast entry)
- In Quick Mode, use filters to focus on urgent items or uncounted items

### Step 2: Enter Staff Name

- Enter the staff member's name who is conducting the stock check
- This will appear in the WhatsApp report

### Step 3: Count Inventory

- Enter quantities for each item
- Items turn green when counted
- Optionally add notes for special conditions (e.g., "in cabinet", "loose stock")

### Step 4: Generate Report

- Click "Generate Report" to see preview and export options
- View detailed table of all counts
- See statistics: total items, urgent items, prepared by

### Step 5: Export Report

- **📋 Copy to Clipboard**: Instantly copy formatted text to send via WhatsApp
- **💾 Download as Text**: Save as `.txt` file for email or sharing
- **📊 Download as CSV**: Export data for spreadsheet analysis or record-keeping

## 🔄 Example WhatsApp Report

```
📦 STOCK KOPI SAIGON NU SENTRAL

Stock Check: 23 July 2026
Prepared by: Mimie

---

🚨 PRIORITY RESTOCK

1. Pati Kopi – 3 bottle
2. ValuePride Whipped Cream – 11 boxes ‼️ URGENT

---

📦 PACKAGING

- Hot Cup 12oz – 41 rolls
- Hot Lid Cup – 40 rolls
...
```

## 💾 Data Persistence

- Stock counts are saved to browser **localStorage** in real-time
- Staff name is remembered
- Current entry mode (Normal/Quick) is saved
- Clear all data with the **🗑️** button (requires confirmation)

## 🛠️ Technology Stack

- **Next.js 16** - React framework with server/client components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling
- **React 19** - Latest React features

## 📁 Project Structure

```
app/
  page.tsx              # Main page with state management
  layout.tsx            # App layout
  globals.css           # Global styles

components/
  StockCheckForm.tsx    # Normal mode form component
  QuickEntryMode.tsx    # Quick mode for fast input
  StockSummary.tsx      # Report preview and export

lib/
  inventory-items.ts    # All inventory item definitions
  csv-utils.ts          # CSV export/import utilities

public/                 # Static assets
```

## 📝 Notes for Staff

- Use **Quick Mode** during busy closing times for faster input
- Filter by "Not Yet Counted" to focus on remaining items
- All data is saved locally - you can take a break and resume later
- Copy report directly to WhatsApp instead of typing manually
- Each report includes date and prepared by information for accountability

## 🔮 Future Enhancements

- [ ] CSV import to reload previous stock checks
- [ ] Low-stock threshold alerts
- [ ] Photo capture for reference
- [ ] Multi-location support
- [ ] Cloud sync across devices
- [ ] Historical trend analysis
- [ ] Barcode scanning integration

## 📞 Support

For issues or feature requests, please contact the development team.

---

### Built for Kopi Saigon Nu Sentral | Streamlining Inventory Management
