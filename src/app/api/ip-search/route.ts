import { NextRequest, NextResponse } from "next/server";
import { searchIP } from "@/lib/review-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brandName = body.brandName as string;

    if (!brandName || brandName.trim().length === 0) {
      return NextResponse.json(
        { error: "请输入品牌名称" },
        { status: 400 }
      );
    }

    const result = searchIP(brandName.trim());
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("IP search error:", error);
    return NextResponse.json(
      { error: "检索失败，请重试" },
      { status: 500 }
    );
  }
}