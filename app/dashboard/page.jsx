// app/dashboard/page.jsx
import { getSession } from "../lib/session";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  console.log(`✅ 세션 상태: ${session}`);

  if (!session) {
    return (
      <Link href="/login">
        <p>로그인이 필요합니다.</p>;
      </Link>
    );
  } else {
    return (
      <div>
        <h1>환영합니다, {session.email}님!</h1>
      </div>
    );
  }
}
