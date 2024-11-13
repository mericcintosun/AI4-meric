
import Link from "next/link";
import NextButton from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center hover:text-indigo-500 transition-colors duration-200">
        SpeakBuddy'ye Hoş Geldin! 
      </h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/login">
          <NextButton className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
            Giriş Yap
          </NextButton>
        </Link>
        <Link href="/register">
          <NextButton className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
            Kayıt Ol
          </NextButton>
        </Link>
      </div>
    </div>
  );
}
