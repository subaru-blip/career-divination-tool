# 手動作成が必要なファイル

## `.env.local.example`

フックの保護により自動作成できませんでした。
以下の内容でプロジェクトルート（`career-divination-tool/`）直下に
`.env.local.example` というファイル名で作成してください。

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

また実際に使う場合は同じ内容で `.env.local` を作成し、
各値を本物のキーに書き換えてください。

---
作成確認後、このファイルは削除してください。
