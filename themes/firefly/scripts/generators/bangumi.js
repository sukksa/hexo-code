'use strict';

/**
 * Bangumi 追番页生成器
 *
 * 配置见 _config.yml 的 bangumi 节点（站点级可用 _config.firefly.yml 覆盖）：
 *   bangumi:
 *     enable: true
 *     user: "726667"
 *     label: "追番"
 *     page_size: 20
 *     cache_ttl: 6
 *     tabs:
 *       - { key: watching, label: 在看, type: 3, path: /bangumi }
 *       - { key: watched,  label: 看过, type: 2, path: /bangumi/watched, show_progress: false }
 *
 * 生成的路由：
 *   {tab.path}/           第 1 页
 *   {tab.path}/page/N/    第 N 页
 *
 * 数据缓存到站点根目录 .bangumi-cache.json，构建失败（离线）时回退到旧缓存。
 */

const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(hexo.base_dir, '.bangumi-cache.json');
const API_BASE = 'https://api.bgm.tv/v0/users';
const USER_AGENT = 'hexo-theme-firefly (+https://github.com/LKDenchin/hexo-theme-firefly)';
const PAGE_LIMIT = 50;
const MAX_API_PAGES = 40;
const REQUEST_TIMEOUT = 10000;

function getConfig() {
  const themeConfig = (hexo.theme && hexo.theme.config) || {};
  const pages = themeConfig.pages || {};
  const cfg = themeConfig.bangumi || {};
  const tabs = (Array.isArray(cfg.tabs) ? cfg.tabs : [])
    .filter(function (tab) {
      return tab && tab.key && tab.type;
    })
    .map(function (tab) {
      const tabPath = '/' + String(tab.path || '/bangumi/' + tab.key).replace(/^\/+|\/+$/g, '');
      return {
        key: String(tab.key),
        label: tab.label || String(tab.key),
        type: Number(tab.type),
        path: tabPath,
        showProgress: tab.show_progress !== false
      };
    });
  const cacheHours = Number(cfg.cache_ttl);
  const columns = parseInt(cfg.columns, 10) === 5 ? 5 : 4;
  return {
    enabled: pages.bangumi !== false && cfg.enable !== false && Boolean(cfg.user) && tabs.length > 0,
    user: String(cfg.user || ''),
    label: cfg.label || '追番',
    pageSize: Math.max(1, parseInt(cfg.page_size, 10) || 20),
    // 关闭分页时忽略 page_size，所有条目在一页里以瀑布流展示
    pagination: cfg.pagination !== false,
    // 每行卡片数，仅支持 4 或 5
    columns: columns,
    cacheTtl: (Number.isFinite(cacheHours) && cacheHours >= 0 ? cacheHours : 6) * 60 * 60 * 1000,
    tabs: tabs
  };
}

function normalizeImage(url) {
  if (!url) return '';
  return url.indexOf('//') === 0 ? 'https:' + url : url;
}

function simplify(entry) {
  const subject = entry.subject || {};
  const images = subject.images || {};
  return {
    id: subject.id || entry.subject_id,
    name: subject.name_cn || subject.name || '',
    nameCn: subject.name_cn || '',
    nameOriginal: subject.name_cn ? subject.name : '',
    cover: normalizeImage(images.large || images.common || images.medium || ''),
    eps: Number(entry.ep_status) || 0,
    totalEps: Number(subject.eps) || 0,
    score: Number(subject.score) || 0,
    date: subject.date || '',
    updatedAt: entry.updated_at || '',
    url: 'https://bangumi.tv/subject/' + (subject.id || entry.subject_id)
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
    return { updated: {}, lists: {} };
  }
  if (!raw || typeof raw !== 'object') return { updated: {}, lists: {} };

  if (raw.lists && typeof raw.lists === 'object') {
    return { updated: raw.updated || {}, lists: raw.lists };
  }

  // 兼容旧结构（按 key 平铺的数组）
  const lists = {};
  Object.keys(raw).forEach(function (key) {
    if (Array.isArray(raw[key])) lists[key] = raw[key];
  });
  return { updated: raw.updated && typeof raw.updated === 'object' ? raw.updated : {}, lists: lists };
}

function writeCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    hexo.log.warn('[bangumi] 写入缓存失败：%s', e.message);
  }
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function requestJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, REQUEST_TIMEOUT);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controller.signal
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchList(user, type) {
  const items = [];
  for (let page = 0; page < MAX_API_PAGES; page++) {
    if (page > 0) await delay(200);
    const url =
      API_BASE +
      '/' + encodeURIComponent(user) +
      '/collections?subject_type=2&type=' + type +
      '&limit=' + PAGE_LIMIT + '&offset=' + page * PAGE_LIMIT;
    const json = await requestJson(url);
    if (!json || !Array.isArray(json.data)) throw new Error('返回数据格式异常');
    items.push.apply(items, json.data.map(simplify));
    if (json.data.length < PAGE_LIMIT) break;
  }
  return items;
}

async function resolveList(tab, cache, cfg) {
  const cached = Array.isArray(cache.lists[tab.key]) ? cache.lists[tab.key] : [];
  const cachedAt = cache.updated[tab.key] || 0;
  const fresh = cached.length > 0 && Date.now() - cachedAt < cfg.cacheTtl;

  if (fresh) return { items: sortItems(cached), updatedAt: cachedAt, fetched: false };

  try {
    const items = sortItems(await fetchList(cfg.user, tab.type));
    return { items: items, updatedAt: Date.now(), fetched: true };
  } catch (e) {
    hexo.log.warn('[bangumi] 拉取「%s」失败（%s），%s', tab.label, e.message, cached.length ? '使用本地缓存' : '该 Tab 显示空状态');
    return { items: sortItems(cached), updatedAt: cachedAt, fetched: false };
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

function pagePath(basePath, page) {
  const base = basePath.replace(/\/+$/, '');
  return page === 1 ? base + '/' : base + '/page/' + page + '/';
}

function routePath(basePath, page) {
  const clean = basePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return page === 1 ? clean + '/index.html' : clean + '/page/' + page + '/index.html';
}

function buildPager(basePath, current, total) {
  const nums = new Set([1, total]);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) nums.add(p);
  }

  const sorted = Array.from(nums).sort(function (a, b) {
    return a - b;
  });
  const links = [];
  let prev = 0;
  sorted.forEach(function (p) {
    if (prev && p - prev > 1) links.push({ ellipsis: true });
    links.push({ page: p, path: pagePath(basePath, p), active: p === current });
    prev = p;
  });

  return {
    current: current,
    total: total,
    links: links,
    prevPath: current > 1 ? pagePath(basePath, current - 1) : '',
    nextPath: current < total ? pagePath(basePath, current + 1) : ''
  };
}

hexo.extend.generator.register('firefly-bangumi', async function () {
  const cfg = getConfig();
  const themeConfig = (hexo.theme && hexo.theme.config) || {};
  themeConfig.bangumi = themeConfig.bangumi || {};

  if (!cfg.enabled) {
    // 关闭时清掉统计计数，避免侧栏「站点统计」残留旧数据
    delete themeConfig.bangumi._counts;
    return;
  }

  const cache = readCache();
  const results = {};
  await Promise.all(
    cfg.tabs.map(async function (tab) {
      results[tab.key] = await resolveList(tab, cache, cfg);
    })
  );

  if (cfg.tabs.some(function (tab) { return results[tab.key].fetched; })) {
    const updated = {};
    const lists = {};
    cfg.tabs.forEach(function (tab) {
      updated[tab.key] = results[tab.key].updatedAt;
      lists[tab.key] = results[tab.key].items;
    });
    writeCache({ updated: updated, lists: lists });
    hexo.log.info(
      '[bangumi] 收藏同步完成：%s',
      cfg.tabs.map(function (tab) { return tab.label + ' ' + results[tab.key].items.length; }).join('，')
    );
  }

  const counts = {};
  cfg.tabs.forEach(function (tab) {
    counts[tab.key] = results[tab.key].items.length;
  });

  // 供「站点统计」侧栏使用：在看（type 3）+ 看过（type 2）的收藏总数
  const totalCollections = cfg.tabs.reduce(function (sum, tab) {
    if (tab.type !== 2 && tab.type !== 3) return sum;
    return sum + (counts[tab.key] || 0);
  }, 0);
  themeConfig.bangumi._counts = { total: totalCollections, tabs: counts };

  const updatedAt = Math.max.apply(
    null,
    cfg.tabs.map(function (tab) { return results[tab.key].updatedAt || 0; }).concat([0])
  );
  const siteUrl = String(hexo.config.url || '').replace(/\/+$/, '');
  const firstTabKey = cfg.tabs[0].key;
  const routes = [];

  // 用主题的卡片模板渲染 chunk 片段，保证和首屏卡片完全一致
  const cardView = typeof hexo.theme.getView === 'function'
    ? hexo.theme.getView('_partials/bangumi/card')
    : null;

  function renderCards(list, showProgress) {
    if (!cardView) return '';
    return list
      .map(function (item) {
        return cardView.renderSync({ item: item, showProgress: showProgress });
      })
      .join('\n');
  }

  cfg.tabs.forEach(function (tab) {
    const items = results[tab.key].items;
    const pagination = cfg.pagination;
    const totalPages = Math.max(1, Math.ceil(items.length / cfg.pageSize));
    const clean = tab.path.replace(/^\/+/, '').replace(/\/+$/, '');
    const baseData = {
      label: cfg.label,
      user: cfg.user,
      activeKey: tab.key,
      showProgress: tab.showProgress,
      tabs: cfg.tabs.map(function (t) {
        return { key: t.key, label: t.label, path: t.path, count: counts[t.key] };
      }),
      columns: cfg.columns,
      mode: 'grid',
      updatedText: formatTime(updatedAt)
    };

    if (pagination) {
      for (let page = 1; page <= totalPages; page++) {
        routes.push({
          path: routePath(tab.path, page),
          layout: 'bangumi',
          data: {
            layout: 'bangumi',
            title:
              cfg.label +
              (tab.key === firstTabKey ? '' : ' · ' + tab.label) +
              (page > 1 ? ' · 第 ' + page + ' 页' : ''),
            permalink: siteUrl + pagePath(tab.path, page),
            bangumi: Object.assign({}, baseData, {
              pagination: true,
              infinite: null,
              items: items.slice((page - 1) * cfg.pageSize, page * cfg.pageSize),
              currentPage: page,
              totalPages: totalPages,
              pager: buildPager(tab.path, page, totalPages)
            })
          }
        });
      }
      return;
    }

    // 关闭分页：首屏只渲染第一批，其余生成为 chunk 片段，由前端滚动到底部时按需加载
    routes.push({
      path: routePath(tab.path, 1),
      layout: 'bangumi',
      data: {
        layout: 'bangumi',
        title: cfg.label + (tab.key === firstTabKey ? '' : ' · ' + tab.label),
        permalink: siteUrl + pagePath(tab.path, 1),
        bangumi: Object.assign({}, baseData, {
          pagination: false,
          infinite:
            totalPages > 1
              ? {
                  chunkBase: tab.path + '/chunk/',
                  totalChunks: totalPages,
                  nextChunk: 2
                }
              : null,
          items: items.slice(0, cfg.pageSize),
          currentPage: 1,
          totalPages: totalPages,
          pager: null
        })
      }
    });

    for (let page = 2; page <= totalPages; page++) {
      routes.push({
        path: clean + '/chunk/' + page + '.html',
        data: renderCards(items.slice((page - 1) * cfg.pageSize, page * cfg.pageSize), tab.showProgress)
      });
    }
  });

  return routes;
});
