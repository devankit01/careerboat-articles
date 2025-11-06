import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { status: "Published" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          tags: true,
          title: true,
          header: true,
          thumbnail: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where: { status: "Published" } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "articles fetched successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    console.error("error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "internal Server Error",
        error: error,
      },
      { status: 500 }
    );
  }
}
