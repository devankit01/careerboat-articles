import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "email and password required to login",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "admin not found, try different email",
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "invalid credentials, try again",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "admin logged in successfully",
      token,
    });

    response.cookies.set({
      name: "token",
      value: token,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("error in admin login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "internal server error",
        error: error,
      },
      { status: 500 }
    );
  }
}
