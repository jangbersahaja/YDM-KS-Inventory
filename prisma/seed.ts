import prisma from "../lib/prisma";
import { generateSlug } from "../lib/slug";

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.restock.deleteMany();
  await prisma.stockTake.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: "Kopi Supplier Co",
        contactPerson: "Ahmad",
        phone: "+60123456789",
        email: "contact@kopisupp.com",
        address: "123 Coffee Street, Kuala Lumpur",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Packaging Masters",
        contactPerson: "Sarah",
        phone: "+60187654321",
        email: "sales@packagingmaster.com",
        address: "456 Box Avenue, Selangor",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Beverage Ingredients Ltd",
        contactPerson: "John",
        phone: "+6016789012",
        email: "orders@beverage-ing.com",
        address: "789 Flavour Road, Petaling Jaya",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Fresh Produce Hub",
        contactPerson: "Mimi",
        phone: "+60149876543",
        email: "delivery@freshproduce.com",
        address: "321 Vegetable Market, KL",
      },
    }),
  ]);

  console.log(`✓ Created ${suppliers.length} suppliers`);

  // Create inventory items with their categories
  const itemsData = [
    // PRIORITY_RESTOCK
    {
      name: "Pati Kopi",
      category: "PRIORITY_RESTOCK",
      unit: "bottle",
      warningLevel: 5,
      reorderQuantity: 20,
      supplierId: suppliers[0].id,
    },
    {
      name: "Cup 22oz",
      category: "PRIORITY_RESTOCK",
      unit: "rolls",
      warningLevel: 50,
      reorderQuantity: 200,
      supplierId: suppliers[1].id,
    },
    {
      name: "ValuePride Whipped Cream",
      category: "PRIORITY_RESTOCK",
      unit: "boxes",
      warningLevel: 5,
      reorderQuantity: 20,
      supplierId: suppliers[2].id,
    },

    // PACKAGING
    {
      name: "Hot Cup 12oz",
      category: "PACKAGING",
      unit: "rolls",
      warningLevel: 50,
      reorderQuantity: 200,
      supplierId: suppliers[1].id,
    },
    {
      name: "Plastik Sampah XL",
      category: "PACKAGING",
      unit: "rolls",
      warningLevel: 5,
      reorderQuantity: 20,
      supplierId: suppliers[1].id,
    },

    // POWDER
    {
      name: "Cocoa Powder",
      category: "POWDER",
      unit: "piece",
      warningLevel: 5,
      reorderQuantity: 15,
      supplierId: suppliers[2].id,
    },
    {
      name: "Vanilla Powder",
      category: "POWDER",
      unit: "piece",
      warningLevel: 5,
      reorderQuantity: 15,
      supplierId: suppliers[2].id,
    },

    // FLAVOUR
    {
      name: "Strawberry Puree 2.1kg",
      category: "FLAVOUR",
      unit: "tubs",
      warningLevel: 10,
      reorderQuantity: 30,
      supplierId: suppliers[2].id,
    },
    {
      name: "Sugar Syrup",
      category: "FLAVOUR",
      unit: "piece",
      warningLevel: 2,
      reorderQuantity: 10,
      supplierId: suppliers[2].id,
    },

    // KITCHEN
    {
      name: "Bread",
      category: "KITCHEN",
      unit: "piece",
      warningLevel: 0,
      reorderQuantity: 10,
      supplierId: suppliers[3].id,
    },
    {
      name: "Bun",
      category: "KITCHEN",
      unit: "piece",
      warningLevel: 0,
      reorderQuantity: 10,
      supplierId: suppliers[3].id,
    },

    // BARANG_BASAH
    {
      name: "Lettuce",
      category: "BARANG_BASAH",
      unit: "piece",
      warningLevel: 0,
      reorderQuantity: 10,
      supplierId: suppliers[3].id,
    },
    {
      name: "Halia",
      category: "BARANG_BASAH",
      unit: "piece",
      warningLevel: 0,
      reorderQuantity: 5,
      supplierId: suppliers[3].id,
    },

    // CLEANING
    {
      name: "Sabun Lantai",
      category: "CLEANING",
      unit: "piece",
      warningLevel: 1,
      reorderQuantity: 5,
      supplierId: suppliers[1].id,
    },
  ];

  const items = await Promise.all(
    itemsData.map((item) =>
      prisma.inventoryItem.create({
        data: {
          id: generateSlug(item.name),
          ...item,
          currentStock: 0,
        },
      })
    )
  );

  console.log(`✓ Created ${items.length} inventory items`);

  // Create some sample stock takes
  const now = new Date();
  await Promise.all(
    items.slice(0, 5).map((item) =>
      prisma.stockTake.create({
        data: {
          itemId: item.id,
          quantity: Math.floor(Math.random() * 100),
          recordedBy: "Mimie",
          recordedAt: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
          notes: "Daily stock check",
        },
      })
    )
  );

  console.log("✓ Created sample stock takes");

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
