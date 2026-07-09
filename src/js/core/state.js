        const DEFAULT_SETTINGS = {
            audioEnabled: true,
            language: "pt-BR",
            withdrawalNetwork: "BSC",
            wallets: [],
            selectedWalletId: null,
            withdrawalHistory: []
        };

        function normalizeSettings(rawSettings = {}) {
            const normalized = Object.assign({}, DEFAULT_SETTINGS, rawSettings || {});
            normalized.wallets = Array.isArray(rawSettings.wallets) ? rawSettings.wallets : [];
            normalized.withdrawalHistory = Array.isArray(rawSettings.withdrawalHistory) ? rawSettings.withdrawalHistory : [];
            normalized.language = typeof rawSettings.language === "string" ? rawSettings.language : DEFAULT_SETTINGS.language;
            if (!["pt-BR", "en", "es"].includes(normalized.language)) {
                normalized.language = DEFAULT_SETTINGS.language;
            }

            // Migra o modelo antigo de carteira unica para a nova lista de carteiras.
            if (!normalized.wallets.length && rawSettings.withdrawalAddress) {
                normalized.wallets.push({
                    id: `wallet_${Date.now()}`,
                    label: rawSettings.withdrawalLabel || "Carteira Principal",
                    address: rawSettings.withdrawalAddress,
                    network: "BSC",
                    asset: "USDT",
                    createdAt: Date.now()
                });
            }

            if (!normalized.selectedWalletId && normalized.wallets.length) {
                normalized.selectedWalletId = normalized.wallets[0].id;
            }

            return normalized;
        }

        const DEFAULT_INVENTORY = {
            recursos: {
                "Ferro": 50, "Bronze": 20, "Prata": 10, "Chumbo": 0, "Zinco": 0, "Cobre": 0, "Ouro": 0, "Platina": 0, "Diamante": 0, "Titânio": 0, "Adamantium": 0, "Vibranium": 0
            },
            collectibles: {
                "Fragmento Polygonita": 2, "Fragmento Dogecrita": 0, "Fragmento Tronita": 0, "Fragmento Cardanita": 0, "Fragmento Xarpita": 0
            },
            gear: {
                drill: 0,
                engine: 0,
                railcar: 0
            },
            services: {
                autoCollectorUntil: 0
            }
        };

        function normalizeInventory(rawInventory = {}) {
            return {
                recursos: Object.assign({}, DEFAULT_INVENTORY.recursos, rawInventory.recursos || {}),
                collectibles: Object.assign({}, DEFAULT_INVENTORY.collectibles, rawInventory.collectibles || {}),
                gear: Object.assign({}, DEFAULT_INVENTORY.gear, rawInventory.gear || {}),
                services: Object.assign({}, DEFAULT_INVENTORY.services, rawInventory.services || {})
            };
        }

        function normalizeMine(rawMine = {}, mineTemplate = {}) {
            const mine = Object.assign({}, mineTemplate, rawMine || {});
            mine.assignedGnomes = Array.isArray(rawMine.assignedGnomes) ? rawMine.assignedGnomes : (Array.isArray(mineTemplate.assignedGnomes) ? [...mineTemplate.assignedGnomes] : []);
            mine.resources = Array.isArray(rawMine.resources) ? rawMine.resources : (Array.isArray(mineTemplate.resources) ? [...mineTemplate.resources] : []);
            mine.broken = Boolean(rawMine.broken);
            mine.runtimeElapsedMs = Math.max(0, Number(rawMine.runtimeElapsedMs || 0));
            mine.lastTickAt = Math.max(0, Number(rawMine.lastTickAt || 0));
            mine.resolvedWindows = Math.max(0, Number(rawMine.resolvedWindows || 0));
            mine.pendingGbc = Math.max(0, Number(rawMine.pendingGbc || 0));
            mine.pendingResources = Object.assign({}, rawMine.pendingResources || {});
            mine.pendingCollectibles = Object.assign({}, rawMine.pendingCollectibles || {});
            mine.cycleCompleted = Boolean(rawMine.cycleCompleted);
            mine.cycleSettlementDone = Boolean(rawMine.cycleSettlementDone);
            mine.completedCycles = Math.max(0, Number(rawMine.completedCycles || 0));
            mine.lastPulseReward = Math.max(0, Number(rawMine.lastPulseReward || 0));
            mine.lastPulseOutcome = typeof rawMine.lastPulseOutcome === "string" ? rawMine.lastPulseOutcome : "idle";
            mine.cycleFrozenReason = typeof rawMine.cycleFrozenReason === "string" ? rawMine.cycleFrozenReason : null;
            mine.collectedThisCycleGbc = Math.max(0, Number(rawMine.collectedThisCycleGbc || 0));
            mine.dailyRateSnapshot = Math.max(0, Number(rawMine.dailyRateSnapshot || 0));
            mine.cycleTargetSnapshot = Math.max(0, Number(rawMine.cycleTargetSnapshot || 0));
            mine.lastResolvedWindowAt = Math.max(0, Number(rawMine.lastResolvedWindowAt || 0));
            mine.lastCollectedAt = Math.max(0, Number(rawMine.lastCollectedAt || 0));
            return mine;
        }

        function normalizeGameMines(rawMines = []) {
            return MINE_DATABASE.map((mineTemplate) => {
                const rawMine = Array.isArray(rawMines)
                    ? rawMines.find((mine) => mine.id === mineTemplate.id) || {}
                    : {};
                return normalizeMine(rawMine, mineTemplate);
            });
        }

        const DEFAULT_MISSION_BLUEPRINTS = [
            {
                id: "m1",
                title: "Operação de Coleta",
                description: "Mantenha o ritmo das minas e colete recompensas por etapas.",
                icon: "fa-solid fa-pickaxe",
                accentClass: "amber",
                phases: [
                    { id: "m1p1", label: "Fase 1", text: "Efetuar 3 coletas no painel", target: 3, rewardGbc: 40, rewardXp: 20 },
                    { id: "m1p2", label: "Fase 2", text: "Efetuar mais 5 coletas no painel", target: 5, rewardGbc: 65, rewardXp: 30 },
                    { id: "m1p3", label: "Fase 3", text: "Efetuar mais 8 coletas no painel", target: 8, rewardGbc: 120, rewardXp: 45 }
                ]
            },
            {
                id: "m2",
                title: "Circuito da Roleta",
                description: "Avance em giros estratégicos e revele bônus progressivos.",
                icon: "fa-solid fa-dice",
                accentClass: "sky",
                phases: [
                    { id: "m2p1", label: "Fase 1", text: "Girar a Roleta da Fortuna 1 vez", target: 1, rewardGbc: 30, rewardXp: 15 },
                    { id: "m2p2", label: "Fase 2", text: "Girar a Roleta da Fortuna 2 vezes", target: 2, rewardGbc: 55, rewardXp: 25 },
                    { id: "m2p3", label: "Fase 3", text: "Girar a Roleta da Fortuna 3 vezes", target: 3, rewardGbc: 90, rewardXp: 40 }
                ]
            },
            {
                id: "m3",
                title: "Expansão do Clã",
                description: "Contrate novos gnomos e destrave bônus táticos por recrutamento.",
                icon: "fa-solid fa-helmet-safety",
                accentClass: "violet",
                phases: [
                    { id: "m3p1", label: "Fase 1", text: "Contratar 1 novo gnomo na loja", target: 1, rewardGbc: 50, rewardXp: 20 },
                    { id: "m3p2", label: "Fase 2", text: "Contratar mais 2 gnomos na loja", target: 2, rewardGbc: 90, rewardXp: 35 },
                    { id: "m3p3", label: "Fase 3", text: "Contratar mais 3 gnomos na loja", target: 3, rewardGbc: 140, rewardXp: 50 }
                ]
            }
        ];

        function cloneDefaultMissionBlueprints() {
            return JSON.parse(JSON.stringify(DEFAULT_MISSION_BLUEPRINTS));
        }

        function getMissionCurrentPhase(mission) {
            if (!mission || !Array.isArray(mission.phases)) return null;
            return mission.phases.find((phase) => !phase.claimed) || null;
        }

        function refreshMissionComputedFields(mission) {
            if (!mission) return mission;

            const phases = Array.isArray(mission.phases) ? mission.phases : [];
            const currentPhase = getMissionCurrentPhase(mission);
            const claimedPhases = phases.filter((phase) => phase.claimed).length;
            const totalTarget = phases.reduce((sum, phase) => sum + (Number(phase.target) || 0), 0);
            const totalProgress = phases.reduce((sum, phase) => {
                const target = Number(phase.target) || 0;
                const progress = Number(phase.progress) || 0;
                return sum + Math.min(progress, target);
            }, 0);

            mission.totalPhases = phases.length;
            mission.claimedPhases = claimedPhases;
            mission.completed = phases.length ? claimedPhases >= phases.length : Boolean(mission.completed);
            mission.currentPhaseId = currentPhase ? currentPhase.id : null;
            mission.currentPhaseIndex = currentPhase ? phases.findIndex((phase) => phase.id === currentPhase.id) : phases.length - 1;
            mission.progress = currentPhase ? currentPhase.progress : (mission.target || 1);
            mission.target = currentPhase ? currentPhase.target : 1;
            mission.rewardGbc = currentPhase ? currentPhase.rewardGbc : 0;
            mission.rewardXp = currentPhase ? (currentPhase.rewardXp || 0) : 0;
            mission.text = currentPhase ? currentPhase.text : `${mission.title} concluída`;
            mission.canCollect = currentPhase ? currentPhase.progress >= currentPhase.target && !currentPhase.claimed : false;
            mission.totalProgressPercent = totalTarget ? Math.round((totalProgress / totalTarget) * 100) : 100;

            return mission;
        }

        function normalizeMissionPhase(rawPhase = {}, phaseTemplate = {}) {
            const target = Number(rawPhase.target ?? phaseTemplate.target ?? 1) || 1;
            const progress = Math.max(0, Math.min(target, Number(rawPhase.progress ?? 0) || 0));
            const claimed = Boolean(rawPhase.claimed);

            return {
                id: rawPhase.id || phaseTemplate.id,
                label: rawPhase.label || phaseTemplate.label,
                text: rawPhase.text || phaseTemplate.text,
                target,
                progress: claimed ? target : progress,
                rewardGbc: Number(rawPhase.rewardGbc ?? phaseTemplate.rewardGbc ?? 0) || 0,
                rewardXp: Number(rawPhase.rewardXp ?? phaseTemplate.rewardXp ?? 0) || 0,
                claimed,
                claimedAt: rawPhase.claimedAt || null
            };
        }

        function normalizeMissionFromTemplate(rawMission = {}, missionTemplate = {}) {
            const mission = {
                id: rawMission.id || missionTemplate.id,
                title: rawMission.title || missionTemplate.title,
                description: rawMission.description || missionTemplate.description,
                icon: rawMission.icon || missionTemplate.icon,
                accentClass: rawMission.accentClass || missionTemplate.accentClass,
                phases: []
            };

            if (Array.isArray(rawMission.phases) && rawMission.phases.length) {
                mission.phases = missionTemplate.phases.map((phaseTemplate, index) => {
                    const rawPhase = rawMission.phases.find((phase) => phase.id === phaseTemplate.id) || rawMission.phases[index] || {};
                    return normalizeMissionPhase(rawPhase, phaseTemplate);
                });
            } else {
                mission.phases = missionTemplate.phases.map((phaseTemplate, index) => {
                    if (index !== 0) return normalizeMissionPhase({}, phaseTemplate);

                    const legacyTarget = Number(rawMission.target ?? phaseTemplate.target ?? 1) || 1;
                    const legacyProgress = Math.max(0, Math.min(legacyTarget, Number(rawMission.progress ?? 0) || 0));
                    const legacyClaimed = Boolean(rawMission.completed || legacyProgress >= legacyTarget);

                    return normalizeMissionPhase({
                        id: phaseTemplate.id,
                        label: phaseTemplate.label,
                        text: rawMission.text || phaseTemplate.text,
                        target: legacyTarget,
                        progress: legacyProgress,
                        rewardGbc: rawMission.rewardGbc ?? phaseTemplate.rewardGbc,
                        rewardXp: phaseTemplate.rewardXp,
                        claimed: legacyClaimed
                    }, phaseTemplate);
                });
            }

            return refreshMissionComputedFields(mission);
        }

        function normalizeMissions(rawMissions = []) {
            return cloneDefaultMissionBlueprints().map((missionTemplate) => {
                const rawMission = Array.isArray(rawMissions)
                    ? rawMissions.find((mission) => mission.id === missionTemplate.id) || {}
                    : {};
                return normalizeMissionFromTemplate(rawMission, missionTemplate);
            });
        }

        // Estado inicial do jogador salvo em localStorage
        let gameState = {
            player: {
                level: 1,
                xp: 0,
                gbc: GAME_CONFIG.initialGbc,
                usdt: GAME_CONFIG.initialUsdt,
                energy: 100,
                inviteCode: "GNOMIN-9941",
                referralVolume: 0,
                rank: "Gno1"
            },
            mines: normalizeGameMines(),
            inventory: normalizeInventory(),
            contractedGnomes: [], // lista de gnomos disponíveis contratados
            referrals: [
                { name: "Carlos Minerador", line: 1, yieldRate: 15, activeVolume: 80 },
                { name: "Alana GnoPower", line: 2, yieldRate: 25, activeVolume: 120 }
            ],
            missions: normalizeMissions(),
            statistics: {
                totalMinedGbc: 1000,
                totalSwappedUsdt: 0,
                totalSpins: 0,
                crisesResolved: 0
            },
            settings: normalizeSettings(),
            activeCrisis: null,
            lastWheelSpinTime: 0,
            lastAwayAt: 0
        };

        // Temporizador para progresso das minas
        let mineTimers = {};

        // Carrega ou salva o estado no LocalStorage
        function loadGameData() {
            const saved = localStorage.getItem("gnominers_mvp_state_v1");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Mescla estruturas para evitar quebras por atualizações de variáveis
                    gameState = Object.assign({}, gameState, parsed);
                    gameState.settings = normalizeSettings(parsed.settings || {});
                    gameState.inventory = normalizeInventory(parsed.inventory || {});
                    gameState.mines = normalizeGameMines(parsed.mines || []);
                    gameState.missions = normalizeMissions(parsed.missions || []);
                    gameState.lastAwayAt = Math.max(0, Number(parsed.lastAwayAt || 0));
                } catch(e) {
                    console.error("Erro ao ler LocalStorage", e);
                }
            }
        }

        function saveGameData() {
            localStorage.setItem("gnominers_mvp_state_v1", JSON.stringify(gameState));
        }

        function resetGame() {
            if (confirm("Deseja mesmo redefinir seu progresso? Seus Gnomos e GnoCriptos serão reiniciados.")) {
                localStorage.removeItem("gnominers_mvp_state_v1");
                window.location.reload();
            }
        }
