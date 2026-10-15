/* ==========================================================
 * 李宁个人介绍 · 交互脚本
 * 核心逻辑：
 *   1) 鼠标悬浮到 4 个卡片热区上，切换对应的 1/2/3/4 图片
 *   2) 点击卡片，弹窗显示对应的内容
 * ========================================================== */
(function(){
  'use strict';

  const $  = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  /* ============ 加载页 → 视频开场 ============ */
  const loader    = $('#loader');
  const loaderBar = $('#loaderBar');
  const loaderNum = $('#loaderNum');
  const loaderTip = $('#loaderTip');
  const intro     = $('#intro');
  const introVid  = $('#introVideo');
  const introSkip = $('#introSkip');
  const soundBtn  = $('#soundBtn');
  const stage     = $('#stage');

  // 圆周长：2πr = 2*π*92 ≈ 578.05
  const CIRC = 578.05;
  const TIPS = ['正在准备视频…','快好了…','缓冲中…','马上就好…'];

  function setLoader(p, tip){
    if(loaderBar) loaderBar.style.strokeDashoffset = String(CIRC * (1 - Math.max(0, Math.min(1, p))));
    if(loaderNum) loaderNum.textContent = Math.round(p * 100) + '%';
    if(loaderTip && tip) loaderTip.textContent = tip;
  }
  setLoader(0, TIPS[0]);

  // 加载开始时间：用于保证 loading 至少显示 3 秒
  const startTime = performance.now();

  function endLoader(){
    if(!loader || loader.classList.contains('is-hidden')) return;
    // 至少显示 3 秒；即使视频 100% 也额外再等 2 秒
    const elapsed = performance.now() - startTime;
    const wait    = Math.max(0, 3000 - elapsed) + 2000;
    setLoader(1, '准备好了 即将进入');
    if(intro) intro.setAttribute('aria-hidden', 'false');
    setTimeout(()=>{
      loader.classList.add('is-hidden');
      const p = introVid && introVid.play();
      if(p && typeof p.catch === 'function') p.catch(()=>{ /* 被拦截用户点跳过即可 */ });
    }, wait + 200);
  }

  function endIntro(){
    if(!intro || intro.classList.contains('is-hidden')) return;
    intro.classList.add('is-hidden');
    if(stage) stage.removeAttribute('aria-hidden');
    setTimeout(()=>{ if(introVid){ introVid.pause(); } }, 700);
  }

  if(intro && introVid){
    // 视频自然结束 / 出错 → 跳过
    introVid.addEventListener('ended', endIntro);
    introVid.addEventListener('error', endIntro);

    // 跳过按钮
    if(introSkip) introSkip.addEventListener('click', (e)=>{ e.stopPropagation(); endIntro(); });

    // 声音按钮
    if(soundBtn){
      const lbl = $('#soundBtnLabel');
      function syncSoundBtn(){
        const muted = introVid.muted;
        soundBtn.setAttribute('aria-pressed', String(!muted));
        soundBtn.setAttribute('aria-label', muted ? '打开声音' : '关闭声音');
        if(lbl) lbl.textContent = muted ? '打开声音' : '关闭声音';
      }
      syncSoundBtn(); // 初始：根据当前 muted 状态同步
      soundBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        introVid.muted = !introVid.muted;
        syncSoundBtn();
      });
    }

    // 点击视频也可跳过
    introVid.addEventListener('click', endIntro);
    intro.addEventListener('click', endIntro);
    document.addEventListener('keydown', function onEsc(e){
      if(e.key === 'Escape' && !intro.classList.contains('is-hidden')){
        endIntro();
        document.removeEventListener('keydown', onEsc);
      }
    });
    // 兜底：15 秒强制跳过
    setTimeout(()=>{ if(intro && !intro.classList.contains('is-hidden')) endIntro(); }, 15000);
  }

  /* ============ 视频加载进度 ============ */
  if(introVid){
    let tipIdx = 0;
    let tipTimer = setInterval(()=>{
      tipIdx = (tipIdx + 1) % TIPS.length;
      if(loaderTip) loaderTip.textContent = TIPS[tipIdx];
    }, 1400);

    // 进度：progress 事件（最准）
    introVid.addEventListener('progress', ()=>{
      if(!introVid.duration) return;
      let p = 0;
      try{
        if(introVid.buffered.length){
          p = introVid.buffered.end(introVid.buffered.length - 1) / introVid.duration;
        }
      }catch(_){}
      if(p > 0) setLoader(p);
    });

    // 可播放时直接结束 loading
    const ready = ()=>{
      setLoader(1, '准备好了 即将进入');
      clearInterval(tipTimer);
      // 极短延迟，让用户看到 100%
      setTimeout(endLoader, 200);
    };
    introVid.addEventListener('canplaythrough', ready);
    introVid.addEventListener('canplay', ()=>{
      // canplay 即可，进度条继续往后走
      if(introVid.readyState >= 3) ready();
    });

    // 视频元数据加载到就给个 30% 视觉
    introVid.addEventListener('loadedmetadata', ()=> setLoader(Math.max(0.3, getLoaderVal()), '正在解码…'));

    // 兜底：网络太慢，最多等 3 秒
    setTimeout(()=>{
      if(loader && !loader.classList.contains('is-hidden')){
        clearInterval(tipTimer);
        setLoader(1, '网络较慢，直接进入');
        endLoader();
      }
    }, 3000);
  }

  function getLoaderVal(){
    if(!loaderBar) return 0;
    const off = parseFloat(loaderBar.style.strokeDashoffset || '0');
    return 1 - off / CIRC;
  }

  /* ============ 图片切换 ============ */
  const sceneImgs = $$('.scene-img');
  function showScene(key){
    sceneImgs.forEach(img => {
      img.classList.toggle('is-active', img.dataset.key === key);
    });
  }

  // 预加载 4 张场景图，避免悬浮时卡顿
  ['1','2','3','4'].forEach(k => {
    const i = new Image();
    i.src = `assets/scene-${k}.png`;
  });

  // 给每个热区绑定 hover/click
  // 用一个延迟定时器，避免在两个热区之间移动时短暂显示 cover 造成的闪烁
  let leaveTimer = null;
  function cancelLeave(){
    if(leaveTimer){ clearTimeout(leaveTimer); leaveTimer = null; }
  }
  function scheduleCover(){
    cancelLeave();
    leaveTimer = setTimeout(() => showScene('cover'), 120);
  }

  $$('.hotzone').forEach((zone, idx) => {
    const key   = zone.dataset.key;       // '1' / '2' / '3' / '4' → 用于图片切换
    const card  = (window.CARDS||[])[idx]; // 按顺序对应 CARDS 数组的 4 项
    if(!card) return;

    zone.addEventListener('mouseenter', () => { cancelLeave(); showScene(key); });
    zone.addEventListener('focus',      () => { cancelLeave(); showScene(key); });
    zone.addEventListener('mouseleave', () => { scheduleCover(); });
    zone.addEventListener('blur',       () => { scheduleCover(); });

    zone.addEventListener('click', () => {
      openModal(card.key);
    });
  });

  /* ============ 详情弹窗 ============ */
  const modal       = $('#modal');
  const modalNo     = $('#modalNo');
  const modalTitle  = $('#modalTitle');
  const modalBody   = $('#modalBody');
  const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;

  function esc(str){
    return String(str||'').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function renderCardContent(cardKey){
    const data = window.RESUME || {};
    const card = (window.CARDS||[]).find(c => c.key === cardKey);
    if(!card){ modalBody.innerHTML = '<p>暂无内容</p>'; return; }

    if(cardKey === 'profile'){
      const p = data.profile || {};
      let html = '';

      /* —— 顶部大卡片：证件照 + 名字 + tagline + MBTI —— */
      html += `<div class="profile-head">`;
      if(p.photo){
        html += `<div class="profile-head-photo"><img src="${esc(p.photo)}" alt="${esc(p.name||'证件照')}" /></div>`;
      }
      html += `<div class="profile-head-info">`;
      html += `<div class="profile-head-name">${esc(p.name||'')}</div>`;
      if(p.title)   html += `<div class="profile-head-title">${esc(p.title)}</div>`;
      if(p.tagline) html += `<div class="profile-head-tagline">${esc(p.tagline)}</div>`;
      if(p.intro)   html += `<div class="profile-head-intro">${esc(p.intro)}</div>`;
      if(p.mbti){
        const m = p.mbtiDetail || {};
        const tip = `
          <div class="mbti-tooltip" role="tooltip">
            <div class="mbti-tip-name">${esc(m.name || ('MBTI · ' + p.mbti))}</div>
            ${m.en ? `<div class="mbti-tip-en">${esc(m.en)}</div>` : ''}
            ${m.traits  ? `<div class="mbti-tip-row"><b>性格</b>${esc(m.traits)}</div>`  : ''}
            ${m.strength? `<div class="mbti-tip-row"><b>优势</b>${esc(m.strength)}</div>`: ''}
            ${m.fit     ? `<div class="mbti-tip-row"><b>适合</b>${esc(m.fit)}</div>`     : ''}
            <div class="mbti-tip-hint">悬停查看 · 移动端可点击</div>
          </div>
        `;
        html += `<div class="profile-head-mbti mbti-has-tip" tabindex="0">`
              + `<span class="mbti-label">MBTI</span>`
              + `<span class="mbti-value">${esc(p.mbti)}</span>`
              + `<span class="mbti-info-icon" aria-hidden="true">`
              +   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">`
              +     `<circle cx="12" cy="12" r="9"></circle>`
              +     `<line x1="12" y1="11" x2="12" y2="17"></line>`
              +     `<circle cx="12" cy="7.5" r="0.6" fill="currentColor"></circle>`
              +   `</svg>`
              + `</span>`
              + tip
              + `</div>`;
      }
      html += `</div></div>`;

      /* —— 基础资料小卡片网格 —— */
      if(p.basic && p.basic.length){
        const cards = p.basic.map(b => {
          let inner = `<div class="bcard-label">${esc(b.label)}</div><div class="bcard-value">${esc(b.value||'')}</div>`;
          if(b.type === 'tel' && b.value)  inner = `<a class="bcard-link" href="tel:${esc(b.value)}">${inner}</a>`;
          if(b.type === 'mail' && b.value) inner = `<a class="bcard-link" href="mailto:${esc(b.value)}">${inner}</a>`;
          return `<div class="bcard">${inner}</div>`;
        }).join('');
        html += `<h3>基础资料</h3><div class="bcard-grid">${cards}</div>`;
      }

      /* —— 学历时间线 —— */
      if(p.education && p.education.length){
        const items = p.education.map(e => `
          <div class="edu-item">
            <div class="edu-dot"></div>
            <div class="edu-body">
              <div class="edu-school">${esc(e.school||'')} ${e.tag?`<span class="edu-tag">${esc(e.tag)}</span>`:''}</div>
              <div class="edu-degree">${esc(e.degree||'')} <span class="edu-level">· ${esc(e.level||'')}</span></div>
            </div>
          </div>
        `).join('');
        html += `<h3>教育背景</h3><div class="edu-list">${items}</div>`;
      }

      /* —— 能力概览 —— */
      if(p.abilities && p.abilities.length){
        const groups = p.abilities.map(g => {
          const chips = (g.items||[]).map(it => `
            <div class="achip" title="${esc(it.desc||'')}">
              <span class="achip-name">${esc(it.name)}</span>
              ${it.desc?`<span class="achip-desc">${esc(it.desc)}</span>`:''}
            </div>
          `).join('');
          return `<div class="agroup">
            <div class="agroup-label">${esc(g.group||'')}</div>
            <div class="achip-row">${chips}</div>
          </div>`;
        }).join('');
        html += `<h3>能力概览</h3><div class="agroup-list">${groups}</div>`;
      }

      modalBody.innerHTML = html || '<p>暂无内容</p>';
    }
    else if(cardKey === 'projects'){
      const list = (data.projects||[])
        .filter(p => p.title && p.title !== '待填写')
        .map(p => {
          const link = p.link
            ? `<a class="proj-link" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel||'查看')}</a>`
            : '';
          const stack = (p.stack||[]).map(s => `<span>${esc(s)}</span>`).join('');
          return `
            <div class="proj">
              <div class="proj-title">${esc(p.title)} ${link}</div>
              <div class="ti-body" style="font-weight:700;color:var(--red)">${esc(p.role||'')} <span style="color:var(--muted);font-weight:700">· ${esc(p.time||'')}</span></div>
              <div class="proj-desc">${esc(p.desc||'')}</div>
              <div class="stack">${stack}</div>
            </div>
          `;
        }).join('');
      modalBody.innerHTML = `<h3>项目经历</h3>${list || '<p>暂无内容</p>'}`;
    }
    else if(cardKey === 'experience'){
      const all = (data.experience||[]).filter(e => e.company && e.company !== '待填写');
      const groups = [
        { key: '校园', label: '校园经历' },
        { key: '工作', label: '工作经历' }
      ];
      let html = '';
      let hasAny = false;
      for(const g of groups){
        const items = all.filter(e => (e.category||'') === g.key);
        if(!items.length) continue;
        hasAny = true;

        if(g.key === '工作'){
          /* 工作：每个公司一张卡片，含（实习）标记、角色、时间、bullet */
          const list = items.map(e => {
            const bullets = (e.bullets||[]).filter(b => b && b !== '待填写').map(b => `<li>${esc(b)}</li>`).join('');
            const headBits = [esc(e.company)];
            if(e.internship) headBits.push('<span class="exp-tag">（实习）</span>');
            if(e.role) headBits.push(`<span class="exp-role">${esc(e.role)}</span>`);
            if(e.time) headBits.push(`<span class="exp-when">${esc(e.time)}</span>`);
            return `
              <div class="exp-card">
                <div class="exp-card-head">${headBits.join(' · ')}</div>
                ${bullets ? `<ul class="exp-bullets">${bullets}</ul>` : ''}
              </div>
            `;
          }).join('');
          html += `<h3 class="exp-group">${g.label}</h3><div class="exp-list">${list}</div>`;
        }
        else{
          /* 校园：跟 03 一样的卡片风格，按 研究生 / 本科 分组 */
          const phaseOrder = [
            { key: '研究生', label: '研究生阶段' },
            { key: '本科',   label: '本科阶段'   }
          ];
          let inner = '';
          let any = false;
          for(const ph of phaseOrder){
            const sub = items.filter(e => (e.phase||'') === ph.key);
            if(!sub.length) continue;
            any = true;
            const list = sub.map(e => {
              const headBits = [esc(e.company)];
              if(e.role) headBits.push(`<span class="exp-role">${esc(e.role)}</span>`);
              if(e.time) headBits.push(`<span class="exp-when">${esc(e.time)}</span>`);
              return `
                <div class="exp-card">
                  <div class="exp-card-head">${headBits.join(' · ')}</div>
                  ${e.location ? `<div class="exp-card-loc">${esc(e.location)}</div>` : ''}
                </div>
              `;
            }).join('');
            inner += `<div class="campus-phase"><h4 class="campus-phase-title">${ph.label}</h4><div class="exp-list">${list}</div></div>`;
          }
          html += `<h3 class="exp-group">${g.label}</h3>${any ? inner : ''}`;
        }
      }
      modalBody.innerHTML = hasAny ? html : '<p>暂无内容</p>';
    }
    else if(cardKey === 'honors'){
      const list = (data.honors||[])
        .filter(h => (h.name || h.title) && (h.name || h.title) !== '待填写')
        .map(h => {
          /* 多奖项卡片：title + awards 列表 */
          if(h.title && Array.isArray(h.awards)){
            const items = h.awards.map(a => `<li>${esc(a)}</li>`).join('');
            return `
              <div class="honor-card honor-card--multi">
                <div class="honor-card-head">
                  <span class="honor-card-title">${esc(h.title)}</span>
                  ${h.time ? `<span class="honor-card-time">${esc(h.time)}</span>` : ''}
                </div>
                <ul class="honor-card-awards">${items}</ul>
              </div>
            `;
          }
          /* 普通奖项卡片 */
          return `
            <div class="honor-card">
              <div class="honor-card-head">
                <span class="honor-card-title">${esc(h.name || '')}</span>
                ${h.time ? `<span class="honor-card-time">${esc(h.time)}</span>` : ''}
              </div>
              ${h.org ? `<div class="honor-card-org">${esc(h.org)}</div>` : ''}
            </div>
          `;
        }).join('');
      modalBody.innerHTML = `<h3>竞赛奖项 · 荣誉证书</h3>${list || '<p>暂无内容</p>'}`;
    }
    else{
      modalBody.innerHTML = '<p>暂无内容</p>';
    }
  }

  function openModal(cardKey){
    const card = (window.CARDS||[]).find(c => c.key === cardKey);
    if(!card) return;
    modalNo.textContent    = card.no;
    modalTitle.textContent = card.title;
    renderCardContent(cardKey);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(()=> modalCloseBtn && modalCloseBtn.focus(), 60);
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  if(modal){
    modal.addEventListener('click', (e)=>{
      if(e.target.dataset && e.target.dataset.close) closeModal();
    });
  }
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  /* ============ 调试：坐标显示（按 D 切换） ============ */
  const coord = $('#coord');
  let showDebug = false;
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'd' || e.key === 'D'){
      showDebug = !showDebug;
      if(coord) coord.hidden = !showDebug;
    }
  });
  if(coord){
    document.addEventListener('mousemove', (e)=>{
      if(!showDebug) return;
      coord.textContent = `x=${e.clientX}  y=${e.clientY}  (${(e.clientX/window.innerWidth*100).toFixed(1)}%, ${(e.clientY/window.innerHeight*100).toFixed(1)}%)`;
    });
  }

})();
