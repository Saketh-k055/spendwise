import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check whether the user is logged in
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const amount = Number(body.amount);

    const type = body.type;

    const category =
      typeof body.category === "string" ? body.category.trim() : "";

    const date = new Date(body.date);

    // Validate required fields
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

    // Save transaction for the logged-in user
    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        category,
        date,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Transaction added successfully.",
        transaction: {
          ...transaction,
          amount: transaction.amount.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Transaction creation error:", error);

    return NextResponse.json(
      { message: "Unable to add transaction." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Check the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    // Fetch only this user's transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Convert Prisma Decimal amounts into strings
    const formattedTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Fetching transactions error:", error);

    return NextResponse.json(
      { message: "Unable to fetch transactions." },
      { status: 500 },
    );
  }
}
