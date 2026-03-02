import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
      const baseurl = process.env.NEXT_PUBLIC_NODE_URL || 'http://localhost:5000';
    const response = await fetch(
      `${baseurl}/api/feedback/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}