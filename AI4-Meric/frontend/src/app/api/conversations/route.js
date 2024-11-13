import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Yetkilendirme başarısız" },
      { status: 401 }
    );
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Konuşmalar alınırken hata:", error);
    return NextResponse.json({ error: "Sunucu Hatası" }, { status: 500 });
  }
}
