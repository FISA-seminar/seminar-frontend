import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// 1. 서버 메모리 기반 세션 저장소 (실제 서비스에선 Redis/DB 사용)
const sessionStore = new Map(); // sessionId -> { email, password, expiresAt }

const SESSION_TTL = 20; // 7일 (초 단위)

/**
 * 세션 생성 (세션 ID 생성 + 서버 저장 + 쿠키 저장)
 */
export async function createSession(email, password) {
  const sessionId = await randomUUID();
  const expiresAt = Date.now() + SESSION_TTL * 1000;

  // 서버에 세션 저장
  sessionStore.set(sessionId, {
    email,
    password,
    expiresAt,
  });

  // 쿠키에 세션 ID 저장
  const cookieStore = await cookies(); // 먼저 변수에 할당
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_TTL,
    path: "/",
    sameSite: "lax",
  });

  console.log("✅ 세션 생성:", sessionId);
}

/**
 * 세션 조회 (쿠키에서 session_id 가져와서 서버 저장소에서 조회)
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) return null;

  const session = sessionStore.get(sessionId);

  if (!session || Date.now() > session.expiresAt) {
    sessionStore.delete(sessionId);
    return null;
  }

  return session;
}

/**
 * 세션 제거 (로그아웃 등)
 */
export async function deleteSession() {
  const sessionId = cookies().get("session_id")?.value;
  if (!sessionId) return;

  sessionStore.delete(sessionId);
  cookies().delete("session_id");

  console.log("❌ 세션 제거:", sessionId);
}
