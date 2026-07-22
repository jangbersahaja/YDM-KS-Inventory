import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const itemId = searchParams.get("itemId");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where = itemId ? { itemId } : {};

    const stockTakes = await prisma.stockTake.findMany({
      where,
      include: { item: true },
      orderBy: { recordedAt: "desc" },
      take: limit,
    });

    return NextResponse.json(stockTakes);
  } catch (error) {
    console.error("Error fetching stock takes:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock takes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, quantity, notes, recordedBy } = body;

    // Record the stock take
    const stockTake = await prisma.stockTake.create({
      data: {
        itemId,
        quantity,
        notes,
        recordedBy,
      },
      include: { item: true },
    });

    // Update current stock
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { currentStock: quantity, lastUpdated: new Date() },
    });

    return NextResponse.json(stockTake, { status: 201 });
  } catch (error) {
    console.error("Error creating stock take:", error);
    return NextResponse.json(
      { error: "Failed to create stock take" },
      { status: 500 }
    );
  }
}
