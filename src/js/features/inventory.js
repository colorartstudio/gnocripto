        // Renderizador de Inventário e Recursos
        function renderInventario() {
            // Recursos Brutos
            const rawContainer = document.getElementById("inventory-raw");
            rawContainer.innerHTML = "";

            Object.entries(gameState.inventory.recursos).forEach(([name, val]) => {
                const item = document.createElement("div");
                item.className = "bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs";
                item.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-sm">⛏</span>
                        <span class="text-slate-300 font-medium">${getLocalizedResourceName(name)}</span>
                    </div>
                    <span class="font-extrabold text-slate-100">${formatGameNumber(val)}</span>
                `;
                rawContainer.appendChild(item);
            });

            // Fragmentos Colecionáveis Temáticos
            const collContainer = document.getElementById("inventory-collectible");
            collContainer.innerHTML = "";

            Object.entries(gameState.inventory.collectibles).forEach(([name, val]) => {
                const item = document.createElement("div");
                item.className = "bg-slate-900 border border-slate-800 p-3 rounded-xl text-center space-y-1";
                
                let colorClass = "text-amber-400";
                if (name.includes("Polygonita")) colorClass = "text-purple-400";
                if (name.includes("Dogecrita")) colorClass = "text-yellow-400";
                if (name.includes("Tronita")) colorClass = "text-red-400";
                if (name.includes("Cardanita")) colorClass = "text-blue-400";

                item.innerHTML = `
                    <div class="text-xl">💎</div>
                    <h5 class="text-[10px] text-slate-300 font-bold">${getLocalizedCollectibleName(name)}</h5>
                    <p class="text-xs font-black ${colorClass}">${formatGameNumber(val)}</p>
                `;
                collContainer.appendChild(item);
            });

            // Equipamentos Instalados
            const gearContainer = document.getElementById("inventory-gear");
            gearContainer.innerHTML = "";

            Object.entries(gameState.inventory.gear).forEach(([type, count]) => {
                const item = document.createElement("div");
                item.className = "bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs";
                
                let title = t("shop.drillName");
                let effect = t("inventory.effects.drill", { value: count * 5 });
                if (type === 'engine') {
                    title = t("shop.engineName");
                    effect = t("inventory.effects.engine", { value: count * 1.5 });
                }
                if (type === 'railcar') {
                    title = t("shop.railcarName");
                    effect = t("inventory.effects.railcar", { value: count * 5 });
                }

                item.innerHTML = `
                    <div>
                        <p class="font-bold text-slate-200">${title}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5">${t("inventory.level")}: <span class="text-amber-400">${formatGameNumber(count)}</span></p>
                    </div>
                    <span class="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">${effect}</span>
                `;
                gearContainer.appendChild(item);
            });

            // Sincroniza balanço superior também
            document.getElementById("bal-usdt").innerText = gameState.player.usdt.toFixed(2);
            document.getElementById("bal-gnocripto").innerText = formatGameNumber(gameState.player.gbc);
        }

