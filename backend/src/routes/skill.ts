import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// スキル一覧取得（GET）
router.get("/", async (req, res) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
});

// スキル新規登録（POST）
router.post("/", async (req, res) => {
  const { name, logoUrl, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: "nameとuserIdは必須です" });
  }

  try {
    const newSkill = await prisma.skill.create({
      data: { name, logoUrl, userId },
    });
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(500).json({ message: "登録に失敗しました", error: err });
  }
});

export default router;
