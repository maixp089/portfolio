import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
const router = express.Router();
const prisma = new PrismaClient();

// multerセット
const upload = multer({ dest: 'uploads/' }); // とりあえずローカルに保存（backend/uploads）

// GET実績一覧
router.get("/", async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: { images: true },
      orderBy: { id: 'desc' },
    });
    res.json(portfolios);
  } catch (err) {
    console.error('一覧取得エラー:', err);
    res.status(500).json({ message: "一覧取得に失敗しました", error: String(err) });
  }
});

// 実績追加（画像付き）
router.post("/", upload.single('image'), async (req, res) => {
  console.log('アップロードされたファイル情報:', req.file);
  const { title, description, userId } = req.body;
  const imageFile = req.file;

  const userIdInt = Number(userId); // フロントから送られてくるIDが文字列になってしまっているから

  if (!title || !userId) {
    return res.status(400).json({ message: "titleとuserIdは必須です" });
  }
  if (!imageFile) {
    return res.status(400).json({ message: "画像ファイルが必要です" });
  }

  try {
    // 1. Portfolio作成
    const newPortfolio = await prisma.portfolio.create({
      data: { title, description, userId: userIdInt}
    });

    // 2. Imageレコードも作成
    await prisma.image.create({
      data: {
        url: imageFile.path, // とりあえずローカルに
        portfolioId: newPortfolio.id
      }
    });

    res.status(201).json({ ...newPortfolio, imageUrl: imageFile.path });
  } catch (err) {
    console.error('登録エラー:', err);
    res.status(500).json({ message: "登録に失敗しました", error: err });
  }
});

export default router;
