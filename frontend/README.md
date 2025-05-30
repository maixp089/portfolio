## フロントエンド使用技術

| 分類          | 技術・ツール              |
|---------------|--------------------------|
| フレームワーク | Next.js (App Router)     |
| 言語           | TypeScript   |
| UI             | React, Chakra UI         |
| 状態管理       | React useState, useContext |
| 認証           | Firebase Authentication  |
| スタイル       | CSS Modules, Chakra UI   |
| Lint/整形      | ESLint, Prettier         |
| テスト         |      Vitest(予定)        |

## ディレクトリ構成
```bash
frontend/
├── .next/                      # Next.jsのビルド成果物（自動生成、git外）
├── node_modules/ 
├── public/                     # 静的ファイル（画像・faviconなど）
├── src/ 
│ ├── app/
│ │    ├── admin/               # 管理画面ルート
│ │    ├── login/               # ログイン画面
│ │    │    └── page.tsx        # ログインページ本体
│ │    ├── layout.tsx           # ChakraUI設定
│ │    └── page.tsx             # トップページ本体
│ ├── components/  
│ │    ├── Contact.tsx          # お問合せ部分
│ │    ├── EditButton.tsx       # 編集用ボタン
│ │    ├── Header.tsx           # ヘッダー部分
│ │    ├── Hero.tsx             # 自己紹介部分
│ │    ├── Project.tsx          # 実績部分
│ │    └── Skill.tsx            # スキル部分
│ └── utils/ 
│      └── firebase.ts          # Firebase設定
├── .env.local                  # Firebaseパス設定
├── .eslintignore               # ESLintで無視するファイル設定
├── .eslintrc.js                # ESLint設定ファイル
├── .prettierrc                 # Prettier設定ファイル
├── next-env.d.ts               # Next.jsの型定義
├── next.config.mjs             # Next.jsの設定ファイル
├── package.json                # パッケージ管理ファイル
├── package-lock.json           # 依存パッケージのバージョンロック
├── README.md                   # このファイル
└── tsconfig.json               # TypeScriptプロジェクト全体の設定
