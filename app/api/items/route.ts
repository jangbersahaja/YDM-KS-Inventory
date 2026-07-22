import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { supplier: true },
      orderBy: { category: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, unit, supplierId, warningLevel, reorderQuantity, description } = body;

    const id = generateSlug(name);

    const item = await prisma.inventoryItem.create({
      data: {
        id,
        name,
        category,
        unit,
        description,
        supplierId: supplierId || null,
        warningLevel: warningLevel || 10,
        reorderQuantity: reorderQuantity || 50,
      },
      include: { supplier: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
