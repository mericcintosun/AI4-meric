import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const session = await getServerSession(request, authOptions);

    if (!session) {
      return NextResponse.redirect("/login"); // Oturumu olmayan kullanıcıları giriş sayfasına yönlendir
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Kullanıcı verileri alınırken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// Kullanıcı kaydı (Register) için POST isteği
export async function POST(request) {
  try {
    const { email, name, password } = await request.json();

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi ile kayıtlı bir kullanıcı zaten mevcut." },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Kayıt başarılı! Giriş yapabilirsiniz.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kullanıcı kaydı sırasında hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
