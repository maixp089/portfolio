// portfolio（実績に画像を追加するときに使う）
import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// 画像新規追加（POST）
router.post("/", async (req, res) => {
  const { url, portfolioId } = req.body;

  if (!url || !portfolioId) {
    return res.status(400).json({ message: "urlとportfolioIdは必須です" });
  }

  try {
    const newImage = await prisma.image.create({
      data: { url, portfolioId }
    });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: "登録に失敗しました", error: err });
  }
});

export default router;
