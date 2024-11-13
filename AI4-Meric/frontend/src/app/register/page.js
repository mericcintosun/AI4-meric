"use client";

import { useState } from "react";
import NextButton from "@/components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          setMessage(`Error: ${errorData.message}`);
        } catch {
          setMessage(`Error: ${errorText}`);
        }
      } else {
        setMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
        setEmail("");
        setName("");
        setPassword("");
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      setMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <form
        onSubmit={handleRegister}
        className="p-8 max-w-md w-full bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-700"
      >
        <h1 className="text-3xl font-extrabold text-gray-100 mb-6 text-center tracking-wide">
          Kayıt Ol
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-3 w-full mb-4 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-3 w-full mb-4 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-3 w-full mb-6 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          required
        />
        <NextButton
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold tracking-wide transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
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
