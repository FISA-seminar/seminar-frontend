"use server"; // 서버에서만 실행되도록

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "../lib/session";

// 입력값 유효성 검증 코드 설정(zod 라이브러리 활용)
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "유효한 이메일 주소를 입력하세요." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "비밀번호는 숫자만 포함하며 최소 8자리여야 합니다." })
    .trim(),
});

// 테스트에 사용할 로그인용 임시 계정(인메모리 형태로만 동작)
// const testUser = {
//   email: "test@example.com",
//   password: "12345678",
// };

// 사용자가 submit 버튼을 클릭했을 때 동작시킬 함수(로그인 로직)
export async function login(prevState, formData) {
  // 1. 사용자가 입력한 값이 유효한지 확인(주로 회원가입)
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    // 입력값이 유효하지 않을 경우, 에러 메시지를 반환
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data; // 입력값이 유효할 경우 email, password 추출
  console.log(email, password);

  // 2. 실제 인증을 수행하는 백엔드 서버로 전송(했다고 가정하고 skip)
  // 백엔드 서버 검증 로직을 간단하게 코드로 구현 예정

  // TODO: 서버에서 연결 성공 시 진행
  const res = await fetch("http://192.168.0.249/auth", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const { serviceUrl } = await res.json();
    router.push(serviceUrl);
  } else {
    alert("로그인 실패");
  }

  // if (email !== testUser.email || password !== testUser.password) {
  //   return {
  //     errors: {
  //       email: ["Invalid email or password"],
  //     },
  //   };
  // }

  // // 3. 인증이 성공했을 경우, 자체적으로 세션 정보(JWT)를 생성 후 쿠키에 저장
  // // (실제로는 백엔드 서버를 통해 응답받은 토큰을 적절한 곳에 저장하는 처리만 수행하면 됨)
  // await createSession(testUser.email, testUser.password);

  // const session = await getSession();

  // // 4. 사용자를 적절한 페이지로 이동시킴(리다이렉트)
  // redirect("/dashboard");
}

// // 로그아웃 처리 함수
// export async function logout() {
//   // 1. 쿠키에서 세션 정보 제거(JWT 토큰 제거)
//   await deleteSession();
//   // 2. 로그인 페이지로 이동(리다이렉트)
//   redirect("/login");
// }
