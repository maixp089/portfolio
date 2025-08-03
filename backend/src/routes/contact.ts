import express from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();

// Nodemailerの設定（この位置でOK）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,      // .envから読む（必須！）
    pass: process.env.MAIL_PASSWORD,  // .envから読む（必須！）
  },
});

// お問い合わせ一覧取得（GET：管理者ページ)
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: '取得に失敗しました', error: String(err) });
  }
});

// お問い合わせ新規登録（POST：ホームページ）
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email, messageは必須です' });
  }

    try {
    // 1. データベースに保存
    const newContact = await prisma.contact.create({
      data: { name, email, message }
    });

    // 2. あなたにメール通知（Nodemailerで送信）
    await transporter.sendMail({
      from: `"ポートフォリオお問い合わせ" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO, // 自分の通知用メールアドレス（.envに入れておくと便利！）
      subject: "【ポートフォリオ】新しいお問い合わせがありました",
      text: `
【お名前】${name}
【メールアドレス】${email}
【内容】
${message}
      `,
    });

    res.status(201).json(newContact);
  } catch (err) {
      // エラー内容をサーバーログに出す！
    console.error("お問い合わせAPIエラー:", err);
    res
      .status(500)
      .json({
        message: '登録またはメール送信に失敗しました',
        error: String(err),
      });
  }
});

export default router;
