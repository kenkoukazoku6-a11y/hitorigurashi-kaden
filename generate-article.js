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
キーワード：${topic.keyword}

重要：マークダウンのコードブロック（\`\`\`html や \`\`\`）を絶対に使わないでください。<!DOCTYPE html>から始まる生のHTMLのみを返してください。

以下のHTMLテンプレート構造に従って作成してください。CSSはそのまま使い、コンテンツ部分を記事に合わせて書いてください。

=== CSSテンプレート（<style>タグ内に必ず含める） ===
:root {
  --primary: #1560a8; --primary-dark: #0d4a8a; --accent: #ff6b35;
  --bg: #f4f6f9; --white: #ffffff; --text: #2d2d2d; --text-light: #6b7280;
  --border: #e5e7eb; --shadow: 0 2px 12px rgba(0,0,0,0.08); --radius: 12px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif; background: var(--bg); color: var(--text); line-height: 1.8; }
header { background: var(--white); border-bottom: 1px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.header-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; height: 64px; gap: 16px; }
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.logo-text { font-size: 1rem; font-weight: 700; color: var(--text); line-height: 1.2; }
.logo-text span { display: block; font-size: 0.68rem; font-weight: 400; color: var(--text-light); }
.back-btn { margin-left: auto; display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; text-decoration: none; font-size: 0.82rem; color: var(--text-light); }
.article-hero { background: linear-gradient(135deg, #1560a8, #0d4a8a); color: white; padding: 48px 20px; }
.article-hero-inner { max-width: 860px; margin: 0 auto; }
.breadcrumb { display: flex; gap: 6px; font-size: 0.78rem; opacity: 0.75; margin-bottom: 16px; }
.breadcrumb a { color: white; text-decoration: none; }
.article-tag-row { display: flex; gap: 8px; margin-bottom: 14px; }
.article-tag { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 0.75rem; font-weight: 700; padding: 3px 12px; border-radius: 20px; }
.article-hero h1 { font-size: 1.7rem; font-weight: 700; line-height: 1.4; margin-bottom: 14px; }
.article-meta { display: flex; gap: 20px; font-size: 0.8rem; opacity: 0.8; }
.article-wrap { max-width: 1100px; margin: 0 auto; padding: 36px 20px; display: grid; grid-template-columns: 1fr 280px; gap: 36px; }
.article-body { min-width: 0; }
.intro-box { background: var(--white); border-left: 4px solid var(--primary); border-radius: 0 var(--radius) var(--radius) 0; padding: 20px 24px; margin-bottom: 32px; box-shadow: var(--shadow); font-size: 0.95rem; line-height: 1.9; }
.intro-box p + p { margin-top: 12px; }
.article-body h2 { font-size: 1.2rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 18px; border-radius: 8px; margin: 40px 0 18px; }
.article-body h3 { font-size: 1.02rem; font-weight: 700; color: var(--primary); border-bottom: 2px solid #dbeafe; padding-bottom: 8px; margin: 28px 0 12px; }
.article-body p { margin-bottom: 14px; font-size: 0.95rem; }
.point-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); padding: 20px 22px; margin-bottom: 16px; border: 1px solid var(--border); }
.point-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.point-num { width: 28px; height: 28px; background: var(--primary); color: white; border-radius: 50%; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.point-card h3 { border: none; margin: 0; padding: 0; font-size: 1rem; color: var(--text); }
.point-card p { margin: 0; font-size: 0.9rem; color: #444; }
.product-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--border); overflow: hidden; margin-bottom: 24px; }
.product-card-head { background: linear-gradient(90deg, #f0f7ff, #e8f0fe); padding: 14px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
.product-rank { width: 32px; height: 32px; border-radius: 8px; background: var(--primary); color: white; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.product-rank.gold { background: #f59e0b; }
.product-rank.silver { background: #9ca3af; }
.product-rank.bronze { background: #b45309; }
.product-card-head h3 { font-size: 1rem; font-weight: 700; color: var(--text); margin: 0; border: none; padding: 0; }
.product-card-body { padding: 18px 20px; }
.product-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.ptag { background: #e8f0fe; color: var(--primary); font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.product-card-body p { font-size: 0.92rem; margin-bottom: 10px; }
.product-info-row { display: flex; gap: 20px; background: #f8fafc; border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-size: 0.85rem; }
.product-info-row span strong { display: block; font-size: 0.72rem; color: var(--text-light); margin-bottom: 2px; }
.amazon-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: white; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem; margin-top: 6px; box-shadow: 0 3px 12px rgba(255,107,53,0.35); }
.table-wrap { overflow-x: auto; margin: 20px 0 30px; border-radius: var(--radius); box-shadow: var(--shadow); }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
thead th { background: var(--primary); color: white; padding: 12px 14px; text-align: left; white-space: nowrap; }
tbody td { padding: 11px 14px; border-bottom: 1px solid var(--border); background: var(--white); }
tbody tr:nth-child(even) td { background: #f8fafc; }
.summary-box { background: linear-gradient(135deg, #f0f7ff, #e8f0fe); border: 1px solid #bfdbfe; border-radius: var(--radius); padding: 24px; margin-top: 32px; }
.summary-box h2 { background: none; color: var(--primary); padding: 0; border-radius: 0; font-size: 1.1rem; margin: 0 0 14px; }
.summary-box p { font-size: 0.93rem; margin-bottom: 12px; }
.article-sidebar { display: flex; flex-direction: column; gap: 20px; }
.sidebar-box { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--border); overflow: hidden; }
.sidebar-box-head { background: var(--primary); color: white; padding: 11px 16px; font-size: 0.85rem; font-weight: 700; }
.sidebar-box-body { padding: 14px 16px; }
.toc-list { list-style: none; }
.toc-list li { border-bottom: 1px solid var(--border); }
.toc-list li:last-child { border-bottom: none; }
.toc-list a { display: block; padding: 9px 4px; font-size: 0.82rem; color: var(--text); text-decoration: none; }
footer { background: #1a2744; color: #9ca3af; margin-top: 20px; }
.footer-bottom { max-width: 1100px; margin: 0 auto; padding: 20px; text-align: center; font-size: 0.75rem; }
.footer-bottom a { color: #6b7280; text-decoration: none; }
@media (max-width: 768px) { .article-wrap { grid-template-columns: 1fr; } .article-sidebar { display: none; } .article-hero h1 { font-size: 1.3rem; } }

=== HTML構造テンプレート ===
<header>
  <div class="header-inner">
    <a href="../index.html" class="logo">
      <div class="logo-icon">🏠</div>
      <div class="logo-text">一人暮らし家電ガイド<span>コンパクト家電を徹底比較</span></div>
    </a>
    <a href="../index.html" class="back-btn">← トップへ戻る</a>
  </div>
</header>

<div class="article-hero">
  <div class="article-hero-inner">
    <div class="breadcrumb"><a href="../index.html">トップ</a><span>›</span><span>（カテゴリ名）</span></div>
    <div class="article-tag-row">（カテゴリタグ・年度タグ・おすすめN選タグ）</div>
    <h1>（記事タイトル）</h1>
    <div class="article-meta"><span>📅 （日付）</span><span>📖 読了目安：8分</span></div>
  </div>
</div>

<div class="article-wrap">
  <article class="article-body">
    <div class="intro-box">（導入文：300文字以上、<p>タグで段落分け）</div>

    <h2>（選び方セクション）</h2>
    <!-- 選び方ポイントを3〜5個、point-cardで -->
    <div class="point-card">
      <div class="point-card-head"><div class="point-num">1</div><h3>（ポイント名）</h3></div>
      <p>（200文字以上の解説）</p>
    </div>

    <h2>おすすめ（カテゴリ名）（N）選</h2>
    <!-- 商品を5個、product-cardで。1位はgold、2位はsilver、3位はbronze -->
    <div class="product-card">
      <div class="product-card-head">
        <div class="product-rank gold">1位</div>
        <h3>（商品名）</h3>
      </div>
      <div class="product-card-body">
        <div class="product-tags"><span class="ptag">（スペック）</span></div>
        <p>（200文字以上の特徴・メリット説明）</p>
        <div class="product-info-row">
          <span><strong>こんな人に</strong>（ターゲット）</span>
          <span><strong>価格帯</strong>（価格）</span>
        </div>
        <a href="https://www.amazon.co.jp/s?k=${topic.keyword}" class="amazon-btn" target="_blank">🛒 Amazonで価格を確認する</a>
      </div>
    </div>

    <h2>比較表</h2>
    <div class="table-wrap"><table>（商品名・価格・特徴の比較表）</table></div>

    <div class="summary-box">
      <h2>まとめ</h2>
      <p>（200文字以上のまとめ）</p>
    </div>
  </article>

  <aside class="article-sidebar">
    <div class="sidebar-box">
      <div class="sidebar-box-head">📋 目次</div>
      <div class="sidebar-box-body"><ul class="toc-list">（目次リスト）</ul></div>
    </div>
  </aside>
</div>

<footer>
  <div class="footer-bottom">
    <p>&copy; 2026 一人暮らし家電ガイド | 本サイトはAmazonアソシエイトとして適格販売により収入を得ています。 | <a href="#">プライバシーポリシー</a></p>
  </div>
</footer>

=== 追加要件 ===
- Googleフォント読み込み：<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
- 合計文字数は4000文字以上
- 商品名は実在する商品名を使う
- 各商品の説明は200文字以上`
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
