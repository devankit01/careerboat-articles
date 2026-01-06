import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    const article = await prisma.article.findFirst({
      where: { slug, status: "Published" },
      select: {
        id: true,
        slug: true,
        title: true,
        tags: true,
        thumbnail: true,
        header: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        admin: { select: { name: true } },
        media: { select: { url: true, type: true, order: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blogs fetched",
      article,
    });
  } catch (error) {
    console.error("error fetching Blogs by slug:", error);
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
