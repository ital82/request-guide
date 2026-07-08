/**
 * オーバーレイ描画の単一ソース（サーバーのオーバーレイページと、独立版設定ツールの
 * プレビューの両方がこのモジュールを使う）。
 *
 * 純粋な文字列生成のみ（DOM APIやサーバー依存なし）なので、ブラウザからも Node からも
 * import できる。色は "#028090" でも "028090" でもどちらでも受け付ける。
 */

export function hexToRgb(hex) {
  hex = String(hex == null ? '' : hex).replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// 先頭 '#' を除いた16進カラー（solid color 用）
function col(c) {
  return String(c == null ? '' : c).replace('#', '');
}

// DOMに依存しないHTMLエスケープ
export function escapeHtml(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function getAnimationCSS(animation, speed) {
  const animations = {
    slideInLeft: `@keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } } .request-item.new-item { animation: slideInLeft ${speed}s ease-out; }`,
    slideInRight: `@keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } } .request-item.new-item { animation: slideInRight ${speed}s ease-out; }`,
    slideInBottom: `@keyframes slideInBottom { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } } .request-item.new-item { animation: slideInBottom ${speed}s ease-out; }`,
    fadeIn: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .request-item.new-item { animation: fadeIn ${speed}s ease-out; }`,
    zoomIn: `@keyframes zoomIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } } .request-item.new-item { animation: zoomIn ${speed}s ease-out; }`,
    bounceIn: `@keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3) translateY(-50px); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); } } .request-item.new-item { animation: bounceIn ${speed}s ease-out; }`,
    flipIn: `@keyframes flipIn { from { opacity: 0; transform: rotateY(90deg); } to { opacity: 1; transform: rotateY(0deg); } } .request-item.new-item { animation: flipIn ${speed}s ease-out; }`,
    slideRotate: `@keyframes slideRotate { from { opacity: 0; transform: translateX(-100px) rotate(-10deg); } to { opacity: 1; transform: translateX(0) rotate(0deg); } } .request-item.new-item { animation: slideRotate ${speed}s ease-out; }`,
    glowPulse: `@keyframes glowPulse { 0% { opacity: 0; transform: scale(0.8); box-shadow: 0 0 0px rgba(2, 195, 154, 0); } 50% { box-shadow: 0 0 30px rgba(2, 195, 154, 0.8); } 100% { opacity: 1; transform: scale(1); box-shadow: 0 6px 12px rgba(0,0,0,0.5); } } .request-item.new-item { animation: glowPulse ${speed}s ease-out; }`,
    typewriter: `@keyframes typewriter { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } } .request-item.new-item .song { overflow: hidden; white-space: nowrap; animation: typewriter ${speed}s steps(40, end); }`,
    none: ``,
  };
  return animations[animation] || animations.slideInLeft;
}

// オーバーレイの <style> 中身を生成
export function overlayStyleText(cfg) {
  const bg = Number(cfg.bgOpacity) > 0 ? `rgba(${hexToRgb(cfg.bgcolor)}, ${Number(cfg.bgOpacity) / 100})` : 'transparent';
  const cardHi = Number(cfg.cardBgOpacity) / 100;
  const cardLo = Math.max(0, Number(cfg.cardBgOpacity) - 10) / 100;
  return `
    body { margin: 0; padding: 0; font-family: 'Yu Gothic', 'Meiryo', sans-serif; background: transparent; color: white; overflow: hidden; display: flex; justify-content: center; align-items: flex-start; }
    .container { width: ${cfg.containerWidth}; height: ${cfg.containerHeight}; max-height: 100vh; padding: ${cfg.containerPadding}px; background: ${bg}; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box; }
    .container::-webkit-scrollbar { width: 8px; }
    .container::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
    .container::-webkit-scrollbar-thumb { background: rgba(${hexToRgb(cfg.titleColor)}, 0.5); border-radius: 4px; }
    .container::-webkit-scrollbar-thumb:hover { background: rgba(${hexToRgb(cfg.titleColor)}, 0.8); }
    .title { font-size: ${cfg.titleSize}px; font-weight: bold; text-align: center; color: #${col(cfg.titleColor)}; text-shadow: 3px 3px 6px rgba(0,0,0,0.9); margin-bottom: 25px; padding: 15px; background: rgba(${hexToRgb(cfg.bgcolor)}, ${Number(cfg.titleBgOpacity) / 100}); border-radius: 15px; display: ${cfg.showTitle ? 'block' : 'none'}; }
    .request-list { display: flex; flex-direction: column; gap: ${cfg.itemGap}px; }
    .request-item { background: linear-gradient(135deg, rgba(${hexToRgb(cfg.cardBg)}, ${cardHi}), rgba(${hexToRgb(cfg.cardBg)}, ${cardLo})); padding: ${cfg.itemPadding}; border-radius: 12px; border-left: 5px solid #${col(cfg.titleColor)}; box-shadow: 0 6px 12px rgba(0,0,0,0.5); }
    .request-item .number { font-size: ${cfg.subTextSize}px; color: rgba(${hexToRgb(cfg.subTextColor)}, 0.8); font-weight: bold; margin-bottom: 5px; }
    .request-item .song { font-size: ${cfg.textSize}px; font-weight: bold; color: #${col(cfg.textColor)}; margin-bottom: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7); }
    .request-item .meta { font-size: ${cfg.subTextSize}px; color: rgba(${hexToRgb(cfg.subTextColor)}, 0.8); font-weight: normal; display: flex; gap: 10px; }
    ${getAnimationCSS(cfg.animation, cfg.animSpeed)}
    .no-requests { text-align: center; font-size: 22px; color: rgba(255,255,255,0.6); padding: 60px 20px; background: rgba(47, 60, 126, 0.3); border-radius: 15px; border: 2px dashed rgba(255,255,255,0.3); }
  `;
}

// タイトル欄のHTML
export function titleHTML(cfg) {
  const ic = cfg.icon ? escapeHtml(cfg.icon) + ' ' : '';
  return `<div class="title">${ic}リクエスト一覧</div>`;
}

export const NO_REQUESTS_HTML = '<div class="no-requests">リクエストを待っています...</div>';

/**
 * #requestList の中身を生成する。表示件数上限・並び順・新規判定を含む。
 * @param {Object} cfg 設定
 * @param {Array} requests リクエスト配列（古い順）
 * @param {Set}   prevNumbers 前回表示していた番号（新規アニメ判定用。省略可）
 * @returns {{html: string, current: Set}} 生成HTMLと今回の表示番号集合
 */
export function renderRequests(cfg, requests, prevNumbers) {
  const limit = Number(cfg.displayLimit) > 0 ? Number(cfg.displayLimit) : requests.length;
  const limited = requests.slice(0, limit);
  const current = new Set(limited.map((r) => r.requestNumber));
  if (limited.length === 0) return { html: NO_REQUESTS_HTML, current };

  const html = limited.map((req) => {
    const isNew = prevNumbers && !prevNumbers.has(req.requestNumber);
    let h = `<div class="request-item${isNew ? ' new-item' : ''}" data-number="${req.requestNumber}">`;
    if (cfg.showNumber) h += `<div class="number">#${req.requestNumber}</div>`;
    const songIcon = (cfg.showSongIcon && cfg.icon) ? escapeHtml(cfg.icon) + ' ' : '';
    h += `<div class="song">${songIcon}${escapeHtml(req.song)}</div>`;
    h += '<div class="meta">';
    if (cfg.showAuthor && req.authorName) h += `<span>@${escapeHtml(req.authorName)}</span>`;
    if (cfg.showTimestamp) h += `<span>${escapeHtml(req.timestamp)}</span>`;
    h += '</div></div>';
    return h;
  }).join('');
  return { html, current };
}
