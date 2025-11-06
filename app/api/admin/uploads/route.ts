import { uploadToS3 } from "@/lib/s3";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "file is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToS3(buffer, file.name);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("upload error", error);
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
