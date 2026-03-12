/**
 * Pudding Lab Core Engine v4.3
 * 共享逻辑中台：通知、PDF、鉴权、仪式感过渡
 */

// 1. 🚀 新增：全站安全网关与仪式感加载
window.initSecurityGate = (pageName = "TERMINAL") => {
    const t = localStorage.getItem('pudding_token');
    const u = localStorage.getItem('pudding_user');
    const lockscreen = document.getElementById('lockscreen');
    const lockText = lockscreen ? lockscreen.querySelector('div') : null;

    if (!t || !u) {
        // 【未登录状态】增加视觉反馈再跳转
        if (lockText) {
            lockText.innerText = "ACCESS_DENIED_REDIRECTING...";
            lockText.className = "text-red-500 font-bold mono animate-pulse tracking-widest text-lg uppercase";
        }
        setTimeout(() => {
            window.location.href = "/";
        }, 1200); // 留出 1.2 秒过渡，让用户知道是因为没权限才跳走的
        return false;
    } else {
        // 【已登录状态】增加 0.5 秒仪式感过渡
        if (lockText) lockText.innerText = `${pageName}_LINKING...`;
        
        // 这里的 500ms 就是你要求的过渡时间
        setTimeout(() => {
            if (lockscreen) {
                lockscreen.style.opacity = '0';
                setTimeout(() => {
                    lockscreen.style.display = 'none';
                }, 500); // 透明度变化的动画时间
            }
        }, 500); 
        return true;
    }
};

// 2. 标准通知 Toast
window.showNotify = (msg, type = 'success') => {
    const container = document.getElementById('notify-container');
    if (!container) return;
    const card = document.createElement('div');
    card.className = `notify-card text-white font-bold mono text-[11px]`;
    card.style.borderColor = type === 'error' ? '#ef4444' : (type === 'radar' ? '#10b981' : '#3b82f6');
    card.innerHTML = `⚡ ${msg}`;
    container.appendChild(card);
    setTimeout(() => { 
        card.style.opacity = '0'; 
        setTimeout(() => card.remove(), 500); 
    }, 3000);
};

// 3. Toast 确认对话框
window.showConfirmToast = (msg) => {
    return new Promise((resolve) => {
        const container = document.getElementById('notify-container');
        if (!container) return resolve(false);
        const card = document.createElement('div');
        card.className = `notify-card border-red-500/50 bg-slate-900/95 flex flex-col gap-4`;
        card.innerHTML = `
            <div class="flex items-center gap-3 text-red-400 font-bold text-[11px]">
                <span class="animate-pulse">⚠️</span> ${msg}
            </div>
            <div class="flex gap-2">
                <button id="toast-ok" class="flex-1 py-2 bg-red-600/20 border border-red-600/40 text-red-500 text-[9px] font-black rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase">Confirm</button>
                <button id="toast-cancel" class="flex-1 py-2 bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg hover:bg-slate-700 transition-all uppercase">Cancel</button>
            </div>`;
        container.prepend(card);
        const handleOk = () => { cleanup(); resolve(true); };
        const handleCancel = () => { cleanup(); resolve(false); };
        const cleanup = () => { card.style.opacity = '0'; setTimeout(() => card.remove(), 500); };
        card.querySelector('#toast-ok').onclick = handleOk;
        card.querySelector('#toast-cancel').onclick = handleCancel;
        setTimeout(() => { if(card.parentNode) { cleanup(); resolve(false); } }, 10000);
    });
};

// 4. 隔离沙盒 PDF 引擎
window.generateIsolatedPDF = (asset, markdown, type = 'factory') => {
    const themeColor = type === 'factory' ? "#3b82f6" : "#10b981";
    const subTitle = type === 'factory' ? "BLUEPRINT_ASSET_REPORT" : "RADAR_INTEL_REPORT";
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0';
    iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    const printHTML = `<html><head><style>body { background: white !important; color: #1a1a1a !important; font-family: sans-serif; padding: 40px; margin: 0; }.header { border-bottom: 4px solid ${themeColor}; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }.footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 10px; color: #888; font-family: monospace; }.markdown-body { line-height: 1.7; font-size: 11pt; }.markdown-body h1, .markdown-body h2 { color: #000; margin-top: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 5px; }.markdown-body strong { font-weight: 800; color: #000; }.markdown-body ul { padding-left: 1.5em; }* { box-shadow: none !important; border-radius: 0 !important; background-clip: padding-box !important; }@media print { @page { margin: 1.5cm; } .container { padding: 0; } }</style></head><body><div class="container"><div class="header"><div><h1 style="margin:0; font-size:24pt;">布丁实验室资产报告</h1><p style="color:${themeColor}; margin:5px 0; font-weight:bold;">${subTitle}</p></div><div style="text-align:right;"><p style="margin:0; font-weight:bold;">ASN: ${asset.id}</p><p style="margin:0; font-size:9pt; color:#666;">DATE: ${new Date(asset.created_at).toLocaleString()}</p></div></div><div class="markdown-body">${marked.parse(markdown)}</div><div class="footer"><div>HUB: https://tools.lbuding.com | WECHAT: lengbuding0101</div><div>© Pudding Lab Confidential</div></div></body></html>`;
    doc.open(); doc.write(printHTML); doc.close();
    window.showNotify("正在解析排版...");
    iframe.contentWindow.onload = () => {
        setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => document.body.removeChild(iframe), 1000); }, 600);
    };
};

// 5. 通用登出
window.handleLogout = () => {
    localStorage.clear();
    location.href = "/";
};