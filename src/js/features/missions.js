        function getMissionById(id) {
            return gameState.missions.find((mission) => mission.id === id) || null;
        }

        function getMissionPhasePercent(phase) {
            if (!phase || !phase.target) return 0;
            return Math.max(0, Math.min(100, Math.round((phase.progress / phase.target) * 100)));
        }

        const missionTabsState = {};
        const missionUpgradeState = {};

        function setMissionTab(missionId, tab) {
            missionTabsState[missionId] = tab;
            renderMissions();
        }

        function getMissionNextPhase(mission) {
            if (!mission || !Array.isArray(mission.phases)) return null;
            const active = getMissionCurrentPhase(mission);
            if (!active) return null;
            const idx = mission.phases.findIndex((phase) => phase.id === active.id);
            if (idx === -1) return null;
            return mission.phases.slice(idx + 1).find((phase) => !phase.claimed) || null;
        }

        function getMissionTotals(mission) {
            const phases = Array.isArray(mission?.phases) ? mission.phases : [];
            const totals = phases.reduce(
                (acc, phase) => {
                    acc.totalGbc += Number(phase.rewardGbc || 0);
                    acc.totalXp += Number(phase.rewardXp || 0);
                    if (!phase.claimed) {
                        acc.remainingGbc += Number(phase.rewardGbc || 0);
                        acc.remainingXp += Number(phase.rewardXp || 0);
                    }
                    return acc;
                },
                { totalGbc: 0, totalXp: 0, remainingGbc: 0, remainingXp: 0 }
            );
            return totals;
        }

        function getMissionLocalizedTitle(mission) {
            return getLocalizedMissionText(mission?.id, "title", mission?.title || "");
        }

        function getMissionLocalizedDescription(mission) {
            return getLocalizedMissionText(mission?.id, "description", mission?.description || "");
        }

        function getMissionLocalizedPhaseLabel(mission, phase) {
            return getLocalizedMissionPhase(mission?.id, phase?.id, "label", phase?.label || "");
        }

        function getMissionLocalizedPhaseText(mission, phase) {
            return getLocalizedMissionPhase(mission?.id, phase?.id, "text", phase?.text || "");
        }

        function getMissionXpJoiner() {
            if (getCurrentLanguage() === "en") return " and ";
            if (getCurrentLanguage() === "es") return " y ";
            return " e ";
        }

        function incrementMissionProgress(id, amount = 1) {
            const mission = getMissionById(id);
            const phase = getMissionCurrentPhase(mission);
            if (!mission || !phase) return false;

            const previousProgress = phase.progress;
            phase.progress = Math.min(phase.target, phase.progress + amount);
            refreshMissionComputedFields(mission);

            if (phase.progress >= phase.target && previousProgress < phase.target) {
                showFeedback(t("missionUi.readyToClaim", {
                    phase: getMissionLocalizedPhaseLabel(mission, phase),
                    title: getMissionLocalizedTitle(mission)
                }), "info");
            }

            saveGameData();
            return true;
        }

        function claimMissionReward(id) {
            const mission = getMissionById(id);
            const phase = getMissionCurrentPhase(mission);
            if (!mission || !phase || phase.claimed || phase.progress < phase.target) return;

            const previousPhaseId = phase.id;

            phase.claimed = true;
            phase.claimedAt = Date.now();
            refreshMissionComputedFields(mission);

            gameState.player.gbc += phase.rewardGbc;
            addXP(phase.rewardXp || 20);
            playSoundUpgrade();

            const advanced = mission.currentPhaseId && mission.currentPhaseId !== previousPhaseId;
            missionUpgradeState[id] = {
                active: true,
                advanced
            };

            const feedback = mission.completed
                ? t("missionUi.completedAll", { title: getMissionLocalizedTitle(mission), reward: phase.rewardGbc })
                : t("missionUi.rewardClaimed", {
                    title: getMissionLocalizedTitle(mission),
                    phase: getMissionLocalizedPhaseLabel(mission, phase),
                    reward: phase.rewardGbc
                });

            showFeedback(`🎯 ${feedback}`, "success");

            missionTabsState[id] = "current";

            saveGameData();
            renderInventario();
            renderMines();
            renderMissions();

            setTimeout(() => {
                if (missionUpgradeState[id]) {
                    missionUpgradeState[id].active = false;
                }
                renderMissions();
            }, 750);
        }

        function completeMission(id) {
            claimMissionReward(id);
        }

        function renderMissionPhaseButton(mission, phase, isActivePhase) {
            if (phase.claimed) {
                return `<span class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-[10px] font-black uppercase tracking-wide text-emerald-300">${t("missionUi.claimed")}</span>`;
            }

            if (isActivePhase && phase.progress >= phase.target) {
                return `<button onclick="claimMissionReward('${mission.id}')" class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wide transition">${t("missionUi.collectPrize")}</button>`;
            }

            if (isActivePhase) {
                return `<span class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-[10px] font-black uppercase tracking-wide text-sky-200">${t("missionUi.inProgress")}</span>`;
            }

            return `<span class="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-slate-700 bg-slate-950/70 text-[10px] font-black uppercase tracking-wide text-slate-500">${t("missionUi.locked")}</span>`;
        }

        function renderMissionTabButton(mission, tab, label, activeTab) {
            const isActive = tab === activeTab;
            const total = mission.totalPhases || (Array.isArray(mission.phases) ? mission.phases.length : 3);
            const fixedStep = tab === "final" ? total : tab === "next" ? Math.min(total, 2) : 1;
            const stepText = `${fixedStep}/${total}`;
            return `
                <button type="button" onclick="setMissionTab('${mission.id}','${tab}')" class="mission-tab-btn ${isActive ? 'is-active' : ''}">
                    <span class="mission-tab-label">${label}</span>
                    <span class="mission-tab-count">${stepText}</span>
                </button>
            `;
        }

        function renderMissionCheckpoints(mission) {
            const phases = Array.isArray(mission?.phases) ? mission.phases : [];
            const activeId = mission.currentPhaseId;
            return `
                <div class="mission-checkpoints" aria-label="${t("missionUi.phaseTrail")}">
                    ${phases.map((phase) => {
                        const done = Boolean(phase.claimed);
                        const active = !done && activeId === phase.id;
                        const cls = done ? "is-done" : active ? "is-active" : "is-locked";
                        return `<span class="mission-checkpoint ${cls}" title="${getMissionLocalizedPhaseLabel(mission, phase)}"></span>`;
                    }).join("")}
                </div>
            `;
        }

        function renderMissionCurrentPanel(mission, activePhase) {
            if (!activePhase) {
                return `
                    <div class="space-y-2">
                        <p class="text-xs text-slate-300 font-extrabold">${t("missionUi.boardDone")}</p>
                        <p class="text-[11px] text-slate-400">${t("missionUi.boardDoneCopy")}</p>
                    </div>
                `;
            }

            const percent = getMissionPhasePercent(activePhase);
            return `
                <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div class="space-y-1">
                            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">${getMissionLocalizedPhaseLabel(mission, activePhase)}</p>
                            <h5 class="text-sm font-extrabold text-slate-100">${getMissionLocalizedPhaseText(mission, activePhase)}</h5>
                            <p class="text-[11px] text-slate-400">${t("missionUi.phasePrize")}: <span class="font-bold text-amber-300">+${activePhase.rewardGbc} GBC</span>${activePhase.rewardXp ? `${getMissionXpJoiner()}<span class="font-bold text-sky-300">+${activePhase.rewardXp} XP</span>` : ''}</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center px-3 py-1 rounded-full border border-slate-700 bg-slate-950/70 text-[10px] font-black uppercase tracking-wide text-slate-200">
                                ${activePhase.progress}/${activePhase.target}
                            </span>
                            ${renderMissionPhaseButton(mission, activePhase, true)}
                        </div>
                    </div>
                    <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }

        function renderMissionNextPanel(mission, activePhase, nextPhase) {
            if (!activePhase) {
                return `
                    <div class="space-y-2">
                        <p class="text-xs text-slate-300 font-extrabold">${t("missionUi.noNextPhase")}</p>
                        <p class="text-[11px] text-slate-400">${t("missionUi.noNextPhaseCopy")}</p>
                    </div>
                `;
            }

            if (!nextPhase) {
                return `
                    <div class="space-y-2">
                        <p class="text-xs text-slate-300 font-extrabold">${t("missionUi.lastPhase")}</p>
                        <p class="text-[11px] text-slate-400">${t("missionUi.lastPhaseCopy")}</p>
                    </div>
                `;
            }

            const expectedTotal = Number(nextPhase.rewardGbc || 0);
            const expectedXp = Number(nextPhase.rewardXp || 0);
            return `
                <div class="space-y-3">
                    <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">${getMissionLocalizedPhaseLabel(mission, nextPhase)}</p>
                    <h5 class="text-sm font-extrabold text-slate-100">${getMissionLocalizedPhaseText(mission, nextPhase)}</h5>
                    <p class="text-[11px] text-slate-400">${t("missionUi.nextPrize")}: <span class="font-bold text-amber-300">+${expectedTotal} GBC</span>${expectedXp ? `${getMissionXpJoiner()}<span class="font-bold text-sky-300">+${expectedXp} XP</span>` : ''}</p>
                    <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                        <p class="text-[11px] text-slate-300 font-semibold">${t("missionUi.status")}</p>
                        <p class="text-[10px] text-slate-500 mt-1">${t("missionUi.nextPhaseUnlock")}</p>
                    </div>
                </div>
            `;
        }

        function renderMissionFinalPanel(mission) {
            const totals = getMissionTotals(mission);
            const isDone = mission.completed;
            const badgeText = isDone ? t("missionUi.boardDone") : t("missionUi.finalReward");
            return `
                <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">${badgeText}</p>
                            <h5 class="text-sm font-extrabold text-slate-100">${isDone ? t("missionUi.everythingClaimed") : t("missionUi.finishBoard")}</h5>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full border ${isDone ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'} text-[10px] font-black uppercase tracking-wide">
                            ${isDone ? t("missionUi.finalized") : t("missionUi.remainingGbc", { value: totals.remainingGbc })}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">${t("missionUi.boardTotal")}</p>
                            <p class="text-sm font-extrabold text-amber-300 mt-1">${totals.totalGbc} GBC</p>
                            <p class="text-[10px] text-slate-500 mt-1">${totals.totalXp ? t("missionUi.xpTotal", { value: totals.totalXp }) : t("missionUi.xpDistributed")}</p>
                        </div>
                        <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">${t("missionUi.toReceive")}</p>
                            <p class="text-sm font-extrabold text-sky-300 mt-1">${isDone ? '0' : totals.remainingGbc} GBC</p>
                            <p class="text-[10px] text-slate-500 mt-1">${isDone ? t("missionUi.noPending") : t("missionUi.xpRemaining", { value: totals.remainingXp || 0 })}</p>
                        </div>
                    </div>
                    <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div class="h-full ${isDone ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'} transition-all duration-300" style="width: ${mission.totalProgressPercent}%"></div>
                    </div>
                </div>
            `;
        }

        // Quadro de Missões Diárias
        function renderMissions() {
            const container = document.getElementById("missions-container");
            container.innerHTML = "";

            gameState.missions.forEach((mission) => {
                refreshMissionComputedFields(mission);
                const activePhase = getMissionCurrentPhase(mission);
                const nextPhase = getMissionNextPhase(mission);
                const activeTab = missionTabsState[mission.id] || (mission.completed ? "final" : "current");
                const upgradeState = missionUpgradeState[mission.id];
                const upgradeClass = upgradeState?.active ? (upgradeState.advanced ? "is-levelup" : "is-claim") : "";

                container.innerHTML += `
                    <div class="bg-slate-900 border ${mission.completed ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'} p-4 rounded-2xl space-y-4 shadow-inner">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="w-8 h-8 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-amber-400 text-xs">
                                        <i class="${mission.icon || 'fa-solid fa-bullseye'}"></i>
                                    </span>
                                    <div>
                                        <h4 class="font-extrabold text-sm text-slate-100">${getMissionLocalizedTitle(mission)}</h4>
                                        <p class="text-[11px] text-slate-400">${getMissionLocalizedDescription(mission)}</p>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-2 pt-1">
                                    <span class="text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-lg border ${mission.completed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-950 text-slate-300'}">
                                        ${mission.completed ? t("missionUi.boardDone") : t("missionUi.phasesClaimed", { claimed: mission.claimedPhases, total: mission.totalPhases })}
                                    </span>
                                    <span class="text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                                        ${mission.completed ? t("missionUi.everythingClaimed") : t("missionUi.boardPercent", { value: mission.totalProgressPercent })}
                                    </span>
                                </div>
                            </div>
                            <div class="text-left sm:text-right">
                                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">${t("missionUi.currentPhase")}</p>
                                <p class="text-xs font-black text-slate-100 mt-1">${activePhase ? getMissionLocalizedPhaseLabel(mission, activePhase) : t("missionUi.finished")}</p>
                                <p class="text-[10px] text-amber-400 mt-1">${activePhase ? `${t("missionUi.phasePrize")}: +${activePhase.rewardGbc} GBC` : t("missionUi.noPendingPrize")}</p>
                            </div>
                        </div>

                        <div class="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300" style="width: ${mission.totalProgressPercent}%"></div>
                        </div>

                        ${renderMissionCheckpoints(mission)}

                        <div class="mission-tabs" role="tablist" aria-label="${t("missionUi.missionTrail")}">
                            ${renderMissionTabButton(mission, "current", t("missionUi.currentTab"), activeTab)}
                            ${renderMissionTabButton(mission, "next", t("missionUi.nextTab"), activeTab)}
                            ${renderMissionTabButton(mission, "final", t("missionUi.finalTab"), activeTab)}
                        </div>

                        <div class="mission-tab-panel ${upgradeClass}">
                            ${activeTab === "next"
                                ? renderMissionNextPanel(mission, activePhase, nextPhase)
                                : activeTab === "final"
                                    ? renderMissionFinalPanel(mission)
                                    : renderMissionCurrentPanel(mission, activePhase)}
                        </div>
                    </div>
                `;
            });

            // Quadro de Estatísticas
            const stats = document.getElementById("stats-panel");
            stats.innerHTML = `
                <div class="bg-slate-900 p-3 rounded-xl text-center">
                    <p class="text-slate-400">${t("missionUi.stats.totalMined")}</p>
                    <p class="text-base font-extrabold text-amber-400 mt-1">${gameState.statistics.totalMinedGbc} GBC</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl text-center">
                    <p class="text-slate-400">${t("missionUi.stats.swappedUsdt")}</p>
                    <p class="text-base font-extrabold text-emerald-400 mt-1">${gameState.statistics.totalSwappedUsdt.toFixed(2)} USDT</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl text-center">
                    <p class="text-slate-400">${t("missionUi.stats.luckySpins")}</p>
                    <p class="text-base font-extrabold text-indigo-400 mt-1">${gameState.statistics.totalSpins}</p>
                </div>
                <div class="bg-slate-900 p-3 rounded-xl text-center">
                    <p class="text-slate-400">${t("missionUi.stats.currentRank")}</p>
                    <p class="text-base font-extrabold text-amber-500 mt-1">${gameState.player.rank}</p>
                </div>
            `;
        }

        window.setMissionTab = setMissionTab;
        window.claimMissionReward = claimMissionReward;
        window.incrementMissionProgress = incrementMissionProgress;

        // Sistema de Eventos de Crise Aleatórios
        function triggerRandomEvent(type) {
            gameState.activeCrisis = {
                type: type,
                costGbc: 120,
                penaltyTime: Date.now() + (10 * 60 * 1000) // 10 minutos para agir
            };
            
            document.getElementById("alert-banner-text").innerHTML = t("missionUi.crisis.alert", { type });
            document.getElementById("alert-banner").classList.remove("hidden");
            playSoundAlert();
        }

        function resolveCurrentCrisis() {
            if (!gameState.activeCrisis) return;

            const cost = gameState.activeCrisis.costGbc;
            if (gameState.player.gbc < cost) {
                showFeedback(t("missionUi.crisis.insufficient"), "error");
                return;
            }

            gameState.player.gbc -= cost;
            gameState.activeCrisis = null;
            gameState.statistics.crisesResolved += 1;

            document.getElementById("alert-banner").classList.add("hidden");
            playSoundUpgrade();
            showFeedback(t("missionUi.crisis.resolved"), "success");
            
            saveGameData();
            renderMines();
        }
