"use client";

import { useActionState } from "react";
import { login } from "./action";

export default function LoginPage() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          로그인
        </h1>
        <form action={loginAction} className="space-y-4">
          <div>
            <input
              name="email"
              placeholder="이메일"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )}
          </div>
          {/* 입력폼 유효성 */}
          <div>
            <input
              name="password"
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {state?.errors?.password && (
              <p className="text-red-500">{state.errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
