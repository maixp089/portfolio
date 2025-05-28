import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// お問い合わせ一覧取得（GET：管理者ページ)
router.get("/", async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);
});

// お問い合わせ新規登録（POST：ホームページ）
router.post("/", async (req, res) => {
  const { email, message, userId } = req.body;

  if (!email || !message || !userId) {
    return res.status(400).json({ message: "email, message, userIdは必須です" });
  }

  try {
    const newContact = await prisma.contact.create({
      data: { email, message, userId }
    });
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: "登録に失敗しました", error: err });
  }
});

export default router;
