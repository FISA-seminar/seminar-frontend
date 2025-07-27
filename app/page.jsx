"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    let valid = true;

    if (!email.includes("@")) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
      valid = false;
    } else {
      setEmailError("");
    }

    const passwordRegex = /^\d{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 숫자만 포함하며 최소 8자리여야 합니다.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token, serviceUrl } = await res.json();
        localStorage.setItem("token", token); 
        window.location.href = serviceUrl;

      } else {
        const data = await res.json();
        setServerError(data.error || "로그인 실패");
      }
    } catch (err) {
      setServerError("서버와 통신 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          로그인
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            로그인
          </button>
          {serverError && (
            <p className="text-red-500 text-sm text-center mt-2">{serverError}</p>
          )}

        </form>
      </div>
    </div>
  );
}