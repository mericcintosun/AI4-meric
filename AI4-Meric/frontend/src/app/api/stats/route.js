import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Yetkilendirme başarısız" },
      { status: 401 }
    );
  }

  try {
    const totalConversations = await prisma.conversation.count({
      where: { userId: session.user.id },
    });


    return NextResponse.json({ totalConversations });
  } catch (error) {
    console.error("İstatistikler alınırken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
