"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Nodemailerの設定（この位置でOK）
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, // .envから読む（必須！）
        pass: process.env.MAIL_PASSWORD, // .envから読む（必須！）
    },
});
// お問い合わせ一覧取得（GET：管理者ページ)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(contacts);
    }
    catch (err) {
        res.status(500).json({ message: '取得に失敗しました', error: String(err) });
    }
}));
// お問い合わせ新規登録（POST：ホームページ）
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'name, email, messageは必須です' });
    }
    try {
        // 1. データベースに保存
        const newContact = yield prisma.contact.create({
            data: { name, email, message }
        });
        // 2. あなたにメール通知（Nodemailerで送信）
        yield transporter.sendMail({
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
    }
    catch (err) {
        // エラー内容をサーバーログに出す！
        console.error("お問い合わせAPIエラー:", err);
        res
            .status(500)
            .json({
            message: '登録またはメール送信に失敗しました',
            error: String(err),
        });
    }
}));
exports.default = router;
