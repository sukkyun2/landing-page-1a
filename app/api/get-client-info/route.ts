import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 클라이언트 IP 주소 가져오기
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    let ip = forwarded?.split(",")[0] || realIp || request.ip || null

    // IP 주소가 "unknown"이거나 유효하지 않으면 null로 설정
    if (ip === "unknown" || ip === "undefined") {
      ip = null
    }

    // URL에서 쿼리 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams
    const referrerSource = searchParams.get("x") || null

    return NextResponse.json({
      ip_address: ip,
      referrer_source: referrerSource,
    })
  } catch (error) {
    console.error("Error getting client info:", error)
    return NextResponse.json({ error: "Failed to get client info" }, { status: 500 })
  }
}
