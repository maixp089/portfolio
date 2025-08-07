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
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const client_s3_2 = require("@aws-sdk/client-s3"); // S3でファイルを削除するためのクラス
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
console.log('バケット名:', process.env.AWS_S3_BUCKET_NAME);
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
            const filename = `skill/${Date.now()}-${file.originalname}`;
            cb(null, filename);
        },
    }),
});
// Skill一覧GET（画像付きで返す）
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield prisma.skill.findMany({ orderBy: { id: 'asc' } });
        res.json(skills);
    }
    catch (err) {
        console.error('Skill一覧取得エラー:', err);
        res
            .status(500)
            .json({ message: 'Skill一覧取得に失敗しました', error: String(err) });
    }
}));
// Skill一件GET
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'IDは数値で指定してください' });
    }
    try {
        const skill = yield prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            return res
                .status(404)
                .json({ message: `ID ${id} のプロジェクトが見つかりませんでした` });
        }
        res.json(skill);
    }
    catch (err) {
        console.error('取得エラー:', err);
        res.status(500).json({ message: '取得に失敗しました', error: String(err) });
    }
}));
// Skill追加（S3に画像を送る）
router.post('/', upload.single('logo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, userId, description } = req.body;
        const logoFile = req.file;
        if (!name || !userId) {
            return res.status(400).json({ message: 'nameとuserIdは必須です' });
        }
        const userIdInt = Number(userId);
        // Skillレコードを作成
        const newSkill = yield prisma.skill.create({
            data: {
                name,
                userId: userIdInt,
                logoUrl: (_a = logoFile === null || logoFile === void 0 ? void 0 : logoFile.location) !== null && _a !== void 0 ? _a : null, // ← location を保存
                description,
            },
        });
        res.status(201).json(newSkill);
    }
    catch (err) {
        console.error('Skill登録エラー:', err);
        res
            .status(500)
            .json({ message: 'Skill登録に失敗しました', error: String(err) });
    }
}));
// 指定Skillを削除
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'IDは数値で指定してください' });
    }
    try {
        // 該当スキルを取得
        const skill = yield prisma.skill.findUnique({ where: { id } });
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
                const delCmd = new client_s3_2.DeleteObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: s3Key,
                });
                yield s3.send(delCmd);
            }
        }
        // Skill削除
        yield prisma.skill.delete({
            where: { id },
        });
        res.status(200).json({ message: `ID ${id} の実績を削除しました` });
    }
    catch (err) {
        console.error('削除エラー:', err);
        res.status(500).json({ message: '削除に失敗しました', error: String(err) });
    }
}));
// Skillを更新
router.put('/:id', upload.single('logo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'IDは数値で指定してください' });
    }
    const { name, description } = req.body;
    // S3で画像保存する
    const logoFile = req.file;
    // 更新用オブジェクト
    const updateData = {};
    if (name)
        updateData.name = name;
    if (description)
        updateData.description = description;
    try {
        // 1. 既存のSkill情報を取得
        const skill = yield prisma.skill.findUnique({ where: { id } });
        if (!skill) {
            return res.status(404).json({ message: `ID ${id} のスキルが見つかりませんでした` });
        }
        // 2. 画像アップロードがあれば
        if (logoFile) {
            // 2-1. 既存画像があればS3から削除
            if (skill.logoUrl) {
                const s3Key = skill.logoUrl.split('.amazonaws.com/')[1];
                if (s3Key) {
                    const delCmd = new client_s3_2.DeleteObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: s3Key,
                    });
                    yield s3.send(delCmd);
                }
            }
            // 2-2. 新しいS3画像URLを保存
            updateData.logoUrl = logoFile.location;
        }
        // 3. Skillを更新
        const updated = yield prisma.skill.update({
            where: { id },
            data: updateData,
        });
        res.json(updated);
    }
    catch (err) {
        console.error('更新エラー:', err);
        if (err instanceof Error) {
            res
                .status(500)
                .json({ message: '更新に失敗しました', error: err.message });
        }
        else {
            res.status(500).json({ message: '更新に失敗しました' });
        }
    }
}));
exports.default = router;
