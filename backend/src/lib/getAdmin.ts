import { PrismaClient } from "@prisma/client"; // 既存のPrismaクライアントをimportしてね

// ここで PrismaClient を new してインスタンス化
const prisma = new PrismaClient();

export async function getAdmin() {
  const email = process.env.ADMIN_EMAIL!;
  const name = process.env.ADMIN_NAME ?? "Admin";
  const firebaseUid = process.env.ADMIN_FIREBASE_UID ?? "admin-seed-uid";

  return prisma.user.upsert({
    where: { email }, // emailが@uniqueになっている前提
    update: {},
    create: { email, name, firebaseUid }, // firebaseUidを必ず入れる
  });
}
