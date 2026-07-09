        // Sistema de Afiliados (8 Níveis de Residual e Ranking Gno1 - Gno5)
        function updateAffiliateSystem() {
            // Calcula Patente baseado no volume
            const vol = gameState.player.referralVolume;
            let rank = "Gno1";
            let nextRankText = "Gno2 (Req: $500)";
            let progress = 0;
            
            // Comissões por nível (1º nível, 2-3º nível, 4-8º nível)
            let rates = { level1: "10%", level23: "5%", level48: "2.5%" };

            if (vol >= 20000) {
                rank = "Gno5";
                nextRankText = "Patente Máxima Atingida";
                progress = 100;
                rates = { level1: "20%", level23: "10%", level48: "5%" };
            } else if (vol >= 10000) {
                rank = "Gno4";
                nextRankText = "Gno5 (Req: $20000)";
                progress = (vol / 20000) * 100;
                rates = { level1: "18%", level23: "9%", level48: "4.5%" };
            } else if (vol >= 5000) {
                rank = "Gno3";
                nextRankText = "Gno4 (Req: $10000)";
                progress = (vol / 10000) * 100;
                rates = { level1: "16%", level23: "8%", level48: "4%" };
            } else if (vol >= 500) {
                rank = "Gno2";
                nextRankText = "Gno3 (Req: $5000)";
                progress = (vol / 5000) * 100;
                rates = { level1: "14%", level23: "7%", level48: "3.5%" };
            } else {
                rank = "Gno1";
                nextRankText = "Gno2 (Req: $500)";
                progress = (vol / 500) * 100;
                rates = { level1: "10%", level23: "5%", level48: "2.5%" };
            }

            gameState.player.rank = rank;
            
            // Atualiza UI
            document.getElementById("rank-badge").innerText = rank;
            document.getElementById("ref-volume-text").innerText = `$${formatGameNumber(vol)} / $${rank === 'Gno5' ? '20k' : rank === 'Gno4' ? '20,000' : rank === 'Gno3' ? '10,000' : rank === 'Gno2' ? '5,000' : '500'}`;
            document.getElementById("rank-progress-bar").style.width = `${progress}%`;
            
            document.getElementById("ref-rate-1").innerText = t("referrals.rates.residual", { rate: rates.level1 });
            document.getElementById("ref-rate-2-3").innerText = t("referrals.rates.residual", { rate: rates.level23 });
            document.getElementById("ref-rate-4-8").innerText = t("referrals.rates.residual", { rate: rates.level48 });
            document.getElementById("ref-next-rank").innerText = getLocalizedDomainSection("referralNames")[nextRankText] || nextRankText;

            // Renderiza tabela de simulação
            const body = document.getElementById("referrals-table-body");
            body.innerHTML = "";

            if (gameState.referrals.length === 0) {
                body.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">${t("referrals.table.empty")}</td></tr>`;
            } else {
                gameState.referrals.forEach(r => {
                    // Calcula a porcentagem comissão com base no nível do indicado e rank atual
                    let commissionPercent = 0;
                    if (r.line === 1) commissionPercent = parseFloat(rates.level1);
                    else if (r.line <= 3) commissionPercent = parseFloat(rates.level23);
                    else commissionPercent = parseFloat(rates.level48);

                    const earningsComm = Math.round(r.yieldRate * (commissionPercent / 100));

                    const row = document.createElement("tr");
                    row.className = "border-b border-slate-800/60 hover:bg-slate-900/40 transition text-xs";
                    row.innerHTML = `
                        <td class="p-3 font-bold text-slate-200 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>${r.name}</span>
                        </td>
                        <td class="p-3 text-slate-400">${t("referrals.table.residualLevel", { line: r.line })}</td>
                        <td class="p-3 text-amber-400 font-bold">+${r.yieldRate} GBC/dia</td>
                        <td class="p-3 text-slate-400">$${r.activeVolume}</td>
                        <td class="p-3 text-emerald-400 font-black">+${earningsComm} GBC (${t("referrals.table.received")})</td>
                    `;
                    body.appendChild(row);
                });
            }
        }

        // Simular a entrada de um amigo indicado
        function simulateReferralInvite() {
            const firstNames = ["Marcos", "Danilo", "Felipe", "Gabriela", "Mariana", "Renato", "Lucas", "Julia"];
            const nickNames = ["GnoPro", "MinaMax", "CriptoBoss", "GnoKing", "DigGold"];
            
            const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${nickNames[Math.floor(Math.random() * nickNames.length)]}`;
            const line = Math.floor(Math.random() * 8) + 1; // 1 a 8 níveis de indicação
            const yieldRate = Math.floor(Math.random() * 80) + 20; // 20 a 100 GBC diários
            const activeVolume = Math.floor(Math.random() * 150) + 10; // $10 a $160

            gameState.referrals.push({ name, line, yieldRate, activeVolume });
            // Soma ao volume total do jogador para avançar patente
            gameState.player.referralVolume += activeVolume;

            playSoundUpgrade();
            showFeedback(t("referrals.invited", { name, line }), "success");
            
            saveGameData();
            updateAffiliateSystem();
        }

        function copyRefLink() {
            // Simulação de cópia segura para iFrames
            const code = document.getElementById("ref-code").innerText;
            const input = document.createElement("input");
            input.value = "https://gnominers.io/register?ref=" + code;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showFeedback(t("referrals.copied"), "success");
        }

        const FORTUNE_WHEEL_SEGMENTS = [
            {
                minDegree: 0,
                maxDegree: 60,
                label: "Bolsa GBC",
                revealTitle: "Bolsa revelada",
                accentClass: "text-amber-300",
                colorName: "Âmbar",
                color: "#f59e0b",
                applyReward() {
                    const reward = [15, 20, 25, 30, 35, 45][Math.floor(Math.random() * 6)];
                    gameState.player.gbc += reward;
                    return {
                        title: t("wheel.segments.gbcBagTitle"),
                        text: getCurrentLanguage() === "en"
                            ? `You received ${reward} GnoCripto on this surprise stop.`
                            : getCurrentLanguage() === "es"
                                ? `Recibiste ${reward} GnoCripto en esta parada sorpresa.`
                                : `Você recebeu ${reward} GnoCriptos nessa parada surpresa.`,
                        badge: `+${reward} GBC`,
                        tone: "success"
                    };
                }
            },
            {
                minDegree: 60,
                maxDegree: 120,
                label: "Carga Vital",
                revealTitle: "Carga de energia",
                accentClass: "text-sky-300",
                colorName: "Azul",
                color: "#38bdf8",
                applyReward() {
                    const reward = [20, 25, 30, 40, 50, 60][Math.floor(Math.random() * 6)];
                    gameState.player.energy = Math.min(100, gameState.player.energy + reward);
                    return {
                        title: t("wheel.segments.vitalLoadTitle"),
                        text: getCurrentLanguage() === "en"
                            ? `Your team recovered +${reward}% vital energy.`
                            : getCurrentLanguage() === "es"
                                ? `Tu equipo recuperó +${reward}% de energía vital.`
                                : `Sua equipe recuperou +${reward}% de energia vital.`,
                        badge: `+${reward}% energia`,
                        tone: "success"
                    };
                }
            },
            {
                minDegree: 120,
                maxDegree: 180,
                label: "Caixa Turbo",
                revealTitle: "Caixa turbo",
                accentClass: "text-fuchsia-300",
                colorName: "Rosa",
                color: "#d946ef",
                applyReward() {
                    const reward = [60, 75, 90, 110, 125, 140][Math.floor(Math.random() * 6)];
                    gameState.player.gbc += reward;
                    return {
                        title: t("wheel.segments.turboBoxTitle"),
                        text: getCurrentLanguage() === "en"
                            ? `The wheel released a boosted bonus of ${reward} GBC.`
                            : getCurrentLanguage() === "es"
                                ? `La ruleta liberó un bono reforzado de ${reward} GBC.`
                                : `A roleta liberou um bônus reforçado de ${reward} GBC.`,
                        badge: `+${reward} GBC`,
                        tone: "success"
                    };
                }
            },
            {
                minDegree: 180,
                maxDegree: 240,
                label: "Reserva BSC",
                revealTitle: "Reserva em USDT",
                accentClass: "text-emerald-300",
                colorName: "Verde",
                color: "#34d399",
                applyReward() {
                    const reward = [0.2, 0.35, 0.5, 0.75, 1, 1.25][Math.floor(Math.random() * 6)];
                    gameState.player.usdt += reward;
                    return {
                        title: t("wheel.segments.bscReserveTitle"),
                        text: getCurrentLanguage() === "en"
                            ? `You revealed ${reward.toFixed(2)} USDT on the BSC network.`
                            : getCurrentLanguage() === "es"
                                ? `Revelaste ${reward.toFixed(2)} USDT en la red BSC.`
                                : `Você revelou ${reward.toFixed(2)} USDT na rede BSC.`,
                        badge: `+${reward.toFixed(2)} USDT`,
                        tone: "success"
                    };
                }
            },
            {
                minDegree: 240,
                maxDegree: 300,
                label: "Névoa",
                revealTitle: "Névoa da sorte",
                accentClass: "text-slate-300",
                colorName: "Cinza",
                color: "#64748b",
                applyReward() {
                    const outcomes = [
                        {
                            title: getCurrentLanguage() === "en" ? "Light fog" : getCurrentLanguage() === "es" ? "Niebla leve" : "Névoa leve",
                            text: getCurrentLanguage() === "en"
                                ? "No prize this round. The next one may open a rare pack."
                                : getCurrentLanguage() === "es"
                                    ? "Sin premio esta vez. La próxima puede abrir un paquete raro."
                                    : "Rodada sem prêmio desta vez. A próxima pode abrir um pacote raro.",
                            badge: t("wheel.segments.noGain"),
                            tone: "warning"
                        },
                        {
                            title: getCurrentLanguage() === "en" ? "Compensated fog" : getCurrentLanguage() === "es" ? "Niebla compensada" : "Névoa compensada",
                            text: getCurrentLanguage() === "en"
                                ? "The fog hid a gift: +10 GBC to keep the wheel alive."
                                : getCurrentLanguage() === "es"
                                    ? "La niebla guardaba un detalle: +10 GBC para mantener vivo el giro."
                                    : "A névoa guardava um mimo: +10 GBC para manter o giro vivo.",
                            badge: "+10 GBC",
                            tone: "success",
                            gbc: 10
                        }
                    ];
                    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                    if (outcome.gbc) gameState.player.gbc += outcome.gbc;
                    return outcome;
                }
            },
            {
                minDegree: 300,
                maxDegree: 360,
                label: "Jackpot",
                revealTitle: "Jackpot do clã",
                accentClass: "text-amber-400",
                colorName: "Dourado",
                color: "#facc15",
                applyReward() {
                    const reward = [150, 180, 220, 260, 300, 360][Math.floor(Math.random() * 6)];
                    gameState.player.gbc += reward;
                    return {
                        title: t("wheel.segments.jackpotTitle"),
                        text: getCurrentLanguage() === "en"
                            ? `The top surprise landed on the panel: ${reward} GBC were added to your balance.`
                            : getCurrentLanguage() === "es"
                                ? `La sorpresa máxima cayó en el panel: ${reward} GBC fueron añadidos al saldo.`
                                : `A surpresa máxima caiu no painel: ${reward} GBC foram adicionados ao saldo.`,
                        badge: `+${reward} GBC`,
                        tone: "success"
                    };
                }
            }
        ];

        function getWheelSegmentPresentation(segment) {
            if (!segment) return { label: "", colorName: "" };
            if (segment.minDegree === 0) return { label: t("wheel.segments.gbcBag"), colorName: t("wheel.segments.amber") };
            if (segment.minDegree === 60) return { label: t("wheel.segments.vitalLoad"), colorName: t("wheel.segments.blue") };
            if (segment.minDegree === 120) return { label: t("wheel.segments.turboBox"), colorName: t("wheel.segments.pink") };
            if (segment.minDegree === 180) return { label: t("wheel.segments.bscReserve"), colorName: t("wheel.segments.green") };
            if (segment.minDegree === 240) return { label: t("wheel.segments.fog"), colorName: t("wheel.segments.gray") };
            return { label: t("wheel.segments.jackpot"), colorName: t("wheel.segments.gold") };
        }

        function getFortuneWheelSegmentByDegree(degree) {
            return FORTUNE_WHEEL_SEGMENTS.find((segment) => degree >= segment.minDegree && degree < segment.maxDegree) || FORTUNE_WHEEL_SEGMENTS[FORTUNE_WHEEL_SEGMENTS.length - 1];
        }

        function renderFortuneWheelResult(result, segment) {
            const panel = document.getElementById("roulette-result-panel");
            const title = document.getElementById("roulette-result-title");
            const copy = document.getElementById("roulette-result-copy");
            const badge = document.getElementById("roulette-result-badge");
            const lane = document.getElementById("roulette-result-lane");
            if (!panel || !title || !copy || !badge || !lane) return;
            const localizedSegment = getWheelSegmentPresentation(segment);

            panel.classList.remove("hidden");
            panel.classList.remove("is-pending");
            panel.classList.add("is-revealing");
            title.innerText = result.title;
            copy.innerText = result.text;
            badge.innerHTML = `<span class="roulette-color-dot" style="background:${segment.color};"></span>${result.badge}`;
            lane.innerText = t("wheel.lane", { color: localizedSegment.colorName, item: localizedSegment.label });
            badge.className = "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide";
            if (result.tone === "warning") {
                badge.classList.add("bg-slate-700", "text-slate-200");
            } else {
                badge.classList.add("bg-emerald-500/15", "text-emerald-300", "border", "border-emerald-500/30");
            }

            setTimeout(() => {
                panel.classList.remove("is-revealing");
            }, 900);
        }

        // Roleta da Fortuna Funcional
        function spinFortuneWheel() {
            if (Date.now() - gameState.lastWheelSpinTime < 15000) { // Trava de teste (15 segundos entre spins no MVP)
                showFeedback(t("wheel.coolingDown"), "warning");
                return;
            }

            const wheel = document.getElementById("roulette-wheel");
            const btn = document.getElementById("btn-spin");
            const panel = document.getElementById("roulette-result-panel");
            
            btn.disabled = true;
            btn.classList.add("opacity-50", "cursor-not-allowed");
            if (panel) {
                const title = document.getElementById("roulette-result-title");
                const copy = document.getElementById("roulette-result-copy");
                const badge = document.getElementById("roulette-result-badge");
                const lane = document.getElementById("roulette-result-lane");

                panel.classList.remove("hidden");
                panel.classList.add("is-pending");
                panel.classList.remove("is-revealing");
                if (title) title.innerText = t("wheel.revealing");
                if (copy) copy.innerText = t("wheel.hiddenPrize");
                if (badge) {
                    badge.innerText = t("wheel.spinning");
                    badge.className = "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-slate-700 text-slate-200";
                }
                if (lane) lane.innerText = t("wheel.pendingLane");
            }

            // Roda aleatório de graus
            const randomRotation = Math.floor(Math.random() * 1080) + 720; // Entre 2 e 5 voltas
            wheel.style.transform = `rotate(${randomRotation}deg)`;

            // Efeito sonoro rítmico simulando parada
            let soundTick = setInterval(() => playSoundSpin(), 150);
            setTimeout(() => clearInterval(soundTick), 3000);

            // Calcula resultado com base na rotação final (graus % 360)
            setTimeout(() => {
                const finalDegree = randomRotation % 360;
                const segment = getFortuneWheelSegmentByDegree(finalDegree);
                const rewardResult = segment.applyReward();
                renderFortuneWheelResult(rewardResult, segment);
                incrementMissionProgress("m2", 1);

                gameState.lastWheelSpinTime = Date.now();
                gameState.statistics.totalSpins += 1;

                playSoundCoin();
                showFeedback(t("wheel.feedback", { text: rewardResult.text }), rewardResult.tone === "warning" ? "warning" : "success");
                
                btn.disabled = false;
                btn.classList.remove("opacity-50", "cursor-not-allowed");

                saveGameData();
                renderInventario();
                renderMissions();
                renderMines();
            }, 4000);
        }
