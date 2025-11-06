import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await context.params;

    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const header = formData.get("header") as string | null;
    const contentRaw = formData.get("content") as string | null;
    const slugInput = formData.get("slug") as string | null;
    const tags = formData.get("tags") as string | null;
    const statusInput = formData.get("status") as string | null;

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    if (existingArticle.adminId !== adminId) {
      return NextResponse.json(
        { success: false, message: "Not allowed" },
        { status: 403 }
      );
    }

    // Handle thumbnail
    let thumbnailUrl = existingArticle.thumbnail;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      thumbnailUrl = await uploadToS3(buffer, thumbnailFile.name);
    }

    // Handle tags
    let tagsString = existingArticle.tags;
    if (tags !== null) {
      tagsString = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 5)
        .join(",");
    }

    // Handle content
    const contentString: string | undefined =
      contentRaw !== null ? String(contentRaw) : undefined;

    // Handle slug
    let newSlug: string | undefined = undefined;
    if (slugInput !== null) {
      const baseSlug = (slugInput || existingArticle.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

      let slug = baseSlug || existingArticle.slug;
      if (slug !== existingArticle.slug) {
        let attempt = 1;
        while (
          await prisma.article.findFirst({
            where: { slug, NOT: { id: existingArticle.id } },
          })
        ) {
          slug = `${baseSlug}-${attempt++}`.slice(0, 90);
        }
      }
      newSlug = slug;
    }

    // Prepare update data
    const updateData: any = {
      ...(title && { title }),
      ...(header !== null && { header }),
      ...(contentString !== undefined && { content: contentString }),
      ...(newSlug !== undefined && { slug: newSlug }),
      thumbnail: thumbnailUrl,
      tags: tagsString,
      ...(statusInput !== null && {
        status: statusInput === "Published" ? "Published" : "Draft",
      }),
    };

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await context.params;

    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    if (article.adminId !== adminId) {
      return NextResponse.json(
        { success: false, message: "Not allowed" },
        { status: 403 }
      );
    }

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
