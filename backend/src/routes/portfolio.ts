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
    console.log(portfolios); 
  } catch (err) {
    console.error('一覧取得エラー:', err);
    res.status(500).json({ message: "一覧取得に失敗しました", error: String(err) });
  }
});

// 実績追加（画像付き）
router.post("/", upload.single('image'), async (req, res) => {
  console.log('アップロードされたファイル情報:', req.file);
  const { title, description, userId , url , urlType} = req.body;
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
      data: { title, description, userId: userIdInt, url , urlType ,}
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

// 指定実績を削除
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "IDは数値で指定してください" });
  }

  try {
    // 関連画像を削除（onDelete: Cascadeにしてなければ必要）
    await prisma.image.deleteMany({
      where: { portfolioId: id },
    });

    // 実績削除
    await prisma.portfolio.delete({
      where: { id },
    });

    res.status(200).json({ message: `ID ${id} の実績を削除しました` });
  } catch (err) {
    console.error("削除エラー:", err);
    res.status(500).json({ message: "削除に失敗しました", error: String(err) });
  }
});

export default router;
