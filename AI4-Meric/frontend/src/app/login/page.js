"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NextButton from "@/components/Button";

export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.ok) {
      setMessage("Giriş başarılı!");
      router.push("/dashboard");
    } else {
      setMessage("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <form
        onSubmit={handleLogin}
        className="p-8 max-w-md w-full bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-700"
      >
        <h1 className="text-3xl font-extrabold text-gray-100 mb-6 text-center tracking-wide">
          Giriş Yap
        </h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-600 bg-gray-800 p-3 w-full mb-4 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-600 bg-gray-800 p-3 w-full mb-6 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          required
        />
        <NextButton
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold tracking-wide transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50"
        >
          Login
        </NextButton>
        {message && (
          <p className="mt-6 text-red-500 dark:text-red-400 text-center font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
