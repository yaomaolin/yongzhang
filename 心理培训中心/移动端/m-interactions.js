/* 心理培训中心 · 移动端交互组件 */

/* ===== Toast ===== */
(function() {
  var container = document.createElement('div');
  container.id = 'mToastWrap';
  Object.assign(container.style, {
    position:'fixed', top:'calc(44px + 50px)', left:'50%', transform:'translateX(-50%)',
    zIndex:'9999', display:'flex', flexDirection:'column', gap:'8px',
    pointerEvents:'none', width:'343px', maxWidth:'calc(100% - 32px)'
  });
  document.body.appendChild(container);

  window.showToast = function(msg, type, duration) {
    type = type || 'info';
    duration = duration || 2500;
    var icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
    var colors = { success:'#1BB975', error:'#DF2027', warning:'#F29100', info:'#3087CC' };
    var bgs = { success:'#E8FCF4', error:'#FCE8EA', warning:'#FFF5E5', info:'#E3F1F9' };
    var borders = { success:'#A7F3D0', error:'#F6BCBE', warning:'#FFE0B3', info:'#BADEF3' };
    var el = document.createElement('div');
    Object.assign(el.style, {
      display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 14px', borderRadius:'10px', fontSize:'13px',
      background:bgs[type], color:'#3C444F', border:'1px solid '+borders[type],
      boxShadow:'0 4px 12px rgba(0,0,0,0.1)', pointerEvents:'auto',
      opacity:'0', transform:'translateY(-12px)', transition:'all 250ms ease-out'
    });
    el.innerHTML = '<i class="fa-solid '+icons[type]+'" style="color:'+colors[type]+';font-size:15px;flex-shrink:0"></i>' +
      '<span style="flex:1;line-height:1.4">'+msg+'</span>';
    container.appendChild(el);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    }); });
    setTimeout(function(){
      el.style.opacity = '0'; el.style.transform = 'translateY(-12px)';
      setTimeout(function(){ el.remove(); }, 260);
    }, duration);
  };
})();

/* ===== 确认弹窗 ===== */
(function() {
  window.showConfirm = function(opts) {
    var title = opts.title || '确认操作';
    var message = opts.message || '确定要执行此操作吗？';
    var confirmText = opts.confirmText || '确定';
    var cancelText = opts.cancelText || '取消';
    var type = opts.type || 'primary';
    var btnColor = type === 'danger' ? 'var(--color-danger,#DF2027)' : 'var(--color-primary,#3087CC)';

    var overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:'fixed', inset:'0', background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      zIndex:'9998', opacity:'0', transition:'opacity 200ms'
    });
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:14px 14px 0 0;padding:24px 20px calc(24px + 23px);width:375px;max-width:100%;box-shadow:0 -8px 30px rgba(0,0,0,0.12);transform:translateY(100%);transition:transform 300ms cubic-bezier(.22,1,.36,1)">' +
        '<div style="font-size:16px;font-weight:600;color:#3C444F;text-align:center;margin-bottom:8px">' + title + '</div>' +
        '<div style="font-size:14px;color:#696F7D;line-height:1.5;text-align:center;margin-bottom:24px">' + message + '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button id="_cfmCancel" style="flex:1;height:44px;border-radius:10px;border:none;background:#F1F2F3;color:#3C444F;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit">' + cancelText + '</button>' +
          '<button id="_cfmOk" style="flex:1;height:44px;border-radius:10px;border:none;background:'+btnColor+';color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit">' + confirmText + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      overlay.style.opacity = '1';
      overlay.querySelector('div').style.transform = 'translateY(0)';
    }); });

    return new Promise(function(resolve) {
      function close(val) {
        overlay.style.opacity = '0';
        overlay.querySelector('div').style.transform = 'translateY(100%)';
        setTimeout(function(){ overlay.remove(); resolve(val); }, 300);
      }
      overlay.querySelector('#_cfmOk').addEventListener('click', function(){ close(true); });
      overlay.querySelector('#_cfmCancel').addEventListener('click', function(){ close(false); });
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(false); });
    });
  };
})();

/* ===== 成功弹窗 ===== */
window.showSuccess = function(opts) {
  var title = opts.title || '操作成功';
  var message = opts.message || '';
  var btnText = opts.btnText || '确定';
  var href = opts.href || '';
  var overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', background:'rgba(0,0,0,0.45)',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:'9998', opacity:'0', transition:'opacity 200ms'
  });
  overlay.innerHTML =
    '<div style="background:#fff;border-radius:16px;padding:32px 24px;width:280px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.15);transform:scale(0.9);transition:transform 250ms cubic-bezier(.22,1,.36,1)">' +
      '<div style="width:56px;height:56px;border-radius:50%;background:#E8FCF4;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><i class="fa-solid fa-check" style="color:#1BB975;font-size:24px"></i></div>' +
      '<div style="font-size:16px;font-weight:600;color:#3C444F">' + title + '</div>' +
      (message ? '<div style="font-size:13px;color:#696F7D;margin-top:8px;line-height:1.5">' + message + '</div>' : '') +
      '<button id="_sucOk" style="margin-top:20px;width:100%;height:44px;border-radius:10px;border:none;background:#3087CC;color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit">' + btnText + '</button>' +
    '</div>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    overlay.style.opacity = '1';
    overlay.querySelector('div').style.transform = 'scale(1)';
  }); });
  overlay.querySelector('#_sucOk').addEventListener('click', function(){
    overlay.style.opacity = '0';
    setTimeout(function(){ overlay.remove(); if(href) location.href = href; }, 200);
  });
};

/* ===== 附件预览 ===== */
window.showPreview = function(src, name) {
  name = name || '附件预览';
  var overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', background:'rgba(0,0,0,0.85)',
    display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
    zIndex:'9997', opacity:'0', transition:'opacity 200ms'
  });
  var isPdf = name.toLowerCase().endsWith('.pdf');
  var inner = isPdf
    ? '<div style="text-align:center;color:#fff;padding:40px">' +
        '<i class="fa-solid fa-file-pdf" style="font-size:48px;color:#F87171;margin-bottom:16px"></i>' +
        '<div style="font-size:14px;margin-bottom:4px">' + name + '</div>' +
        '<div style="font-size:12px;opacity:0.6">PDF 文件预览（原型演示）</div>' +
      '</div>'
    : '<img src="' + src + '" style="max-width:calc(100% - 32px);max-height:70vh;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,0.3)" />' +
      '<div style="color:#fff;font-size:13px;margin-top:12px;opacity:0.8">' + name + '</div>';
  overlay.innerHTML = inner +
    '<button id="_pvClose" style="position:absolute;top:50px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
  document.body.appendChild(overlay);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ overlay.style.opacity = '1'; }); });
  function close() { overlay.style.opacity = '0'; setTimeout(function(){ overlay.remove(); }, 200); }
  overlay.querySelector('#_pvClose').addEventListener('click', function(e){ e.stopPropagation(); close(); });
  overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
};

/* ===== 全局绑定(文件预览) ===== */
document.addEventListener('click', function(e) {
  var fp = e.target.closest('.m-file-item, .file-preview');
  if (!fp) return;
  var img = fp.querySelector('img');
  var nameEl = fp.querySelector('.file-name');
  var name = nameEl ? nameEl.textContent.trim() : '附件预览';
  var src = img ? img.src : '';
  if (src || name) showPreview(src, name);
});
