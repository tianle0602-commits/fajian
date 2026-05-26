import { NextRequest, NextResponse } from "next/server";
import { analyzeContract, analyzeLaborDoc } from "@/lib/review-engine";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "contract";

    if (!file) {
      return NextResponse.json({ error: "未收到文件" }, { status: 400 });
    }

    const text = await file.text();

    let result;
    if (type === "labor") {
      result = analyzeLaborDoc(file.name, text);
    } else {
      result = analyzeContract(file.name, text);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "文件审查失败，请重试" },
      { status: 500 }
    );
  }
}