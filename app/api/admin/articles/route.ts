import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export const config = { api: { bodyParser: false } };

export async function GET(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { adminId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          header: true,
          tags: true,
          thumbnail: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { media: true } },
        },
      }),
      prisma.article.count({ where: { adminId } }),
    ]);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    console.error("error listing admin articles", error);
    return NextResponse.json(
      { success: false, message: "internal server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const header = (formData.get("header") as string) || undefined;
    const slugInput = (formData.get("slug") as string) || undefined;
    const contentRaw = formData.get("content") as string;
    const tags = formData.get("tags") as string | null;
    const statusInput = (formData.get("status") as string) || "Draft";

    if (!title || !contentRaw) {
      return NextResponse.json(
        { success: false, message: "title and content required" },
        { status: 400 }
      );
    }

    const contentString: string = String(contentRaw || "");

    const baseSlug = (slugInput || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

    let slug = baseSlug || `post-${Date.now()}`;
    let attempt = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt++}`.slice(0, 90);
    }

    let thumbnailUrl: string | undefined;

    const thumbnailFile = formData.get("thumbnail") as File | null;
    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailUrl = await uploadToS3(buffer, thumbnailFile.name);
    }

    const tagsString = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 5)
          .join(",")
      : undefined;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        header,
        content: contentString,
        thumbnail: thumbnailUrl,
        tags: tagsString,
        status: statusInput === "Published" ? "Published" : "Draft",
        adminId,
      },
      include: { media: true },
    });

    return NextResponse.json({
      success: true,
      message: "article created",
      data: article,
    });
  } catch (error) {
    console.error("error creating article", error);
    return NextResponse.json(
      {
        success: false,
        message: "internal server error",
        error,
      },
      { status: 500 }
    );
  }
}
