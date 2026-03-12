/**
 * Pudding Lab Enterprise UI Engine v4.3
 * 动力源：动态注入、沙盒PDF、状态监控
 */

(function() {
    // 自动判断当前所在目录深度，解决 Favicon 和跳转路径问题
    const isSubDir = window.location.pathname.includes('/dashboard/') || 
                     window.location.pathname.includes('/factory/') || 
                     window.location.pathname.includes('/radar/');
    const basePath = isSubDir ? '../' : './';

    // 1. 动态注入全站统一 Header
    window.injectPuddingHeader = () => {
        const headerPlaceholder = document.getElementById('pudding-header');
        if (!headerPlaceholder) return;

        const user = localStorage.getItem('pudding_user') || 'GUEST';
        const isLogged = !!localStorage.getItem('pudding_token');

        headerPlaceholder.innerHTML = `
        <nav class="h-20 flex items-center justify-between px-6 md:px-8 glass border-b border-white/5 sticky top-0 z-50">
            <div class="flex items-center gap-3 md:gap-4">
                <a href="${basePath}" class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg text-xl shadow-blue-500/20 hover:scale-105 transition-transform">B</a>
                <div>
                    <h1 class="text-xs md:text-sm font-black text-white tracking-widest uppercase">Pudding Lab <span class="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded ml-1">ENT</span></h1>
                    <p class="text-[8px] md:text-[9px] text-blue-500 font-bold tracking-[0.2em] md:tracking-[0.3em]">资产实验基地</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                ${!isLogged ? `
                    <button onclick="toggleAuthModal()" class="px-4 py-2 bg-blue-600/10 border border-blue-500/40 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600/20 transition-all">接入实验室</button>
                ` : `
                    <div class="flex items-center gap-2 md:gap-4">
                        <a href="${basePath}dashboard/" class="px-3 md:px-4 py-1.5 bg-purple-600/10 border border-purple-500/40 rounded-full text-[9px] font-black text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm">进入金库</a>
                        <div class="glass px-3 md:px-4 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                            <span class="text-[9px] md:text-[10px] font-bold text-blue-400 mono uppercase">${user}</span>
                        </div>
                        <button onclick="handleLogout()" class="text-[9px] font-bold text-slate-600 hover:text-red-400 uppercase mono">Logout</button>
                    </div>
                `}
            </div>
        </nav>`;
    };

    // 2. 原有的中台逻辑（PDF、Notify、Logout）保持不变，并增强路径兼容
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

    // 自动挂载图标
    const link = document.createElement('link');
    link.rel = 'icon'; link.type = 'image/png'; link.href = basePath + 'favicon.png';
    document.head.appendChild(link);
    
    // 初始化执行
    window.addEventListener('DOMContentLoaded', () => {
        window.injectPuddingHeader();
    });
})();