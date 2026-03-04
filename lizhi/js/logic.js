const { createApp, ref, reactive, watch, onMounted, nextTick } = Vue;

createApp({
    setup() {
        const defaultData = {
            savings: 100000, severance: 20000, emergencyFund: 20000,
            interestRate: 2.5, unemployment: 2000, unemploymentMonths: 6,
            rent: 3000, insurance: 1500, food: 2000, other: 1000, sideIncome: 1000
        };

        const data = reactive(JSON.parse(localStorage.getItem('hina_fire_pro_max')) || { ...defaultData });
        const isInfinite = ref(false);
        const survivalResult = reactive({ months: 0, bankruptcyDate: '' });
        const netBurnRate = ref(0);
        let chartInstance = null;

        const calculate = () => {
            localStorage.setItem('hina_fire_pro_max', JSON.stringify(data));
            
            // 确保所有参与计算的都是数字类型
            const startSavings = Number(data.savings) || 0;
            const startSeverance = Number(data.severance) || 0;
            let totalFunds = startSavings + startSeverance;
            
            const monthlyInt = (Number(data.interestRate) || 0) / 100 / 12;
            const monthlyExp = (Number(data.rent) || 0) + (Number(data.insurance) || 0) + (Number(data.food) || 0) + (Number(data.other) || 0);
            const sideInc = Number(data.sideIncome) || 0;
            const eFund = Number(data.emergencyFund) || 0;
            
            // 界面显示的净烧钱速度
            netBurnRate.value = Math.max(0, monthlyExp - sideInc - (data.unemploymentMonths > 0 ? data.unemployment : 0)).toFixed(0);

            let months = 0;
            let chartY = [];
            let chartX = [];
            let limitFound = false;
            const today = new Date();

            // 模拟推演上限 120 个月
            while (totalFunds > 0 && months < 120) {
                chartY.push(Math.round(totalFunds));
                let d = new Date(today.getFullYear(), today.getMonth() + months, 1);
                chartX.push(`${d.getFullYear()}/${d.getMonth() + 1}`);

                totalFunds += totalFunds * monthlyInt;
                totalFunds -= monthlyExp;
                totalFunds += sideInc;
                if (months < (data.unemploymentMonths || 0)) totalFunds += (data.unemployment || 0);

                if (totalFunds < eFund && !limitFound) {
                    survivalResult.months = months;
                    survivalResult.bankruptcyDate = `${d.getFullYear()}年${d.getMonth() + 1}月`;
                    limitFound = true;
                }
                months++;
            }

            // --- 修复后的核心判断逻辑 ---
            if (months >= 120 && totalFunds >= (startSavings + startSeverance)) {
                // 情况 1: 资产在增加或持平 —— 永动机模式
                isInfinite.value = true;
                chartX = chartX.slice(0, 36); chartY = chartY.slice(0, 36);
            } else {
                isInfinite.value = false;
                if (!limitFound) {
                    // 情况 2: 资产在减少，但 10 年内还跌不破警戒线 —— 慢速烧钱模式
                    survivalResult.months = "120+"; 
                    survivalResult.bankruptcyDate = "10年以上";
                }
                // 情况 3: 已经在循环中找到了 limitFound，保持原有 survivalResult
            }

            updateChart(chartX, chartY, eFund);
        };

        const updateChart = (x, y, line) => {
            if (!chartInstance) return;
            chartInstance.setOption({
                tooltip: { trigger: 'axis', backgroundColor: '#fff', textStyle: {color: '#333'} },
                grid: { left: '3%', right: '5%', bottom: '5%', top: '10%', containLabel: true },
                xAxis: { type: 'category', data: x, axisTick: {show: false}, axisLabel: { color: '#94a3b8', fontSize: 10 } },
                yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: {color: '#94a3b8'} },
                series: [{
                    data: y, type: 'line', smooth: true, symbol: 'none',
                    lineStyle: { color: '#3b82f6', width: 3 },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(59,130,246,0.2)'}, {offset: 1, color: 'rgba(59,130,246,0)'}]) },
                    markLine: {
                        symbol: 'none',
                        data: line > 0 ? [{ yAxis: line, label: {formatter: '警戒线', position: 'end', color: '#f97316', fontSize: 10} }] : [],
                        lineStyle: { color: '#f97316', type: 'dashed', opacity: 0.5 }
                    }
                }]
            }, true);
        };

        const generatePoster = () => {
            const el = document.getElementById('posterArea');
            html2canvas(el, { 
                scale: 2, 
                backgroundColor: '#f8fafc',
                useCORS: true,      // 🌟 关键魔法 1：允许加载跨域/本地相对路径图片
                allowTaint: true    // 🌟 关键魔法 2：允许图片渲染到画布上
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = `生存报告_${new Date().getTime()}.png`;
                link.click();
            });
        };

        const resetData = () => { if(confirm('确定重置数据吗？')) { Object.assign(data, defaultData); calculate(); } };

        watch(data, () => { survivalResult.months = 0; calculate(); }, { deep: true });

        onMounted(() => {
            const chartDom = document.getElementById('chart');
            chartInstance = echarts.init(chartDom);
            window.onresize = () => { if(chartInstance) chartInstance.resize(); };

            nextTick(() => {
                calculate();
                setTimeout(() => { if (chartInstance) chartInstance.resize(); }, 100);
            });
        });

        return { data, isInfinite, survivalResult, netBurnRate, resetData, generatePoster };
    }
}).mount('#app');