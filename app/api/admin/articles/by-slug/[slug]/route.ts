import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const article = await prisma.article.findFirst({
      where: { slug, adminId },
      select: {
        id: true,
        slug: true,
        title: true,
        header: true,
        content: true,
        thumbnail: true,
        tags: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("error fetching admin article by slug:", error);
    return NextResponse.json(
      { success: false, message: "internal server error", error },
      { status: 500 }
    );
  }
}
