import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// 実績一覧取得（GET）
router.get("/", async (req, res) => {
  const portfolios = await prisma.portfolio.findMany({
    include: { images: true } // 画像もまとめて
  });
  res.json(portfolios);
});

// 実績追加（Post）
router.post("/", async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ message: "titleとuserIdは必須です" });
  }

  try {
    const newPortfolio = await prisma.portfolio.create({
      data: { title, description, userId }
    });
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(500).json({ message: "登録に失敗しました", error: err });
  }
});

export default router;

