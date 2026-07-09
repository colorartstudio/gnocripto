        function getSavedWallets() {
            return Array.isArray(gameState.settings?.wallets) ? gameState.settings.wallets : [];
        }

        function getSelectedWallet() {
            const wallets = getSavedWallets();
            return wallets.find(wallet => wallet.id === gameState.settings?.selectedWalletId) || wallets[0] || null;
        }

        function getConfiguredWithdrawalAddress() {
            return (getSelectedWallet()?.address || "").trim();
        }

        function getConfiguredWithdrawalLabel() {
            return (getSelectedWallet()?.label || t("settings.walletMain")).trim();
        }

        function formatWalletAddress(address) {
            if (!address) return "Nenhuma carteira configurada";
            if (address.length <= 14) return address;
            return `${address.slice(0, 8)}...${address.slice(-6)}`;
        }

        function formatTransactionDate(timestamp) {
            return formatGameDate(timestamp);
        }

        function getLocalizedStatusLabel(status, fallback = "") {
            const key = `statuses.${status}`;
            const translated = t(key);
            return translated === key ? (fallback || status || "") : translated;
        }

        function getLocalizedWalletLabel(label) {
            if (!label) return label;
            if (label === "Saldo interno da plataforma" || label === "Platform internal balance" || label === "Saldo interno de la plataforma") {
                return t("swap.internalDestination");
            }
            if (label === "Carteira Principal" || label === "Main Wallet" || label === "Billetera principal") {
                return t("settings.walletMain");
            }
            return label;
        }

        function resetWalletForm() {
            const idInput = document.getElementById("settings-wallet-id");
            const labelInput = document.getElementById("settings-withdrawal-label");
            const addressInput = document.getElementById("settings-withdrawal-address");
            const submitLabel = document.getElementById("settings-wallet-submit-label");
            const cancelButton = document.getElementById("settings-wallet-cancel-edit");

            if (idInput) idInput.value = "";
            if (labelInput) labelInput.value = "";
            if (addressInput) addressInput.value = "";
            if (submitLabel) submitLabel.innerText = t("settings.addWallet");
            if (cancelButton) cancelButton.classList.add("hidden");
        }

        function renderWalletList() {
            const walletList = document.getElementById("settings-wallet-list");
            if (!walletList) return;

            const wallets = getSavedWallets();
            const selectedWallet = getSelectedWallet();

            if (!wallets.length) {
                walletList.innerHTML = `
                    <div class="bg-slate-950 border border-dashed border-slate-800 rounded-xl p-4 text-center">
                        <p class="text-sm font-bold text-slate-300">${t("settings.noWalletRegistered")}</p>
                        <p class="text-xs text-slate-500 mt-1">${t("settings.addFirstWallet")}</p>
                    </div>
                `;
                return;
            }

            walletList.innerHTML = wallets.map(wallet => {
                const isSelected = selectedWallet && selectedWallet.id === wallet.id;
                return `
                    <div class="bg-slate-950 border ${isSelected ? 'border-amber-500/50' : 'border-slate-800'} rounded-xl p-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="flex items-center gap-2">
                                    <p class="text-sm font-black text-slate-100">${wallet.label}</p>
                                    ${isSelected ? `<span class="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">${t("settings.active")}</span>` : ""}
                                </div>
                                <p class="text-[10px] text-emerald-400 font-bold mt-1">USDT • BSC / BEP20</p>
                                <p class="text-xs font-mono text-slate-400 mt-2 break-all">${wallet.address}</p>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            <button onclick="selectWithdrawalWallet('${wallet.id}')" class="${isSelected ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'} font-bold px-3 py-2 rounded-xl text-xs transition">
                                ${isSelected ? t("settings.walletInUse") : t("settings.useForWithdrawal")}
                            </button>
                            <button onclick="editWithdrawalWallet('${wallet.id}')" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl text-xs transition">
                                ${t("settings.edit")}
                            </button>
                            <button onclick="deleteWithdrawalWallet('${wallet.id}')" class="bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 font-bold px-3 py-2 rounded-xl text-xs transition">
                                ${t("settings.delete")}
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }

        function renderWithdrawalHistory() {
            const container = document.getElementById("settings-withdrawal-history");
            if (!container) return;

            const getStatusTheme = (status) => {
                if (status === "done") return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
                if (status === "error" || status === "rejected") return "bg-red-500/10 text-red-300 border border-red-500/20";
                if (status === "processing" || status === "payout_created") return "bg-sky-500/10 text-sky-300 border border-sky-500/20";
                return "bg-amber-500/10 text-amber-300 border border-amber-500/20";
            };

            const history = Array.isArray(gameState.settings?.withdrawalHistory) ? gameState.settings.withdrawalHistory : [];
            if (!history.length) {
                container.innerHTML = `
                    <div class="bg-slate-950 border border-dashed border-slate-800 rounded-xl p-4 text-center">
                        <p class="text-sm font-bold text-slate-300">${t("settings.noTransactions")}</p>
                        <p class="text-xs text-slate-500 mt-1">${t("settings.nextTransactions")}</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = history.map(tx => `
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="text-sm font-black ${tx.type === 'withdrawal' ? 'text-emerald-400' : 'text-amber-400'}">
                                ${tx.type === 'withdrawal' ? t("settings.withdrawalRequestTitle") : t("settings.purchaseTitle")}
                            </p>
                            <p class="text-[10px] text-slate-500 mt-1">${formatTransactionDate(tx.createdAt)}</p>
                        </div>
                        <span class="text-[10px] uppercase font-black px-2 py-0.5 rounded ${tx.type === 'withdrawal' ? getStatusTheme(tx.status) : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}">
                            ${tx.type === 'withdrawal' ? `${tx.provider || 'USDT BSC'}${tx.status ? ` • ${getLocalizedStatusLabel(tx.status, tx.status)}` : ''}` : t("settings.internalSwap")}
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 mt-4 text-xs">
                        <div>
                            <p class="text-slate-500 uppercase font-black">${t("settings.source")}</p>
                            <p class="text-slate-200 font-bold mt-1">${tx.fromAmount} ${tx.fromCurrency}</p>
                        </div>
                        <div>
                            <p class="text-slate-500 uppercase font-black">${t("settings.destination")}</p>
                            <p class="text-slate-200 font-bold mt-1">${tx.toAmount} ${tx.toCurrency}</p>
                        </div>
                    </div>
                    <div class="mt-4 text-xs">
                        <p class="text-slate-500 uppercase font-black">${t("settings.destinationWallet")}</p>
                        <p class="text-slate-300 font-medium mt-1">${getLocalizedWalletLabel(tx.destinationLabel) || t("settings.internalBalance")}${tx.destinationAddress ? ` • ${formatWalletAddress(tx.destinationAddress)}` : ''}</p>
                    </div>
                    ${tx.type === 'withdrawal' ? `
                        <div class="mt-4 grid grid-cols-1 gap-3 text-xs">
                            <div>
                                <p class="text-slate-500 uppercase font-black">${t("settings.status")}</p>
                                <p class="text-slate-300 font-medium mt-1">${getLocalizedStatusLabel(tx.status, tx.displayStatus || tx.status || t("settings.remainingProcessing"))}</p>
                            </div>
                            <div>
                                <p class="text-slate-500 uppercase font-black">${t("settings.requestId")}</p>
                                <p class="text-slate-300 font-mono mt-1 break-all">${tx.requestId || tx.id || '-'}</p>
                            </div>
                            <div>
                                <p class="text-slate-500 uppercase font-black">${t("settings.payoutId")}</p>
                                <p class="text-slate-300 font-mono mt-1 break-all">${tx.payoutId || '-'}</p>
                            </div>
                            ${tx.txid ? `
                                <div>
                                    <p class="text-slate-500 uppercase font-black">TXID</p>
                                    <p class="text-slate-300 font-mono mt-1 break-all">${tx.txid}</p>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join("");
        }

        function renderSettings() {
            const walletCurrent = document.getElementById("settings-wallet-current");
            const walletHint = document.getElementById("settings-wallet-hint");
            const selectedWallet = getSelectedWallet();

            if (walletCurrent) {
                walletCurrent.innerText = selectedWallet
                    ? `${selectedWallet.label} • ${formatWalletAddress(selectedWallet.address)}`
                    : t("settings.currentWalletNone");
            }

            if (walletHint) {
                walletHint.innerText = selectedWallet
                    ? t("settings.currentWalletHint")
                    : t("settings.currentWalletHintEmpty");
            }

            renderWalletList();
            renderWithdrawalHistory();
            syncAudioUI();
        }

        function saveWithdrawalWallet() {
            const idInput = document.getElementById("settings-wallet-id");
            const walletLabelInput = document.getElementById("settings-withdrawal-label");
            const walletAddressInput = document.getElementById("settings-withdrawal-address");

            const walletId = (idInput?.value || "").trim();
            const label = (walletLabelInput?.value || "").trim() || t("settings.walletMain");
            const address = (walletAddressInput?.value || "").trim();

            if (!address) {
                showFeedback(t("settings.askWalletBeforeSaving"), "error");
                return;
            }

            if (!address.startsWith("0x") || address.length < 12) {
                showFeedback(t("settings.invalidWallet"), "error");
                return;
            }

            const wallets = getSavedWallets();
            const duplicatedWallet = wallets.find(wallet => wallet.address.toLowerCase() === address.toLowerCase() && wallet.id !== walletId);
            if (duplicatedWallet) {
                showFeedback(t("settings.duplicatedWallet"), "warning");
                return;
            }

            if (walletId) {
                const wallet = wallets.find(item => item.id === walletId);
                if (wallet) {
                    wallet.label = label;
                    wallet.address = address;
                }
            } else {
                wallets.push({
                    id: `wallet_${Date.now()}`,
                    label,
                    address,
                    network: "BSC",
                    asset: "USDT",
                    createdAt: Date.now()
                });
            }

            gameState.settings.wallets = wallets;
            if (!gameState.settings.selectedWalletId && wallets.length) {
                gameState.settings.selectedWalletId = wallets[0].id;
            }

            saveGameData();
            resetWalletForm();
            renderSettings();
            if (typeof updateSwapPreview === "function") {
                updateSwapPreview("settings");
            }

            showFeedback(t("settings.walletSaved"), "success");
        }

        function selectWithdrawalWallet(walletId) {
            const wallet = getSavedWallets().find(item => item.id === walletId);
            if (!wallet) return;

            gameState.settings.selectedWalletId = walletId;
            saveGameData();
            renderSettings();
            if (typeof updateSwapPreview === "function") {
                updateSwapPreview("settings");
            }

            showFeedback(t("settings.walletActivated", { label: wallet.label }), "success");
        }

        function editWithdrawalWallet(walletId) {
            const wallet = getSavedWallets().find(item => item.id === walletId);
            if (!wallet) return;

            document.getElementById("settings-wallet-id").value = wallet.id;
            document.getElementById("settings-withdrawal-label").value = wallet.label;
            document.getElementById("settings-withdrawal-address").value = wallet.address;
            document.getElementById("settings-wallet-submit-label").innerText = t("settings.saveChanges");
            document.getElementById("settings-wallet-cancel-edit").classList.remove("hidden");
        }

        function deleteWithdrawalWallet(walletId) {
            const wallet = getSavedWallets().find(item => item.id === walletId);
            if (!wallet) return;

            if (!confirm(t("settings.removeWalletConfirm", { label: wallet.label }))) {
                return;
            }

            gameState.settings.wallets = getSavedWallets().filter(item => item.id !== walletId);

            if (gameState.settings.selectedWalletId === walletId) {
                gameState.settings.selectedWalletId = gameState.settings.wallets[0]?.id || null;
            }

            saveGameData();
            resetWalletForm();
            renderSettings();
            if (typeof updateSwapPreview === "function") {
                updateSwapPreview("settings");
            }
            showFeedback(t("settings.walletDeleted"), "info");
        }

        function registerSwapTransaction(entry) {
            const history = Array.isArray(gameState.settings.withdrawalHistory) ? gameState.settings.withdrawalHistory : [];
            history.unshift(entry);
            gameState.settings.withdrawalHistory = history.slice(0, 12);
        }

        function openSettingsFromSwap() {
            closeSwapModal();
            switchTab("configuracoes");
        }
