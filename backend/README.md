
## バックエンド使用技術

| 分類            | 技術・ツール         |
|-----------------|---------------------|
| フレームワーク  | Express.js          |
| 言語            | TypeScript         |
| ORM             | Prisma              |
| データベース     | MySQL               |
| 認証            | Firebase Authentication (連携) |
| Lint/整形       | ESLint, Prettier    |
| テスト          | vitest（予定）　　   |

## ディレクトリ構成
```bash
backend/
├── generated/prisma/      # Prismaの自動生成ファイル(git外)
├── node_modules/ 
├── prisma/                # Prisma関連
│      └── schema.prisma
├── src/ 
│ ├── routes/              # APIエンドポイント
│ │ ├── contact.ts         # お問い合わせAPI
│ │ ├── image.ts           # 画像アップロードAPI
│ │ ├── portfolio.ts       # ポートフォリオ実績API
│ │ └── skill.ts           # スキルAPI
│ └── app.ts               # エントリーポイント
├── uploads/               # 画像アップロードファイル
├── .env                   # 環境変数ファイル（DB接続情報など）
├── .eslintignore          # ESLintで無視するファイル設定
├── .eslintrc.js           # ESLint設定ファイル
├── .prettierrc            # Prettier設定ファイル
├── package.json           # パッケージ管理ファイル
├── package-lock.json      # パッケージのバージョンロックファイル
├── README.md              # このファイル
└── tsconfig.json          # TypeScriptコンパイル設定
```

