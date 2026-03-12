/**
 * Pudding Lab Enterprise Kernel v5.0
 * 核心：安全网关(Gate)、API 中间件(Request)、可观测性(Telemetry)
 */

const PUDDING_VERSION = "5.0.1-ENT";

// 1. 🚀 安全网关：处理拦截与进场仪式感
window.initSecurityGate = (pageName = "TERMINAL") => {
    const t = localStorage.getItem('pudding_token');
    const u = localStorage.getItem('pudding_user');
    const lockscreen = document.getElementById('lockscreen');
    const lockText = lockscreen ? lockscreen.querySelector('div') : null;

    if (!t || !u) {
        // 【未登录状态】红色警报 + 延迟 1.2s 重定向
        if (lockText) {
            lockText.innerText = "ACCESS_DENIED_REDIRECTING...";
            lockText.className = "text-red-500 font-bold mono animate-pulse tracking-widest text-lg uppercase";
        }
        setTimeout(() => {
            window.location.href = "/";
        }, 1200); 
        return false;
    } else {
        // 【已登录状态】0.5s 算力链路初始化仪式
        if (lockText) lockText.innerText = `INITIALIZING_${pageName}_LINK...`;
        
        setTimeout(() => {
            if (lockscreen) {
                lockscreen.style.opacity = '0';
                setTimeout(() => {
                    lockscreen.style.display = 'none';
                    console.log(`%c[Pudding Lab] %c${pageName} Environment Secured.`, "color: #3b82f6; font-weight: bold", "color: #94a3b8");
                }, 500); 
            }
        }, 500); // 🚀 这里就是你要求的 0.5 秒平滑过渡
        return true;
    }
};

// 2. 🚀 企业级 API 中间件：自动注入 Token，统一拦截 401
window.puddingRequest = async (url, options = {}) => {
    const token = localStorage.getItem('pudding_token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        // 统一处理鉴权过期
        if (response.status === 401) {
            window.showNotify("会话密钥失效，强制注销", "error");
            setTimeout(() => window.handleLogout(), 1500);
            return null;
        }

        return await response.json();
    } catch (err) {
        window.showNotify("算力链路中断 (Network Error)", "error");
        console.error("Kernel_API_Err:", err);
        return null;
    }
};

// 3. 🚀 系统遥测监控 (模拟企业级实时数据)
window.startTelemetry = () => {
    setInterval(() => {
        const latency = Math.floor(Math.random() * 40) + 10;
        const load = (Math.random() * 10 + 2).toFixed(1);
        const el = document.getElementById('telemetry-data');
        if (el) el.innerHTML = `LATENCY: ${latency}ms | LOAD: ${load}%`;
    }, 3000);
};

// 4. 🚀 统一通知系统
window.showNotify = (msg, type = 'success') => {
    const container = document.getElementById('notify-container');
    if (!container) return;
    const card = document.createElement('div');
    card.className = `notify-card text-white font-bold mono text-[11px] border-l-4`;
    const colors = { 'error': '#ef4444', 'info': '#3b82f6', 'success': '#10b981', 'radar': '#10b981' };
    card.style.borderColor = colors[type] || colors.info;
    card.innerHTML = `<span class="opacity-40 mr-2">[${new Date().toLocaleTimeString([], {hour12:false})}]</span> ${msg}`;
    container.appendChild(card);
    setTimeout(() => { 
        card.style.opacity = '0'; 
        setTimeout(() => card.remove(), 500); 
    }, 3500);
};

// 5. 🚀 确认对话框
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

// 6. 🚀 企业级品牌化 PDF 引擎 (V5.2 Custom)
window.generateIsolatedPDF = (asset, markdown, type = 'factory') => {
    const themeColor = type === 'factory' ? "#3b82f6" : "#10b981";
    const reportTag = type === 'factory' ? "VAL_FACTORY_BLUEPRINT" : "GEO_RADAR_INTEL";
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    
    // 注入高度定制的打印模板
    const printHTML = `
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');
                body { background: white; color: #1a1a1a; font-family: sans-serif; padding: 50px 60px; margin: 0; }
                
                /* 顶部品牌区 */
                .header { border-bottom: 2px solid ${themeColor}; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .brand-title { margin: 0; font-size: 26pt; font-weight: 900; letter-spacing: -1px; }
                .report-tag { color: ${themeColor}; font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: bold; margin: 5px 0 0 0; }
                
                /* 资产元数据 */
                .meta { text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: #666; }
                .meta b { color: #000; }

                /* 正文区 */
                .markdown-body { line-height: 1.8; font-size: 11.5pt; min-height: 700px; }
                .markdown-body h1, .markdown-body h2 { color: #000; margin-top: 1.5em; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; }
                .markdown-body strong { color: ${themeColor}; }
                
                /* 🚀 品牌页脚区 */
                .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; color: #999; }
                .footer-links b { color: #333; }
                .watermark { position: fixed; bottom: 20px; right: 20px; font-size: 60pt; color: rgba(0,0,0,0.03); transform: rotate(-25deg); pointer-events: none; z-index: -1; font-weight: 900; }

                @media print { 
                    @page { margin: 1.5cm; } 
                    .markdown-body { min-height: auto; }
                }
            </style>
        </head>
        <body>
            <div class="watermark">PUDDING</div>
            
            <div class="header">
                <div>
                    <h1 class="brand-title">布丁实验室资产报告</h1>
                    <p class="report-tag">${reportTag} // SECURE_ACCESS</p>
                </div>
                <div class="meta">
                    <p>SERIAL_NO: <b>ASN-${asset.id || 'INTERNAL'}</b></p>
                    <p>GEN_DATE: <b>${new Date().toLocaleString()}</b></p>
                </div>
            </div>

            <div class="markdown-body">
                ${marked.parse(markdown)}
            </div>

            <div class="footer">
                <div class="footer-links">
                    <span>SOURCE: <b>tools.lbuding.com</b></span>
                    <span style="margin-left: 20px;">WECHAT: <b>lengbuding0101</b></span>
                </div>
                <div>© PUDDING LAB CONFIDENTIAL</div>
            </div>
        </body>
        </html>`;

    doc.open();
    doc.write(printHTML);
    doc.close();

    window.showNotify("生成专属品牌报告...", "success");

    iframe.contentWindow.onload = () => {
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 800);
    };
};