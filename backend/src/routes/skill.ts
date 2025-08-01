import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3'; // S3でファイルを削除するためのクラス

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

console.log('バケット名:', process.env.AWS_S3_BUCKET_NAME);
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const filename = `skill/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

// Skill一覧GET（画像付きで返す）
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { id: 'asc' } });
    res.json(skills);
  } catch (err) {
    console.error('Skill一覧取得エラー:', err);
    res
      .status(500)
      .json({ message: 'Skill一覧取得に失敗しました', error: String(err) });
  }
});

// Skill一件GET
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      return res
        .status(404)
        .json({ message: `ID ${id} のプロジェクトが見つかりませんでした` });
    }

    res.json(skill);
  } catch (err) {
    console.error('取得エラー:', err);
    res.status(500).json({ message: '取得に失敗しました', error: String(err) });
  }
});

// Skill追加（S3に画像を送る）
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, userId, description } = req.body;
    const logoFile = req.file as Express.MulterS3.File;
    if (!name || !userId) {
      return res.status(400).json({ message: 'nameとuserIdは必須です' });
    }
    const userIdInt = Number(userId);

    // Skillレコードを作成
    const newSkill = await prisma.skill.create({
      data: {
        name,
        userId: userIdInt,
        logoUrl: logoFile?.location ?? null, // ← location を保存
        description,
      },
    });
    res.status(201).json(newSkill);
  } catch (err) {
    console.error('Skill登録エラー:', err);
    res
      .status(500)
      .json({ message: 'Skill登録に失敗しました', error: String(err) });
  }
});

// 指定Skillを削除
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  try {
    // 該当スキルを取得
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      return res
        .status(404)
        .json({ message: `ID ${id} のスキルが見つかりませんでした` });
    }
    // S3のファイル名を抜き出し（keyだけにする！）
    if (skill.logoUrl) {
      // logoUrl例: https://xxx.s3.ap-northeast-1.amazonaws.com/skill/xxx.png
      // key: skill/xxx.png
      const s3Key = skill.logoUrl.split('.amazonaws.com/')[1];
      if (s3Key) {
        const delCmd = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: s3Key,
        });
        await s3.send(delCmd);
      }
    }
    // Skill削除
    await prisma.skill.delete({
      where: { id },
    });

    res.status(200).json({ message: `ID ${id} の実績を削除しました` });
  } catch (err) {
    console.error('削除エラー:', err);
    res.status(500).json({ message: '削除に失敗しました', error: String(err) });
  }
});

// Skillを更新
router.put('/:id', upload.single('logo'), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'IDは数値で指定してください' });
  }

  const { name, description } = req.body;
  // S3で画像保存する
  const logoFile = req.file as Express.MulterS3.File;

  // 更新用オブジェクト
  const updateData: {
    name?: string;
    description?: string;
    logoUrl?: string;
  } = {};

  if (name) updateData.name = name;
  if (description) updateData.description = description;

  try {
     // 1. 既存のSkill情報を取得
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      return res.status(404).json({ message: `ID ${id} のスキルが見つかりませんでした` });
    }
    // 2. 画像アップロードがあれば
    if (logoFile) {
      // 2-1. 既存画像があればS3から削除
      if (skill.logoUrl) {
        const s3Key = skill.logoUrl.split('.amazonaws.com/')[1];
        if (s3Key) {
          const delCmd = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: s3Key,
          });
          await s3.send(delCmd);
        }
      }
      // 2-2. 新しいS3画像URLを保存
      updateData.logoUrl = logoFile.location;
    }
    // 3. Skillを更新
    const updated = await prisma.skill.update({
      where: { id },
      data: updateData,
    });
    
    res.json(updated);
  } catch (err: unknown) {
    console.error('更新エラー:', err);
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: '更新に失敗しました', error: err.message });
    } else {
      res.status(500).json({ message: '更新に失敗しました' });
    }
  }
});
export default router;
