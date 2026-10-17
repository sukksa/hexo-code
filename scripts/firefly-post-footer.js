'use strict';

/**
 * Firefly 的 footer-widgets.ejs 会无条件输出「相关文章 / 随机文章」两块，
 * 并不读取 post.related.enable（主题缺陷）。
 *
 * 这里在页面渲染完成后按配置把这两块裁掉，无需修改主题文件：
 *   _config.firefly.yml -> post.related.enable: false  隐藏
 *   _config.firefly.yml -> post.related.enable: true   恢复显示
 */

const ROW_OPEN = '<div class="post-recommendations-row">';
const ROW_COMMENT = '<!-- Side-by-Side Recommendations Grid -->';

// 从 openTag 开始，按 <div> / </div> 配对，裁掉整个外层块
function stripDivBlock(html, openTag) {
  const start = html.indexOf(openTag);
  if (start === -1) return html;

  const tagRe = /<div\b[^>]*>|<\/div>/gi;
  tagRe.lastIndex = start;

  let depth = 0;
  let match;
  while ((match = tagRe.exec(html)) !== null) {
    if (match[0].charAt(1) === '/') {
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, start) + html.slice(tagRe.lastIndex);
      }
    } else {
      depth += 1;
    }
  }
  return html;
}

hexo.extend.filter.register('after_render:html', function (content) {
  if (typeof content !== 'string' || content.indexOf(ROW_OPEN) === -1) return content;

  const themeConfig = (hexo.theme && hexo.theme.config) || {};
  const related = themeConfig.post && themeConfig.post.related;
  if (!related || related.enable !== false) return content;

  return stripDivBlock(content.replace(ROW_COMMENT, ''), ROW_OPEN);
});
