const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const topics = [
  { title: '一人暮らしにおすすめのミニ冷蔵庫5選', keyword: 'ミニ冷蔵庫' },
  { title: 'コンパクト電子レンジの選び方とおすすめ4選', keyword: 'コンパクト電子レンジ' },
  { title: '一人暮らし向けスティック掃除機おすすめ5選', keyword: 'スティック掃除機' },
  { title: '電気ケトルとポットどちらがいい？徹底比較', keyword: '電気ケトル' },
  { title: '一人暮らしにおすすめの電気鍋4選', keyword: '電気鍋' },
  { title: 'コンパクトオーブントースターおすすめ5選', keyword: 'オーブントースター' },
  { title: '一人暮らし向け空気清浄機おすすめ4選', keyword: '空気清浄機' },
  { title: 'ホットプレートの選び方と一人暮らし向けおすすめ', keyword: 'ホットプレート' },
  { title: '一人暮らしにおすすめのコンパクト洗濯機4選', keyword: 'コンパクト洗濯機' },
  { title: '炊飯器の選び方｜一人暮らし向けおすすめ5選', keyword: '炊飯器' },
];

async function generateArticle() {
  const today = new Date();
  const topicIndex = Math.floor(Math.random() * topics.length);
  const topic = topics[topicIndex];
  const dateStr = today.toISOString().split('T')[0];
  const slug = `article-${dateStr}-${topicIndex}`;
  const filename = `${slug}.html`;

  console.log(`記事を生成中：${topic.title}`);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `一人暮らし向け小型家電アフィリエイトサイト用の記事をHTMLで作成してください。

テーマ：${topic.title}

重要：マークダウンのコードブロック（\`\`\`html や \`\`\`）を絶対に使わないでください。<!DOCTYPE html>から始まる生のHTMLのみを返してください。

要件：
- 完全なHTMLページ（<!DOCTYPE html>から</html>まで）
- 日本語で書く
- SEOを意識したtitleタグとmeta description
- 見出し構造（h1, h2, h3）を適切に使う
- おすすめ商品を3〜5個紹介する（商品名、特徴、価格帯、Amazonリンクのプレースホルダー[AMAZON_LINK_HERE]を含める）
- 商品比較表を含める
- 読みやすいCSSスタイルを含める（緑系のデザイン、スマホ対応）
- ヘッダーに「一人暮らしの小型家電ガイド」というサイト名を表示
- フッターにAmazonアソシエイトの免責文を含める
- トップページへのリンク（<a href="../index.html">）を含める
- 文字数は2000文字程度`
    }]
  });

  let content = message.content[0].text;
  // コードフェンスを行単位で除去
  const lines = content.split('\n');
  const startIdx = lines[0].trim().startsWith('```') ? 1 : 0;
  const lastLine = lines[lines.length - 1].trim();
  const endIdx = lastLine === '```' || lastLine === '```html' ? lines.length - 1 : lines.length;
  content = lines.slice(startIdx, endIdx).join('\n').trim();
  const articlesDir = path.join(process.cwd(), 'articles');
  if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);
  fs.writeFileSync(path.join(articlesDir, filename), content);

  // index.htmlの新着記事リストを更新
  updateIndex(topic.title, filename, dateStr);

  console.log(`完了：articles/${filename}`);
}

function updateIndex(title, filename, dateStr) {
  const indexPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  const newItem = `\n    <li><a href="articles/${filename}">${title}【${dateStr}】</a></li>`;

  if (html.includes('<ul class="article-list">')) {
    html = html.replace('<ul class="article-list">', `<ul class="article-list">${newItem}`);
    fs.writeFileSync(indexPath, html);
    console.log('index.htmlを更新しました');
  }
}

generateArticle().catch(err => {
  console.error('エラー:', err);
  process.exit(1);
});
