        // Renderizador e compras da Loja
        function switchShopSubTab(sub) {
            document.getElementById("btn-sub-gnomos").className = sub === 'gnomos' ? 'bg-slate-800 text-amber-400 font-bold py-2 rounded-xl text-xs md:text-sm shadow transition' : 'text-slate-400 hover:text-slate-200 font-bold py-2 rounded-xl text-xs md:text-sm transition';
            document.getElementById("btn-sub-equipamentos").className = sub === 'equipamentos' ? 'bg-slate-800 text-amber-400 font-bold py-2 rounded-xl text-xs md:text-sm shadow transition' : 'text-slate-400 hover:text-slate-200 font-bold py-2 rounded-xl text-xs md:text-sm transition';
            document.getElementById("btn-sub-energia").className = sub === 'energia' ? 'bg-slate-800 text-amber-400 font-bold py-2 rounded-xl text-xs md:text-sm shadow transition' : 'text-slate-400 hover:text-slate-200 font-bold py-2 rounded-xl text-xs md:text-sm transition';

            document.getElementById("shop-gnomos").classList.add("hidden");
            document.getElementById("shop-equipamentos").classList.add("hidden");
            document.getElementById("shop-energia").classList.add("hidden");

            if (sub === 'gnomos') document.getElementById("shop-gnomos").classList.remove("hidden");
            if (sub === 'equipamentos') document.getElementById("shop-equipamentos").classList.remove("hidden");
            if (sub === 'energia') document.getElementById("shop-energia").classList.remove("hidden");
        }

        // NOVO REQUISITO: ABRE MODAL DETALHADO DO GNOMO
        let currentGnomeDetailKey = null;
        let currentShowcaseKey = null;
        let showcaseInteractionBound = false;
        let showcaseCelebrationTimeout = null;
        let showcaseRealtimeSyncInterval = null;
        let lastShowcaseSceneSignature = null;
        const latestMineResourceContext = {};
        let detailReturnFocusEl = null;
        let showcaseReturnFocusEl = null;
        let showcaseReturnToDetail = false;
        let modalKeyboardBound = false;
        let lastModalEscapeAt = 0;
        let modalScrollLockY = 0;
        const SHOWCASE_PANELS = ["animation", "state", "scene", "emotion", "mission", "audio", "supervisor"];

        function getRuntimeShowcaseHook(name) {
            if (typeof globalThis !== "undefined" && typeof globalThis[name] === "function") {
                return globalThis[name];
            }
            if (typeof window !== "undefined" && typeof window[name] === "function") {
                return window[name];
            }
            return null;
        }

        function getGnomeAnimationClass(key) {
            if (key === "gnorin") return "gnome-anim-gnorin";
            if (key === "bortok") return "gnome-anim-bortok";
            if (key === "zeldrik") return "gnome-anim-zeldrik";
            if (key === "faggro") return "gnome-anim-faggro";
            if (key === "nyra") return "gnome-anim-nyra";
            return "gnome-anim-gnorin";
        }

        function applyGnomeAnimation(containerEl, key) {
            if (!containerEl) return;
            const svg = containerEl.querySelector("svg");
            if (!svg) return;

            svg.classList.add("gnome-anim-base");
            svg.classList.remove(
                "gnome-anim-gnorin",
                "gnome-anim-bortok",
                "gnome-anim-zeldrik",
                "gnome-anim-faggro",
                "gnome-anim-nyra"
            );
            svg.classList.add(getGnomeAnimationClass(key));
        }

        function getGnomeShowcaseThemeClass(key) {
            return `showcase-theme-${key}`;
        }

        function getGnomeCameraClass(key) {
            const rarity = GNOME_DATABASE[key]?.rarity;
            if (rarity === "Lendário") return "showcase-camera-legendary";
            if (rarity === "Especial") return "showcase-camera-special";
            return "showcase-camera-common";
        }

        function getPlayerRankTheme() {
            let rank = gameState.player.rank || "Gno1";
            if (gameState.player.level >= 10) rank = "Gno5";
            else if (gameState.player.level >= 8) rank = "Gno4";
            else if (gameState.player.level >= 5) rank = "Gno3";
            else if (gameState.player.level >= 3) rank = "Gno2";
            else rank = "Gno1";
            const normalizedRank = rank.toLowerCase();
            if (["gno5", "gno4", "gno3", "gno2", "gno1"].includes(normalizedRank)) return `showcase-rank-${normalizedRank}`;
            return "showcase-rank-gno1";
        }

        function getOpenModalShell() {
            if (!document.getElementById("modal-levelup-cutscene")?.classList.contains("hidden")) return document.getElementById("levelup-cutscene-shell");
            if (!document.getElementById("modal-mine-cutscene")?.classList.contains("hidden")) return document.getElementById("mine-cutscene-shell");
            if (!document.getElementById("modal-gnome-showcase")?.classList.contains("hidden")) return document.getElementById("gnome-showcase-shell");
            if (!document.getElementById("modal-gnome-detail")?.classList.contains("hidden")) return document.getElementById("gnome-detail-shell");
            return null;
        }

        function syncModalScrollLock() {
            const hasOpenModal = Boolean(getOpenModalShell());
            const body = document.body;
            const root = document.documentElement;
            if (!body || !root) return;

            if (hasOpenModal) {
                if (!body.classList.contains("modal-open")) {
                    modalScrollLockY = window.scrollY || window.pageYOffset || 0;
                    body.style.position = "fixed";
                    body.style.top = `-${modalScrollLockY}px`;
                    body.style.left = "0";
                    body.style.right = "0";
                    body.style.width = "100%";
                }
                body.classList.add("modal-open");
                root.classList.add("modal-open");
                return;
            }

            body.classList.remove("modal-open");
            root.classList.remove("modal-open");
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            window.scrollTo(0, modalScrollLockY);
            modalScrollLockY = 0;
        }

        function showModal(modalId, displayMode = "flex") {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            modal.classList.remove("hidden");
            modal.style.display = displayMode;
            modal.setAttribute("aria-hidden", "false");
            syncModalScrollLock();
        }

        function hideModal(modalId, options = {}) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            modal.classList.add("hidden");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
            if (!options.skipScrollSync) syncModalScrollLock();
        }

        function getFocusableElements(container) {
            if (!container) return [];
            return [...container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
                .filter((el) => !el.disabled && !el.getAttribute("aria-hidden") && !el.hasAttribute("hidden") && el.getClientRects().length > 0);
        }

        function focusModalShell(shell, preferredSelector) {
            if (!shell) return;
            const preferred = preferredSelector ? shell.querySelector(preferredSelector) : null;
            const focusable = getFocusableElements(shell);
            const target = preferred || focusable[0] || shell;
            if (target && typeof target.focus === "function") {
                requestAnimationFrame(() => {
                    try {
                        target.focus({ preventScroll: true });
                    } catch (e) {
                        target.focus();
                    }
                });
            }
        }

        function trapFocusWithinModal(event, shell) {
            if (event.key !== "Tab" || !shell) return;
            const focusable = getFocusableElements(shell);
            event.preventDefault();
            event.stopPropagation();
            if (!focusable.length) {
                shell.focus();
                return;
            }

            const activeIndex = focusable.indexOf(document.activeElement);
            const direction = event.shiftKey ? -1 : 1;
            const fallbackIndex = event.shiftKey ? focusable.length - 1 : 0;
            const nextIndex = activeIndex === -1
                ? fallbackIndex
                : (activeIndex + direction + focusable.length) % focusable.length;
            focusable[nextIndex].focus();
        }

        function initModalKeyboardSupport() {
            if (modalKeyboardBound) return;
            window.addEventListener("keydown", (event) => {
                const activeShell = getOpenModalShell();
                if (!activeShell) return;

                if (event.key === "Escape") {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.repeat) return;
                    const now = Date.now();
                    if (now - lastModalEscapeAt < 180) return;
                    lastModalEscapeAt = now;
                    if (!document.getElementById("modal-levelup-cutscene")?.classList.contains("hidden")) {
                        if (typeof closeLevelUpCutscene === "function") closeLevelUpCutscene();
                        return;
                    }
                    if (!document.getElementById("modal-mine-cutscene")?.classList.contains("hidden")) {
                        if (typeof closeMineCutscene === "function") closeMineCutscene();
                        return;
                    }
                    if (!document.getElementById("modal-gnome-showcase")?.classList.contains("hidden")) {
                        closeGnomeShowcase();
                        return;
                    }
                    if (!document.getElementById("modal-gnome-detail")?.classList.contains("hidden")) {
                        closeGnomeDetailModal();
                    }
                    return;
                }

                trapFocusWithinModal(event, activeShell);
            });
            modalKeyboardBound = true;
        }

        function setShowcasePanelExpanded(panel, expanded) {
            const panelEl = document.getElementById(`showcase-panel-${panel}`);
            const toggleEl = document.getElementById(`showcase-toggle-${panel}`);
            if (!panelEl || !toggleEl) return;
            panelEl.classList.toggle("hidden", !expanded);
            toggleEl.classList.toggle("is-open", expanded);
            toggleEl.setAttribute("aria-expanded", expanded ? "true" : "false");
        }

        function collapseShowcasePanels(exceptPanel = null) {
            SHOWCASE_PANELS.forEach((panel) => {
                setShowcasePanelExpanded(panel, panel === exceptPanel);
            });
        }

        function toggleShowcaseInfoPanel(panel) {
            const toggleEl = document.getElementById(`showcase-toggle-${panel}`);
            if (!toggleEl) return;
            const willOpen = toggleEl.getAttribute("aria-expanded") !== "true";
            collapseShowcasePanels(willOpen ? panel : null);
        }

        function getEmotionFlavorForGnome(key, emotionKind) {
            const flavorMap = {
                gnorin: {
                    focused: "Gnorin baixa os ombros e firma o ritmo como um veterano blindando a operação com calma.",
                    triumphant: "Gnorin celebra sem perder o controle, como quem confirma que a disciplina venceu mais um turno.",
                    alert: "Gnorin endurece a expressão e assume o comando tático para conter o colapso.",
                    inspired: "Gnorin reencontra o brilho de um mestre minerador diante de um minério raro."
                },
                bortok: {
                    focused: "Bortok reprime a explosão por alguns segundos e canaliza a força para o ponto certo da rocha.",
                    triumphant: "Bortok praticamente ruge para a equipe, exibindo confiança bruta no auge da coleta.",
                    alert: "Bortok entra em modo de impacto, pronto para abrir passagem em meio ao caos.",
                    inspired: "Bortok sente o cheiro do prêmio raro e transforma isso em presença colossal."
                },
                zeldrik: {
                    focused: "Zeldrik recalibra tudo mentalmente, mantendo a postura de engenheiro preciso.",
                    triumphant: "Zeldrik reage com satisfação técnica, como se cada engrenagem estivesse finalmente no ponto ideal.",
                    alert: "Zeldrik varre a cena em busca da falha exata, com resposta imediata e calculada.",
                    inspired: "Zeldrik encara a raridade como um enigma precioso digno de sua engenharia."
                },
                faggro: {
                    focused: "Faggro escuta a mina em silêncio, deixando a sorte trabalhar junto do instinto.",
                    triumphant: "Faggro sorri como quem já sabia que a sorte estava do lado dele.",
                    alert: "Faggro perde a leveza por um instante e fixa o olhar no risco da operação.",
                    inspired: "Faggro sente o recurso raro vibrar como um amuleto chamando seu nome."
                },
                nyra: {
                    focused: "Nyra mantém o grupo sob controle, conduzindo a equipe com carisma e precisão.",
                    triumphant: "Nyra transforma a vitória em espetáculo, puxando toda a cena para sua liderança.",
                    alert: "Nyra assume o posto central e protege a moral da equipe em meio à crise.",
                    inspired: "Nyra reage ao brilho raro como uma comandante vendo o clã tocar seu auge."
                }
            };

            return flavorMap[key]?.[emotionKind] || flavorMap.gnorin[emotionKind];
        }

        function getSupervisorShowcaseState() {
            const xpNeeded = gameState.player.level * GAME_CONFIG.xpPerLevelFactor;
            const xpPercent = Math.max(0, Math.min(100, Math.round((gameState.player.xp / xpNeeded) * 100)));
            return {
                level: gameState.player.level,
                xpPercent,
                boosted: gameState.player.level >= 4 || xpPercent >= 75,
                copy: xpPercent >= 75
                    ? `O supervisor está com ${xpPercent}% da barra de experiência preenchida. O clã entra em um momento forte de progressão para o próximo level up.`
                    : `Nível ${gameState.player.level} com ${xpPercent}% da barra atual. O showcase mantém o foco no gnomo enquanto o clã evolui.`
            };
        }

        function getActiveMissionContext() {
            const mission = gameState.missions.find((m) => !m.completed);
            if (!mission) {
                return {
                    kind: "complete",
                    badge: "Quadro Limpo",
                    copy: "As missões atuais já foram concluídas. O gnomo opera sem pressão imediata, mas pronto para o próximo objetivo do clã."
                };
            }

            const percent = Math.max(0, Math.min(100, Math.round((mission.progress / mission.target) * 100)));
            return {
                kind: percent >= 70 ? "progress" : "neutral",
                badge: `${percent}% | ${mission.text}`,
                copy: percent >= 70
                    ? `A missão "${mission.text}" está em reta final. O gnomo sente a pressão positiva de concluir esse objetivo com máxima eficiência.`
                    : `Missão atual: "${mission.text}". O showcase mantém o foco narrativo alinhado ao objetivo do clã enquanto o progresso avança.`
            };
        }

        function getResourceRarity(resourceName) {
            const legendary = ["Adamantium", "Vibranium"];
            const special = ["Prata", "Ouro", "Platina", "Titânio", "Diamante"];
            if (legendary.includes(resourceName)) return "legendary";
            if (special.includes(resourceName)) return "special";
            return "common";
        }

        function getShowcaseResourceContext(key) {
            const assigned = getGnomeAssignedInstance(key);
            if (!assigned) return null;
            const mine = gameState.mines.find((m) => m.id === assigned.allocatedTo);
            return latestMineResourceContext[assigned.allocatedTo] || (mine ? {
                name: mine.resources[0],
                rarity: getResourceRarity(mine.resources[0]),
                collectibleName: mine.collectibleName
            } : null);
        }

        function getShowcaseEmotionState(key) {
            const scene = getShowcaseSceneState(key);
            const mission = getActiveMissionContext();
            const resource = getShowcaseResourceContext(key);

            if (scene.kind === "broken") {
                return {
                    kind: "alert",
                    badge: "Alerta Total",
                    copy: getEmotionFlavorForGnome(key, "alert")
                };
            }

            if (scene.kind === "ready" || mission.kind === "progress") {
                return {
                    kind: "triumphant",
                    badge: "Vitória Imediata",
                    copy: getEmotionFlavorForGnome(key, "triumphant")
                };
            }

            if (resource?.rarity === "legendary" || gameState.player.level >= 5) {
                return {
                    kind: "inspired",
                    badge: "Êxtase Raro",
                    copy: getEmotionFlavorForGnome(key, "inspired")
                };
            }

            return {
                kind: "focused",
                badge: "Foco de Mina",
                copy: getEmotionFlavorForGnome(key, "focused")
            };
        }

        function getGnomeShowcaseCopy(key) {
            if (key === "nyra") {
                return {
                    animation: "Nyra lidera a apresentação com passos ritmados, tranças em movimento, olhos piscando e um sorriso que reage como uma comandante celebrando a equipe.",
                    interaction: "O foco permanece no carisma da Nyra, sem distrações no restante da cena."
                };
            }
            if (key === "bortok") {
                return {
                    animation: "Bortok explode energia bruta: sobrancelhas fecham, barba vibra e o capacete golpeia o ar como um martelo entrando na mina.",
                    interaction: "A presença de Bortok fica concentrada no personagem, reforçando impacto e agressividade sem efeitos extras ao redor."
                };
            }
            if (key === "faggro") {
                return {
                    animation: "Faggro flutua como quem sente a sorte no ar: capuz balança, barba sobe leve e o brinco responde como um amuleto precioso.",
                    interaction: "Faggro mantém sua presença rara e controlada, com a atenção visual concentrada apenas no personagem."
                };
            }
            if (key === "zeldrik") {
                return {
                    animation: "Zeldrik mantém o ritmo técnico: óculos cintilam, a postura ajusta a cadência e tudo parece milimetricamente calculado.",
                    interaction: "Zeldrik mantém uma leitura técnica e precisa, com o cenário fixo para valorizar sua postura."
                };
            }
            return {
                animation: "Gnorin transmite estabilidade e foco, com um movimento respirado e seguro como um veterano acostumado ao trabalho profundo.",
                interaction: "A presença do gnomo segue em destaque, com uma cena estática e sem ruído visual extra."
            };
        }

        function getGnomeContractState(key) {
            const contracted = gameState.contractedGnomes.filter(g => g.type === key);
            if (!contracted.length) {
                return {
                    kind: "store",
                    label: "Disponível na Loja",
                    copy: "Este gnomo ainda nao foi contratado. O showcase exibe o potencial completo dele antes da assinatura do contrato."
                };
            }

            const assigned = contracted.find(g => g.allocatedTo);
            if (assigned) {
                const mineName = gameState.mines.find(m => m.id === assigned.allocatedTo)?.name || "Mina ativa";
                return {
                    kind: "assigned",
                    label: `Ativo em ${mineName}`,
                    copy: `Estado atual: contratado e alocado em ${mineName}. O showcase destaca um gnomo ja em operacao no clã, sem elementos extras competindo por atenção.`
                };
            }

            return {
                kind: "contracted",
                label: "Contratado no Clã",
                copy: "Estado atual: contratado e aguardando alocacao. O gnomo ja faz parte do clã e esta pronto para entrar em operacao."
            };
        }

        function getGnomeAssignedInstance(key) {
            return gameState.contractedGnomes.find(g => g.type === key && g.allocatedTo) || null;
        }

        function getMineCinematicProfile(mine) {
            if (!mine) {
                return {
                    badge: "Modo Base",
                    copy: "Apresentação limpa focada no gnomo, sem vínculo ativo com uma mina específica.",
                    className: "mine-cinematic-base",
                    mineId: "base"
                };
            }

            const profileMap = {
                mine_1: {
                    badge: "Mina Iniciante | Ferro e disciplina",
                    copy: "Ambiente de rocha estável e leitura simples, adequado aos primeiros ciclos do clã."
                },
                mine_2: {
                    badge: "Mina Intermediária | Liga quente",
                    copy: "Ambiente mais industrial, com leitura quente e operação mais intensa nas camadas médias."
                },
                mine_3: {
                    badge: "Mina Avançada | Ouro vivo",
                    copy: "Leitura mais luminosa, reforçando riqueza crescente e pressão constante por rendimento elevado."
                },
                mine_4: {
                    badge: "Mina Épica | Cristais frios",
                    copy: "Tom épico com acentos azulados que reforçam a sensação de tecnologia mineral rara."
                },
                mine_5: {
                    badge: "Mina Lendária | Núcleo mítico",
                    copy: "Camada mais rara do clã, com atmosfera energética e profundidade mística de alto valor."
                }
            };

            const base = profileMap[mine.id] || profileMap.mine_1;
            return {
                badge: base.badge,
                copy: base.copy,
                className: `mine-cinematic-${mine.id}`,
                mineId: mine.id
            };
        }

        function getShowcaseSceneState(key) {
            const assigned = getGnomeAssignedInstance(key);
            if (!assigned) {
                const hasContract = gameState.contractedGnomes.some(g => g.type === key);
                if (hasContract) {
                    return {
                        kind: "ready",
                        badge: "Contrato Ativo",
                        title: "Gnomo pronto para alocação",
                        copy: "O contrato ja esta ativo. O gnomo permanece em prontidão, aguardando ser designado para a próxima mina do clã.",
                        audio: "A trilha sobe com um tom de expectativa, como um chamado operacional antes da entrada em campo."
                    };
                }

                return {
                    kind: "store",
                    badge: "Loja",
                    title: "Apresentação do clã",
                    copy: "O gnomo exibe sua identidade visual em um showcase limpo, com destaque total para contratação.",
                    audio: "A assinatura sonora toca como um teaser curto, apresentando a personalidade do gnomo ao jogador."
                };
            }

            const mine = gameState.mines.find(m => m.id === assigned.allocatedTo);
            const progressPercent = mine && mineTimers[mine.id]
                ? Math.round((mineTimers[mine.id].current / GAME_CONFIG.cycleTimeSeconds) * 100)
                : 0;
            const cinematic = getMineCinematicProfile(mine);

            if (mine?.broken) {
                return {
                    kind: "broken",
                    badge: "Alerta de Ruptura",
                    title: `${mine.name} sob manutenção crítica`,
                    copy: `${assigned.type === key ? "Este gnomo" : "O gnomo"} foi pego em uma ruptura na ${mine.name}. O showcase passa a mostrar um estado de alerta até o reparo.`,
                    audio: "A trilha recebe um reforço grave e curto de emergência para sinalizar a mina quebrada.",
                    mine,
                    progressPercent,
                    cinematic
                };
            }

            if (gameState.player.energy <= 20) {
                return {
                    kind: "low-energy",
                    badge: "Energia Baixa",
                    title: `${mine?.name || "Mina ativa"} operando no limite`,
                    copy: `A energia global do clã está em ${gameState.player.energy}%. O gnomo continua na ${mine?.name || "mina ativa"}, mas o estado atual transmite exaustão e operação contida.`,
                    audio: "A assinatura sonora ganha uma queda suave de energia, indicando que a operação precisa de recarga.",
                    mine,
                    progressPercent,
                    cinematic
                };
            }

            if (progressPercent >= 100) {
                return {
                    kind: "ready",
                    badge: "Coleta Pronta",
                    title: `${mine?.name || "Mina ativa"} pronta para colher`,
                    copy: `O ciclo de trabalho foi concluído e a coleta está pronta em ${mine?.name || "uma mina ativa"}. O gnomo assume uma expressão de sucesso para reforçar a recompensa iminente.`,
                    audio: "A trilha recebe um acento de conquista curto, lembrando um momento de coleta bem-sucedida.",
                    mine,
                    progressPercent,
                    cinematic
                };
            }

            return {
                kind: "mining",
                badge: mine?.name || "Em Campo",
                title: `${mine?.name || "Mina ativa"} em extração contínua`,
                copy: `O gnomo está trabalhando em ${mine?.name || "uma mina ativa"} com ${progressPercent}% do ciclo concluído. O showcase mantém esse contexto de forma limpa e direta.`,
                audio: "A paisagem sonora mistura o tema do gnomo com um acento de operação ativa, reforçando o estado de trabalho.",
                mine,
                progressPercent,
                cinematic
            };
        }

        function applyShowcaseTheme(key) {
            const shell = document.getElementById("gnome-showcase-shell");
            if (!shell) return;

            shell.classList.remove(
                "showcase-theme-gnorin",
                "showcase-theme-bortok",
                "showcase-theme-zeldrik",
                "showcase-theme-faggro",
                "showcase-theme-nyra",
                "showcase-celebration",
                "gnome-showcase-cinematic"
            );
            shell.classList.add(getGnomeShowcaseThemeClass(key));
            updateShowcaseCameraState(key);
        }

        function updateShowcaseCameraState(key) {
            const shell = document.getElementById("gnome-showcase-shell");
            if (!shell) return;

            shell.classList.remove(
                "showcase-camera-common",
                "showcase-camera-special",
                "showcase-camera-legendary",
                "showcase-level-boost",
                "showcase-emotion-focused",
                "showcase-emotion-triumphant",
                "showcase-emotion-alert",
                "showcase-emotion-inspired",
                "showcase-rank-gno1",
                "showcase-rank-gno2",
                "showcase-rank-gno3",
                "showcase-rank-gno4",
                "showcase-rank-gno5",
                "showcase-mission-aura-neutral",
                "showcase-mission-aura-progress",
                "showcase-mission-aura-complete"
            );
            shell.classList.add(getPlayerRankTheme());
        }

        function syncDuplicateShowcaseContent(primaryId, duplicateId) {
            const primary = document.getElementById(primaryId);
            const duplicate = document.getElementById(duplicateId);
            if (!primary || !duplicate) return;
            duplicate.innerText = primary.innerText;
            duplicate.className = primary.className;
        }

        function applyShowcaseState(key) {
            const g = GNOME_DATABASE[key];
            const status = document.getElementById("gnome-showcase-status");
            const stateCopy = document.getElementById("gnome-showcase-state-copy");
            const animationCopy = document.getElementById("gnome-showcase-animation-copy");
            const interactionCopy = document.getElementById("gnome-showcase-interaction-copy");
            const network = document.getElementById("gnome-showcase-network");
            const sceneBadge = document.getElementById("gnome-showcase-scene-badge");
            const sceneTitle = document.getElementById("gnome-showcase-scene-title");
            const sceneCopy = document.getElementById("gnome-showcase-scene-copy");
            const audioBadge = document.getElementById("gnome-showcase-audio-badge");
            const audioCopy = document.getElementById("gnome-showcase-audio-copy");
            const mineBadge = document.getElementById("gnome-showcase-mine-badge");
            const supervisorBadge = document.getElementById("gnome-showcase-supervisor-badge");
            const supervisorCopy = document.getElementById("gnome-showcase-supervisor-copy");
            const emotionBadge = document.getElementById("gnome-showcase-emotion-badge");
            const emotionCopy = document.getElementById("gnome-showcase-emotion-copy");
            const missionBadge = document.getElementById("gnome-showcase-mission-badge");
            const missionCopy = document.getElementById("gnome-showcase-mission-copy");
            const heroCopy = document.getElementById("gnome-showcase-hero-copy");

            const state = getGnomeContractState(key);
            const copy = getGnomeShowcaseCopy(key);
            const scene = getShowcaseSceneState(key);
            const supervisor = getSupervisorShowcaseState();
            const emotion = getShowcaseEmotionState(key);
            const mission = getActiveMissionContext();
            const resourceContext = getShowcaseResourceContext(key);

            status.innerText = state.label;
            status.className = "text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border";
            if (state.kind === "store") status.classList.add("showcase-status-store");
            if (state.kind === "contracted") status.classList.add("showcase-status-contracted");
            if (state.kind === "assigned") status.classList.add("showcase-status-assigned");

            stateCopy.innerText = state.copy;
            animationCopy.innerText = copy.animation;
            interactionCopy.innerText = copy.interaction;
            network.innerText = state.kind === "assigned" ? "Performance em Campo" : state.kind === "contracted" ? "Contrato Ativo" : "Preview Premium";

            sceneBadge.innerText = scene.badge;
            sceneBadge.className = "text-[10px] uppercase font-black px-2 py-1 rounded-lg border";
            sceneBadge.classList.add(`showcase-scene-${scene.kind}`);
            sceneTitle.innerText = scene.title;
            sceneCopy.innerText = scene.cinematic?.copy ? `${scene.copy} ${scene.cinematic.copy}` : scene.copy;
            mineBadge.innerText = scene.cinematic?.badge || "Modo Base";
            heroCopy.innerText = `${g?.name || "Gnomo"} em destaque. ${scene.title}. Abra "!" apenas quando quiser mais contexto.`;

            audioBadge.innerText = audioMuted ? "Mudo" : "Ativa";
            audioBadge.className = `text-[10px] uppercase font-black px-2 py-1 rounded-lg border border-slate-700 ${audioMuted ? "bg-red-950/40 text-red-300" : "bg-slate-950/70 text-slate-300"}`;
            audioCopy.innerText = audioMuted
                ? "Os sons do jogo estão desativados. Ative o áudio para ouvir a assinatura sonora contextual deste gnomo."
                : resourceContext
                    ? `${scene.audio} O último recurso extraído aqui foi ${resourceContext.name}, classificado como ${resourceContext.rarity === "legendary" ? "lendário" : resourceContext.rarity === "special" ? "especial" : "comum"}, com ressonância temática de ${resourceContext.collectibleName || "fragmento local"}.`
                    : scene.audio;

            supervisorBadge.innerText = `Nível ${supervisor.level} | XP ${supervisor.xpPercent}%`;
            supervisorCopy.innerText = supervisor.copy;
            emotionBadge.innerText = emotion.badge;
            emotionBadge.className = "text-[10px] uppercase font-black px-2 py-1 rounded-lg border";
            emotionBadge.classList.add(`showcase-emotion-${emotion.kind}-badge`);
            emotionCopy.innerText = emotion.copy;
            missionBadge.innerText = mission.badge;
            missionBadge.className = "text-[10px] uppercase font-black px-2 py-1 rounded-lg border";
            missionBadge.classList.add(`showcase-mission-${mission.kind}`);
            missionCopy.innerText = mission.copy;
            syncDuplicateShowcaseContent("gnome-showcase-emotion-badge", "gnome-showcase-emotion-badge-desktop");
        }

        function renderShowcaseBackdrop(key) {
            const backdrop = document.getElementById("gnome-showcase-backdrop");
            if (!backdrop) return;
            backdrop.className = "absolute inset-0";
            backdrop.innerHTML = "";
        }

        function getParticleClassByRarity(rarity) {
            if (rarity === "Lendário") return "particle-legendary";
            if (rarity === "Especial") return "particle-special";
            return "particle-common";
        }

        function renderShowcaseParticles(key) {
            const particlesContainer = document.getElementById("gnome-showcase-rarity-particles");
            if (!particlesContainer) return;
            particlesContainer.innerHTML = "";
        }

        function getShowcaseSceneSignature(key) {
            const scene = getShowcaseSceneState(key);
            const mission = getActiveMissionContext();
            const resource = getShowcaseResourceContext(key);
            return `${scene.kind}:${scene.mine?.id || "base"}:${scene.progressPercent || 0}:${gameState.player.energy}:${gameState.player.level}:${gameState.player.xp}:${mission.badge}:${resource?.name || "none"}:${resource?.rarity || "none"}`;
        }

        function animateShowcaseSceneTransition() {
            return;
        }

        function startShowcaseRealtimeSync() {
            if (showcaseRealtimeSyncInterval) clearInterval(showcaseRealtimeSyncInterval);
            if (!currentShowcaseKey) return;
            lastShowcaseSceneSignature = getShowcaseSceneSignature(currentShowcaseKey);
            showcaseRealtimeSyncInterval = setInterval(() => {
                syncOpenShowcaseWithGame("tick");
            }, 1000);
        }

        function stopShowcaseRealtimeSync() {
            if (showcaseRealtimeSyncInterval) {
                clearInterval(showcaseRealtimeSyncInterval);
                showcaseRealtimeSyncInterval = null;
            }
        }

        function syncOpenShowcaseWithGame(trigger = "passive") {
            const modal = document.getElementById("modal-gnome-showcase");
            if (!modal || modal.classList.contains("hidden") || !currentShowcaseKey) return;

            const nextSignature = getShowcaseSceneSignature(currentShowcaseKey);
            if (trigger !== "force" && nextSignature === lastShowcaseSceneSignature) return;

            applyShowcaseState(currentShowcaseKey);
            updateShowcaseCameraState(currentShowcaseKey);
            renderShowcaseBackdrop(currentShowcaseKey);
            renderShowcaseParticles(currentShowcaseKey);

            const stopAmbientHook = getRuntimeShowcaseHook("stopAmbientSoundtrack");
            if (stopAmbientHook) {
                stopAmbientHook();
            }
            lastShowcaseSceneSignature = nextSignature;
        }

        function triggerShowcaseMineEvent(type, payload = {}) {
            const modal = document.getElementById("modal-gnome-showcase");
            if (!modal || modal.classList.contains("hidden") || !currentShowcaseKey) return;

            const scene = getShowcaseSceneState(currentShowcaseKey);
            const currentMineId = scene.mine?.id;

            if (type === "collect" && payload.mineId && payload.resource) {
                latestMineResourceContext[payload.mineId] = {
                    name: payload.resource,
                    rarity: getResourceRarity(payload.resource),
                    collectibleName: payload.collectibleName || null
                };
            }

            if (payload.mineId && currentMineId && payload.mineId !== currentMineId) return;

            syncOpenShowcaseWithGame("force");
        }

        function initShowcaseInteractions() {
            if (showcaseInteractionBound) return;
            showcaseInteractionBound = true;
        }

        function triggerShowcaseCelebration() {
            const shell = document.getElementById("gnome-showcase-shell");
            if (!shell) return;
            shell.classList.add("showcase-celebration");
            if (showcaseCelebrationTimeout) clearTimeout(showcaseCelebrationTimeout);
            showcaseCelebrationTimeout = setTimeout(() => {
                shell.classList.remove("showcase-celebration");
            }, 900);
        }

        function getShowcaseSvgMarkup(key) {
            if (key === "nyra") {
                return `
                    <svg class="w-full h-full p-4" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#475569" />
                        <path class="nyra-heart-left" d="M22 24 C22 20 28 20 28 24 C28 20 34 20 34 24 C34 28 28 32 28 32 C28 32 22 28 22 24 Z" fill="#fb7185" />
                        <path class="nyra-heart-right" d="M66 18 C66 14 72 14 72 18 C72 14 78 14 78 18 C78 22 72 26 72 26 C72 26 66 22 66 18 Z" fill="#f472b6" />
                        <path class="nyra-sparkle-a" d="M17 40 L19 45 L24 47 L19 49 L17 54 L15 49 L10 47 L15 45 Z" fill="#fde68a" />
                        <path class="nyra-sparkle-b" d="M80 33 L81.5 37 L86 38.5 L81.5 40 L80 44 L78.5 40 L74 38.5 L78.5 37 Z" fill="#f9a8d4" />
                        <path class="nyra-sparkle-c" d="M71 64 L72.5 67.5 L76 69 L72.5 70.5 L71 74 L69.5 70.5 L66 69 L69.5 67.5 Z" fill="#fef08a" />
                        <path class="nyra-magic-ring" d="M18 62 C28 57 39 55 50 55 C61 55 72 57 82 62" stroke="#f9a8d4" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.45" />
                        <path class="nyra-magic-dust-a" d="M24 28 L26 32.5 L30.5 34 L26 35.5 L24 40 L22 35.5 L17.5 34 L22 32.5 Z" fill="#fde68a" />
                        <path class="nyra-magic-dust-b" d="M75 58 L76.4 61.2 L79.6 62.5 L76.4 63.8 L75 67 L73.6 63.8 L70.4 62.5 L73.6 61.2 Z" fill="#f9a8d4" />
                        <path class="nyra-dance-hat" d="M50 15 L25 45 L75 45 Z" fill="#db2777" />
                        <path class="nyra-hat-gem" d="M50 20 L54 25 L50 30 L46 25 Z" fill="#fde68a" stroke="#fbbf24" stroke-width="1.3" />
                        <circle class="nyra-hat-gem-core" cx="50" cy="25" r="1.6" fill="#fff7ed" />
                        <path d="M33 43 C30 47 29 52 30 58" stroke="#f9a8d4" stroke-width="3.6" stroke-linecap="round" fill="none" />
                        <path d="M67 43 C70 47 71 52 70 58" stroke="#f9a8d4" stroke-width="3.6" stroke-linecap="round" fill="none" />
                        <path class="nyra-dance-braid-left" d="M27 45 C22 53 22 61 24 69 C25 74 25 79 23 84" stroke="#f472b6" stroke-width="6.2" stroke-linecap="round" fill="none" />
                        <path class="nyra-dance-braid-right" d="M73 45 C78 53 78 61 76 69 C75 74 75 79 77 84" stroke="#f472b6" stroke-width="6.2" stroke-linecap="round" fill="none" />
                        <path d="M26 52 L22 58" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <path d="M26 61 L22 67" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <path d="M26 70 L22 76" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <path d="M74 52 L78 58" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <path d="M74 61 L78 67" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <path d="M74 70 L78 76" stroke="#f9a8d4" stroke-width="3.5" stroke-linecap="round" />
                        <ellipse cx="23" cy="78" rx="2.3" ry="3.3" fill="#ec4899" />
                        <ellipse cx="77" cy="78" rx="2.3" ry="3.3" fill="#ec4899" />
                        <circle cx="23" cy="83" r="1.6" fill="#f9a8d4" />
                        <circle cx="77" cy="83" r="1.6" fill="#f9a8d4" />
                        <g class="nyra-dance-face">
                            <path d="M32 45 C32 65 68 65 68 45 Z" fill="#fbcfe8" />
                            <circle cx="50" cy="46" r="6" fill="#fda4af" />
                            <path d="M37 34.8 C39.5 32.8 42.7 32.5 45.2 34" stroke="#831843" stroke-width="1.9" stroke-linecap="round" fill="none" />
                            <path d="M54.8 34 C57.3 32.5 60.5 32.8 63 34.8" stroke="#831843" stroke-width="1.9" stroke-linecap="round" fill="none" />
                            <ellipse class="nyra-eye-left" cx="41" cy="40.5" rx="3.3" ry="3.8" fill="#111827" />
                            <ellipse class="nyra-eye-right" cx="59" cy="40.5" rx="3.3" ry="3.8" fill="#111827" />
                            <circle class="nyra-eye-spark-left" cx="40.2" cy="39.4" r="1.1" fill="#ffffff" />
                            <circle class="nyra-eye-spark-right" cx="58.2" cy="39.4" r="1.1" fill="#ffffff" />
                            <path d="M38.2 36.5 L36.9 35.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path d="M41 35.9 L40.7 34.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path d="M43.8 36.6 L45 35.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path d="M56.2 36.6 L55 35.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path d="M59 35.9 L59.3 34.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path d="M61.8 36.5 L63.1 35.2" stroke="#f9a8d4" stroke-width="1.1" stroke-linecap="round" />
                            <path class="nyra-smile" d="M45.5 54 Q50 59.2 54.5 54" stroke="#db2777" stroke-width="2.2" fill="none" />
                        </g>
                    </svg>
                `;
            }

            if (key === "bortok") {
                return `
                    <svg class="w-full h-full p-4" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#475569" />
                        <path class="bortok-impact-left" d="M18 31 L22 37 L30 39 L23 42 L21 49 L17 43 L9 41 L16 38 Z" fill="#fb923c" />
                        <path class="bortok-impact-right" d="M77 24 L80 30 L87 32 L81 35 L79 41 L75 35 L68 33 L74 30 Z" fill="#fbbf24" />
                        <path class="bortok-hat" d="M50 10 L20 48 L80 48 Z" fill="#ea580c" />
                        <circle class="bortok-hat" cx="50" cy="15" r="5" fill="#c2410c" />
                        <path class="bortok-beard" d="M28 48 C28 75 72 75 72 48 Z" fill="#f97316" />
                        <circle cx="50" cy="45" r="9" fill="#fecdd3" />
                        <path class="bortok-brow-left" d="M38 35 L48 38" stroke="black" stroke-width="2.8" stroke-linecap="round" />
                        <path class="bortok-brow-right" d="M62 35 L52 38" stroke="black" stroke-width="2.8" stroke-linecap="round" />
                        <circle class="bortok-eye-left" cx="43" cy="40" r="3" fill="#000" />
                        <circle class="bortok-eye-right" cx="57" cy="40" r="3" fill="#000" />
                    </svg>
                `;
            }

            if (key === "zeldrik") {
                return `
                    <svg class="w-full h-full p-4" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#1e293b" />
                        <path class="zeldrik-spark-a" d="M19 28 L20.5 32 L25 33.5 L20.5 35 L19 39 L17.5 35 L13 33.5 L17.5 32 Z" fill="#93c5fd" />
                        <path class="zeldrik-spark-b" d="M76 22 L78 27 L83 29 L78 31 L76 36 L74 31 L69 29 L74 27 Z" fill="#fde68a" />
                        <path class="zeldrik-hat" d="M50 12 L22 45 L78 45 Z" fill="#0284c7" />
                        <path class="zeldrik-beard" d="M32 45 C32 68 68 68 68 45 Z" fill="#cbd5e1" />
                        <circle cx="50" cy="43" r="6" fill="#fbcfe8" />
                        <g class="zeldrik-glasses">
                            <circle cx="41" cy="39" r="6" stroke="#fbbf24" stroke-width="2" fill="none" />
                            <circle cx="59" cy="39" r="6" stroke="#fbbf24" stroke-width="2" fill="none" />
                            <line x1="47" y1="39" x2="53" y2="39" stroke="#fbbf24" stroke-width="2" />
                        </g>
                        <circle class="zeldrik-eye-left" cx="41" cy="39" r="1.5" fill="#000" />
                        <circle class="zeldrik-eye-right" cx="59" cy="39" r="1.5" fill="#000" />
                    </svg>
                `;
            }

            if (key === "faggro") {
                return `
                    <svg class="w-full h-full p-4" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#334155" />
                        <path class="faggro-sparkle-a" d="M19 23 L21 28 L26 30 L21 32 L19 37 L17 32 L12 30 L17 28 Z" fill="#fde047" />
                        <path class="faggro-sparkle-b" d="M74 18 L76 22 L80 24 L76 26 L74 30 L72 26 L68 24 L72 22 Z" fill="#a78bfa" />
                        <path class="faggro-hood" d="M50 15 C30 15 25 45 25 45 L75 45 C75 45 70 15 50 15 Z" fill="#16a34a" />
                        <path class="faggro-beard" d="M30 45 C30 72 70 72 70 45 Z" fill="#d97706" />
                        <circle cx="50" cy="44" r="7" fill="#fecdd3" />
                        <circle class="faggro-earring" cx="26" cy="52" r="3" stroke="#f59e0b" stroke-width="1.5" fill="none" />
                        <circle class="faggro-eye-left" cx="43" cy="38" r="2.5" fill="#000" />
                        <circle class="faggro-eye-right" cx="57" cy="38" r="2.5" fill="#000" />
                    </svg>
                `;
            }

            return `<svg class="w-full h-full p-4">${document.getElementById(GNOME_DATABASE[key].svgId).innerHTML}</svg>`;
        }

        function openGnomeDetailModal(key, options = {}) {
            const g = GNOME_DATABASE[key];
            if (!g) return;
            const localizedRole = getLocalizedGnomeField(key, "role", g.role);
            const localizedGender = getLocalizedGnomeField(key, "gender", g.gender);
            const localizedRarity = getLocalizedGnomeField(key, "rarity", g.rarity);
            const localizedQuote = getLocalizedGnomeField(key, "quote", g.quote);
            const localizedBonus = getLocalizedGnomeField(key, "bonusText", g.bonusText);
            initModalKeyboardSupport();
            if (!options.restoreFocusTarget) {
                detailReturnFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            } else {
                detailReturnFocusEl = options.restoreFocusTarget;
            }
            currentGnomeDetailKey = key;

            // Injeta o SVG ampliado
            const svgContainer = document.getElementById("gnome-detail-svg-container");
            svgContainer.innerHTML = `<svg class="w-full h-full p-2">${document.getElementById(g.svgId).innerHTML}</svg>`;
            svgContainer.classList.add("cursor-pointer");
            svgContainer.onclick = function() {
                openGnomeShowcaseFromDetail();
            };
            applyGnomeAnimation(svgContainer, key);

            // Títulos e identificadores do clã
            document.getElementById("gnome-detail-name").innerText = g.name;
            document.getElementById("gnome-detail-role").innerText = localizedRole;
            document.getElementById("gnome-detail-gender").innerText = `Gender: ${localizedGender} | Mining Clan`;
            if (getCurrentLanguage() === "pt-BR") {
                document.getElementById("gnome-detail-gender").innerText = `Gênero: ${localizedGender} | Clã Minerador`;
            }
            if (getCurrentLanguage() === "es") {
                document.getElementById("gnome-detail-gender").innerText = `Género: ${localizedGender} | Clan Minero`;
            }
            
            // Textos de Frase de Efeito e Biografia
            document.getElementById("gnome-detail-quote").innerHTML = `"${localizedQuote}"`;
            document.getElementById("gnome-detail-desc").innerText = g.description;
            document.getElementById("gnome-detail-passivetext").innerText = localizedBonus;

            // Valores de Contrato e Dias
            document.getElementById("gnome-detail-days").innerText = g.durationDays;
            document.getElementById("gnome-detail-cost").innerText = g.costGbc;

            // Cores baseadas na raridade
            const badge = document.getElementById("gnome-detail-rarity");
            const header = document.getElementById("gnome-detail-header");
            
            badge.innerText = localizedRarity;
            
            if (g.rarity === "Comum") {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700";
                header.className = "p-6 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between relative";
            } else if (g.rarity === "Especial") {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60";
                header.className = "p-6 bg-gradient-to-r from-slate-950 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between relative";
            } else if (g.rarity === "Lendário") {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800/60";
                header.className = "p-6 bg-gradient-to-r from-slate-950 to-pink-950/40 border-b border-slate-800 flex items-center justify-between relative";
            }

            // Ajusta barras e valores numéricos de performance (Stats 0 a 100)
            const stats = g.stats || { production: 50, luck: 50, resistance: 50, energy: 50 };

            document.getElementById("stat-val-production").innerText = `${stats.production}%`;
            document.getElementById("stat-bar-production").style.width = `${stats.production}%`;

            document.getElementById("stat-val-luck").innerText = `${stats.luck}%`;
            document.getElementById("stat-bar-luck").style.width = `${stats.luck}%`;

            document.getElementById("stat-val-resistance").innerText = `${stats.resistance}%`;
            document.getElementById("stat-bar-resistance").style.width = `${stats.resistance}%`;

            document.getElementById("stat-val-energy").innerText = `${stats.energy}%`;
            document.getElementById("stat-bar-energy").style.width = `${stats.energy}%`;

            // Vincula o botão de contratar de dentro do modal
            const buyBtn = document.getElementById("gnome-detail-buy-btn");
            buyBtn.onclick = function() {
                buyGnome(g.key);
                closeGnomeDetailModal();
            };

            // Abre o modal
            showModal("modal-gnome-detail");
            focusModalShell(document.getElementById("gnome-detail-shell"), "#btn-gnome-showcase");
            if (!options.suppressSound) {
                const detailCueHook = getRuntimeShowcaseHook("playGnomeDetailCue");
                if (detailCueHook) {
                    detailCueHook(key);
                } else {
                    playSoundSpin();
                }
            }
        }

        function closeGnomeDetailModal(options = {}) {
            const stopDetailCueHook = getRuntimeShowcaseHook("stopGnomeModalCue");
            if (stopDetailCueHook) {
                stopDetailCueHook();
            }
            hideModal("modal-gnome-detail", { skipScrollSync: options.skipScrollSync });
            if (!options.skipRestoreFocus && detailReturnFocusEl && typeof detailReturnFocusEl.focus === "function") {
                detailReturnFocusEl.focus();
            }
        }

        function openGnomeShowcaseFromDetail() {
            if (!currentGnomeDetailKey) return;
            showcaseReturnToDetail = true;
            showcaseReturnFocusEl = document.getElementById("btn-gnome-showcase");
            closeGnomeDetailModal({ skipRestoreFocus: true, skipScrollSync: true });
            openGnomeShowcase(currentGnomeDetailKey);
        }

        function openGnomeShowcase(key) {
            const g = GNOME_DATABASE[key];
            if (!g) return;
            const localizedRole = getLocalizedGnomeField(key, "role", g.role);
            const localizedRarity = getLocalizedGnomeField(key, "rarity", g.rarity);
            const localizedQuote = getLocalizedGnomeField(key, "quote", g.quote);
            initModalKeyboardSupport();
            if (!showcaseReturnToDetail) {
                showcaseReturnFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            }
            currentShowcaseKey = key;

            const svgContainer = document.getElementById("gnome-showcase-svg");
            svgContainer.innerHTML = getShowcaseSvgMarkup(key);
            applyGnomeAnimation(svgContainer, key);
            applyShowcaseTheme(key);
            applyShowcaseState(key);
            renderShowcaseBackdrop(key);
            renderShowcaseParticles(key);
            initShowcaseInteractions();

            document.getElementById("gnome-showcase-name").innerText = g.name;
            document.getElementById("gnome-showcase-role").innerText = localizedRole;
            document.getElementById("gnome-showcase-quote").innerText = `"${localizedQuote}"`;

            const badge = document.getElementById("gnome-showcase-rarity");
            badge.innerText = localizedRarity;
            if (g.rarity === "Comum") {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700";
            } else if (g.rarity === "Especial") {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60";
            } else {
                badge.className = "text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-pink-950 text-pink-400 border border-pink-800/60";
            }

            showModal("modal-gnome-showcase");
            document.getElementById("btn-back-gnome-showcase").innerText = showcaseReturnToDetail ? "Voltar para ficha" : "Voltar";
            collapseShowcasePanels(null);
            startShowcaseRealtimeSync();
            syncOpenShowcaseWithGame("force");
            focusModalShell(document.getElementById("gnome-showcase-shell"), "#btn-back-gnome-showcase");
            const themeHook = getRuntimeShowcaseHook("playGnomeShowcaseTheme");
            if (themeHook) {
                themeHook(key, getShowcaseSceneState(key).kind);
            } else {
                playSoundSpin();
            }
        }

        function closeGnomeShowcase() {
            const willReturnToDetail = showcaseReturnToDetail && currentGnomeDetailKey;
            hideModal("modal-gnome-showcase", { skipScrollSync: Boolean(willReturnToDetail) });
            const stage = document.getElementById("gnome-showcase-stage");
            stage?.classList.remove("gnome-showcase-stage-hover");
            stage?.style.setProperty("--parallax-x", "0px");
            stage?.style.setProperty("--parallax-y", "0px");
            stopShowcaseRealtimeSync();
            lastShowcaseSceneSignature = null;
            const stopDetailCueHook = getRuntimeShowcaseHook("stopGnomeModalCue");
            if (stopDetailCueHook) {
                stopDetailCueHook();
            }
            const stopAmbientHook = getRuntimeShowcaseHook("stopAmbientSoundtrack");
            if (stopAmbientHook) {
                stopAmbientHook();
            }
            if (willReturnToDetail) {
                showcaseReturnToDetail = false;
                openGnomeDetailModal(currentGnomeDetailKey, {
                    restoreFocusTarget: detailReturnFocusEl,
                    suppressSound: true
                });
                requestAnimationFrame(() => {
                    const trigger = showcaseReturnFocusEl || document.getElementById("btn-gnome-showcase");
                    if (trigger && typeof trigger.focus === "function") trigger.focus();
                });
                return;
            }
            if (showcaseReturnFocusEl && typeof showcaseReturnFocusEl.focus === "function") {
                showcaseReturnFocusEl.focus();
            }
            showcaseReturnFocusEl = null;
        }

        window.syncOpenShowcaseWithGame = syncOpenShowcaseWithGame;
        window.triggerShowcaseMineEvent = triggerShowcaseMineEvent;
        window.toggleShowcaseInfoPanel = toggleShowcaseInfoPanel;
        window.openGnomeDetailModal = openGnomeDetailModal;
        window.closeGnomeDetailModal = closeGnomeDetailModal;
        window.openGnomeShowcaseFromDetail = openGnomeShowcaseFromDetail;
        window.openGnomeShowcase = openGnomeShowcase;
        window.closeGnomeShowcase = closeGnomeShowcase;

        function renderShop() {
            // Seção Gnomos
            const gnomesContainer = document.getElementById("shop-gnomos");
            gnomesContainer.innerHTML = "";
            
            Object.values(GNOME_DATABASE).forEach(g => {
                const card = document.createElement("div");
                const localizedRole = getLocalizedGnomeField(g.key, "role", g.role);
                const localizedGender = getLocalizedGnomeField(g.key, "gender", g.gender);
                const localizedRarity = getLocalizedGnomeField(g.key, "rarity", g.rarity);
                const localizedQuote = getLocalizedGnomeField(g.key, "quote", g.quote);
                const localizedBonus = getLocalizedGnomeField(g.key, "bonusText", g.bonusText);
                // Card interativo: Clicar no card abre a ficha do gnomo (popup curto), exceto ao clicar no botão "Contratar"
                card.className = "bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 hover:bg-slate-800 transition duration-200 cursor-pointer relative group";
                
                let rarityColor = "text-slate-400";
                if (g.rarity === "Especial") rarityColor = "text-indigo-400 font-bold";
                if (g.rarity === "Lendário") rarityColor = "text-pink-400 font-extrabold";

                card.innerHTML = `
                    <!-- Link visual superior para detalhar -->
                    <div class="absolute right-3 top-3 text-slate-500 group-hover:text-amber-400 transition text-xs" title="${t("shop.techSheet")}">
                        <i class="fa-solid fa-circle-info text-base"></i>
                    </div>

                    <div onclick="openGnomeDetailModal('${g.key}')" class="flex items-start gap-4 flex-grow">
                        <div class="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex-shrink-0">
                            <svg class="w-full h-full p-1">${document.getElementById(g.svgId).innerHTML}</svg>
                        </div>
                        <div class="space-y-1.5 flex-grow pr-4">
                            <div class="flex items-center gap-2">
                                <h4 class="font-black text-sm text-slate-100">${g.name}</h4>
                                <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 ${rarityColor}">${localizedRarity}</span>
                            </div>
                            <p class="text-[10px] text-amber-400 font-medium leading-none">${localizedRole} (${localizedGender})</p>
                            <p class="text-xs text-slate-300 font-medium leading-normal italic">"${localizedQuote}"</p>
                            <p class="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 line-clamp-2">${localizedBonus}</p>
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div onclick="openGnomeDetailModal('${g.key}')" class="flex-grow">
                            <p class="text-[10px] text-slate-500 leading-none">${t("shop.contract", { days: g.durationDays })}</p>
                            <p class="font-extrabold text-amber-400 mt-1 flex items-center">
                                <i class="fa-solid fa-coins mr-0.5"></i>${g.costGbc} GBC
                            </p>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button onclick="openGnomeDetailModal('${g.key}')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-xl transition text-[11px]">
                                ${t("shop.detail")}
                            </button>
                            <button onclick="buyGnome('${g.key}')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl transition duration-150 shadow-md">
                                ${t("shop.hire")}
                            </button>
                        </div>
                    </div>
                `;
                gnomesContainer.appendChild(card);
            });

            // Seção Equipamentos (Drones, brocas, etc.)
            const gearContainer = document.getElementById("shop-equipamentos");
            gearContainer.innerHTML = `
                <!-- Brocas -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg mb-3">
                            <i class="fa-solid fa-bore-hole"></i>
                        </div>
                        <h4 class="font-bold text-sm text-slate-200">${t("shop.drillName")}</h4>
                        <p class="text-xs text-slate-400 mt-1">${t("shop.drillDesc")}</p>
                        <p class="text-[10px] text-slate-500 mt-2">${t("shop.levelOwned")}: <span class="text-blue-400 font-bold">${gameState.inventory.gear.drill}</span></p>
                    </div>
                    <div class="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                            <p class="text-[10px] text-slate-500 leading-none">${t("shop.uniqueCost")}</p>
                            <p class="font-bold text-amber-400 mt-1">400 GBC</p>
                        </div>
                        <button onclick="buyGear('drill')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow">
                            ${t("shop.buy")}
                        </button>
                    </div>
                </div>

                <!-- Motor de Redução de Consumo -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                        <div class="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 flex items-center justify-center text-lg mb-3">
                            <i class="fa-solid fa-car-battery"></i>
                        </div>
                        <h4 class="font-bold text-sm text-slate-200">${t("shop.engineName")}</h4>
                        <p class="text-xs text-slate-400 mt-1">${t("shop.engineDesc")}</p>
                        <p class="text-[10px] text-slate-500 mt-2">${t("shop.levelOwned")}: <span class="text-yellow-400 font-bold">${gameState.inventory.gear.engine}</span></p>
                    </div>
                    <div class="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                            <p class="text-[10px] text-slate-500 leading-none">${t("shop.uniqueCost")}</p>
                            <p class="font-bold text-amber-400 mt-1">650 GBC</p>
                        </div>
                        <button onclick="buyGear('engine')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow">
                            ${t("shop.buy")}
                        </button>
                    </div>
                </div>

                <!-- Vagonete de Mineração Extra -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg mb-3">
                            <i class="fa-solid fa-train"></i>
                        </div>
                        <h4 class="font-bold text-sm text-slate-200">${t("shop.railcarName")}</h4>
                        <p class="text-xs text-slate-400 mt-1">${t("shop.railcarDesc")}</p>
                        <p class="text-[10px] text-slate-500 mt-2">${t("shop.levelOwned")}: <span class="text-emerald-400 font-bold">${gameState.inventory.gear.railcar}</span></p>
                    </div>
                    <div class="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                            <p class="text-[10px] text-slate-500 leading-none">${t("shop.uniqueCost")}</p>
                            <p class="font-bold text-amber-400 mt-1">500 GBC</p>
                        </div>
                        <button onclick="buyGear('railcar')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow">
                            ${t("shop.buy")}
                        </button>
                    </div>
                </div>

                <!-- Coletor Automático -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-lg mb-3">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <h4 class="font-bold text-sm text-slate-200">${t("shop.collectorName")}</h4>
                        <p class="text-xs text-slate-400 mt-1">${t("shop.collectorDesc")}</p>
                        <p class="text-[10px] text-slate-500 mt-2">${t("shop.statusCurrent")}: <span class="text-cyan-400 font-bold">${Number(gameState.inventory.services?.autoCollectorUntil || 0) > Date.now() ? t("shop.active") : t("shop.inactive")}</span></p>
                    </div>
                    <div class="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                            <p class="text-[10px] text-slate-500 leading-none">${t("shop.rent7days")}</p>
                            <p class="font-bold text-amber-400 mt-1">200 GBC</p>
                        </div>
                        <button onclick="buyGear('autoCollector')" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow">
                            ${Number(gameState.inventory.services?.autoCollectorUntil || 0) > Date.now() ? t("shop.renew") : t("shop.activate")}
                        </button>
                    </div>
                </div>
            `;

            // Seção Energia (Suprimentos)
            const energyContainer = document.getElementById("shop-energia");
            energyContainer.innerHTML = `
                <!-- Pacote Compacto -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 flex items-center justify-center text-xl font-bold">
                            +25%
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-200">${t("shop.batteryCompact")}</h4>
                            <p class="text-xs text-slate-400 mt-0.5">${t("shop.batteryCompactDesc")}</p>
                        </div>
                    </div>
                    <button onclick="buyEnergy(25, 40)" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow">
                        40 GBC
                    </button>
                </div>

                <!-- Pacote Total de Lítio -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl font-bold">
                            +100%
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-200">${t("shop.batteryMax")}</h4>
                            <p class="text-xs text-slate-400 mt-0.5">${t("shop.batteryMaxDesc")}</p>
                        </div>
                    </div>
                    <button onclick="buyEnergy(100, 150)" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow">
                        150 GBC
                    </button>
                </div>
            `;

            document.getElementById("shop-energy-val").innerText = gameState.player.energy;
        }

        function buyGnome(key) {
            const g = GNOME_DATABASE[key];
            if (!g) return;

            if (gameState.player.gbc < g.costGbc) {
                showFeedback(t("shop.errors.insufficientHire"), "error");
                return;
            }

            gameState.player.gbc -= g.costGbc;
            const uniqueId = `${g.key}_${Date.now()}`;
            gameState.contractedGnomes.push({
                id: uniqueId,
                type: g.key,
                allocatedTo: null,
                contractExpires: Date.now() + (g.durationDays * 24 * 60 * 60 * 1000)
            });

            // Missão de contratação
            incrementMissionProgress("m3", 1);

            playSoundUpgrade();
            showFeedback(t("shop.success.hired", { name: g.name }), "success");
            saveGameData();
            renderInventario();
            renderShop();
            renderMines();
            renderMissions();
            openGnomeShowcase(g.key);
            triggerShowcaseCelebration();
        }

        function buyGear(type) {
            let cost = 0;
            if (type === 'drill') cost = 400;
            if (type === 'engine') cost = 650;
            if (type === 'railcar') cost = 500;
            if (type === 'autoCollector') cost = GAME_CONFIG.mineAutoCollectorCostGbc;

            if (gameState.player.gbc < cost) {
                showFeedback(t("shop.errors.insufficientGear"), "error");
                return;
            }

            gameState.player.gbc -= cost;
            if (type === 'autoCollector') {
                const currentUntil = Number(gameState.inventory.services?.autoCollectorUntil || 0);
                const startFrom = currentUntil > Date.now() ? currentUntil : Date.now();
                gameState.inventory.services.autoCollectorUntil = startFrom + (GAME_CONFIG.mineAutoCollectorDurationDays * 24 * 60 * 60 * 1000);
            } else {
                gameState.inventory.gear[type] = (gameState.inventory.gear[type] || 0) + 1;
            }
            
            playSoundUpgrade();
            showFeedback(type === 'autoCollector' ? t("shop.success.collectorActivated") : t("shop.success.gearInstalled"), "success");
            saveGameData();
            renderShop();
            renderInventario();
            renderMines();
        }

        function buyEnergy(qty, cost) {
            if (gameState.player.gbc < cost) {
                showFeedback(t("shop.errors.insufficientEnergy"), "error");
                return;
            }

            if (gameState.player.energy >= 100) {
                showFeedback(t("shop.errors.energyFull"), "warning");
                return;
            }

            gameState.player.gbc -= cost;
            gameState.player.energy = Math.min(100, gameState.player.energy + qty);
            
            playSoundUpgrade();
            showFeedback(t("shop.success.energyRecharged", { qty }), "success");
            saveGameData();
            renderShop();
            renderMines();
        }
