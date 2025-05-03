import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function ensureUserInDatabase() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) return;

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user.id, // Kinde user ID
        email: user.email,
        firstName: user.given_name ?? "Unknown",
        lastName: user.family_name ?? "",
        profileImage: user.picture ?? null,
      },
    });
  }

  //To change depending on running instance of the application, either local or deployed
  return NextResponse.redirect('https://vista-woad.vercel.app');
}
