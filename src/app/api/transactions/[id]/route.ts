import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    // 1. Check login
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    // 2. Get transaction ID from URL
    const { id } = await params;

    // 3. Verify that this transaction belongs to the logged-in user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 },
      );
    }

    // 4. Delete the transaction
    await prisma.transaction.delete({
      where: {
        id: transaction.id,
      },
    });

    return NextResponse.json(
      { message: "Transaction deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete transaction error:", error);

    return NextResponse.json(
      { message: "Unable to delete transaction." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    // 1. Check whether the user is logged in
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    // 2. Get transaction ID
    const { id } = await params;

    // 3. Check transaction ownership
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 },
      );
    }

    // 4. Read updated values
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const amount = Number(body.amount);

    const type = body.type;

    const category =
      typeof body.category === "string" ? body.category.trim() : "";

    const date = new Date(body.date);

    // 5. Validate values
    if (!title || !category || !body.date) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Enter a valid amount." },
        { status: 400 },
      );
    }

    if (type !== "INCOME" && type !== "EXPENSE") {
      return NextResponse.json(
        { message: "Invalid transaction type." },
        { status: 400 },
      );
    }

    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        { message: "Enter a valid date." },
        { status: 400 },
      );
    }

    // 6. Update transaction in PostgreSQL
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        title,
        amount,
        type,
        category,
        date,
      },
    });

    return NextResponse.json(
      {
        message: "Transaction updated successfully.",
        transaction: {
          ...updatedTransaction,
          amount: updatedTransaction.amount.toString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update transaction error:", error);

    return NextResponse.json(
      { message: "Unable to update transaction." },
      { status: 500 },
    );
  }
}
