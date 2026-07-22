import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const itemId = searchParams.get("itemId");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where = itemId ? { itemId } : {};

    const restocks = await prisma.restock.findMany({
      where,
      include: { item: true },
      orderBy: { restockDate: "desc" },
      take: limit,
    });

    return NextResponse.json(restocks);
  } catch (error) {
    console.error("Error fetching restocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch restocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, quantity, restockDate, notes, recordedBy } = body;

    // Record the restock
    const restock = await prisma.restock.create({
      data: {
        itemId,
        quantity,
        restockDate: new Date(restockDate),
        notes,
        recordedBy,
      },
      include: { item: true },
    });

    // Update current stock
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (item) {
      await prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: item.currentStock + quantity,
          lastUpdated: new Date(),
        },
      });
    }

    return NextResponse.json(restock, { status: 201 });
  } catch (error) {
    console.error("Error creating restock:", error);
    return NextResponse.json(
      { error: "Failed to create restock" },
      { status: 500 }
    );
  }
}
