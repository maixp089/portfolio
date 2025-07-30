import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({ dest: 'uploads/' }); // 共通でOK


// Skill一覧GET（画像付きで返す）
router.get("/", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { id: "asc" } });
    res.json(skills);
  } catch (err) {
    console.error("Skill一覧取得エラー:", err);
    res.status(500).json({ message: "Skill一覧取得に失敗しました", error: String(err) });
  }
});

// Skill一件GET
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "IDは数値で指定してください" });
  }

  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      return res.status(404).json({ message: `ID ${id} のプロジェクトが見つかりませんでした` });
    }

    res.json(skill);
  } catch (err) {
    console.error("取得エラー:", err);
    res.status(500).json({ message: "取得に失敗しました", error: String(err) });
  }
});

// Skill追加（画像付き）
router.post("/", upload.single('logo'), async (req, res) => {
  try {
    const { name, userId, description} = req.body;
    const logoFile = req.file;
    if (!name || !userId) {
      return res.status(400).json({ message: "nameとuserIdは必須です" });
    }
    const userIdInt = Number(userId);

    // Skillレコードを作成
    const newSkill = await prisma.skill.create({
      data: {
        name,
        userId: userIdInt,
        logoUrl: logoFile ? logoFile.path : null, // ファイルがある場合のみ保存
        description,
      },
    });
    res.status(201).json(newSkill);
  } catch (err) {
    console.error("Skill登録エラー:", err);
    res.status(500).json({ message: "Skill登録に失敗しました", error: String(err) });
  }
});

// Skillを更新
router.put("/:id", upload.single('logo'), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "IDは数値で指定してください" });
  }

  const { name, description } = req.body;
  const logoFile = req.file;
  
  try {
    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name,
        logoUrl: logoFile ? logoFile.path : null, // ファイルがある場合のみ保存
        description,
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "更新に失敗しました", error: String(err) });
  }
});


export default router;
