        // Inicializador Onload
        window.onload = function() {
            // Carrega progresso
            loadGameData();
            const bootOfflineStartedAt = Math.max(0, Number(gameState.lastAwayAt || 0));

            audioMuted = !gameState.settings.audioEnabled;
            syncAudioUI();
            initLanguageUI();
            renderSettings();
            
            // Força XP inicial a renderizar corretamente na barra superior
            addXP(0);

            // Inicializa ciclos em todas as minas
            gameState.mines.forEach(m => {
                if (m.unlocked) startMineCycle(m.id, { deferInitialAdvance: true });
            });
            if (typeof window.syncAllMineSimulations === "function") {
                window.syncAllMineSimulations({
                    render: false,
                    offlineStartedAt: bootOfflineStartedAt,
                    notify: true
                });
            }
            gameState.lastAwayAt = 0;
            saveGameData();

            // Loop de Autossalvamento a cada 5 segundos
            setInterval(() => {
                saveGameData();
            }, 5000);

            // Renderiza inicial
            renderMines();
            renderInventario();
            rerenderLocalizedUI();

            // Sorteia chance de um evento aleatório ocorrer a cada 45 segundos de gameplay
            setInterval(() => {
                if (!gameState.activeCrisis && Math.random() < 0.3) {
                    triggerRandomEvent("Greve dos Gnomos (Exigência de salário)");
                }
            }, 45000);
        };

        function syncMinesAfterReturn(options = {}) {
            const offlineStartedAt = Math.max(0, Number(gameState.lastAwayAt || 0));
            if (typeof window.syncAllMineSimulations === "function") {
                window.syncAllMineSimulations({
                    render: true,
                    offlineStartedAt,
                    notify: options.notify !== false
                });
            }
            gameState.lastAwayAt = 0;
            saveGameData();
        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                gameState.lastAwayAt = Date.now();
                saveGameData();
                return;
            }
            syncMinesAfterReturn({ notify: true });
        });

        window.addEventListener("focus", () => {
            syncMinesAfterReturn({ notify: true });
        });

        window.addEventListener("pageshow", () => {
            syncMinesAfterReturn({ notify: true });
        });

        window.addEventListener("beforeunload", () => {
            gameState.lastAwayAt = Date.now();
            saveGameData();
        });

