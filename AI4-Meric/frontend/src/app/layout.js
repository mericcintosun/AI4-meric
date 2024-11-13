"use client";

import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import NextButton from "@/components/Button";
import dynamic from "next/dynamic"; // Dinamik yükleme için import

// ThemeToggle'ı dinamik olarak yüklüyoruz, SSR devre dışı bırakıldı
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}

function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b flex justify-around items-center p-4 bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-bold hover:text-indigo-400 transition-colors duration-200">
        <Link href="/">SpeakBuddy</Link>
      </h1>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-sm sm:text-base">
              Hoş geldiniz,{" "}
              <span className="font-semibold">{session.user.name}</span>
            </span>
            <Link href="/dashboard">
              <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                Dashboard
              </NextButton>
            </Link>
            <NextButton
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Çıkış Yap
            </NextButton>
          </>
        ) : (
          <>
            <Link href="/login">
              <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                Giriş Yap
              </NextButton>
            </Link>
            <Link href="/register">
              <NextButton className="text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                Kayıt Ol
              </NextButton>
            </Link>
          </>
        )}
      </div>
      {/* Dinamik olarak yüklenen ThemeToggle */}
      <ThemeToggle />
    </header>
  );
}
