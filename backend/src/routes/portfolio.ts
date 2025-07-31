import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' }); // シンプルに設定

// 一覧取得
router.get('/', async (_req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(portfolios);
  } catch (err) {
    console.error('一覧取得エラー:', err);
    res.status(500).json({ message: '一覧取得に失敗しました', error: String(err) });
  }
});

// 一件取得
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      return res.status(404).json({ message: `ID ${id} のポートフォリオが見つかりませんでした` });
    }
    res.json(portfolio);
  } catch (err) {
    console.error('取得エラー:', err);
    res.status(500).json({ message: '取得に失敗しました', error: String(err) });
  }
});

// 追加
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, userId, url, urlType } = req.body;
  const imageFile = req.file;

  if (!title || !userId) {
    return res.status(400).json({ message: 'titleとuserIdは必須です' });
  }

  if (!imageFile) {
    return res.status(400).json({ message: '画像ファイルが必要です' });
  }

  try {
    const userIdInt = Number(userId);
    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        userId: userIdInt,
        url,
        urlType,
        imageUrl: imageFile.path,
      },
    });
    res.status(201).json(newPortfolio);
  } catch (err) {
    console.error('登録エラー:', err);
    res.status(500).json({ message: '登録に失敗しました', error: String(err) });
  }
});

// 削除
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      return res.status(404).json({ message: `ID ${id} のポートフォリオが見つかりませんでした` });
    }

    await prisma.portfolio.delete({ where: { id } });
    res.status(200).json({ message: `ID ${id} のポートフォリオを削除しました` });
  } catch (err) {
    console.error('削除エラー:', err);
    res.status(500).json({ message: '削除に失敗しました', error: String(err) });
  }
});

// 更新
router.put('/:id', upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  const { title, description, url, urlType } = req.body;
  const imageFile = req.file;

  const updateData: {
    title?: string;
    description?: string;
    url?: string;
    urlType?: string;
    imageUrl?: string;
  } = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (url) updateData.url = url;
  if (urlType) updateData.urlType = urlType;
  if (imageFile) updateData.imageUrl = imageFile.path;

  try {
    const updated = await prisma.portfolio.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (err) {
    console.error('更新エラー:', err);
    res.status(500).json({
      message: '更新に失敗しました',
      error: err instanceof Error ? err.message : '不明なエラーです',
    });
  }
});

export default router;
