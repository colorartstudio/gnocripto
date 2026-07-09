        // Biblioteca Tone.js / Audio Nativo Simulado (Para evitar arquivos ausentes)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playTone(freq, type, duration) {
            if (audioMuted) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) {
                console.log("AudioContext blocked or failed", e);
            }
        }

        function playSoundCoin() { playTone(587.33, 'sine', 0.1); setTimeout(() => playTone(880, 'sine', 0.15), 80); }
        function playSoundUpgrade() { 
            playTone(440, 'triangle', 0.1); 
            setTimeout(() => {
                playTone(659.25, 'triangle', 0.1); 
                playTone(880, 'triangle', 0.2);
            }, 100); 
        }
        function playSoundAlert() { playTone(220, 'sawtooth', 0.3); }
        function playSoundSpin() { playTone(330, 'sine', 0.05); }
        let ambientOscillators = [];
        let ambientGainNode = null;
        let ambientCurrentKey = null;
        let ambientLastRequest = null;
        let ambientCleanupTimeout = null;
        let gnomeModalCueAudio = null;
        const gnomeModalCueMap = {
            nyra: "public/music-gnomos/Nyra.MP3",
            bortok: "public/music-gnomos/Bortok.MP3",
            zeldrik: "public/music-gnomos/Zeldrik.MP3",
            faggro: "public/music-gnomos/Faggro.MP3",
            gnorin: "public/music-gnomos/Gnorin.MP3"
        };

        function stopGnomeModalCue() {
            if (!gnomeModalCueAudio) return;
            try {
                gnomeModalCueAudio.pause();
                gnomeModalCueAudio.currentTime = 0;
            } catch (e) {
                console.log("Could not stop gnome modal cue", e);
            }
            gnomeModalCueAudio = null;
        }

        function playGnomeMappedCue(key, fallback) {
            if (audioMuted) return false;
            stopGnomeModalCue();

            const audioSrc = gnomeModalCueMap[key];
            if (!audioSrc) {
                if (typeof fallback === "function") fallback();
                return false;
            }

            try {
                const cueAudio = new Audio(audioSrc);
                cueAudio.preload = "auto";
                cueAudio.loop = true;
                cueAudio.volume = 0.72;
                cueAudio.currentTime = 0;
                gnomeModalCueAudio = cueAudio;
                cueAudio.addEventListener("ended", () => {
                    if (gnomeModalCueAudio === cueAudio) gnomeModalCueAudio = null;
                }, { once: true });
                cueAudio.addEventListener("pause", () => {
                    if (cueAudio.ended) return;
                    if (gnomeModalCueAudio === cueAudio && cueAudio.currentTime === 0) {
                        gnomeModalCueAudio = null;
                    }
                });
                cueAudio.play().catch((error) => {
                    if (gnomeModalCueAudio === cueAudio) gnomeModalCueAudio = null;
                    console.log("Could not play gnome detail cue", error);
                    if (typeof fallback === "function") fallback();
                });
                return true;
            } catch (e) {
                console.log("Could not create gnome detail cue", e);
                if (typeof fallback === "function") fallback();
                return false;
            }
        }

        function playGnomeDetailCue(key) {
            playGnomeMappedCue(key, playSoundSpin);
        }

        function playTonePattern(steps = []) {
            if (audioMuted || !Array.isArray(steps)) return;
            steps.forEach((step) => {
                setTimeout(() => {
                    playTone(step.freq, step.type || "sine", step.duration || 0.12);
                }, step.delay || 0);
            });
        }

        function playGnomeShowcaseTheme(key, sceneKind = "store") {
            if (audioMuted) return;
            playGnomeMappedCue(key);
        }

        window.playGnomeShowcaseTheme = playGnomeShowcaseTheme;
        globalThis.playGnomeShowcaseTheme = playGnomeShowcaseTheme;
        window.playGnomeDetailCue = playGnomeDetailCue;
        window.stopGnomeModalCue = stopGnomeModalCue;
        globalThis.playGnomeDetailCue = playGnomeDetailCue;
        globalThis.stopGnomeModalCue = stopGnomeModalCue;

        function stopAmbientSoundtrack() {
            if (ambientCleanupTimeout) {
                clearTimeout(ambientCleanupTimeout);
                ambientCleanupTimeout = null;
            }
            if (ambientOscillators.length) {
                ambientOscillators.forEach((osc) => {
                    try { osc.stop(); } catch (e) {}
                    try { osc.disconnect(); } catch (e) {}
                });
                ambientOscillators = [];
            }
            if (ambientGainNode) {
                try { ambientGainNode.disconnect(); } catch (e) {}
                ambientGainNode = null;
            }
            ambientCurrentKey = null;
            ambientLastRequest = null;
        }

        function setAmbientSoundtrack(sceneKind = "store", mineId = "base", resourceRarity = "common", collectibleName = null) {
            ambientLastRequest = { sceneKind, mineId, resourceRarity, collectibleName };
            if (audioMuted) return;

            const nextKey = `${sceneKind}:${mineId}:${resourceRarity}:${collectibleName || "none"}`;
            if (ambientCurrentKey === nextKey) return;

            const sceneBaseMap = {
                store: [174.61, 261.63],
                ready: [220, 329.63],
                mining: [196, 293.66],
                "low-energy": [146.83, 220],
                broken: [130.81, 196]
            };

            const mineOffsetMap = {
                mine_1: 0,
                mine_2: 18,
                mine_3: 32,
                mine_4: 45,
                mine_5: 58,
                base: 0
            };
            const rarityOffsetMap = {
                common: 0,
                special: 24,
                legendary: 52
            };
            const collectibleAccentMap = {
                "Fragmento Polygonita": { offset: 4, type: "triangle" },
                "Fragmento Dogecrita": { offset: 9, type: "square" },
                "Fragmento Tronita": { offset: 14, type: "triangle" },
                "Fragmento Cardanita": { offset: 18, type: "sine" },
                "Fragmento Xarpita": { offset: 24, type: "sawtooth" }
            };

            const base = sceneBaseMap[sceneKind] || sceneBaseMap.store;
            const offset = mineOffsetMap[mineId] || 0;
            const rarityOffset = rarityOffsetMap[resourceRarity] || 0;
            const collectibleAccent = collectibleAccentMap[collectibleName] || { offset: 0, type: "triangle" };
            const freqs = [
                base[0] + offset + rarityOffset,
                base[1] + (offset * 0.45) + (rarityOffset * 0.35),
                base[1] + collectibleAccent.offset
            ];

            try {
                const previousGain = ambientGainNode;
                const previousOscillators = [...ambientOscillators];

                const nextGain = audioCtx.createGain();
                nextGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
                nextGain.gain.exponentialRampToValueAtTime(0.018, audioCtx.currentTime + 0.35);
                nextGain.connect(audioCtx.destination);

                const nextOscillators = freqs.map((freq, index) => {
                    const osc = audioCtx.createOscillator();
                    osc.type = index === 0 ? "sine" : index === 1 ? "triangle" : collectibleAccent.type;
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    osc.connect(nextGain);
                    osc.start();
                    return osc;
                });

                if (previousGain) {
                    try {
                        previousGain.gain.cancelScheduledValues(audioCtx.currentTime);
                        previousGain.gain.setValueAtTime(Math.max(previousGain.gain.value, 0.0001), audioCtx.currentTime);
                        previousGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
                    } catch (e) {}
                }

                if (previousOscillators.length) {
                    ambientCleanupTimeout = setTimeout(() => {
                        previousOscillators.forEach((osc) => {
                            try { osc.stop(); } catch (e) {}
                            try { osc.disconnect(); } catch (e) {}
                        });
                        if (previousGain) {
                            try { previousGain.disconnect(); } catch (e) {}
                        }
                        ambientCleanupTimeout = null;
                    }, 520);
                }

                ambientGainNode = nextGain;
                ambientOscillators = nextOscillators;
                ambientCurrentKey = nextKey;
            } catch (e) {
                stopAmbientSoundtrack();
            }
        }

        function playShowcaseCollectionFx() {
            if (audioMuted) return;
            playTonePattern([
                { freq: 523.25, type: "triangle", duration: 0.1, delay: 0 },
                { freq: 659.25, type: "sine", duration: 0.12, delay: 90 },
                { freq: 880, type: "sine", duration: 0.14, delay: 180 }
            ]);
        }

        window.setAmbientSoundtrack = setAmbientSoundtrack;
        window.stopAmbientSoundtrack = stopAmbientSoundtrack;
        window.playShowcaseCollectionFx = playShowcaseCollectionFx;
        globalThis.setAmbientSoundtrack = setAmbientSoundtrack;
        globalThis.stopAmbientSoundtrack = stopAmbientSoundtrack;
        globalThis.playShowcaseCollectionFx = playShowcaseCollectionFx;

        function syncAudioUI() {
            const icon = document.getElementById("audio-icon");
            if (icon) {
                icon.className = audioMuted
                    ? "fa-solid fa-volume-xmark text-red-400"
                    : "fa-solid fa-volume-high text-emerald-400";
            }

            const status = document.getElementById("settings-audio-status");
            if (status) {
                status.innerText = audioMuted ? t("audio.disabled") : t("audio.enabled");
                status.className = audioMuted
                    ? "text-xs font-black text-red-400"
                    : "text-xs font-black text-emerald-400";
            }
        }

        function toggleAudio(forceEnabled) {
            const audioEnabled = typeof forceEnabled === "boolean" ? forceEnabled : audioMuted;
            audioMuted = !audioEnabled;

            if (gameState && gameState.settings) {
                gameState.settings.audioEnabled = audioEnabled;
                saveGameData();
            }

            syncAudioUI();

            if (audioMuted) {
                stopGnomeModalCue();
                stopAmbientSoundtrack();
                showFeedback(t("audio.disabledFeedback"), "info");
            } else {
                showFeedback(t("audio.enabledFeedback"), "info");
                playTone(440, "sine", 0.1);
            }
        }

        function getLanguageBadgeText(language) {
            if (language === "pt-BR") return "PT";
            return (language || "PT").toUpperCase();
        }

        function syncLanguageUI() {
            const badge = document.getElementById("lang-badge");
            if (!badge) return;
            badge.innerText = getLanguageBadgeText(gameState?.settings?.language || "pt-BR");
        }

        function closeLanguageMenu() {
            const menu = document.getElementById("lang-menu");
            if (menu) menu.classList.add("hidden");
        }

        function toggleLanguageMenu(event) {
            if (event) event.stopPropagation();
            const menu = document.getElementById("lang-menu");
            if (!menu) return;
            menu.classList.toggle("hidden");
        }

        function setLanguage(language) {
            if (!["pt-BR", "en", "es"].includes(language)) return;
            if (!gameState?.settings) return;
            gameState.settings.language = language;
            saveGameData();
            rerenderLocalizedUI();
            closeLanguageMenu();
            showFeedback(t("language.changed", { language: getLanguageDisplayName(language) }), "info");
        }

        function initLanguageUI() {
            rerenderLocalizedUI();
            document.addEventListener("click", (event) => {
                const inside = event.target.closest("#lang-selector");
                if (!inside) closeLanguageMenu();
            });
        }

        function showFeedback(message, type = 'success') {
            const area = document.getElementById("notification-area");
            const toast = document.createElement("div");
            
            const bgClass = {
                success: 'bg-emerald-900/90 border-emerald-500 text-emerald-200',
                error: 'bg-red-950/90 border-red-500 text-red-200',
                warning: 'bg-amber-950/90 border-amber-500 text-amber-200',
                info: 'bg-slate-900/90 border-blue-500 text-slate-200'
            }[type];

            toast.className = `flex items-center gap-3 border px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${bgClass}`;
            toast.innerHTML = `
                <span class="text-lg">
                    ${type === 'success' ? '🏆' : type === 'error' ? '💥' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span class="text-xs font-bold leading-snug">${message}</span>
            `;
            
            area.appendChild(toast);
            setTimeout(() => {
                toast.classList.remove('opacity-0', 'translate-y-2');
            }, 50);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }
