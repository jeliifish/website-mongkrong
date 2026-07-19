import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url, { redirect: "manual" });
    const location = res.headers.get("location") || url;
    return NextResponse.json({ success: true, resolvedUrl: location });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
