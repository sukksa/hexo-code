'use strict';

/**
 * Bangumi 追番页（在看 / 看过，两个 Tab + 分页）
 *
 * 1. 构建时通过 https://api.bgm.tv 拉取用户 726667 的动画收藏：
 *      在看（type=3）+ 看过（type=2）
 *    生成 /bangumi/（在看第 1 页）、/bangumi/page/N/，
 *    以及 /bangumi/watched/、/bangumi/watched/page/N/。
 * 2. 结果缓存在项目根目录 .bangumi-cache.json，每个列表缓存 6 小时；
 *    请求失败（离线构建）时沿用旧缓存，没有缓存则该列表显示空状态，不影响构建。
 * 3. 在顶部导航「关于」之前插入「追番」入口。
 *
 * 开关：_config.firefly.yml -> pages.bangumi: false 可同时关闭页面与导航入口
 */

const fs = require('fs');
const path = require('path');

const BGM_USER = '726667';
const API_BASE = `https://api.bgm.tv/v0/users/${BGM_USER}/collections?subject_type=2`;
const USER_AGENT = 'sukksa.github.io/1.0 (https://sukksa.github.io)';
const USER_PAGE = `https://bangumi.tv/user/${BGM_USER}/collections`;

const PAGE_SIZE = 20;
const CACHE_FILE = path.join(hexo.base_dir, '.bangumi-cache.json');
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 小时
const REQUEST_TIMEOUT = 10000;
const MAX_PAGES = 40; // 单列表最多拉取 40 * 50 = 2000 条

const SITE_ROOT = String(hexo.config.root || '/').replace(/\/+$/, '');
const SITE_URL = String(hexo.config.url || '').replace(/\/+$/, '');

function isEnabled() {
  const themeConfig = (hexo.theme && hexo.theme.config) || {};
  return !(themeConfig.pages && themeConfig.pages.bangumi === false);
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeImage(url) {
  if (!url) return '';
  if (url.startsWith('//')) return 'https:' + url;
  return url;
}

function simplify(entry) {
  const subject = entry.subject || {};
  const images = subject.images || {};
  return {
    id: subject.id || entry.subject_id,
    name: subject.name_cn || subject.name || '',
    nameOriginal: subject.name_cn ? subject.name : '',
    cover: normalizeImage(images.large || images.common || images.medium || ''),
    eps: Number(entry.ep_status) || 0,
    totalEps: Number(subject.eps) || 0,
    score: Number(subject.score) || 0,
    date: subject.date || '',
    updatedAt: entry.updated_at || '',
    url: `https://bangumi.tv/subject/${subject.id || entry.subject_id}`
  };
}

function sortItems(items) {
  return items.slice().sort(function (a, b) {
    return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
  });
}

function readCache() {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;

  // 兼容旧版缓存结构 { updated: <ts>, items: [...] }
  if (!raw.watching && Array.isArray(raw.items)) {
    return { updated: { watching: raw.updated || 0, watched: 0 }, watching: raw.items, watched: [] };
  }
  return {
    updated: raw.updated && typeof raw.updated === 'object' ? raw.updated : {},
    watching: Array.isArray(raw.watching) ? raw.watching : [],
    watched: Array.isArray(raw.watched) ? raw.watched : []
  };
}

function writeCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    hexo.log.warn('[bangumi] 写入缓存失败：%s', e.message);
  }
}

function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function requestJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchList(type) {
  const limit = 50;
  const items = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    if (page > 0) await delay(200);
    const url = `${API_BASE}&type=${type}&limit=${limit}&offset=${page * limit}`;
    const json = await requestJson(url);
    if (!json || !Array.isArray(json.data)) throw new Error('返回数据格式异常');
    items.push(...json.data.map(simplify));
    if (json.data.length < limit) break;
  }
  return items;
}

// 依次尝试：缓存是否新鲜 -> 请求 API -> 回退缓存
async function resolveList(kind, type, label, cache) {
  const cachedItems = (cache && Array.isArray(cache[kind])) ? cache[kind] : [];
  const cachedAt = (cache && cache.updated && cache.updated[kind]) || 0;
  const fresh = cachedItems.length > 0 && Date.now() - cachedAt < CACHE_TTL;

  if (fresh) {
    return { items: sortItems(cachedItems), updatedAt: cachedAt, fetched: false };
  }

  try {
    const items = sortItems(await fetchList(type));
    return { items: items, updatedAt: Date.now(), fetched: true };
  } catch (e) {
    hexo.log.warn('[bangumi] 拉取「%s」失败（%s），%s', label, e.message,
      cachedItems.length ? '使用本地缓存' : '该列表显示空状态');
    return { items: sortItems(cachedItems), updatedAt: cachedAt, fetched: false };
  }
}

function formatTime(ts) {
  if (!ts) return '';
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(ts));
  } catch (e) {
    return new Date(ts).toISOString().slice(0, 10);
  }
}

const STYLE = `
.bangumi-page { display: flex; flex-direction: column; gap: 1rem; }
.bangumi-header { padding: 1.25rem 1.5rem; }
.bangumi-header h1 { margin: 0 0 .35rem; font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #1f2937); }
.bangumi-header p { margin: 0; font-size: .85rem; color: var(--text-tertiary, #6b7280); }
.bangumi-header a { color: var(--primary, #10b981); text-decoration: none; }
.bangumi-tabs { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .9rem; }
.bangumi-tab { display: inline-flex; align-items: center; gap: .4rem; padding: .42rem 1.05rem; border-radius: 999px; border: 1px solid var(--line-divider, #e5e7eb); background: var(--card-bg, #fff); color: var(--text-secondary, #4b5563); font-size: .875rem; font-weight: 600; text-decoration: none; transition: color .2s ease, border-color .2s ease, background-color .2s ease; }
.bangumi-tab:hover { color: var(--primary, #10b981); border-color: var(--primary, #10b981); }
.bangumi-tab.active { background: var(--primary, #10b981); border-color: var(--primary, #10b981); color: #fff; }
.bangumi-tab-count { font-size: .78rem; font-weight: 500; opacity: .85; }
.bangumi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1rem; }
.bangumi-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; transition: transform .2s ease, box-shadow .2s ease; }
.bangumi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, .12); }
.bangumi-cover { aspect-ratio: 3 / 4; background: linear-gradient(135deg, #e5e7eb, #f3f4f6); overflow: hidden; }
.bangumi-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bangumi-info { padding: .6rem .7rem .8rem; display: flex; flex-direction: column; gap: .3rem; }
.bangumi-title { margin: 0; font-size: .9rem; font-weight: 600; line-height: 1.35; color: var(--text-primary, #1f2937); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bangumi-sub { font-size: .74rem; color: var(--text-tertiary, #6b7280); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bangumi-meta { display: flex; align-items: center; flex-wrap: wrap; gap: .4rem; font-size: .74rem; color: var(--text-secondary, #4b5563); }
.bangumi-progress { color: var(--primary, #10b981); font-weight: 600; }
.bangumi-empty { padding: 2rem 1.5rem; text-align: center; color: var(--text-secondary, #4b5563); line-height: 1.9; }
.bangumi-empty a { color: var(--primary, #10b981); }
.bangumi-pager { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: .4rem; margin-top: .35rem; }
.bangumi-page-link { display: inline-flex; align-items: center; justify-content: center; min-width: 2.25rem; height: 2.25rem; padding: 0 .65rem; border-radius: .6rem; border: 1px solid var(--line-divider, #e5e7eb); background: var(--card-bg, #fff); color: var(--text-secondary, #4b5563); font-size: .85rem; text-decoration: none; }
.bangumi-page-link:hover { color: var(--primary, #10b981); border-color: var(--primary, #10b981); }
.bangumi-page-link.active { background: var(--primary, #10b981); border-color: var(--primary, #10b981); color: #fff; }
.bangumi-page-link.disabled { opacity: .45; cursor: not-allowed; }
.bangumi-page-ellipsis { color: var(--text-tertiary, #9ca3af); padding: 0 .15rem; }
@media (max-width: 640px) {
  .bangumi-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: .75rem; }
  .bangumi-header { padding: 1rem 1.1rem; }
}
`;

function renderCard(item) {
  const title = escapeHtml(item.name || item.nameOriginal || '未知条目');
  const sub = item.nameOriginal && item.nameOriginal !== item.name ? escapeHtml(item.nameOriginal) : '';
  const year = item.date ? escapeHtml(String(item.date).slice(0, 4)) : '';
  const progress = item.eps > 0
    ? (item.totalEps ? `看到 ${item.eps} / ${item.totalEps} 话` : `看到 ${item.eps} 话`)
    : '暂无观看进度';

  return `
      <a class="bangumi-card card-base" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" title="${title}">
        <div class="bangumi-cover">
          ${item.cover ? `<img src="${escapeHtml(item.cover)}" alt="${title}" loading="lazy" referrerpolicy="no-referrer">` : ''}
        </div>
        <div class="bangumi-info">
          <h3 class="bangumi-title">${title}</h3>
          ${sub ? `<span class="bangumi-sub">${sub}</span>` : ''}
          <div class="bangumi-meta">
            ${year ? `<span class="bangumi-year">${year}</span>` : ''}
            ${item.score > 0 ? `<span class="bangumi-score">★ ${item.score.toFixed(1)}</span>` : ''}
            <span class="bangumi-progress">${escapeHtml(progress)}</span>
          </div>
        </div>
      </a>`;
}

function renderTabs(activeKind, counts) {
  const tabs = [
    { kind: 'watching', label: '在看', count: counts.watching, href: `${SITE_ROOT}/bangumi/` },
    { kind: 'watched', label: '看过', count: counts.watched, href: `${SITE_ROOT}/bangumi/watched/` }
  ];

  return `<div class="bangumi-tabs">
        ${tabs.map(function (tab) {
          const active = tab.kind === activeKind;
          return `<a class="bangumi-tab${active ? ' active' : ''}" href="${tab.href}"${active ? ' aria-current="page"' : ''}>${tab.label}<span class="bangumi-tab-count">${tab.count}</span></a>`;
        }).join('\n        ')}
      </div>`;
}

function pageHref(basePath, page) {
  return page === 1 ? `${SITE_ROOT}${basePath}/` : `${SITE_ROOT}${basePath}/page/${page}/`;
}

function renderPager(basePath, current, total) {
  if (total <= 1) return '';

  const nums = new Set();
  nums.add(1);
  nums.add(total);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) nums.add(p);
  }

  const sorted = Array.from(nums).sort(function (a, b) { return a - b; });
  const parts = [];
  let prev = 0;
  sorted.forEach(function (p) {
    if (prev && p - prev > 1) parts.push('<span class="bangumi-page-ellipsis">…</span>');
    parts.push(`<a class="bangumi-page-link${p === current ? ' active' : ''}" href="${pageHref(basePath, p)}"${p === current ? ' aria-current="page"' : ''}>${p}</a>`);
    prev = p;
  });

  const prevLink = current > 1
    ? `<a class="bangumi-page-link" href="${pageHref(basePath, current - 1)}" rel="prev">上一页</a>`
    : '<span class="bangumi-page-link disabled">上一页</span>';
  const nextLink = current < total
    ? `<a class="bangumi-page-link" href="${pageHref(basePath, current + 1)}" rel="next">下一页</a>`
    : '<span class="bangumi-page-link disabled">下一页</span>';

  return `<nav class="bangumi-pager" aria-label="分页">
        ${prevLink}
        ${parts.join('\n        ')}
        ${nextLink}
      </nav>`;
}

function renderPage(options) {
  const kind = options.kind;
  const items = options.items;
  const counts = options.counts;
  const updated = formatTime(options.updatedAt);

  const head = `
    <div class="bangumi-header card-base">
      <h1>追番</h1>
      <p>来自 <a href="${USER_PAGE}" target="_blank" rel="noopener noreferrer">Bangumi</a> 的动画收藏 · 在看 ${counts.watching} 部 · 看过 ${counts.watched} 部${updated ? ' · 数据同步于 ' + updated : ''}</p>
      ${renderTabs(kind, counts)}
    </div>`;

  let body;
  if (items.length) {
    body = `<div class="bangumi-grid">
        ${items.map(renderCard).join('\n')}
      </div>
      ${renderPager(options.basePath, options.page, options.totalPages)}`;
  } else {
    const emptyText = kind === 'watched' ? '还没有标记「看过」的动画。' : '暂时没有「在看」的动画。';
    body = `<div class="bangumi-empty card-base">
        <p>${emptyText}</p>
        <p>可能是构建时没有联网，或 Bangumi API 暂时不可用；重新生成博客会自动重试。</p>
        <p><a href="${USER_PAGE}" target="_blank" rel="noopener noreferrer">直接去 Bangumi 查看</a></p>
      </div>`;
  }

  return `<style>${STYLE}</style>
<div class="bangumi-page">
  ${head}
  ${body}
</div>`;
}

function routePath(basePath, page) {
  const clean = basePath.replace(/^\/+/, '');
  return page === 1 ? `${clean}/index.html` : `${clean}/page/${page}/index.html`;
}

function routePermalink(basePath, page) {
  return `${SITE_URL}${basePath}${page === 1 ? '/' : `/page/${page}/`}`;
}

function buildRoutes(kind, basePath, items, counts, updatedAt) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const routes = [];

  for (let page = 1; page <= totalPages; page++) {
    routes.push({
      path: routePath(basePath, page),
      layout: 'page',
      data: {
        title: (kind === 'watching' ? '追番' : '追番 · 看过') + (page > 1 ? ` · 第 ${page} 页` : ''),
        permalink: routePermalink(basePath, page),
        content: renderPage({
          kind: kind,
          items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
          page: page,
          totalPages: totalPages,
          basePath: basePath,
          counts: counts,
          updatedAt: updatedAt
        })
      }
    });
  }

  return routes;
}

hexo.extend.generator.register('firefly-bangumi', async function () {
  if (!isEnabled()) return;

  const cache = readCache();
  const results = await Promise.all([
    resolveList('watching', 3, '在看', cache),
    resolveList('watched', 2, '看过', cache)
  ]);

  const watching = results[0];
  const watched = results[1];

  if (watching.fetched || watched.fetched) {
    writeCache({
      updated: { watching: watching.updatedAt, watched: watched.updatedAt },
      watching: watching.items,
      watched: watched.items
    });
    hexo.log.info('[bangumi] 收藏同步完成：在看 %d 部，看过 %d 部', watching.items.length, watched.items.length);
  }

  const counts = { watching: watching.items.length, watched: watched.items.length };
  const updatedAt = Math.max(watching.updatedAt || 0, watched.updatedAt || 0);

  return buildRoutes('watching', '/bangumi', watching.items, counts, updatedAt)
    .concat(buildRoutes('watched', '/bangumi/watched', watched.items, counts, updatedAt));
});

// 在顶部导航「关于」之前插入「追番」
hexo.extend.filter.register('after_render:html', function (html) {
  if (typeof html !== 'string') return html;
  if (!isEnabled()) return html;
  if (html.indexOf('class="navbar-links"') === -1) return html;
  if (html.indexOf('data-bangumi-nav') !== -1) return html;

  const aboutHref = `href="${SITE_ROOT}/about"`;
  const bangumiHref = `${SITE_ROOT}/bangumi/`;

  const aboutIndex = html.indexOf(aboutHref);
  if (aboutIndex === -1) return html;

  const liStart = html.lastIndexOf('<li', aboutIndex);
  if (liStart === -1) return html;

  const isBangumiPage = html.indexOf('class="bangumi-page"') !== -1;
  const navItem = `
        <li class="navbar-link-item" role="none" data-bangumi-nav>
          <a href="${bangumiHref}" class="navbar-link${isBangumiPage ? ' active' : ''}" role="menuitem">
            <span class="navbar-link-content">
              <span class="material-symbols-outlined">live_tv</span>
              <span>追番</span>
            </span>
            <span class="material-symbols-outlined dropdown-arrow mobile-arrow">chevron_right</span>
          </a>
        </li>`;

  return html.slice(0, liStart) + navItem + '\n        ' + html.slice(liStart);
});
