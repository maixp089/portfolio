
module.exports = {
  // プロジェクトルート直下の設定であることを明示
  root: true,

  // TypeScript用のパーサー指定
  parser: '@typescript-eslint/parser',

  // 使用するESLintプラグイン
  plugins: [
    '@typescript-eslint', // TypeScript向けルール
    'react',              // React向けルール
    'react-hooks',        // React Hooks向けルール
    'jsx-a11y',           // アクセシビリティ
    'import',             // import文の整理
  ],

  // ルールのベースとなるセット
  extends: [
    'next/core-web-vitals',             // Next.js公式推奨ルール
    'plugin:@typescript-eslint/recommended', // TypeScript推奨ルール
    'plugin:react/recommended',              // React推奨ルール
    'plugin:react-hooks/recommended',        // React Hooks推奨ルール
    'plugin:jsx-a11y/recommended',           // アクセシビリティ
    'plugin:import/recommended',             // import関連
    'prettier',                             // Prettierで整形するための連携
  ],

  // カスタムルール（必要ならここで個別設定）
  rules: {
  'react/react-in-jsx-scope': 'off',

    // 例: セミコロンを必須にしたい場合
    // 'semi': ['error', 'always'],
    // 例: console.logの許可
    // 'no-console': 'off',
  },

  // Reactバージョンの自動検出
  settings: {
    react: { version: 'detect' },
  },
};
