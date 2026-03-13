/**
 * Pudding Lab Enterprise Kernel v5.3 (Final Fix)
 * 核心：安全网关、API 中间件、品牌 PDF 引擎
 */

// 1. 🚀 安全网关：处理拦截与 0.5s 进场仪式
window.initSecurityGate = function(pageName = "TERMINAL") {
    const t = localStorage.getItem('pudding_token');
    const u = localStorage.getItem('pudding_user');
    const lockscreen = document.getElementById('lockscreen');
    const lockText = lockscreen ? (lockscreen.querySelector('div') || lockscreen) : null;

    // 🛡️ 暴力开锁保险：防止任何错误导致卡死
    const forceUnlock = () => {
        if (lockscreen) {
            lockscreen.style.opacity = '0';
            setTimeout(() => { lockscreen.style.display = 'none'; }, 500);
        }
    };
    setTimeout(() => { if (lockscreen && lockscreen.style.display !== 'none') forceUnlock(); }, 3000);

    if (!t || !u) {
        if (lockText) {
            lockText.innerText = "ACCESS_DENIED_REDIRECTING...";
            lockText.style.color = "#ef4444";
        }
        setTimeout(() => { window.location.href = "/"; }, 1200); 
        return false;
    } else {
        if (lockText) lockText.innerText = `INITIALIZING_${pageName}_LINK...`;
        setTimeout(() => { forceUnlock(); }, 500); // 0.5秒平滑过渡
        return true;
    }
};

// 2. 🚀 企业级 API 中间件 (解决 puddingRequest is not defined)
window.puddingRequest = async (url, options = {}) => {
    const token = localStorage.getItem('pudding_token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
    };
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            window.showNotify("密钥失效，正在注销", "error");
            setTimeout(() => window.handleLogout(), 1500);
            return null;
        }
        return await response.json();
    } catch (err) {
        window.showNotify("算力链路中断", "error");
        return null;
    }
};

// 3. 🚀 品牌化 PDF 引擎 (包含域名 tools.lbuding.com 和微信 lengbuding0101)
window.generateIsolatedPDF = (asset, markdown, type = 'factory') => {
    const themeColor = type === 'factory' ? "#3b82f6" : "#10b981";
    const reportTag = type === 'factory' ? "VAL_FACTORY_BLUEPRINT" : "GEO_RADAR_INTEL";
    const iframe = document.createElement('iframe');
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    const printHTML = `<html><head><style>
        body{background:white;color:#1a1a1a;font-family:sans-serif;padding:50px 60px;margin:0}
        .header{border-bottom:2px solid ${themeColor};padding-bottom:20px;margin-bottom:40px;display:flex;justify-content:space-between;align-items:flex-end}
        .markdown-body{line-height:1.8;font-size:11.5pt;min-height:700px}
        .footer{margin-top:50px;padding-top:20px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-family:monospace;font-size:8.5pt;color:#999}
        .watermark{position:fixed;bottom:20px;right:20px;font-size:60pt;color:rgba(0,0,0,0.03);transform:rotate(-25deg);z-index:-1;font-weight:900}
    </style></head><body><div class="watermark">PUDDING</div><div class="header"><div><h1 style="margin:0;font-size:26pt;">布丁实验室资产报告</h1><p style="color:${themeColor};font-weight:bold;margin:5px 0;">${reportTag} // SECURE_ACCESS</p></div><div style="text-align:right;font-size:9pt;color:#666;"><p>ID: <b>ASN-${asset.id || 'N/A'}</b></p><p>DATE: <b>${new Date().toLocaleString()}</b></p></div></div><div class="markdown-body">${marked.parse(markdown)}</div><div class="footer"><div>SOURCE: <b>tools.lbuding.com</b> | WECHAT: <b>lengbuding0101</b></div><div>© PUDDING LAB CONFIDENTIAL</div></div></body></html>`;
    doc.open(); doc.write(printHTML); doc.close();
    window.showNotify("生成专属品牌报告...", "success");
    iframe.contentWindow.onload = () => { setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => document.body.removeChild(iframe), 1000); }, 800); };
};

// 4. 🚀 基础功能
window.showNotify = (msg, type = 'success') => {
    const container = document.getElementById('notify-container');
    if (!container) return;
    const card = document.createElement('div');
    card.className = `notify-card text-white font-bold mono text-[11px] border-l-4`;
    card.style.borderColor = type === 'error' ? '#ef4444' : '#3b82f6';
    card.innerHTML = `⚡ ${msg}`;
    container.appendChild(card);
    setTimeout(() => { card.style.opacity = '0'; setTimeout(() => card.remove(), 500); }, 3000);
};

window.showConfirmToast = (msg) => {
    return new Promise((resolve) => {
        const container = document.getElementById('notify-container');
        if (!container) return resolve(false);
        const card = document.createElement('div');
        card.className = `notify-card border-red-500/50 bg-slate-900/95 flex flex-col gap-4`;
        card.innerHTML = `<div class="text-red-400 font-bold text-[11px]">⚠️ ${msg}</div><div class="flex gap-2"><button id="t-ok" class="flex-1 py-2 bg-red-600/20 border border-red-600/40 text-red-500 text-[9px] font-black rounded uppercase">SHRED</button><button id="t-cn" class="flex-1 py-2 bg-slate-800 text-slate-400 text-[9px] font-black rounded uppercase">KEEP</button></div>`;
        container.prepend(card);
        const cleanup = () => { card.style.opacity = '0'; setTimeout(() => card.remove(), 500); };
        card.querySelector('#t-ok').onclick = () => { cleanup(); resolve(true); };
        card.querySelector('#t-cn').onclick = () => { cleanup(); resolve(false); };
    });
};

window.startTelemetry = () => {
    setInterval(() => {
        const latency = Math.floor(Math.random() * 40) + 10;
        const load = (Math.random() * 10 + 2).toFixed(1);
        const el = document.getElementById('telemetry-data');
        if (el) el.innerHTML = `LATENCY: ${latency}ms | LOAD: ${load}%`;
    }, 3000);
};

window.handleLogout = () => { localStorage.clear(); location.href = "/"; };