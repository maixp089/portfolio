# ポートフォリオ（モノレポ）

このリポジトリは Next.js フロントエンドと Express/Prisma バックエンドで構成されたポートフォリオアプリです。Docker は未使用です。各パッケージはローカル Node.js 実行を前提にしています。

## 技術スタック

| 役割             | 使用技術 |
|------------------|---------|
| フロントエンド    | Next.js (App Router), React, TypeScript, Chakra UI |
| バックエンド      | Express.js, TypeScript, Prisma |
| データベース      | MySQL |
| ストレージ        | AWS S3（画像アップロード） |
| 認証             | Firebase Authentication |
| メール送信        | Nodemailer（Gmail） |
| Lint/フォーマット | ESLint, Prettier |

## ディレクトリ構成
```bash
portfolio/
├── backend/         # Express + Prisma（API）
├── docs/            # API/ER ドキュメント
├── frontend/        # Next.js（フロント）
└── README.md        # 本ファイル
```

## セットアップ（共通）
- Node.js をインストール（推奨: v18+）。
- 各パッケージで依存関係をインストールします。
```bash
cd backend && npm i
cd ../frontend && npm i
```

## バックエンドの起動
ポート: 4000（CORS は `http://localhost:3000` を許可）。

1) 環境変数 `.env` を `backend/` 直下に作成
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DBNAME"
AWS_REGION="ap-northeast-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
MAIL_USER="your_gmail_address@gmail.com"
MAIL_PASSWORD="app_password_from_google"
MAIL_TO="notify_destination@example.com"
```

2) マイグレーション/クライアント生成（初回またはスキーマ更新時）
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

3) 開発サーバー起動
```bash
npm run dev
```
（本番ビルド→起動）
```bash
npm run build
npm start
```

エンドポイント（抜粋）は `docs/API.md` を参照してください。

## フロントエンドの起動
ポート: 3000

1) 環境変数 `frontend/.env.local` を作成
```env
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

2) 開発サーバー起動
```bash
cd frontend
npm run dev
```

## API 仕様
- 詳細は `docs/API.md` を参照してください。
- 主なベース URL は `http://localhost:4000/api` です。

## よくあるトラブルと対処
- S3 への画像アップロードで 403/権限エラー: `AWS_REGION`/`AWS_S3_BUCKET_NAME`、IAM ポリシー、バケットの CORS を確認。
- 画像 URL が保存されない: S3 アップローダは `multer-s3` を使用。保存値は `file.location`（Skill/Portfolio いずれも）です。
- Gmail 送信で失敗: 2 段階認証＋アプリパスワードを使用し、`MAIL_USER`/`MAIL_PASSWORD`/`MAIL_TO` を確認。
- DB 接続エラー: `DATABASE_URL` のユーザー/パス/ホスト/DB 名と MySQL の起動状態を確認。
- CORS エラー: バックエンドの `cors` 設定は `http://localhost:3000` を許可。別ホストの際は `backend/src/app.ts` を調整してください。

## 参考
- バックエンド実装のエントリ: `backend/src/app.ts`
- 主要ルート: `backend/src/routes/portfolio.ts`, `backend/src/routes/skill.ts`, `backend/src/routes/contact.ts`
- スキーマ: `backend/prisma/schema.prisma`
- ER 図: `docs/ER.md`
- API 設計: `docs/API.md`