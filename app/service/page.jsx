"use client";

import { useEffect, useState } from "react";

export default function ServicePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/service/test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.text())
      .then((text) => setMessage(text))
      .catch((err) => {
        console.error(err);
        setMessage("오류 발생");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-center">
      {message || "서비스 확인 중..."}
    </div>
  );
}
