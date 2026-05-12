/* 心理培训中心 · 公共交互组件 */

/* ===== Toast 通知 ===== */
(function() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  Object.assign(container.style, {
    position:'fixed', top:'24px', right:'24px', zIndex:'9999',
    display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'none'
  });
  document.body.appendChild(container);

  window.showToast = function(msg, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    var icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
    var colors = { success:'#1BB975', error:'#DF2027', warning:'#F29100', info:'#3087CC' };
    var bgs = { success:'#E8FCF4', error:'#FCE8EA', warning:'#FFF5E5', info:'#E3F1F9' };
    var borders = { success:'#A7F3D0', error:'#F6BCBE', warning:'#FFE0B3', info:'#BADEF3' };
    var el = document.createElement('div');
    Object.assign(el.style, {
      display:'flex', alignItems:'center', gap:'10px',
      padding:'12px 18px', borderRadius:'8px', fontSize:'14px',
      background:bgs[type], color:'#3C444F', border:'1px solid '+borders[type],
      boxShadow:'0 4px 12px rgba(0,0,0,0.1)', pointerEvents:'auto',
      transform:'translateX(120%)', transition:'transform 250ms ease-out',
      maxWidth:'380px'
    });
    el.innerHTML = '<i class="fa-solid '+icons[type]+'" style="color:'+colors[type]+';font-size:16px;flex-shrink:0"></i><span style="flex:1">'+msg+'</span><i class="fa-solid fa-xmark" style="cursor:pointer;color:#9096A2;font-size:12px" onclick="this.parentElement.remove()"></i>';
    container.appendChild(el);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.transform = 'translateX(0)'; }); });
    setTimeout(function() {
      el.style.transform = 'translateX(120%)';
      setTimeout(function(){ el.remove(); }, 300);
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
    var btnClass = type === 'danger' ? 'btn-danger' : 'btn-primary';

    var overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:'fixed', inset:'0', background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:'9998', opacity:'0', transition:'opacity 200ms'
    });
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:12px;padding:24px;width:400px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.15);transform:scale(0.92);transition:transform 200ms ease-out">' +
        '<div style="font-size:16px;font-weight:600;color:#3C444F;margin-bottom:8px">' + title + '</div>' +
        '<div style="font-size:14px;color:#696F7D;line-height:1.6;margin-bottom:20px">' + message + '</div>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
          '<button class="btn btn-ghost" id="_cfmCancel">' + cancelText + '</button>' +
          '<button class="btn ' + btnClass + '" id="_cfmOk">' + confirmText + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      overlay.style.opacity = '1';
      overlay.querySelector('div').style.transform = 'scale(1)';
    }); });

    return new Promise(function(resolve) {
      function close(val) {
        overlay.style.opacity = '0';
        overlay.querySelector('div').style.transform = 'scale(0.92)';
        setTimeout(function(){ overlay.remove(); resolve(val); }, 200);
      }
      overlay.querySelector('#_cfmOk').addEventListener('click', function(){ close(true); });
      overlay.querySelector('#_cfmCancel').addEventListener('click', function(){ close(false); });
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(false); });
    });
  };
})();

/* ===== 附件预览弹窗 ===== */
(function() {
  window.showPreview = function(src, name) {
    name = name || '附件预览';
    var overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:'fixed', inset:'0', background:'rgba(0,0,0,0.7)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:'9997', opacity:'0', transition:'opacity 200ms', cursor:'pointer'
    });
    var isPdf = name.toLowerCase().endsWith('.pdf');
    var inner = isPdf
      ? '<div style="background:#fff;border-radius:12px;width:700px;height:85vh;max-width:90vw;display:flex;flex-direction:column;overflow:hidden;transform:scale(0.92);transition:transform 200ms">' +
          '<div style="padding:14px 20px;border-bottom:1px solid #ECEFF4;display:flex;align-items:center;justify-content:space-between">' +
            '<div style="font-size:14px;font-weight:600;color:#3C444F"><i class="fa-regular fa-file-pdf" style="color:#DC2626;margin-right:8px"></i>' + name + '</div>' +
            '<button id="_pvClose" style="width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9096A2;border:none;background:#F5F7FA"><i class="fa-solid fa-xmark"></i></button>' +
          '</div>' +
          '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px;color:#696F7D;font-size:14px"><i class="fa-solid fa-file-pdf" style="font-size:48px;color:#DC2626;margin-right:16px"></i>PDF 文件预览（原型演示）</div>' +
        '</div>'
      : '<div style="max-width:90vw;max-height:90vh;position:relative;transform:scale(0.92);transition:transform 200ms">' +
          '<div style="position:absolute;top:-40px;left:0;right:0;display:flex;align-items:center;justify-content:space-between">' +
            '<span style="color:#fff;font-size:13px">' + name + '</span>' +
            '<button id="_pvClose" style="width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;border:none;background:rgba(255,255,255,0.15)"><i class="fa-solid fa-xmark"></i></button>' +
          '</div>' +
          '<img src="' + src + '" style="max-width:80vw;max-height:80vh;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,0.3)" />' +
        '</div>';
    overlay.innerHTML = inner;
    document.body.appendChild(overlay);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      overlay.style.opacity = '1';
      var d = overlay.querySelector('div');
      if(d) d.style.transform = 'scale(1)';
    }); });

    function close() {
      overlay.style.opacity = '0';
      setTimeout(function(){ overlay.remove(); }, 200);
    }
    overlay.querySelector('#_pvClose').addEventListener('click', function(e){ e.stopPropagation(); close(); });
    overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
  };

  document.addEventListener('click', function(e) {
    var fp = e.target.closest('.file-preview, .file-chip, .upload-thumb');
    if (!fp) return;
    var img = fp.querySelector('img');
    var nameEl = fp.querySelector('.truncate') || fp.querySelector('[class*="truncate"]');
    var name = '';
    if (nameEl) name = nameEl.textContent.trim();
    else {
      var spans = fp.querySelectorAll('span');
      spans.forEach(function(s){ if(s.textContent.match(/\.\w+$/)) name = s.textContent.trim(); });
    }
    if (!name) {
      var labelEl = fp.querySelector('div:last-child');
      if (labelEl) name = labelEl.textContent.trim();
    }
    var src = img ? img.src : '';
    if (src || name) showPreview(src, name || '附件预览');
  });
})();

/* ===== 成功结果弹窗 ===== */
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
    '<div style="background:#fff;border-radius:12px;padding:32px;width:360px;max-width:90vw;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.15);transform:scale(0.92);transition:transform 200ms">' +
      '<div style="width:56px;height:56px;border-radius:50%;background:#E8FCF4;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><i class="fa-solid fa-check" style="color:#1BB975;font-size:24px"></i></div>' +
      '<div style="font-size:16px;font-weight:600;color:#3C444F">' + title + '</div>' +
      (message ? '<div style="font-size:14px;color:#696F7D;margin-top:8px;line-height:1.5">' + message + '</div>' : '') +
      '<button class="btn btn-primary btn-block" style="margin-top:20px" id="_sucOk">' + btnText + '</button>' +
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

/* ===== 全局通知图标 ===== */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.header-action[title="通知"]').forEach(function(el) {
    if (!el._bound) {
      el._bound = true;
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() { showToast('暂无新通知','info'); });
    }
  });

  document.querySelectorAll('.uploader').forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() { showToast('请选择要上传的文件','info'); });
  });
});
