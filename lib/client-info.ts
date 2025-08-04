// 클라이언트 정보 타입 정의
export interface ClientInfo {
  ip_address: string | null
  referrer_source: string | null
}

// 클라이언트 정보 가져오기
export async function getClientInfo(): Promise<ClientInfo> {
  try {
    // URL에서 x 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search)
    const referrerSource = urlParams.get("x")

    // API를 통해 IP 주소 가져오기
    const response = await fetch(`/api/get-client-info?x=${encodeURIComponent(referrerSource || "")}`)

    if (!response.ok) {
      throw new Error("Failed to fetch client info")
    }

    const data = await response.json()

    return {
      ip_address: data.ip_address || null,
      referrer_source: data.referrer_source || referrerSource || null,
    }
  } catch (error) {
    console.error("Error getting client info:", error)
    return {
      ip_address: null,
      referrer_source: null,
    }
  }
}
