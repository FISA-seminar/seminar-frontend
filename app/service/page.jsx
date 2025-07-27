"use client";

import { useEffect, useState } from "react";

export default function ServicePage() {
  const [message, setMessage] = useState("서비스 확인 중...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      
      alert("로그인이 필요합니다.");
      window.location.href = "/";
      return;
    }

    fetch("/service/test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("토큰 유효성 실패");
        return res.text();
      })
      .then((text) => {
        setIsAuthenticated(true);
        setMessage(text); 
      })
      .catch((err) => {
        console.error("인증 실패:", err);
        setIsAuthenticated(false);
        
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg font-semibold">{message}</p>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          로그아웃
        </button>
      )}
    </div>
  );
}
