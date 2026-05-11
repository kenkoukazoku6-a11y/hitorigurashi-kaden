const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const articles = [
  { file: 'articles/article-2026-05-11-0.html', title: '一人暮らしにおすすめのミニ冷蔵庫5選', keyword: 'ミニ冷蔵庫 一人暮らし' },
  { file: 'articles/article-2026-05-11-3.html', title: '電気ケトルとポットどちらがいい？一人暮らし向け徹底比較', keyword: '電気ケトル 一人暮らし' },
];

async function regenerate(article) {
  console.log(`生成中: ${article.title}`);
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `一人暮らし向け小型家電アフィリエイトサイト用の記事をHTMLで作成してください。

テーマ：${article.title}

重要：マークダウンのコードブロック（\`\`\`html や \`\`\`）を絶対に使わないでください。<!DOCTYPE html>から始まる生のHTMLのみを返してください。

要件：
- 完全なHTMLページ（<!DOCTYPE html>から</html>まで）
- 日本語で書く
- SEOを意識したtitleタグとmeta description
- 見出し構造（h1, h2, h3）を適切に使う
- 導入文（300文字以上）：この家電が一人暮らしに必要な理由を丁寧に説明
- 選び方のポイントを3〜5項目、各項目200文字以上で詳しく解説
- おすすめ商品を5個紹介。各商品に以下を含める：
  ・商品名（実在する商品名）
  ・特徴・メリット（200文字以上）
  ・こんな人におすすめ
  ・価格帯（例：15,000円前後）
  ・Amazonリンクボタン：<a href="https://www.amazon.co.jp/s?k=${article.keyword}&tag=hitorigura01c-22" class="amazon-btn">Amazonで見る</a>
- 商品比較表（商品名・価格・サイズ・特徴を一覧表示）
- まとめ（200文字以上）
- 読みやすいCSSスタイルを含める（緑系のデザイン、スマホ対応）
- .amazon-btnのCSSスタイル（オレンジ色のボタン）を含める
- ヘッダーに「一人暮らしの小型家電ガイド」というサイト名を表示
- フッターにAmazonアソシエイトの免責文を含める
- トップページへのリンク（<a href="../index.html">トップへ戻る</a>）を含める
- 合計文字数は4000文字以上`
    }]
  });

  let content = message.content[0].text;
  const lines = content.split('\n');
  const startIdx = lines[0].trim().startsWith('```') ? 1 : 0;
  const lastLine = lines[lines.length - 1].trim();
  const endIdx = lastLine === '```' || lastLine === '```html' ? lines.length - 1 : lines.length;
  content = lines.slice(startIdx, endIdx).join('\n').trim();

  fs.writeFileSync(path.join(process.cwd(), article.file), content, 'utf8');
  console.log(`完了: ${article.file}`);
}

(async () => {
  for (const a of articles) {
    await regenerate(a);
  }
  console.log('全記事の再生成完了');
})().catch(err => { console.error(err); process.exit(1); });
