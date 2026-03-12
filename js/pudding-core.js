/**
 * Pudding Lab Enterprise UI Engine v4.3 (Robust Version)
 * 强化版：自启动注入、多级路径修复、控制台自检
 */

(function() {
    console.log("🚀 Pudding Core Engine v4.3 启动中...");

    // 自动识别路径：确保在根目录和子目录下 Favicon 和链接都正确
    const path = window.location.pathname;
    const isSubDir = path.includes('/dashboard/') || path.includes('/factory/') || path.includes('/radar/');
    const basePath = isSubDir ? '../' : './';

    // 1. 核心注入逻辑
    window.injectPuddingHeader = () => {
        const headerPlaceholder = document.getElementById('pudding-header');
        if (!headerPlaceholder) {
            console.error("❌ 引擎异常：未找到 id='pudding-header' 的注入点");
            return;
        }

        const user = localStorage.getItem('pudding_user') || 'GUEST';
        const isLogged = !!localStorage.getItem('pudding_token');

        headerPlaceholder.innerHTML = `
        <nav class="h-20 flex items-center justify-between px-6 md:px-8 glass border-b border-white/5 sticky top-0 z-50">
            <div class="flex items-center gap-3 md:gap-4">
                <a href="${basePath}" class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg text-xl shadow-blue-500/20 hover:scale-105 transition-transform">B</a>
                <div>
                    <h1 class="text-xs md:text-sm font-black text-white tracking-widest uppercase leading-tight">Pudding Lab <span class="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded ml-1">ENT</span></h1>
                    <p class="text-[8px] md:text-[9px] text-blue-500 font-bold tracking-[0.2em] md:tracking-[0.3em]">数字化资产实验基地</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                ${!isLogged ? `
                    <button onclick="toggleAuthModal()" class="px-4 md:px-6 py-2 bg-blue-600/10 border border-blue-500/40 rounded-full text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600/20 transition-all">接入实验室 / CONNECT</button>
                ` : `
                    <div class="flex items-center gap-2 md:gap-4">
                        <a href="${basePath}dashboard/" class="px-3 md:px-4 py-1.5 bg-purple-600/10 border border-purple-500/40 rounded-full text-[9px] md:text-[10px] font-black text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm">进入金库</a>
                        <div class="glass px-3 md:px-4 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                            <span class="text-[9px] md:text-[10px] font-bold text-blue-400 mono uppercase">${user}</span>
                        </div>
                        <button onclick="handleLogout()" class="text-[9px] md:text-[10px] font-bold text-slate-600 hover:text-red-400 uppercase mono">Logout</button>
                    </div>
                `}
            </div>
        </nav>`;
        console.log("✅ 导航栏注入完成，当前用户:", user);
    };

    // 2. 通用服务
    window.showNotify = (msg, type = 'success') => {
        const container = document.getElementById('notify-container');
        if (!container) return;
        const card = document.createElement('div');
        card.className = `notify-card text-white border-blue-500 font-bold mono text-[11px]`;
        if(type === 'error') card.style.borderColor = '#ef4444';
        card.innerHTML = `⚡ ${msg}`;
        container.appendChild(card);
        setTimeout(() => { card.style.opacity = '0'; setTimeout(() => card.remove(), 500); }, 3000);
    };

    window.handleLogout = () => {
        localStorage.clear();
        window.location.href = basePath;
    };

    // 3. 自动挂载 Favicon (企业级全局策略)
    if (!document.querySelector('link[rel="icon"]')) {
        const link = document.createElement('link');
        link.rel = 'icon'; link.type = 'image/png'; link.href = basePath + 'favicon.png';
        document.head.appendChild(link);
    }
    
    // 4. 强力自启动监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.injectPuddingHeader);
    } else {
        window.injectPuddingHeader();
    }
})();