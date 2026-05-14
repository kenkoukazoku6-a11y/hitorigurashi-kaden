const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ASSOCIATE_TAG = 'hitorigura01c-22';
const BASE_URL = 'https://hitorigurashi-kaden.pages.dev';

// 記事トピック一覧（順番に生成）
const topics = [
  {
    id: 'microwave',
    name: '電子レンジ',
    tag: '電子レンジ',
    emoji: '📡',
    title: '一人暮らしにおすすめのコンパクト電子レンジ5選【2026年最新】単機能からオーブンまで徹底比較',
    summary: '単機能・オーブン機能付き電子レンジを5つのポイントで徹底比較。パナソニック・シャープなど人気5モデルを詳細レビュー。',
    keyword: 'コンパクト電子レンジ 一人暮らし'
  },
  {
    id: 'ricecooker',
    name: '炊飯器',
    tag: '炊飯器',
    emoji: '🍚',
    title: '一人暮らし向けコンパクト炊飯器おすすめ5選【2026年最新】1〜3合タイプを徹底比較',
    summary: '1〜3合炊きの小型炊飯器を容量・機能・価格で比較。象印・パナソニック・アイリスオーヤマなど人気モデルを厳選紹介。',
    keyword: '炊飯器 一人暮らし 1合 3合'
  },
  {
    id: 'vacuum',
    name: 'スティック掃除機',
    tag: '掃除機',
    emoji: '🌀',
    title: '一人暮らし向けスティック掃除機おすすめ5選【2026年最新】軽量コードレスタイプを徹底比較',
    summary: 'コードレス・軽量・吸引力を重視した一人暮らし向け掃除機を厳選。マキタ・ダイソン・パナソニックなど人気5モデルを比較。',
    keyword: 'スティック掃除機 コードレス 一人暮らし'
  },
  {
    id: 'toaster',
    name: 'オーブントースター',
    tag: 'トースター',
    emoji: '🍞',
    title: '一人暮らし向けオーブントースターおすすめ5選【2026年最新】コンパクトで高機能なモデルを徹底比較',
    summary: 'コンパクトで多機能なオーブントースターを5つのポイントで比較。アラジン・バルミューダ・パナソニックなど人気モデルを厳選。',
    keyword: 'オーブントースター コンパクト 一人暮らし'
  },
  {
    id: 'hairdryer',
    name: 'ドライヤー',
    tag: 'ドライヤー',
    emoji: '💨',
    title: '一人暮らし向けドライヤーおすすめ5選【2026年最新】軽量・速乾・コンパクトモデルを徹底比較',
    summary: '軽量・速乾・静音性を重視したドライヤーを5つのポイントで比較。パナソニック・ダイソン・日立など人気5モデルを厳選紹介。',
    keyword: 'ドライヤー 軽量 速乾 一人暮らし'
  },
  {
    id: 'humidifier',
    name: '加湿器',
    tag: '加湿器',
    emoji: '💧',
    title: '一人暮らし向け加湿器おすすめ5選【2026年最新】コンパクトで静音性が高いモデルを徹底比較',
    summary: 'ワンルームに最適なコンパクト加湿器を5つのポイントで比較。象印・シャープ・アイリスオーヤマなど人気5モデルを厳選。',
    keyword: '加湿器 コンパクト 静音 一人暮らし'
  },
  {
    id: 'fan',
    name: 'サーキュレーター',
    tag: 'サーキュレーター',
    emoji: '🌬️',
    title: '一人暮らし向けサーキュレーターおすすめ5選【2026年最新】静音・省エネ・コンパクトモデルを徹底比較',
    summary: '一人暮らしの部屋に最適なサーキュレーターを5つのポイントで比較。アイリスオーヤマ・バルミューダ・山善など人気5モデルを厳選。',
    keyword: 'サーキュレーター 静音 省エネ 一人暮らし'
  },
  {
    id: 'hotplate',
    name: 'ホットプレート',
    tag: 'ホットプレート',
    emoji: '🍳',
    title: '一人暮らし向けホットプレートおすすめ5選【2026年最新】コンパクトで使いやすいモデルを徹底比較',
    summary: '一人暮らしにちょうどよいコンパクトホットプレートを5つのポイントで比較。ブルーノ・パナソニック・アイリスオーヤマなど人気5モデルを厳選。',
    keyword: 'ホットプレート コンパクト 一人用'
  },
  {
    id: 'washing',
    name: 'コンパクト洗濯機',
    tag: '洗濯機',
    emoji: '🫧',
    title: '一人暮らし向けコンパクト洗濯機おすすめ5選【2026年最新】容量・機能・静音性で徹底比較',
    summary: '一人暮らしにぴったりな容量3〜7kgの洗濯機を5つのポイントで比較。パナソニック・東芝・日立など人気5モデルを厳選紹介。',
    keyword: 'コンパクト洗濯機 一人暮らし 全自動'
  },
  {
    id: 'coffemaker',
    name: 'コーヒーメーカー',
    tag: 'コーヒーメーカー',
    emoji: '☕',
    title: '一人暮らし向けコーヒーメーカーおすすめ5選【2026年最新】コンパクトで使いやすいモデルを徹底比較',
    summary: '一人暮らしに最適なコンパクトコーヒーメーカーを5つのポイントで比較。デロンギ・パナソニック・ネスプレッソなど人気5モデルを厳選。',
    keyword: 'コーヒーメーカー コンパクト 一人暮らし'
  }
];

// 使用済みトピックを記録するファイル
const STATE_FILE = path.join(process.cwd(), 'scripts', 'topic-state.json');

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return { used: [] };
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { used: [] };
  }
}

function saveState(state) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function getNextTopic(state) {
  const used = new Set(state.used);
  for (const topic of topics) {
    if (!used.has(topic.id)) return topic;
  }
  // すべて使い切ったらリセット
  state.used = [];
  return topics[0];
}

async function generateArticle() {
  const state = loadState();
  const topic = getNextTopic(state);

  const now = new Date(Date.now() + 9 * 60 * 60 * 1000); // JST
  const dateStr = now.toISOString().split('T')[0];
  const displayDate = `${dateStr.slice(0,4)}年${dateStr.slice(5,7)}月${dateStr.slice(8,10)}日`;

  // ファイル名の重複を避ける
  let idx = 0;
  while (fs.existsSync(path.join('articles', `article-${dateStr}-${idx}.html`))) idx++;
  const filename = `article-${dateStr}-${idx}.html`;

  console.log(`生成中: ${topic.title}`);

  // 商品データを読み込む
  const productsDB = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'products.json'), 'utf8'));
  const products = productsDB[topic.id] || [];

  // 商品リストをプロンプト用にフォーマット
  const productsList = products.map((p, i) => {
    const rankLabel = ['1位（gold）', '2位（silver）', '3位（bronze）', '4位', '5位'][i] || `${i+1}位`;
    return `${rankLabel}: ${p.name}
  ASIN: ${p.asin}
  Amazon直リンク: https://www.amazon.co.jp/dp/${p.asin}?tag=${ASSOCIATE_TAG}
  価格帯: ${p.price}
  スペック: ${p.spec}
  タグ: ${p.tags.join('・')}
  こんな人に: ${p.recommended_for}`;
  }).join('\n\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `あなたは一人暮らし向け家電アフィリエイトサイト「一人暮らし家電ガイド」のライターです。
以下の仕様に従って完全なHTML記事を作成してください。

## 記事情報
- カテゴリ: ${topic.name}
- タイトル: ${topic.title}
- 公開日: ${displayDate}
- Amazonアソシエイトタグ: ${ASSOCIATE_TAG}
- ファイル名: ${filename}

## 紹介する商品（必ずこの5商品を使うこと・リンクはそのまま使用）
${productsList}

## 必須要件
1. <!DOCTYPE html>から</html>まで完全なHTMLのみ出力（コードブロック記号不要）
2. 上記5商品を必ず全て使う（ASINリンクをそのまま使用・変更厳禁）
3. 各商品説明は200文字以上
4. 導入文は300文字以上
5. 選び方ポイントは5つ
6. まとめは200文字以上

## CSSデザイン（必ずこのとおり）
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
.breadcrumb { display: flex; gap: 6px; align-items: center; font-size: 0.78rem; opacity: 0.75; margin-bottom: 16px; }
.breadcrumb a { color: white; text-decoration: none; }
.breadcrumb span { opacity: 0.6; }
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
tbody tr:last-child td { border-bottom: none; }
tbody tr:nth-child(even) td { background: #f8fafc; }
tbody tr:hover td { background: #f0f7ff; }
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
.toc-list a { display: block; padding: 9px 4px; font-size: 0.82rem; color: var(--text); text-decoration: none; transition: color 0.15s; }
.toc-list a:hover { color: var(--primary); }
.toc-list .toc-h3 { padding-left: 14px; font-size: 0.78rem; color: var(--text-light); }
footer { background: #1a2744; color: #9ca3af; margin-top: 20px; }
.footer-bottom { max-width: 1100px; margin: 0 auto; padding: 20px; text-align: center; font-size: 0.75rem; }
.footer-bottom a { color: #6b7280; text-decoration: none; }
@media (max-width: 768px) { .article-wrap { grid-template-columns: 1fr; } .article-sidebar { display: none; } .article-hero h1 { font-size: 1.3rem; } .product-info-row { flex-direction: column; gap: 8px; } }

## HTML構造（必ずこのとおりに作成）
<header>
  <div class="header-inner">
    <a href="../index.html" class="logo">
      <div class="logo-icon">🏠</div>
      <div class="logo-text">一人暮らし家電ガイド<span>コンパクト家電を徹底比較</span></div>
    </a>
    <a href="../index.html" class="back-btn">← トップへ戻る</a>
  </div>
</header>

<div class="article-hero">（ブレッドクラム・タグ行・h1・メタ情報）</div>

<div class="article-wrap">
  <article class="article-body">
    <div class="intro-box">（導入文）</div>
    <h2 id="howto">（選び方5つのポイント）</h2>
    <div class="point-card" id="point1">〜</div> ×5個
    <h2 id="recommend">おすすめ${topic.name}5選</h2>
    （product-card ×5個、1位gold 2位silver 3位bronze）
    <h2 id="table">比較表</h2>
    <div class="table-wrap"><table>（5商品の比較表）</table></div>
    <div class="summary-box"><h2 id="summary">まとめ</h2>（まとめ）</div>
  </article>
  <aside class="article-sidebar">
    <div class="sidebar-box">（目次：howto/point1〜5/recommend/table/summary）</div>
    <div class="sidebar-box">（関連記事：冷蔵庫・電気ケトル・空気清浄機から2つ）</div>
  </aside>
</div>

<footer>
  <div class="footer-bottom">
    <p>&copy; ${dateStr.slice(0,4)} 一人暮らし家電ガイド &nbsp;|&nbsp; 本サイトはAmazonアソシエイトとして適格販売により収入を得ています。&nbsp;|&nbsp; <a href="../privacy.html">プライバシーポリシー</a> &nbsp;|&nbsp; <a href="../contact.html">お問い合わせ</a></p>
  </div>
</footer>

関連記事リンク（サイドバー用）:
- articles/article-2026-05-11-0.html → ミニ冷蔵庫おすすめ5選
- articles/article-2026-05-11-3.html → 電気ケトルvsポット徹底比較
- articles/article-2026-05-11-6.html → 空気清浄機おすすめ4選`
    }]
  });

  let content = message.content[0].text.trim();
  // コードフェンス除去
  content = content.replace(/^```html?\n?/i, '').replace(/\n?```$/, '').trim();

  const articlesDir = path.join(process.cwd(), 'articles');
  if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);
  fs.writeFileSync(path.join(articlesDir, filename), content, 'utf8');
  console.log(`記事を保存: articles/${filename}`);

  updateIndex(topic, filename, dateStr);
  updateSitemap(filename, dateStr);

  state.used.push(topic.id);
  saveState(state);

  console.log('完了！');
}

function updateIndex(topic, filename, dateStr) {
  const indexPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  const displayDate = `${dateStr.slice(0,4)}.${dateStr.slice(5,7)}.${dateStr.slice(8,10)}`;

  const newCard = `      <div class="art-card">
        <div class="art-card-thumb">${topic.emoji}</div>
        <div class="art-card-body">
          <div class="art-card-meta">
            <span class="art-tag">${topic.tag}</span>
            <span class="art-date">${displayDate}</span>
          </div>
          <a href="articles/${filename}">
            <h3>${topic.title}</h3>
          </a>
          <p>${topic.summary}</p>
        </div>
        <div class="art-card-arrow">›</div>
      </div>`;

  // 新着記事の先頭に挿入
  html = html.replace(
    '<div class="article-cards">',
    `<div class="article-cards">\n${newCard}`
  );

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('index.htmlを更新しました');
}

function updateSitemap(filename, dateStr) {
  const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');

  const newUrl = `  <url>
    <loc>${BASE_URL}/articles/${filename}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;

  xml = xml.replace('</urlset>', newUrl + '</urlset>');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log('sitemap.xmlを更新しました');
}

generateArticle().catch(err => {
  console.error('エラー:', err);
  process.exit(1);
});
