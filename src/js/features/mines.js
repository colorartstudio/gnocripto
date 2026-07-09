        function getGnomeAvatarMarkup(gnomeType, svgClass = "w-full h-full p-1") {
            const ref = GNOME_DATABASE[gnomeType];
            const sourceSvg = ref ? document.getElementById(ref.svgId) : null;
            if (!ref || !sourceSvg) {
                return `
                    <div class="w-full h-full flex items-center justify-center text-slate-500">
                        <i class="fa-solid fa-helmet-safety text-xs"></i>
                    </div>
                `;
            }

            const viewBox = sourceSvg.getAttribute("viewBox") || "0 0 100 100";
            return `<svg class="${svgClass}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${sourceSvg.innerHTML}</svg>`;
        }

        // O algoritmo calcula a eficiência de cada mina e sugere a menos ocupada ou improdutiva para receber upgrade
        function updateInvestmentAdvisor() {
            let advice = t("mines.advice.harmony");
            let actionBtnHtml = "";
            
            // Filtra as minas desbloqueadas
            const activeMines = gameState.mines.filter(m => m.unlocked);
            
            if (activeMines.length === 0) {
                advice = t("mines.advice.none");
            } else {
                // Calcula mina com menor ocupação de gnomos em relação a sua capacidade total
                let lowOccupancyMine = null;
                let lowestRatio = 2; // Maior que 1

                activeMines.forEach(m => {
                    const allocatedCount = gameState.contractedGnomes.filter(g => g.allocatedTo === m.id).length;
                    const ratio = m.capacityMax > 0 ? (allocatedCount / m.capacityMax) : 0;
                    if (ratio < lowestRatio) {
                        lowestRatio = ratio;
                        lowOccupancyMine = m;
                    }
                });

                // Se houver uma mina quebrada, ela é prioridade absoluta de manutenção!
                const brokenMine = activeMines.find(m => m.broken);
                
                if (brokenMine) {
                    advice = t("mines.advice.broken", { name: getMineDisplayName(brokenMine) });
                    actionBtnHtml = `<button onclick="repairMine('${brokenMine.id}')" class="bg-red-500 hover:bg-red-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow">
                        ${t("mines.actions.repairNow")}
                    </button>`;
                } else if (!isAutoCollectorActive() && activeMines.some((mine) => mine.cycleCompleted)) {
                    advice = t("mines.advice.autoCollector");
                    actionBtnHtml = `<button onclick="switchTab('loja'); switchShopSubTab('equipamentos')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow">
                        ${t("mines.actions.activateCollector")}
                    </button>`;
                } else if (gameState.player.energy < 20) {
                    advice = t("mines.advice.lowEnergy");
                    actionBtnHtml = `<button onclick="switchTab('loja'); switchShopSubTab('energia')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow">
                        ${t("mines.actions.buyEnergy")}
                    </button>`;
                } else if (lowOccupancyMine && lowestRatio < 1) {
                    advice = t("mines.advice.occupancy", {
                        name: getMineDisplayName(lowOccupancyMine),
                        allocated: gameState.contractedGnomes.filter(g => g.allocatedTo === lowOccupancyMine.id).length,
                        capacity: lowOccupancyMine.capacityMax
                    });
                    actionBtnHtml = `<button onclick="openAllocationWizard('${lowOccupancyMine.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-extrabold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow">
                        ${t("mines.actions.moveGnomes")}
                    </button>`;
                } else {
                    // Sugere evoluir estrelas da mina de menor nível de produção
                    const lowestStarMine = activeMines.sort((a,b) => a.stars - b.stars)[0];
                    if (lowestStarMine && lowestStarMine.stars < 5) {
                        const upgradeCost = Math.round(lowestStarMine.baseYieldGbc * 25);
                        advice = t("mines.advice.stars", { name: getMineDisplayName(lowestStarMine), level: lowestStarMine.stars + 1 });
                        actionBtnHtml = `<button onclick="upgradeMineStars('${lowestStarMine.id}')" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow">
                            ${t("mines.actions.upgradeStar", { cost: upgradeCost })}
                        </button>`;
                    }
                }
            }

            document.getElementById("advisor-text").innerHTML = advice;
            document.getElementById("advisor-action").innerHTML = actionBtnHtml;
        }

        function getMineRhythmLabel(mine) {
            if (!mine) return "Ritmo Base";
            return getLocalizedMineField(mine.id, "rhythm", "Ritmo Mineral");
        }

        function getMineDisplayName(mine) {
            return getLocalizedMineField(mine?.id, "name", mine?.name || "");
        }

        function getMineLiveWorkerProfile(gnomeType) {
            const profiles = {
                gnorin: {
                    workerClass: "mine-live-worker--gnorin",
                    toolClass: "is-pickaxe",
                    toolVariantClass: "mine-live-tool--gnorin",
                    iconClass: "fa-hammer",
                    badgeLabel: t("mines.workerSets.gnorin"),
                    flair: t("mines.workerFlair.gnorin")
                },
                bortok: {
                    workerClass: "mine-live-worker--bortok",
                    toolClass: "is-hammer",
                    toolVariantClass: "mine-live-tool--bortok",
                    iconClass: "fa-hammer",
                    badgeLabel: t("mines.workerSets.bortok"),
                    flair: t("mines.workerFlair.bortok")
                },
                zeldrik: {
                    workerClass: "mine-live-worker--zeldrik",
                    toolClass: "is-drill",
                    toolVariantClass: "mine-live-tool--zeldrik",
                    iconClass: "fa-screwdriver-wrench",
                    badgeLabel: t("mines.workerSets.zeldrik"),
                    flair: t("mines.workerFlair.zeldrik")
                },
                faggro: {
                    workerClass: "mine-live-worker--faggro",
                    toolClass: "is-hammer",
                    toolVariantClass: "mine-live-tool--faggro",
                    iconClass: "fa-hammer",
                    badgeLabel: t("mines.workerSets.faggro"),
                    flair: t("mines.workerFlair.faggro")
                },
                nyra: {
                    workerClass: "mine-live-worker--nyra",
                    toolClass: "is-pickaxe",
                    toolVariantClass: "mine-live-tool--nyra",
                    iconClass: "fa-hammer",
                    badgeLabel: t("mines.workerSets.nyra"),
                    flair: t("mines.workerFlair.nyra")
                }
            };

            return profiles[gnomeType] || {
                workerClass: "",
                toolClass: "is-pickaxe",
                toolVariantClass: "",
                iconClass: "fa-hammer",
                badgeLabel: t("mines.tools.hammer"),
                flair: ""
            };
        }

        let currentLiveMineId = null;
        let liveMineInterval = null;

        function ensureMineRuntimeState(mine) {
            if (!mine) return;
            mine.runtimeElapsedMs = Math.max(0, Number(mine.runtimeElapsedMs || 0));
            mine.lastTickAt = Math.max(0, Number(mine.lastTickAt || 0));
            mine.resolvedWindows = Math.max(0, Number(mine.resolvedWindows || 0));
            mine.pendingGbc = Math.max(0, Number(mine.pendingGbc || 0));
            mine.pendingResources = Object.assign({}, mine.pendingResources || {});
            mine.pendingCollectibles = Object.assign({}, mine.pendingCollectibles || {});
            mine.cycleCompleted = Boolean(mine.cycleCompleted);
            mine.cycleSettlementDone = Boolean(mine.cycleSettlementDone);
            mine.completedCycles = Math.max(0, Number(mine.completedCycles || 0));
            mine.lastPulseReward = Math.max(0, Number(mine.lastPulseReward || 0));
            mine.lastPulseOutcome = typeof mine.lastPulseOutcome === "string" ? mine.lastPulseOutcome : "idle";
            mine.cycleFrozenReason = typeof mine.cycleFrozenReason === "string" ? mine.cycleFrozenReason : null;
            mine.collectedThisCycleGbc = Math.max(0, Number(mine.collectedThisCycleGbc || 0));
            mine.dailyRateSnapshot = Math.max(0, Number(mine.dailyRateSnapshot || 0));
            mine.cycleTargetSnapshot = Math.max(0, Number(mine.cycleTargetSnapshot || 0));
            mine.lastResolvedWindowAt = Math.max(0, Number(mine.lastResolvedWindowAt || 0));
            mine.lastCollectedAt = Math.max(0, Number(mine.lastCollectedAt || 0));
        }

        function getMineAssignedGnomes(mineId) {
            return gameState.contractedGnomes.filter((g) => g.allocatedTo === mineId);
        }

        function getMineOperationStats(mine) {
            const gnomesInMine = getMineAssignedGnomes(mine.id);
            let productionBonus = 0;
            let luckFactor = 0;
            let breakModifier = 0;
            let maintenanceLoad = 0;

            gnomesInMine.forEach((gObj) => {
                const ref = GNOME_DATABASE[gObj.type];
                if (!ref) return;
                productionBonus += Number(ref.bonusProduction || 0);
                luckFactor += Number(ref.bonusLuck || 0);
                breakModifier += Number(ref.bonusBreakReduction || 0);
                maintenanceLoad += Number(ref.maintenanceFactor || 0);
            });

            const occupancy = mine.capacityMax > 0 ? Math.min(1, gnomesInMine.length / mine.capacityMax) : 0;

            return {
                gnomesInMine,
                gnomesCount: gnomesInMine.length,
                occupancy,
                productionBonus,
                luckFactor,
                breakModifier,
                maintenanceLoad
            };
        }

        function isAutoCollectorActive() {
            return Number(gameState.inventory?.services?.autoCollectorUntil || 0) > Date.now();
        }

        function getAutoCollectorRemainingText() {
            const until = Number(gameState.inventory?.services?.autoCollectorUntil || 0);
            if (!until || until <= Date.now()) return t("mines.autoCollectorInactive");
            const remainingMs = until - Date.now();
            const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
            const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            return t("mines.autoCollectorRemaining", { days, hours });
        }

        function getMineRoiProfile(mine, stats = getMineOperationStats(mine)) {
            const starFactor = Math.max(0, (Number(mine.stars || 1) - 1) / 4);
            const gearFactor = Math.min(1, ((gameState.inventory.gear.drill || 0) * 0.08) + ((gameState.inventory.gear.railcar || 0) * 0.04));
            const gnomeFactor = Math.min(1, stats.productionBonus + stats.luckFactor * 0.35);
            const energyFactor = gameState.player.energy <= 15 ? 0.25 : gameState.player.energy <= 40 ? 0.6 : 1;
            const pressureFactor = Math.max(0, Math.min(1, (stats.occupancy * 0.45) + (starFactor * 0.3) + (gearFactor * 0.1) + (gnomeFactor * 0.15)));
            const minRate = Number(mine.dailyRoiMin || 0.005);
            const maxRate = Number(mine.dailyRoiMax || 0.015);
            const effectiveRate = Math.max(minRate, Math.min(maxRate, (minRate + ((maxRate - minRate) * pressureFactor)) * energyFactor));
            const capitalBase = Number(mine.capitalBaseGbc || Math.max(1000, mine.baseYieldGbc * 80));
            const minDailyGbc = capitalBase * minRate;
            const maxDailyGbc = capitalBase * maxRate;
            const dailyTargetGbc = capitalBase * effectiveRate;
            const cycleMinGbc = minDailyGbc / 4;
            const cycleMaxGbc = maxDailyGbc / 4;
            const cycleTargetGbc = dailyTargetGbc / 4;
            const pulseTargetGbc = cycleTargetGbc / GAME_CONFIG.minePulseCount;
            const profitChance = Math.max(0.4, Math.min(0.88, 0.52 + (stats.occupancy * 0.18) + Math.min(0.12, stats.luckFactor * 0.18) + (starFactor * 0.1)));

            return {
                minRate,
                maxRate,
                effectiveRate,
                capitalBase,
                minDailyGbc,
                maxDailyGbc,
                dailyTargetGbc,
                cycleMinGbc,
                cycleMaxGbc,
                cycleTargetGbc,
                pulseTargetGbc,
                profitChance
            };
        }

        function formatCompactDuration(ms) {
            const safeMs = Math.max(0, ms);
            const totalSeconds = Math.ceil(safeMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
            if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
            return `${seconds}s`;
        }

        function getMineFrozenReason(mine, stats = getMineOperationStats(mine)) {
            if (mine.broken) return "broken";
            if (stats.gnomesCount === 0) return "no-gnomes";
            if (gameState.player.energy <= 0) return "no-energy";
            return null;
        }

        function getMineProgressPercent(mine) {
            ensureMineRuntimeState(mine);
            return Math.max(0, Math.min(100, (mine.runtimeElapsedMs / GAME_CONFIG.mineCycleDurationMs) * 100));
        }

        function getMinePendingResourceTotal(mine) {
            return Object.values(mine.pendingResources || {}).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        }

        function getMinePendingCollectibleSummary(mine) {
            const entries = Object.entries(mine.pendingCollectibles || {}).filter(([, qty]) => Number(qty || 0) > 0);
            if (!entries.length) return "";
            return entries.map(([name, qty]) => `${qty}x ${getLocalizedCollectibleName(name)}`).join(", ");
        }

        function getMinePulseMeta(mine) {
            ensureMineRuntimeState(mine);
            const nextPulseIndex = Math.min(GAME_CONFIG.minePulseCount, mine.resolvedWindows + 1);
            const nextPulseAtMs = nextPulseIndex * GAME_CONFIG.minePulseDurationMs;
            const remainingMs = Math.max(0, nextPulseAtMs - mine.runtimeElapsedMs);
            return {
                nextPulseIndex,
                remainingMs
            };
        }

        function getMineOfflineSnapshot(mine) {
            ensureMineRuntimeState(mine);
            return {
                id: mine.id,
                pulseTotal: (mine.completedCycles * GAME_CONFIG.minePulseCount) + mine.resolvedWindows,
                cycleTotal: mine.completedCycles,
                pendingGbc: Math.round(Number(mine.pendingGbc || 0))
            };
        }

        function getOfflinePulseText(count) {
            return count === 1
                ? t("mines.offlinePulseSingle")
                : t("mines.offlinePulsePlural", { count });
        }

        function getOfflineCycleText(count) {
            return count === 1
                ? t("mines.offlineCycleSingle")
                : t("mines.offlineCyclePlural", { count });
        }

        function buildOfflineMinesSummary(offlineStartedAt, syncNow, beforeSnapshots = []) {
            const awayMs = Math.max(0, Number(syncNow || Date.now()) - Number(offlineStartedAt || 0));
            if (awayMs < 15000 || !beforeSnapshots.length) return "";

            let pulseDelta = 0;
            let cycleDelta = 0;
            let pendingGbcDelta = 0;

            beforeSnapshots.forEach((before) => {
                const mine = gameState.mines.find((entry) => entry.id === before.id);
                if (!mine) return;
                const after = getMineOfflineSnapshot(mine);
                pulseDelta += Math.max(0, after.pulseTotal - before.pulseTotal);
                cycleDelta += Math.max(0, after.cycleTotal - before.cycleTotal);
                pendingGbcDelta += Math.max(0, after.pendingGbc - before.pendingGbc);
            });

            if (pulseDelta <= 0 && cycleDelta <= 0 && pendingGbcDelta <= 0) return "";

            return t("mines.offlineSummary", {
                time: formatCompactDuration(awayMs),
                pulseText: getOfflinePulseText(pulseDelta),
                cycleText: getOfflineCycleText(cycleDelta),
                stashText: pendingGbcDelta > 0 ? t("mines.offlineStash", { gbc: pendingGbcDelta }) : ""
            });
        }

        function resetMineCycleState(mine) {
            ensureMineRuntimeState(mine);
            mine.runtimeElapsedMs = 0;
            mine.lastTickAt = Date.now();
            mine.resolvedWindows = 0;
            mine.pendingGbc = 0;
            mine.pendingResources = {};
            mine.pendingCollectibles = {};
            mine.cycleCompleted = false;
            mine.cycleSettlementDone = false;
            mine.lastPulseReward = 0;
            mine.lastPulseOutcome = "idle";
            mine.cycleFrozenReason = null;
            mine.collectedThisCycleGbc = 0;
            mine.dailyRateSnapshot = 0;
            mine.cycleTargetSnapshot = 0;
            mine.lastResolvedWindowAt = 0;
        }

        function resolveMinePulse(mine, stats, roiProfile) {
            const randomResource = mine.resources[Math.floor(Math.random() * mine.resources.length)];
            const foundProfit = Math.random() < roiProfile.profitChance;
            const rawQty = foundProfit ? (1 + Math.floor(Math.random() * 2) + (Math.random() < 0.2 ? 1 : 0)) : (Math.random() < 0.4 ? 1 : 0);
            let pulseReward = 0;

            if (foundProfit) {
                const multiplier = 0.7 + Math.random() * 0.9;
                pulseReward = Math.max(1, Math.round(roiProfile.pulseTargetGbc * multiplier * (1 + stats.productionBonus * 0.22)));
                mine.pendingGbc += pulseReward;
            }

            if (rawQty > 0) {
                mine.pendingResources[randomResource] = (mine.pendingResources[randomResource] || 0) + rawQty;
            }

            const collectibleChance = Math.max(0.04, Math.min(0.28, 0.04 + (stats.luckFactor * 0.12) + ((gameState.inventory.gear.railcar || 0) * 0.015)));
            if (Math.random() < collectibleChance) {
                mine.pendingCollectibles[mine.collectibleName] = (mine.pendingCollectibles[mine.collectibleName] || 0) + 1;
            }

            mine.resolvedWindows += 1;
            mine.lastPulseReward = pulseReward;
            mine.lastPulseOutcome = foundProfit ? "profit" : "dry";
            mine.lastResolvedWindowAt = Date.now();
            mine.dailyRateSnapshot = roiProfile.effectiveRate;
            mine.cycleTargetSnapshot = roiProfile.cycleTargetGbc;
        }

        function settleMineCycle(mine, stats) {
            if (mine.cycleSettlementDone) return;

            const baseEnergyLoss = 8 + (stats.gnomesCount * 2) + Math.round((mine.stars || 1) * 1.5);
            const engineMitigation = (gameState.inventory.gear.engine || 0) * 1.5;
            const efficiencyMitigation = Math.min(3, Math.round(stats.productionBonus * 6));
            const actualEnergyLoss = Math.max(3, Math.round(baseEnergyLoss - engineMitigation - efficiencyMitigation));
            gameState.player.energy = Math.max(0, gameState.player.energy - actualEnergyLoss);

            const finalBreakChance = Math.max(0.01, mine.breakChance - stats.breakModifier + (stats.maintenanceLoad * 0.15));
            if (Math.random() < finalBreakChance) {
                mine.broken = true;
                playSoundAlert();
                triggerRandomEvent(t("mines.events.frontRupture"));
                showFeedback(t("mines.events.wornOut", { name: getLocalizedMineField(mine.id, "name", mine.name) }), "error");
                if (typeof window.triggerShowcaseMineEvent === "function") {
                    window.triggerShowcaseMineEvent("break", { mineId: mine.id });
                }
            }

            mine.cycleSettlementDone = true;
            mine.completedCycles = (mine.completedCycles || 0) + 1;
        }

        function grantMinePendingRewards(mine, options = {}) {
            ensureMineRuntimeState(mine);
            const pendingGbc = Math.round(Number(mine.pendingGbc || 0));
            const pendingResources = Object.assign({}, mine.pendingResources || {});
            const pendingCollectibles = Object.assign({}, mine.pendingCollectibles || {});
            const resourceEntries = Object.entries(pendingResources).filter(([, qty]) => Number(qty || 0) > 0);
            const collectibleEntries = Object.entries(pendingCollectibles).filter(([, qty]) => Number(qty || 0) > 0);

            if (pendingGbc <= 0 && resourceEntries.length === 0 && collectibleEntries.length === 0) {
                return { claimed: false, pendingGbc: 0 };
            }

            gameState.player.gbc += pendingGbc;
            gameState.statistics.totalMinedGbc += pendingGbc;

            resourceEntries.forEach(([name, qty]) => {
                gameState.inventory.recursos[name] = (gameState.inventory.recursos[name] || 0) + Number(qty || 0);
            });

            collectibleEntries.forEach(([name, qty]) => {
                gameState.inventory.collectibles[name] = (gameState.inventory.collectibles[name] || 0) + Number(qty || 0);
            });

            const xpGained = Math.max(10, Math.round((pendingGbc / 5) + (collectibleEntries.length * 8)));
            addXP(xpGained);
            incrementMissionProgress("m1", 1);

            mine.collectedThisCycleGbc = (mine.collectedThisCycleGbc || 0) + pendingGbc;
            mine.pendingGbc = 0;
            mine.pendingResources = {};
            mine.pendingCollectibles = {};
            mine.lastCollectedAt = Date.now();

            if (!options.silent) {
                const resourceText = resourceEntries.length
                    ? t("mines.reward.oreText", { value: resourceEntries.reduce((sum, [, qty]) => sum + Number(qty || 0), 0) })
                    : "";
                const collectibleText = collectibleEntries.length
                    ? t("mines.reward.collectibleJoiner", { items: collectibleEntries.map(([name, qty]) => `${qty}x ${getLocalizedCollectibleName(name)}`).join(", ") })
                    : "";
                const prefix = options.auto ? t("mines.reward.autoPrefix") : t("mines.reward.collectPrefix");
                showFeedback(t("mines.reward.summary", {
                    prefix,
                    name: getLocalizedMineField(mine.id, "name", mine.name),
                    gbc: pendingGbc,
                    resourceText,
                    collectibleText
                }), "success");
            }

            return {
                claimed: true,
                pendingGbc,
                resourceEntries,
                collectibleEntries
            };
        }

        function maybeAutoHandleMineCycle(mine) {
            if (!mine.cycleCompleted || !isAutoCollectorActive()) return false;

            const summary = grantMinePendingRewards(mine, { auto: true, silent: false });
            if (!mine.broken) {
                startMineCycle(mine.id, { reset: true });
            }
            return summary.claimed || !mine.broken;
        }

        function advanceMineSimulation(mineId, now = Date.now(), render = true) {
            const mine = gameState.mines.find((m) => m.id === mineId);
            if (!mine || !mine.unlocked) return;

            ensureMineRuntimeState(mine);
            const stats = getMineOperationStats(mine);
            const frozenReason = getMineFrozenReason(mine, stats);
            mine.cycleFrozenReason = frozenReason;

            if (!mine.cycleCompleted && !frozenReason) {
                const lastTickAt = mine.lastTickAt || now;
                const delta = Math.max(0, now - lastTickAt);
                mine.runtimeElapsedMs = Math.min(GAME_CONFIG.mineCycleDurationMs, mine.runtimeElapsedMs + delta);

                const roiProfile = getMineRoiProfile(mine, stats);
                const resolvedByTime = Math.min(GAME_CONFIG.minePulseCount, Math.floor(mine.runtimeElapsedMs / GAME_CONFIG.minePulseDurationMs));
                while (mine.resolvedWindows < resolvedByTime) {
                    resolveMinePulse(mine, stats, roiProfile);
                }

                if (mine.runtimeElapsedMs >= GAME_CONFIG.mineCycleDurationMs) {
                    mine.runtimeElapsedMs = GAME_CONFIG.mineCycleDurationMs;
                    mine.cycleCompleted = true;
                    settleMineCycle(mine, stats);
                }
            }

            mine.lastTickAt = now;

            if (mine.cycleCompleted) {
                maybeAutoHandleMineCycle(mine);
            }

            if (render) {
                renderMines();
                if (currentLiveMineId === mine.id) {
                    renderMineLiveModal();
                }
                if (typeof window.syncOpenShowcaseWithGame === "function") {
                    window.syncOpenShowcaseWithGame("tick");
                }
            }
        }

        function syncAllMineSimulations(options = {}) {
            const now = Number(options.now || Date.now());
            const shouldRender = options.render !== false;
            const offlineStartedAt = Math.max(0, Number(options.offlineStartedAt || 0));
            const beforeSnapshots = offlineStartedAt
                ? gameState.mines.filter((mine) => mine.unlocked).map((mine) => getMineOfflineSnapshot(mine))
                : [];

            gameState.mines.forEach((mine) => {
                if (!mine.unlocked) return;
                advanceMineSimulation(mine.id, now, false);
            });

            if (shouldRender) {
                renderMines();
                if (currentLiveMineId) {
                    renderMineLiveModal();
                }
                if (typeof window.syncOpenShowcaseWithGame === "function") {
                    window.syncOpenShowcaseWithGame("force");
                }
            }

            if (options.notify !== false) {
                const summaryMessage = buildOfflineMinesSummary(offlineStartedAt, now, beforeSnapshots);
                if (summaryMessage) {
                    showFeedback(summaryMessage, "info");
                }
            }

            return now;
        }

        function renderLiveWorkersMarkup(mine, gnomesInMine) {
            if (!gnomesInMine.length) {
                return `
                    <div class="mine-live-empty">
                        <i class="fa-solid fa-user-slash"></i>
                        <p>${t("mines.liveNoTeam")}</p>
                    </div>
                `;
            }

            return gnomesInMine.map((gnome) => {
                const ref = GNOME_DATABASE[gnome.type];
                const profile = getMineLiveWorkerProfile(gnome.type);
                return `
                    <div class="mine-live-worker ${profile.workerClass}">
                        <div class="mine-live-worker-avatar">
                            ${getGnomeAvatarMarkup(gnome.type, "w-full h-full p-1")}
                        </div>
                        <div class="mine-live-worker-copy">
                            <div class="flex flex-wrap items-center gap-2">
                                <p class="font-extrabold text-slate-100 text-sm">${ref?.name || "Gnomo"}</p>
                                <span class="mine-live-badge ${profile.toolClass}">${profile.badgeLabel}</span>
                            </div>
                            <p class="text-[11px] text-slate-400">${t("mines.liveShiftRhythm", { role: getLocalizedGnomeField(gnome.type, "role", ref?.role || t("mines.clanWorker")) })}</p>
                            <p class="mine-live-worker-flair">${profile.flair}</p>
                            <div class="mine-live-tool ${profile.toolClass} ${profile.toolVariantClass}">
                                <span class="mine-live-tool-track"></span>
                                <span class="mine-live-tool-icon"><i class="fa-solid ${profile.iconClass}"></i></span>
                                <span class="mine-live-spark spark-a"></span>
                                <span class="mine-live-spark spark-b"></span>
                                <span class="mine-live-dust"></span>
                                <span class="mine-live-dust dust-b"></span>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        }

        function openMineLiveModal(mineId) {
            currentLiveMineId = mineId;
            const modal = document.getElementById("modal-mine-live");
            if (!modal) return;
            modal.classList.remove("hidden");
            modal.classList.add("flex");
            renderMineLiveModal();
            if (liveMineInterval) clearInterval(liveMineInterval);
            liveMineInterval = setInterval(() => {
                const mine = gameState.mines.find((m) => m.id === currentLiveMineId);
                if (!mine) return;
                advanceMineSimulation(mine.id, Date.now(), false);
                renderMineLiveModal();
            }, 1000);
        }

        function closeMineLiveModal() {
            const modal = document.getElementById("modal-mine-live");
            if (modal) {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            }
            currentLiveMineId = null;
            if (liveMineInterval) {
                clearInterval(liveMineInterval);
                liveMineInterval = null;
            }
        }

        function renderMineLiveModal() {
            const modal = document.getElementById("modal-mine-live");
            const shell = document.getElementById("mine-live-shell");
            const body = document.getElementById("mine-live-body");
            const title = document.getElementById("mine-live-title");
            const subtitle = document.getElementById("mine-live-subtitle");
            const badge = document.getElementById("mine-live-badge");
            if (!modal || modal.classList.contains("hidden") || !body || !currentLiveMineId) return;

            const mine = gameState.mines.find((m) => m.id === currentLiveMineId);
            if (!mine) return;

            ensureMineRuntimeState(mine);
            const stats = getMineOperationStats(mine);
            const roi = getMineRoiProfile(mine, stats);
            const pulseMeta = getMinePulseMeta(mine);
            const progressPercent = Math.round(getMineProgressPercent(mine));
            const pendingResources = getMinePendingResourceTotal(mine);
            const pendingCollectibles = getMinePendingCollectibleSummary(mine);
            const frozenReason = getMineFrozenReason(mine, stats);

            if (shell) {
                shell.className = `w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden relative mine-live-shell mine-live-${mine.id}`;
            }

            if (title) title.innerText = `${getMineDisplayName(mine)} ${t("mines.live")}`;
            if (subtitle) {
                subtitle.innerText = frozenReason === "no-gnomes"
                    ? t("mines.liveReadyNoTeam")
                    : frozenReason === "no-energy"
                        ? t("mines.liveNoEnergy")
                        : frozenReason === "broken"
                            ? t("mines.liveBroken")
                            : mine.lastPulseOutcome === "profit"
                                ? t("mines.livePulseProfit", { value: mine.lastPulseReward, time: formatCompactDuration(pulseMeta.remainingMs) })
                                : t("mines.livePulseDry", { time: formatCompactDuration(pulseMeta.remainingMs) });
            }
            if (badge) badge.innerText = isAutoCollectorActive() ? t("mines.liveAutoActive", { time: getAutoCollectorRemainingText() }) : t("mines.liveManualCollection");

            body.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                    <div class="space-y-4">
                        <div class="mine-live-stage">
                            ${renderLiveWorkersMarkup(mine, stats.gnomesInMine)}
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div class="mine-live-stat">
                                <span>${t("mines.shift6h")}</span>
                                <strong>${progressPercent}%</strong>
                            </div>
                            <div class="mine-live-stat">
                                <span>${t("mines.readings")}</span>
                                <strong>${mine.resolvedWindows}/${GAME_CONFIG.minePulseCount}</strong>
                            </div>
                            <div class="mine-live-stat">
                                <span>${t("mines.partialChest")}</span>
                                <strong>${Math.round(mine.pendingGbc)} GBC</strong>
                            </div>
                            <div class="mine-live-stat">
                                <span>${t("mines.dailyRoi")}</span>
                                <strong>${(roi.effectiveRate * 100).toFixed(2)}%/dia</strong>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="mine-live-panel">
                            <p class="mine-live-label">${t("mines.dailyGoal")}</p>
                            <h4>${Math.round(roi.minDailyGbc)} a ${Math.round(roi.maxDailyGbc)} GBC</h4>
                            <p>${t("mines.dailyGoalCopy", { minRate: (roi.minRate * 100).toFixed(2), maxRate: (roi.maxRate * 100).toFixed(2) })}</p>
                        </div>
                        <div class="mine-live-panel">
                            <p class="mine-live-label">${t("mines.shift6hTitle")}</p>
                            <h4>${Math.round(roi.cycleMinGbc)} a ${Math.round(roi.cycleMaxGbc)} GBC</h4>
                            <p>${t("mines.shift6hCopy", { time: formatCompactDuration(pulseMeta.remainingMs) })}</p>
                        </div>
                        <div class="mine-live-panel">
                            <p class="mine-live-label">${t("mines.pendingLoad")}</p>
                            <h4>${t("mines.oresLabel", { value: pendingResources })}${pendingCollectibles ? ` + ${pendingCollectibles}` : ""}</h4>
                            <p>${mine.cycleCompleted ? t("mines.shiftClosedCopy") : t("mines.accumulatingCopy")}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        function openMineCutscene(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            const modal = document.getElementById("modal-mine-cutscene");
            const shell = document.getElementById("mine-cutscene-shell");
            if (!mine || !modal || !shell) return;

            shell.classList.remove(
                "mine-cutscene-mine_1",
                "mine-cutscene-mine_2",
                "mine-cutscene-mine_3",
                "mine-cutscene-mine_4",
                "mine-cutscene-mine_5"
            );
            shell.classList.add(`mine-cutscene-${mine.id}`);

            const mineName = getLocalizedMineField(mine.id, "name", mine.name);
            document.getElementById("mine-cutscene-title").innerText = mineName;
            document.getElementById("mine-cutscene-subtitle").innerText = mineName;
            document.getElementById("mine-cutscene-badge").innerText = mineName;
            document.getElementById("mine-cutscene-rhythm").innerText = getMineRhythmLabel(mine);
            document.getElementById("mine-cutscene-collectible").innerText = getLocalizedCollectibleName(mine.collectibleName);
            document.getElementById("mine-cutscene-capacity").innerText = t("mines.gnomes", { count: mine.capacityMax, capacity: mine.capacityMax });
            document.getElementById("mine-cutscene-copy").innerText = `${mineName} • ${mine.resources.map(getLocalizedResourceName).join(", ")}`;

            modal.classList.remove("hidden");
            modal.classList.add("flex");
            playSoundUpgrade();
        }

        function closeMineCutscene() {
            const modal = document.getElementById("modal-mine-cutscene");
            if (!modal) return;
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }

        function getNextUnlockGoal(level) {
            const nextLockedMine = gameState.mines.find((m) => !m.unlocked);
            if (!nextLockedMine) {
                return "Consolidar o clã e elevar as missões ao máximo";
            }
            return `Preparar ${getLocalizedMineField(nextLockedMine.id, "name", nextLockedMine.name)} para desbloqueio`;
        }

        function getLevelUpRankLabel(level) {
            if (level >= 5) return "Mestre de Núcleo";
            if (level >= 4) return "Supervisor Épico";
            if (level >= 3) return "Supervisor Avançado";
            if (level >= 2) return "Coordenador Tático";
            return "Ascensão Inicial";
        }

        function getPlayerRankByLevel(level) {
            if (level >= 10) return "Gno5";
            if (level >= 8) return "Gno4";
            if (level >= 5) return "Gno3";
            if (level >= 3) return "Gno2";
            return "Gno1";
        }

        function openLevelUpCutscene(level, xpNeeded) {
            const modal = document.getElementById("modal-levelup-cutscene");
            const title = document.getElementById("levelup-cutscene-title");
            const subtitle = document.getElementById("levelup-cutscene-subtitle");
            const badge = document.getElementById("levelup-cutscene-badge");
            const rank = document.getElementById("levelup-cutscene-rank");
            const nextGoal = document.getElementById("levelup-cutscene-next-goal");
            const xp = document.getElementById("levelup-cutscene-xp");
            const copy = document.getElementById("levelup-cutscene-copy");
            if (!modal || !title || !subtitle || !badge || !rank || !nextGoal || !xp || !copy) return;

            title.innerText = `Nível ${level}`;
            subtitle.innerText = `Seu supervisor subiu de nível e o clã agora opera com mais confiança, organização e presença de liderança.`;
            badge.innerText = `${gameState.player.rank} | Level Up ${level}`;
            rank.innerText = getLevelUpRankLabel(level);
            nextGoal.innerText = getNextUnlockGoal(level);
            xp.innerText = `${Math.max(0, xpNeeded - gameState.player.xp)} XP`;
            copy.innerText = `A nova graduação ${gameState.player.rank} fortalece a autoridade do supervisor e prepara o clã para missões e minas mais exigentes.`;

            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }

        function closeLevelUpCutscene() {
            const modal = document.getElementById("modal-levelup-cutscene");
            if (!modal) return;
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }

        // Renderizador das Minas com progressão de barra e status de operação
        function renderMines() {
            const container = document.getElementById("mines-container");
            container.innerHTML = "";

            gameState.mines.forEach((m) => {
                ensureMineRuntimeState(m);
                const stats = getMineOperationStats(m);
                const gnomesInMine = stats.gnomesInMine;
                const gnomesCount = stats.gnomesCount;
                const roi = getMineRoiProfile(m, stats);

                let contentHtml = "";

                if (!m.unlocked) {
                    // "Comprar Mina" recheado com os requisitos
                    contentHtml = `
                    <div class="bg-slate-800/40 border-2 border-dashed border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between h-80 relative overflow-hidden backdrop-blur-sm">
                        <div class="text-center my-auto space-y-3">
                            <span class="w-12 h-12 bg-slate-900 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl shadow">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                            <h4 class="font-bold text-slate-300">${getLocalizedMineField(m.id, "name", m.name)}</h4>
                            <p class="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">${getLocalizedMineField(m.id, "reqText", m.reqText)}</p>
                        </div>
                        <button onclick="unlockMine('${m.id}')" class="w-full bg-slate-700 hover:bg-amber-500 hover:text-slate-950 font-bold py-2.5 rounded-xl text-xs transition duration-200 mt-auto shadow border border-slate-600/40 hover:border-transparent">
                            ${t("mines.unlockFor")} <i class="fa-solid fa-coins text-[10px] ml-0.5"></i>${m.baseCostGbc} GBC
                        </button>
                    </div>`;
                } else {
                    const progressPercent = getMineProgressPercent(m);
                    const pulseMeta = getMinePulseMeta(m);
                    const isBroken = m.broken === true;
                    const hasPendingClaim = Number(m.pendingGbc || 0) > 0 || getMinePendingResourceTotal(m) > 0 || Object.keys(m.pendingCollectibles || {}).length > 0;
                    const isCycleDone = Boolean(m.cycleCompleted);
                    const autoCollectorActive = isAutoCollectorActive();
                    const frozenReason = getMineFrozenReason(m, stats);

                    let statusBadge = `<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">${t("mines.active")}</span>`;
                    if (isBroken) {
                        statusBadge = `<span class="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">${t("mines.broken")}</span>`;
                    } else if (frozenReason === "no-energy") {
                        statusBadge = `<span class="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">${t("mines.noEnergy")}</span>`;
                    } else if (frozenReason === "no-gnomes") {
                        statusBadge = `<span class="bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">${t("mines.noTeam")}</span>`;
                    } else if (isCycleDone) {
                        statusBadge = `<span class="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">${t("mines.shiftClosed")}</span>`;
                    }

                    // Estrela UI
                    let starIcons = "";
                    for(let i=1; i<=5; i++) {
                        starIcons += `<i class="fa-solid fa-star ${i <= m.stars ? 'text-amber-400' : 'text-slate-600'} text-[10px] ml-0.5"></i>`;
                    }

                    let actionButtonHtml = "";
                    if (isBroken) {
                        actionButtonHtml = `
                            <button onclick="repairMine('${m.id}')" class="w-full bg-red-600 hover:bg-red-500 text-slate-100 font-extrabold py-2.5 rounded-xl text-xs transition duration-150 shadow border border-red-500">
                                <i class="fa-solid fa-wrench mr-1"></i> ${t("mines.repairMine")}
                            </button>
                        `;
                    } else if (isCycleDone) {
                        actionButtonHtml = `
                            <button onclick="collectFromMine('${m.id}')" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition duration-200 shadow-md">
                                <i class="fa-solid fa-truck-ramp-box mr-1"></i> ${hasPendingClaim ? t("mines.closeShiftRestart") : t("mines.restartShift")}
                            </button>
                        `;
                    } else if (hasPendingClaim) {
                        actionButtonHtml = `
                            <button onclick="collectFromMine('${m.id}')" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition duration-200 shadow-md">
                                <i class="fa-solid fa-box-open mr-1"></i> ${t("mines.collectWindow", { value: Math.round(m.pendingGbc || 0) })}
                            </button>
                        `;
                    } else {
                        const waitText = frozenReason === "no-gnomes"
                            ? t("mines.assignToStart")
                            : frozenReason === "no-energy"
                                ? t("mines.recoverEnergy")
                                : t("mines.nextReadingIn", { time: formatCompactDuration(pulseMeta.remainingMs) });
                        actionButtonHtml = `
                            <button onclick="${frozenReason === 'no-gnomes' ? `openAllocationWizard('${m.id}')` : frozenReason === 'no-energy' ? `switchTab('loja'); switchShopSubTab('energia')` : `openMineLiveModal('${m.id}')`}" class="w-full font-black py-2.5 rounded-xl text-xs transition duration-200 shadow-md ${frozenReason ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/40' : 'bg-slate-700 text-slate-300 border border-slate-600/30'}">
                                <i class="fa-solid fa-wave-square mr-1"></i> ${waitText}
                            </button>
                        `;
                    }

                    contentHtml = `
                    <div class="bg-gradient-to-b from-slate-800 to-slate-900 border ${isBroken ? 'border-red-500' : isCycleDone ? 'border-indigo-400' : hasPendingClaim ? 'border-emerald-400/60 active-mining' : 'border-slate-700/80'} rounded-2xl p-4 flex flex-col justify-between min-h-[25rem] shadow-md relative transition duration-300">
                        <div>
                            <!-- Header da Mina -->
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="flex items-center gap-1.5">
                                        <h4 class="font-extrabold text-sm text-slate-100">${getLocalizedMineField(m.id, "name", m.name)}</h4>
                                        ${statusBadge}
                                    </div>
                                    <div class="flex items-center mt-1">
                                        ${starIcons}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button onclick="openMineLiveModal('${m.id}')" class="bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow">
                                            <i class="fa-solid fa-eye mr-1"></i>${t("mines.live")}
                                        </button>
                                        ${autoCollectorActive ? `<span class="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-1 rounded-md">${t("mines.auto")}</span>` : ""}
                                    </div>
                                    <p class="text-[10px] text-slate-400 leading-none mt-2">${t("mines.shift6h")}</p>
                                    <p class="text-xs font-black text-amber-400 mt-1 flex items-center justify-end">
                                        <i class="fa-solid fa-coins mr-0.5 text-[9px]"></i>${Math.round(roi.cycleMinGbc)}-${Math.round(roi.cycleMaxGbc)} GBC
                                    </p>
                                </div>
                            </div>

                            <!-- Barra de Progresso do Ciclo -->
                            <div class="mt-4">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                    <span>${t("mines.cycle6h")}</span>
                                    <span>${Math.round(progressPercent)}%</span>
                                </div>
                                <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                    <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300" style="width: ${progressPercent}%"></div>
                                </div>
                                <div class="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-mono">
                                    <span>${m.resolvedWindows}/${GAME_CONFIG.minePulseCount} ${t("mines.readings")}</span>
                                    <span>${GAME_CONFIG.cycleDisplayLabel}</span>
                                </div>
                            </div>

                            <div class="mt-4 grid grid-cols-2 gap-2">
                                <div class="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                                    <p class="text-[9px] uppercase font-black tracking-wide text-slate-500">${t("mines.partialChest")}</p>
                                    <p class="text-sm font-extrabold text-emerald-300 mt-1">${Math.round(m.pendingGbc || 0)} GBC</p>
                                    <p class="text-[10px] text-slate-500 mt-1">${t("mines.pendingOre", { value: getMinePendingResourceTotal(m) })}</p>
                                </div>
                                <div class="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                                    <p class="text-[9px] uppercase font-black tracking-wide text-slate-500">${t("mines.dailyRoi")}</p>
                                    <p class="text-sm font-extrabold text-amber-300 mt-1">${(roi.effectiveRate * 100).toFixed(2)}%</p>
                                    <p class="text-[10px] text-slate-500 mt-1">${t("mines.rangePerDay", { min: Math.round(roi.minDailyGbc), max: Math.round(roi.maxDailyGbc) })}</p>
                                </div>
                            </div>

                            <!-- Alocação de Gnomos -->
                            <div class="mt-4">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                                    <span>${t("mines.gnomes", { count: gnomesCount, capacity: m.capacityMax })}</span>
                                    <button onclick="openAllocationWizard('${m.id}')" class="text-amber-400 hover:underline text-[9px] font-bold">${t("mines.moveGnomes")}</button>
                                </div>
                                <div class="flex items-center gap-1.5 h-10">
                                    ${gnomesCount === 0 ? `
                                        <div class="w-full h-full border border-dashed border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 text-[10px]">
                                            ${t("mines.noGnomeWorking")}
                                        </div>
                                    ` : gnomesInMine.map(g => {
                                        const r = GNOME_DATABASE[g.type];
                                        return `
                                            <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden" title="${r.name} (${getLocalizedGnomeField(g.type, "role", r.role)})">
                                                ${getGnomeAvatarMarkup(g.type, "w-full h-full p-0.5")}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <div class="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <p class="text-[10px] uppercase font-black tracking-wide text-slate-500">${t("mines.nextReading")}</p>
                                        <p class="text-xs font-bold text-slate-200 mt-1">${isCycleDone ? t("mines.fullShift") : formatCompactDuration(pulseMeta.remainingMs)}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[10px] uppercase font-black tracking-wide text-slate-500">${t("mines.automation")}</p>
                                        <p class="text-xs font-bold ${autoCollectorActive ? 'text-emerald-300' : 'text-slate-300'} mt-1">${autoCollectorActive ? getAutoCollectorRemainingText() : t("mines.manual")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Rodapé do Card: Coletar ou Consertar -->
                        <div class="mt-auto">
                            ${actionButtonHtml}
                        </div>
                    </div>`;
                }

                const wrapper = document.createElement("div");
                wrapper.className = "contents";
                wrapper.innerHTML = contentHtml;
                container.appendChild(wrapper);
            });

            updateInvestmentAdvisor();
        }

        // Desbloquear Novas Minas
        function unlockMine(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!mine) return;
            const requirement = mine.unlockRequirement || null;

            if (gameState.player.gbc < mine.baseCostGbc) {
                showFeedback(t("mines.unlockErrors.insufficientGbc"), "error");
                return;
            }

            if (requirement) {
                const requiredLevel = Number(requirement.level || 0);
                const requiredResource = requirement.resource;
                const requiredAmount = Number(requirement.amount || 0);
                const currentResourceAmount = Number(gameState.inventory.recursos[requiredResource] || 0);

                if (gameState.player.level < requiredLevel || currentResourceAmount < requiredAmount) {
                    showFeedback(t("mines.unlockErrors.requirements", {
                        level: requiredLevel,
                        amount: requiredAmount,
                        resource: getLocalizedResourceName(requiredResource)
                    }), "error");
                    return;
                }
            }

            gameState.player.gbc -= mine.baseCostGbc;
            if (requirement?.resource && Number(requirement.amount || 0) > 0) {
                gameState.inventory.recursos[requirement.resource] -= Number(requirement.amount || 0);
            }
            mine.unlocked = true;
            playSoundUpgrade();
            showFeedback(t("mines.unlockErrors.unlocked", { name: getLocalizedMineField(mine.id, "name", mine.name) }), "success");
            
            // Inicia timer de produção
            startMineCycle(mineId, { reset: true });
            
            saveGameData();
            renderMines();
            renderInventario();
            openMineCutscene(mineId);
        }

        // Subir estrelas de uma mina
        function upgradeMineStars(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!mine || mine.stars >= 5) return;

            const upgradeCost = Math.round(mine.baseYieldGbc * 25);
            if (gameState.player.gbc < upgradeCost) {
                showFeedback(t("mines.upgradeErrors.insufficientGbc"), "error");
                return;
            }

            gameState.player.gbc -= upgradeCost;
            mine.stars += 1;
            playSoundUpgrade();
            showFeedback(t("mines.upgradeErrors.upgraded", { name: getLocalizedMineField(mine.id, "name", mine.name), level: mine.stars }), "success");
            saveGameData();
            renderMines();
        }

        // Inicializador de Ciclo de Mineração
        function startMineCycle(mineId, options = {}) {
            const mine = gameState.mines.find((m) => m.id === mineId);
            if (!mine) return;

            ensureMineRuntimeState(mine);
            if (mineTimers[mineId]?.interval) {
                clearInterval(mineTimers[mineId].interval);
            }

            if (options.reset) {
                resetMineCycleState(mine);
            } else if (!mine.lastTickAt) {
                mine.lastTickAt = Date.now();
            }

            mineTimers[mineId] = {
                interval: setInterval(() => {
                    advanceMineSimulation(mineId, Date.now(), true);
                }, 1000)
            };

            if (!options.deferInitialAdvance) {
                advanceMineSimulation(mineId, Date.now(), false);
            }
        }

        // Caixa de diálogo interna para alocação/desalocação de gnomos nas minas (Manoel-Style)
        function openAllocationWizard(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!mine) return;

            const modal = document.createElement("div");
            modal.className = "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";
            modal.id = "allocation-modal";

            const gnomesList = gameState.contractedGnomes;
            const allocatedCount = gnomesList.filter(g => g.allocatedTo === mineId).length;

            let listHtml = "";
            if (gnomesList.length === 0) {
                listHtml = `<p class="text-xs text-slate-400 text-center py-4">${t("mines.allocation.empty")}</p>`;
            } else {
                gnomesList.forEach(g => {
                    const ref = GNOME_DATABASE[g.type];
                    const isAllocatedToThis = g.allocatedTo === mineId;
                    const isAllocatedToOther = g.allocatedTo && g.allocatedTo !== mineId;
                    const otherMine = isAllocatedToOther ? gameState.mines.find(m => m.id === g.allocatedTo)?.name : "";

                    listHtml += `
                    <div class="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
                                ${getGnomeAvatarMarkup(g.type, "w-full h-full p-1")}
                            </div>
                            <div>
                                <p class="font-extrabold text-slate-100">${ref.name} <span class="text-[10px] text-amber-400">${getLocalizedGnomeField(g.type, "role", ref.role)}</span></p>
                                <p class="text-[10px] text-slate-400 mt-0.5">${getLocalizedGnomeField(g.type, "bonusText", ref.bonusText)}</p>
                            </div>
                        </div>
                        <div>
                            ${isAllocatedToThis ? `
                                <button onclick="deallocateGnome('${g.id}', '${mineId}')" class="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/50 px-2.5 py-1.5 rounded-lg font-bold transition">
                                    ${t("mines.allocation.deallocate")}
                                </button>
                            ` : isAllocatedToOther ? `
                                <button onclick="allocateGnome('${g.id}', '${mineId}')" class="bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 px-2.5 py-1.5 rounded-lg font-bold transition">
                                    ${t("mines.allocation.moveFrom", { name: otherMine })}
                                </button>
                            ` : `
                                <button onclick="allocateGnome('${g.id}', '${mineId}')" ${allocatedCount >= mine.capacityMax ? 'disabled' : ''} class="${
                                    allocatedCount >= mine.capacityMax 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40' 
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:font-bold'
                                } px-3 py-1.5 rounded-lg font-semibold transition">
                                    ${t("mines.allocation.work")}
                                </button>
                            `}
                        </div>
                    </div>`;
                });
            }

            modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
                <button onclick="document.getElementById('allocation-modal').remove()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-100 text-lg transition">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h3 class="text-base font-black text-slate-100 flex items-center gap-2 mb-1">
                    <i class="fa-solid fa-helmet-safety text-amber-500"></i>
                    <span>${t("mines.allocation.title", { name: getLocalizedMineField(mine.id, "name", mine.name) })}</span>
                </h3>
                <p class="text-xs text-slate-400 mb-4">${t("mines.allocation.subtitle", { capacity: mine.capacityMax })}</p>

                <div class="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    ${listHtml}
                </div>

                <div class="mt-6 flex justify-end">
                    <button onclick="document.getElementById('allocation-modal').remove()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition">
                        ${t("mines.allocation.closePanel")}
                    </button>
                </div>
            </div>`;
            
            document.body.appendChild(modal);
        }

        function allocateGnome(gnomeId, mineId) {
            const gnome = gameState.contractedGnomes.find(g => g.id === gnomeId);
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!gnome || !mine) return;

            // Verifica capacidade máxima
            const allocatedCount = gameState.contractedGnomes.filter(g => g.allocatedTo === mineId).length;
            if (allocatedCount >= mine.capacityMax) {
                showFeedback(t("mines.allocation.capacityReached"), "error");
                return;
            }

            gnome.allocatedTo = mineId;
            showFeedback(t("mines.allocation.allocated"), "success");
            playTone(440, "sine", 0.15);
            
            document.getElementById('allocation-modal').remove();
            if (!mine.cycleCompleted && !mine.broken) {
                mine.lastTickAt = Date.now();
            }
            saveGameData();
            renderMines();
            if (typeof window.triggerShowcaseMineEvent === "function") {
                window.triggerShowcaseMineEvent("allocate", { mineId });
            }
            openAllocationWizard(mineId); // Reabre atualizado
        }

        function deallocateGnome(gnomeId, mineId) {
            const gnome = gameState.contractedGnomes.find(g => g.id === gnomeId);
            if (!gnome) return;

            gnome.allocatedTo = null;
            showFeedback(t("mines.allocation.idle"), "info");
            playTone(300, "sine", 0.1);

            document.getElementById('allocation-modal').remove();
            saveGameData();
            renderMines();
            if (typeof window.triggerShowcaseMineEvent === "function") {
                window.triggerShowcaseMineEvent("deallocate", { mineId });
            }
            openAllocationWizard(mineId); // Reabre atualizado
        }

        // Coletar recursos acumulados da mina
        function collectFromMine(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!mine) return;
            ensureMineRuntimeState(mine);
            advanceMineSimulation(mineId, Date.now(), false);

            const hasPendingClaim = Number(mine.pendingGbc || 0) > 0 || getMinePendingResourceTotal(mine) > 0 || Object.keys(mine.pendingCollectibles || {}).length > 0;
            if (!hasPendingClaim && !mine.cycleCompleted) {
                showFeedback(t("mines.collect.notReady"), "warning");
                return;
            }

            const claimSummary = grantMinePendingRewards(mine, { auto: false, silent: false });
            if (claimSummary.claimed) {
                playSoundCoin();
            }

            if (mine.cycleCompleted && !mine.broken) {
                startMineCycle(mineId, { reset: true });
            }

            saveGameData();
            renderMines();
            renderInventario();
            renderMissions();
            if (claimSummary.claimed && typeof window.triggerShowcaseMineEvent === "function") {
                const firstResource = claimSummary.resourceEntries[0]?.[0] || mine.resources[0];
                const firstCollectible = claimSummary.collectibleEntries[0]?.[0] || mine.collectibleName;
                window.triggerShowcaseMineEvent("collect", {
                    mineId,
                    mineName: mine.name,
                    yield: claimSummary.pendingGbc,
                    resource: firstResource,
                    collectibleFound: claimSummary.collectibleEntries.length > 0,
                    collectibleName: firstCollectible
                });
            }
        }

        // Reparação de Minas quebradas
        function repairMine(mineId) {
            const mine = gameState.mines.find(m => m.id === mineId);
            if (!mine || !mine.broken) return;

            const repairCost = Math.round(mine.baseYieldGbc * 4); // custo baseado na escala
            if (gameState.player.gbc < repairCost) {
                showFeedback(t("mines.repair.insufficientGbc"), "error");
                return;
            }

            gameState.player.gbc -= repairCost;
            mine.broken = false;
            playSoundUpgrade();
            showFeedback(t("mines.repair.success", { name: getLocalizedMineField(mine.id, "name", mine.name) }), "success");
            
            if (mine.cycleCompleted) {
                startMineCycle(mineId, { reset: true });
            } else {
                mine.lastTickAt = Date.now();
                startMineCycle(mineId);
            }
            saveGameData();
            renderMines();
            if (typeof window.triggerShowcaseMineEvent === "function") {
                window.triggerShowcaseMineEvent("repair", { mineId });
            }
        }

        // Adicionar XP e checar level up
        function addXP(amount) {
            gameState.player.xp += amount;
            let xpNeeded = gameState.player.level * GAME_CONFIG.xpPerLevelFactor;
            let leveledUpTo = null;
            
            while (gameState.player.xp >= xpNeeded) {
                gameState.player.xp -= xpNeeded;
                gameState.player.level += 1;
                gameState.player.rank = getPlayerRankByLevel(gameState.player.level);
                leveledUpTo = gameState.player.level;
                playSoundUpgrade();
                showFeedback(t("mines.levelUp.feedback", { level: gameState.player.level }), "success");
                xpNeeded = gameState.player.level * GAME_CONFIG.xpPerLevelFactor;
            }

            // Atualiza barra na tela
            document.getElementById("player-level").innerText = gameState.player.level;
            const progress = (gameState.player.xp / xpNeeded) * 100;
            document.getElementById("player-xp-bar").style.width = `${progress}%`;
            if (typeof window.syncOpenShowcaseWithGame === "function") {
                window.syncOpenShowcaseWithGame("force");
            }
            if (leveledUpTo !== null) {
                openLevelUpCutscene(leveledUpTo, xpNeeded);
            }
        }

        window.closeMineCutscene = closeMineCutscene;
        window.closeLevelUpCutscene = closeLevelUpCutscene;
        window.openMineLiveModal = openMineLiveModal;
        window.closeMineLiveModal = closeMineLiveModal;
        window.syncAllMineSimulations = syncAllMineSimulations;
