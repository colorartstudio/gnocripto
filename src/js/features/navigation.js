        // Navegação de Telas/Tabs Principais
        function switchTab(tabId) {
            // Esconde todas
            document.getElementById("tab-minas").classList.add("hidden");
            document.getElementById("tab-loja").classList.add("hidden");
            document.getElementById("tab-inventario").classList.add("hidden");
            document.getElementById("tab-afiliados").classList.add("hidden");
            document.getElementById("tab-missoes").classList.add("hidden");
            document.getElementById("tab-configuracoes").classList.add("hidden");

            // Mostra ativa
            document.getElementById(`tab-${tabId}`).classList.remove("hidden");

            // Atualiza botões do menu inferior
            const navIds = ['minas', 'loja', 'inventario', 'afiliados', 'missoes'];
            navIds.forEach(id => {
                const btn = document.getElementById(`nav-${id}`);
                if (id === tabId) {
                    btn.classList.add("text-amber-500");
                    btn.classList.remove("text-slate-400");
                } else {
                    btn.classList.remove("text-amber-500");
                    btn.classList.add("text-slate-400");
                }
            });

            const configBtn = document.getElementById("btn-configuracoes");
            if (configBtn) {
                if (tabId === "configuracoes") {
                    configBtn.classList.add("bg-amber-500", "text-slate-950");
                    configBtn.classList.remove("bg-slate-700", "text-slate-300");
                } else {
                    configBtn.classList.add("bg-slate-700", "text-slate-300");
                    configBtn.classList.remove("bg-amber-500", "text-slate-950");
                }
            }

            // Gatilho de renderização específica
            if (tabId === 'loja') renderShop();
            if (tabId === 'inventario') renderInventario();
            if (tabId === 'afiliados') updateAffiliateSystem();
            if (tabId === 'missoes') renderMissions();
            if (tabId === 'minas') renderMines();
            if (tabId === 'configuracoes') renderSettings();
        }

        function dismissTutorial() {
            document.getElementById("tutorial-card").remove();
            showFeedback(t("tutorial.hidden"), "info");
        }

