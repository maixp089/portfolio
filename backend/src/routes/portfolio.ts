import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
const router = express.Router();
const prisma = new PrismaClient();

// multerセット
const upload = multer({ dest: 'uploads/' }); // とりあえずローカルに保存（backend/uploads）

// GET/プロジェクト一覧
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

// プロジェクト追加（画像付き）
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

// 指定プロジェクトを削除
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "IDは数値で指定してください" });
  }

  try {
    // 関連画像を削除
    await prisma.image.deleteMany({
      where: { portfolioId: id },
    });

    // プロジェクト削除
    await prisma.portfolio.delete({
      where: { id },
    });

    res.status(200).json({ message: `ID ${id} の実績を削除しました` });
  } catch (err) {
    console.error("削除エラー:", err);
    res.status(500).json({ message: "削除に失敗しました", error: String(err) });
  }
});
// プロジェクトを更新
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, url, urlType } = req.body;

  try {
    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        description,
        url,
        urlType,
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "更新に失敗しました", error: String(err) });
  }
});

export default router;
