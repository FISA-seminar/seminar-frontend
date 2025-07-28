"use client";

import { useEffect, useState } from "react";

export default function ServicePage() {
  const [message, setMessage] = useState("서비스 확인 중...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    //토큰 없을 시 문구 
    if (!token) {
      
      alert("로그인이 필요합니다.");
      window.location.href = "/";
      return;
    }
    //자동 로그아웃 
     try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expireAt = payload.exp * 1000;
      const now = Date.now();

      if (expireAt <= now) {
        alert("토큰이 이미 만료되었습니다.");
        handleLogout();
      } else {
        const remainingTime = expireAt - now;
        console.log("자동 로그아웃까지 남은 시간(ms):", remainingTime);
        setTimeout(() => {
          alert("세션이 만료되어 로그아웃됩니다.");
          handleLogout();
        }, remainingTime);
      }
    } catch (e) {
      console.error("JWT 디코딩 실패:", e);
      handleLogout();
    }
    //인증 요청
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
  //로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  let userEmail = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.sub; 
    }
  } catch (e) {
    userEmail = "";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg font-semibold">{message}</p>

       {isAuthenticated && (
        <>
          <p className="text-sm text-gray-700">
            로그인된 사용자: <strong>{userEmail}</strong>
          </p>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
