        let pendingWithdrawalRequest = null;
        let currentSwapEntryMode = "swap";
        let activeDepositRequest = null;
        const BLOCKBEE_USDT_BSC_TICKER = "bep20_usdt";
        const BLOCKBEE_WITHDRAWAL_STATUSES = {
            queued_for_backend: "Na fila do backend",
            payout_request_created: "Payout Request criado",
            payout_created: "Payout criado",
            processing: "Processando payout",
            done: "Pago com sucesso",
            error: "Erro no payout",
            rejected: "Saque rejeitado"
        };
        const BLOCKBEE_BACKEND_CONTRACT_VERSION = "2026-07-07";

        function createMockBlockBeeAddress() {
            const chars = "abcdef0123456789";
            let address = "0x";
            while (address.length < 42) {
                address += chars[Math.floor(Math.random() * chars.length)];
            }
            return address;
        }

        function createMockBlockBeeRequestId(prefix = "BB") {
            return `${prefix}-${Date.now()}`;
        }

        function buildMockBlockBeeDepositApiResponse(amountUsdt) {
            const addressIn = createMockBlockBeeAddress();
            return {
                payment_id: createMockBlockBeeRequestId("BB-DEP"),
                address_in: addressIn,
                qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(addressIn)}`,
                payment_uri: `https://app.blockbee.io/deposit/mock/${Date.now()}?ticker=${BLOCKBEE_USDT_BSC_TICKER}&address_in=${encodeURIComponent(addressIn)}&amount=${amountUsdt.toFixed(2)}`,
                status: "pending",
                requested_amount: amountUsdt
            };
        }

        function normalizeBlockBeeDepositResponse(apiResponse) {
            if (!apiResponse || typeof apiResponse !== "object") return null;

            const amountUsdt = Number(
                apiResponse.requested_amount ??
                apiResponse.amount_usdt ??
                apiResponse.amount ??
                0
            );
            const safeAmountUsdt = Number.isFinite(amountUsdt) ? amountUsdt : 0;

            return {
                payment_id: String(apiResponse.payment_id || apiResponse.id || createMockBlockBeeRequestId("BB-DEP")),
                address_in: String(apiResponse.address_in || apiResponse.address || ""),
                qr_code: String(apiResponse.qr_code || ""),
                payment_uri: String(apiResponse.payment_uri || apiResponse.checkout_url || ""),
                status: String(apiResponse.status || "pending"),
                meta: {
                    amount_usdt: safeAmountUsdt,
                    gbc_credit: safeAmountUsdt * GAME_CONFIG.usdtToGbc,
                    network: "BSC",
                    asset: "USDT",
                    provider: "BlockBee",
                    ticker: BLOCKBEE_USDT_BSC_TICKER
                }
            };
        }

        function buildBlockBeeWithdrawalBackendPayload(request) {
            return {
                provider: "blockbee",
                action: "create_payout_request",
                ticker: BLOCKBEE_USDT_BSC_TICKER,
                address: request.walletAddress,
                value: Number(request.toAmount.toFixed(2)),
                internal_reference: request.request_id,
                metadata: {
                    wallet_id: request.walletId,
                    wallet_label: request.walletLabel,
                    from_amount_gbc: request.fromAmount,
                    to_amount_usdt: Number(request.toAmount.toFixed(2))
                }
            };
        }

        function buildBackendPollingStatusPayload(entry) {
            return {
                provider: "blockbee",
                event: "withdrawal.status.polling",
                request_id: entry?.requestId || "",
                payout_id: entry?.payoutId || "",
                status: entry?.status || "processing",
                display_status: entry?.displayStatus || "Pending Payment",
                coin: entry?.coin || BLOCKBEE_USDT_BSC_TICKER,
                txid: entry?.txid || "",
                error: entry?.error || "",
                queued: Boolean(entry?.queued),
                updated_at: new Date().toISOString()
            };
        }

        function buildBackendWebhookStatusPayload(entry) {
            return {
                provider: "blockbee",
                event: "withdrawal.status.webhook",
                request_id: entry?.requestId || "",
                payout_info: {
                    id: entry?.payoutId || "",
                    status: entry?.status || "processing",
                    display_status: entry?.displayStatus || "Pending Payment",
                    coin: entry?.coin || BLOCKBEE_USDT_BSC_TICKER,
                    txid: entry?.txid || "",
                    error: entry?.error || null,
                    total_requested: entry?.toAmount || "0.00",
                    total_with_fee: entry?.payoutResponse?.total_with_fee || entry?.toAmount || "0.00",
                    fee: entry?.payoutResponse?.fee || "",
                    blockchain_fee: entry?.payoutResponse?.blockchain_fee || "",
                    webhook_logs: entry?.payoutResponse?.webhook_logs || [],
                    timestamp: new Date().toISOString()
                },
                queued: Boolean(entry?.queued)
            };
        }

        function getBlockBeeBackendContractExamples() {
            const sampleWithdrawal = {
                request_id: "BB-WREQ-20260707-0001",
                walletId: "wallet_primary",
                walletLabel: "Carteira Principal",
                walletAddress: "0x2990c6d41ce608c9a140b10ae6f89276b90e52f9",
                fromAmount: 100,
                toAmount: 1,
                status: "queued_for_backend"
            };

            const createPayoutRequest = buildBlockBeeWithdrawalBackendPayload(sampleWithdrawal);
            const pollingProcessing = {
                provider: "blockbee",
                event: "withdrawal.status.polling",
                request_id: "BB-WREQ-20260707-0001",
                payout_id: "BB-PAYOUT-20260707-0001",
                status: "processing",
                display_status: "Pending Payment",
                coin: BLOCKBEE_USDT_BSC_TICKER,
                txid: "",
                error: "",
                queued: true,
                updated_at: "2026-07-07T18:30:00.000Z"
            };
            const webhookDone = {
                provider: "blockbee",
                event: "withdrawal.status.webhook",
                request_id: "BB-WREQ-20260707-0001",
                payout_info: {
                    id: "BB-PAYOUT-20260707-0001",
                    status: "done",
                    display_status: "Concluido",
                    coin: BLOCKBEE_USDT_BSC_TICKER,
                    txid: "0xblockbeedonetxidexample",
                    error: null,
                    total_requested: "1.00",
                    total_with_fee: "1.001",
                    fee: "0.001",
                    blockchain_fee: "0E-18",
                    webhook_logs: [],
                    timestamp: "2026-07-07T18:35:12.000Z"
                },
                queued: false
            };

            return {
                version: BLOCKBEE_BACKEND_CONTRACT_VERSION,
                createPayoutRequest,
                pollingProcessing,
                webhookDone
            };
        }

        function buildMockBlockBeePayoutRequestApiResponse(request) {
            return {
                status: "success",
                request_id: request.request_id || createMockBlockBeeRequestId("BB-WREQ")
            };
        }

        function buildMockBlockBeePayoutApiResponse(normalizedRequest) {
            return {
                status: "success",
                queued: true,
                payout_info: {
                    id: createMockBlockBeeRequestId("BB-PAYOUT"),
                    status: "processing",
                    display_status: "Pending Payment",
                    from: "",
                    requests: {
                        [normalizedRequest.address]: normalizedRequest.value.toFixed(2)
                    },
                    total_requested: normalizedRequest.value.toFixed(2),
                    total_with_fee: (normalizedRequest.value + 0.001).toFixed(3),
                    error: null,
                    blockchain_fee: "0E-18",
                    fee: "0.001",
                    coin: BLOCKBEE_USDT_BSC_TICKER,
                    txid: "",
                    timestamp: new Date().toLocaleString("pt-BR"),
                    webhook_logs: []
                }
            };
        }

        function normalizeBlockBeeWithdrawalRequestResponse(apiResponse, fallbackRequest) {
            const requestId = String(
                apiResponse?.request_id ||
                apiResponse?.id ||
                fallbackRequest?.request_id ||
                createMockBlockBeeRequestId("BB-WREQ")
            );

            return {
                request_id: requestId,
                payout_id: apiResponse?.payout_id || null,
                status: String(apiResponse?.status || fallbackRequest?.status || "queued_for_backend"),
                display_status: String(
                    apiResponse?.display_status ||
                    BLOCKBEE_WITHDRAWAL_STATUSES[apiResponse?.status] ||
                    BLOCKBEE_WITHDRAWAL_STATUSES[fallbackRequest?.status] ||
                    "Na fila do backend"
                ),
                address: String(apiResponse?.address || fallbackRequest?.walletAddress || ""),
                value: Number(apiResponse?.value ?? fallbackRequest?.toAmount ?? 0),
                coin: String(apiResponse?.coin || BLOCKBEE_USDT_BSC_TICKER),
                txid: String(apiResponse?.txid || ""),
                backend_payload: fallbackRequest?.backend_payload || null,
                meta: {
                    walletLabel: fallbackRequest?.walletLabel || "",
                    walletAddress: fallbackRequest?.walletAddress || "",
                    fromAmountGbc: fallbackRequest?.fromAmount || 0,
                    toAmountUsdt: Number((fallbackRequest?.toAmount || 0).toFixed ? fallbackRequest.toAmount.toFixed(2) : fallbackRequest?.toAmount || 0)
                }
            };
        }

        function normalizeBlockBeePayoutRequestResponse(apiResponse, fallbackRequest) {
            const normalizedRequest = normalizeBlockBeeWithdrawalRequestResponse(apiResponse, fallbackRequest);
            normalizedRequest.status = apiResponse?.status === "success"
                ? "payout_request_created"
                : normalizedRequest.status;
            normalizedRequest.display_status = apiResponse?.status === "success"
                ? BLOCKBEE_WITHDRAWAL_STATUSES.payout_request_created
                : normalizedRequest.display_status;
            normalizedRequest.provider = "BlockBee";
            normalizedRequest.ticker = BLOCKBEE_USDT_BSC_TICKER;
            return normalizedRequest;
        }

        function normalizeBlockBeePayoutResponse(apiResponse, payoutRequestResponse) {
            const payoutInfo = apiResponse?.payout_info || {};
            const payoutStatus = String(payoutInfo.status || (apiResponse?.status === "success" ? "payout_created" : "error"));
            const uiStatus = payoutStatus === "created" ? "payout_created" : payoutStatus;

            return {
                payout_id: String(payoutInfo.id || createMockBlockBeeRequestId("BB-PAYOUT")),
                request_id: String(payoutRequestResponse?.request_id || ""),
                status: uiStatus,
                display_status: String(
                    payoutInfo.display_status ||
                    BLOCKBEE_WITHDRAWAL_STATUSES[uiStatus] ||
                    "Processando payout"
                ),
                queued: Boolean(apiResponse?.queued ?? false),
                coin: String(payoutInfo.coin || BLOCKBEE_USDT_BSC_TICKER),
                txid: String(payoutInfo.txid || ""),
                total_requested: Number(payoutInfo.total_requested ?? payoutRequestResponse?.value ?? 0),
                total_with_fee: Number(payoutInfo.total_with_fee ?? payoutRequestResponse?.value ?? 0),
                fee: String(payoutInfo.fee || ""),
                blockchain_fee: String(payoutInfo.blockchain_fee || ""),
                error: payoutInfo.error || "",
                requests: payoutInfo.requests || {},
                timestamp: String(payoutInfo.timestamp || ""),
                webhook_logs: Array.isArray(payoutInfo.webhook_logs) ? payoutInfo.webhook_logs : []
            };
        }

        function getWithdrawalHistoryEntries() {
            return Array.isArray(gameState.settings?.withdrawalHistory) ? gameState.settings.withdrawalHistory : [];
        }

        function getHistoryEntryNumericMeta(entry) {
            const metadata = entry?.backendPayload?.metadata || {};
            return {
                fromAmountGbc: Number(metadata.from_amount_gbc || 0),
                toAmountUsdt: Number(metadata.to_amount_usdt || 0)
            };
        }

        function findWithdrawalHistoryEntryIndex(requestId = "", payoutId = "") {
            const history = getWithdrawalHistoryEntries();
            return history.findIndex((entry) => {
                if (entry?.type !== "withdrawal") return false;
                const matchesRequest = requestId && entry.requestId === requestId;
                const matchesPayout = payoutId && entry.payoutId === payoutId;
                return matchesRequest || matchesPayout;
            });
        }

        function handleTerminalWithdrawalStatus(previousEntry, nextEntry) {
            const status = nextEntry?.status;
            const wasTerminal = ["done", "error", "rejected"].includes(previousEntry?.status);
            if (wasTerminal || !["done", "error", "rejected"].includes(status)) {
                return nextEntry;
            }

            const numericMeta = getHistoryEntryNumericMeta(previousEntry);

            if ((status === "error" || status === "rejected") && !previousEntry?.compensationApplied) {
                gameState.player.gbc += numericMeta.fromAmountGbc;
                gameState.statistics.totalSwappedUsdt = Math.max(0, gameState.statistics.totalSwappedUsdt - numericMeta.toAmountUsdt);
                nextEntry.compensationApplied = true;
                nextEntry.compensatedAt = Date.now();
                nextEntry.displayStatus = `${nextEntry.displayStatus} • saldo devolvido`;
            }

            if (status === "done") {
                nextEntry.completedAt = Date.now();
            }

            return nextEntry;
        }

        function syncWithdrawalHistoryEntry(requestId, payoutResponse = {}) {
            const resolvedRequestId = String(requestId || payoutResponse?.request_id || "");
            const resolvedPayoutId = String(payoutResponse?.payout_id || payoutResponse?.payout_info?.id || "");
            const history = [...getWithdrawalHistoryEntries()];
            const targetIndex = findWithdrawalHistoryEntryIndex(resolvedRequestId, resolvedPayoutId);

            if (targetIndex === -1) return null;

            const previousEntry = history[targetIndex];
            const nextEntry = {
                ...previousEntry,
                status: payoutResponse?.status || previousEntry.status,
                displayStatus: payoutResponse?.display_status || previousEntry.displayStatus,
                requestId: resolvedRequestId || previousEntry.requestId,
                payoutId: resolvedPayoutId || previousEntry.payoutId,
                txid: payoutResponse?.txid || previousEntry.txid || "",
                queued: typeof payoutResponse?.queued === "boolean" ? payoutResponse.queued : previousEntry.queued,
                coin: payoutResponse?.coin || previousEntry.coin || BLOCKBEE_USDT_BSC_TICKER,
                error: payoutResponse?.error || previousEntry.error || "",
                payoutResponse: {
                    ...(previousEntry.payoutResponse || {}),
                    ...payoutResponse
                },
                updatedAt: Date.now()
            };

            handleTerminalWithdrawalStatus(previousEntry, nextEntry);
            history[targetIndex] = nextEntry;
            gameState.settings.withdrawalHistory = history;
            saveGameData();
            renderSettings();
            renderInventario();
            renderMines();

            return nextEntry;
        }

        function applyBlockBeeWithdrawalStatusUpdate(apiResponse) {
            if (!apiResponse || typeof apiResponse !== "object") return null;

            const requestId = String(
                apiResponse.request_id ||
                apiResponse.internal_reference ||
                apiResponse.reference ||
                ""
            );

            const normalizedStatus = apiResponse.payout_info
                ? normalizeBlockBeePayoutResponse(apiResponse, { request_id: requestId })
                : normalizeBlockBeePayoutRequestResponse(apiResponse, { request_id: requestId });

            const syncedEntry = syncWithdrawalHistoryEntry(requestId || normalizedStatus.request_id, normalizedStatus);
            if (!syncedEntry) return null;

            if (normalizedStatus.status === "done") {
                showFeedback(t("swap.completed", { label: syncedEntry.destinationLabel }), "success");
            } else if (normalizedStatus.status === "processing" || normalizedStatus.status === "payout_created") {
                showFeedback(t("swap.updated", { status: normalizedStatus.display_status }), "info");
            } else if (normalizedStatus.status === "error" || normalizedStatus.status === "rejected") {
                showFeedback(t("swap.failed", { status: normalizedStatus.display_status }), "error");
            }

            return syncedEntry;
        }

        function copyTextToClipboard(text) {
            if (!text) return false;

            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                navigator.clipboard.writeText(text).catch(() => null);
                return true;
            }

            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            return true;
        }

        function syncSwapModeLayout() {
            const depositFlow = document.getElementById("deposit-blockbee-flow");
            const standardFlow = document.getElementById("swap-standard-flow");
            if (!depositFlow || !standardFlow) return;

            const depositMode = currentSwapEntryMode === "deposit";
            depositFlow.classList.toggle("hidden", !depositMode);
            standardFlow.classList.toggle("hidden", depositMode);
        }

        function clearDepositRequestCard() {
            activeDepositRequest = null;
            const card = document.getElementById("deposit-request-card");
            if (card) card.classList.add("hidden");
        }

        function syncDepositPreview() {
            const amountInput = document.getElementById("deposit-input-amount");
            const output = document.getElementById("deposit-output-preview");
            if (!amountInput || !output) return;

            const amount = parseFloat(amountInput.value) || 0;
            output.innerText = amount >= 5
                ? formatGameNumber(Math.max(0, amount * GAME_CONFIG.usdtToGbc))
                : "0";
            clearDepositRequestCard();
        }

        function renderDepositRequestCard(request) {
            const card = document.getElementById("deposit-request-card");
            const requestId = document.getElementById("deposit-request-id");
            const requestStatus = document.getElementById("deposit-request-status");
            const requestPaymentId = document.getElementById("deposit-request-payment-id");
            const requestStatusCode = document.getElementById("deposit-request-status-code");
            const requestQr = document.getElementById("deposit-request-qr");
            const requestAddress = document.getElementById("deposit-request-address");
            const requestAmount = document.getElementById("deposit-request-amount");
            const requestGbc = document.getElementById("deposit-request-gbc");
            const requestNetwork = document.getElementById("deposit-request-network");
            const requestPaymentUri = document.getElementById("deposit-request-payment-uri");

            if (!card || !requestId || !requestStatus || !requestPaymentId || !requestStatusCode || !requestQr || !requestAddress || !requestAmount || !requestGbc || !requestNetwork || !requestPaymentUri) return;

            requestId.innerText = request.payment_id;
            requestStatus.innerText = request.status === "pending" ? t("swap.waitingPayment") : request.status;
            requestPaymentId.innerText = request.payment_id;
            requestStatusCode.innerText = request.status;
            requestAddress.innerText = request.address_in;
            requestAmount.innerText = `${request.meta.amount_usdt.toFixed(2)} USDT`;
            requestGbc.innerText = `${formatGameNumber(request.meta.gbc_credit)} GBC`;
            requestNetwork.innerText = "USDT • BSC / BEP20";
            requestPaymentUri.innerText = request.payment_uri;
            requestQr.src = request.qr_code;
            card.classList.remove("hidden");
        }

        function generateBlockBeeDepositRequest() {
            const amountInput = document.getElementById("deposit-input-amount");
            if (!amountInput) return;

            const amount = parseFloat(amountInput.value) || 0;
            if (amount < 5) {
                showFeedback(t("swap.minDepositWarning"), "warning");
                return;
            }

            const mockApiResponse = buildMockBlockBeeDepositApiResponse(amount);
            activeDepositRequest = normalizeBlockBeeDepositResponse(mockApiResponse);

            renderDepositRequestCard(activeDepositRequest);
            copyTextToClipboard(activeDepositRequest.address_in);
            showFeedback(t("swap.depositGenerated"), "success");
        }

        function copyDepositAddress() {
            if (!activeDepositRequest?.address_in) {
                showFeedback(t("swap.generateAddressFirst"), "warning");
                return;
            }

            copyTextToClipboard(activeDepositRequest.address_in);
            showFeedback(t("swap.depositWalletCopied"), "success");
        }

        function openDepositPaymentUri() {
            if (!activeDepositRequest?.payment_uri) {
                showFeedback(t("swap.generateValidRequestFirst"), "warning");
                return;
            }

            window.open(activeDepositRequest.payment_uri, "_blank", "noopener,noreferrer");
        }

        function openWalletModal() {
            document.getElementById("modal-wallet-actions")?.classList.remove("hidden");
        }

        function closeWalletModal() {
            document.getElementById("modal-wallet-actions")?.classList.add("hidden");
        }

        function openWalletAction(mode) {
            closeWalletModal();
            openSwapModal(mode);
        }

        // MODAL SWAP CONTROL
        function syncSwapModalMeta(currency) {
            const title = document.getElementById("swap-modal-title");
            const subtitle = document.getElementById("swap-modal-subtitle");
            const confirmButton = document.getElementById("swap-confirm-button");

            if (!title || !subtitle) return;

            if (currentSwapEntryMode === "deposit") {
                title.innerHTML = `<i class="fa-solid fa-arrow-down text-emerald-400"></i><span>${t("swap.depositTitle")}</span>`;
                subtitle.innerText = t("swap.depositSubtitle");
                return;
            }

            if (currentSwapEntryMode === "withdrawal") {
                title.innerHTML = `<i class="fa-solid fa-arrow-up text-sky-400"></i><span>${t("swap.withdrawalTitle")}</span>`;
                subtitle.innerText = t("swap.withdrawalSubtitle");
                if (!confirmButton) return;
                confirmButton.innerText = t("swap.requestWithdrawal");
                confirmButton.className = "w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-black py-3 rounded-xl shadow-md transition duration-200";
                return;
            }

            title.innerHTML = `<i class="fa-solid fa-arrow-right-arrow-left text-amber-500"></i><span>${t("swap.swapTitle")}</span>`;
            subtitle.innerText = currency === "USDT"
                ? t("swap.swapSubtitleBuy")
                : t("swap.swapSubtitleSell");
            if (!confirmButton) return;
            confirmButton.innerText = t("swap.confirmSwap");
            confirmButton.className = "w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl shadow-md transition duration-200";
        }

        function openSwapModal(mode = "swap") {
            currentSwapEntryMode = mode;
            document.getElementById("swap-from-currency").value = mode === "deposit" ? "USDT" : "GBC";
            document.getElementById("modal-swap").classList.remove("hidden");
            syncSwapModeLayout();
            syncDepositPreview();
            updateSwapPreview('from');
        }

        function openDepositModal() {
            openSwapModal("deposit");
        }

        function openWithdrawModal() {
            openSwapModal("withdrawal");
        }

        function closeSwapModal() {
            document.getElementById("modal-swap").classList.add("hidden");
            currentSwapEntryMode = "swap";
        }

        function updateSwapPreview(trigger) {
            const amountInput = document.getElementById("swap-input-amount");
            const selectCurrency = document.getElementById("swap-from-currency");
            const previewSpan = document.getElementById("swap-output-preview");
            const previewCurrencyText = document.getElementById("swap-output-currency-text");

            const value = parseFloat(amountInput.value) || 0;
            const currency = selectCurrency.value;

            if (
                trigger === "select" &&
                ((currentSwapEntryMode === "deposit" && currency !== "USDT") ||
                    (currentSwapEntryMode === "withdrawal" && currency !== "GBC"))
            ) {
                currentSwapEntryMode = "swap";
            }

            if (currency === "USDT") {
                // USDT para GnoCripto
                const converted = value * GAME_CONFIG.usdtToGbc;
                previewSpan.innerText = formatGameNumber(converted);
                previewCurrencyText.innerText = "GnoCripto";
            } else {
                // GnoCripto para USDT
                const converted = value / GAME_CONFIG.usdtToGbc;
                previewSpan.innerText = converted.toFixed(2);
                previewCurrencyText.innerText = "USDT (BSC)";
            }

            syncSwapDestinationInfo(currency);
            syncSwapModalMeta(currency);
        }

        function syncSwapDestinationInfo(currency) {
            const currentCurrency = currency || document.getElementById("swap-from-currency").value;
            const walletSummary = document.getElementById("swap-wallet-summary");
            const walletHelper = document.getElementById("swap-wallet-helper");
            const walletBadge = document.getElementById("swap-wallet-network");

            if (!walletSummary || !walletHelper || !walletBadge) return;

            if (currentCurrency === "USDT") {
                walletSummary.innerText = t("swap.internalPlatformBalance");
                walletHelper.innerText = t("swap.internalPlatformHelper");
                walletBadge.innerText = t("swap.swapInternal");
                return;
            }

            const wallet = getSelectedWallet();
            if (!wallet) {
                walletSummary.innerText = t("swap.noWalletConfigured");
                walletHelper.innerText = t("swap.configureWallet");
                walletBadge.innerText = "USDT • BSC";
                return;
            }

            walletSummary.innerText = `${wallet.label} • ${formatWalletAddress(wallet.address)}`;
            walletHelper.innerText = t("swap.withdrawalHelper");
            walletBadge.innerText = "USDT • BSC";
        }

        function openWithdrawalConfirmModal() {
            document.getElementById("modal-withdrawal-confirm").classList.remove("hidden");
        }

        function closeWithdrawalConfirmModal() {
            document.getElementById("modal-withdrawal-confirm").classList.add("hidden");
            pendingWithdrawalRequest = null;
        }

        function prepareWithdrawalConfirmation(value) {
            const wallet = getSelectedWallet();
            if (!wallet) {
                showFeedback(t("swap.configureAndSelectWallet"), "error");
                return;
            }

            if (gameState.player.gbc < value) {
                showFeedback(t("swap.insufficientGbc"), "error");
                return;
            }

            const convertedUsdt = value / GAME_CONFIG.usdtToGbc;
            pendingWithdrawalRequest = {
                request_id: createMockBlockBeeRequestId("BB-WREQ"),
                fromAmount: value,
                fromCurrency: "GBC",
                toAmount: convertedUsdt,
                toCurrency: "USDT",
                walletId: wallet.id,
                walletLabel: wallet.label,
                walletAddress: wallet.address,
                status: "queued_for_backend"
            };
            pendingWithdrawalRequest.backend_payload = buildBlockBeeWithdrawalBackendPayload(pendingWithdrawalRequest);

            document.getElementById("confirm-withdraw-amount-gbc").innerText = value.toLocaleString();
            document.getElementById("confirm-withdraw-amount-usdt").innerText = convertedUsdt.toFixed(2);
            document.getElementById("confirm-withdraw-wallet").innerText = `${wallet.label} • ${formatWalletAddress(wallet.address)}`;
            document.getElementById("confirm-withdraw-note").innerText = t("swap.backendRequestNote", { requestId: pendingWithdrawalRequest.request_id });

            openWithdrawalConfirmModal();
        }

        function confirmWithdrawalExecution() {
            if (!pendingWithdrawalRequest) return;

            const request = pendingWithdrawalRequest;
            const payoutRequestApiResponse = buildMockBlockBeePayoutRequestApiResponse(request);
            const normalizedPayoutRequest = normalizeBlockBeePayoutRequestResponse(payoutRequestApiResponse, request);
            const payoutApiResponse = buildMockBlockBeePayoutApiResponse(normalizedPayoutRequest);
            const normalizedPayout = normalizeBlockBeePayoutResponse(payoutApiResponse, normalizedPayoutRequest);

            gameState.player.gbc -= request.fromAmount;
            gameState.statistics.totalSwappedUsdt += request.toAmount;

            registerSwapTransaction({
                id: normalizedPayout.payout_id,
                type: "withdrawal",
                fromAmount: formatGameNumber(request.fromAmount),
                fromCurrency: request.fromCurrency,
                toAmount: request.toAmount.toFixed(2),
                toCurrency: request.toCurrency,
                destinationLabel: request.walletLabel,
                destinationAddress: request.walletAddress,
                createdAt: Date.now(),
                status: normalizedPayout.status,
                displayStatus: normalizedPayout.display_status,
                requestId: normalizedPayoutRequest.request_id,
                payoutId: normalizedPayout.payout_id,
                provider: "BlockBee",
                coin: normalizedPayout.coin,
                queued: normalizedPayout.queued,
                txid: normalizedPayout.txid,
                backendPayload: request.backend_payload,
                payoutRequestResponse: normalizedPayoutRequest,
                payoutResponse: normalizedPayout
            });

            playSoundCoin();
            saveGameData();
            closeWithdrawalConfirmModal();
            closeSwapModal();
            renderInventario();
            renderMines();
            renderSettings();
            updateSwapPreview("confirm");

            showFeedback(t("swap.withdrawalSent", {
                label: request.walletLabel,
                address: formatWalletAddress(request.walletAddress)
            }), "success");
        }

        function executeSwap() {
            if (currentSwapEntryMode === "deposit") {
                generateBlockBeeDepositRequest();
                return;
            }

            const amountInput = document.getElementById("swap-input-amount");
            const selectCurrency = document.getElementById("swap-from-currency");

            const value = parseFloat(amountInput.value) || 0;
            const currency = selectCurrency.value;

            if (value <= 0) {
                showFeedback(t("swap.valueMustBePositive"), "error");
                return;
            }

            if (currency === "USDT") {
                // Tenta trocar USDT por GnoCripto
                if (gameState.player.usdt < value) {
                    showFeedback(t("swap.insufficientUsdt"), "error");
                    return;
                }
                gameState.player.usdt -= value;
                gameState.player.gbc += (value * GAME_CONFIG.usdtToGbc);
                registerSwapTransaction({
                    id: `tx_${Date.now()}`,
                    type: "purchase",
                    fromAmount: value.toFixed(2),
                    fromCurrency: "USDT",
                    toAmount: formatGameNumber(value * GAME_CONFIG.usdtToGbc),
                    toCurrency: "GBC",
                    destinationLabel: t("swap.internalDestination"),
                    destinationAddress: "",
                    createdAt: Date.now()
                });
                showFeedback(t("swap.successPurchase", {
                    amount: value.toFixed(2),
                    gbc: formatGameNumber(value * GAME_CONFIG.usdtToGbc)
                }), "success");
                playSoundCoin();
                closeSwapModal();
                saveGameData();
                renderInventario();
                renderMines();
                renderSettings();
                return;
            }

            prepareWithdrawalConfirmation(value);
        }

        window.normalizeBlockBeeDepositResponse = normalizeBlockBeeDepositResponse;
        window.normalizeBlockBeePayoutRequestResponse = normalizeBlockBeePayoutRequestResponse;
        window.normalizeBlockBeePayoutResponse = normalizeBlockBeePayoutResponse;
        window.syncWithdrawalHistoryEntry = syncWithdrawalHistoryEntry;
        window.applyBlockBeeWithdrawalStatusUpdate = applyBlockBeeWithdrawalStatusUpdate;
        window.buildBlockBeeWithdrawalBackendPayload = buildBlockBeeWithdrawalBackendPayload;
        window.buildBackendPollingStatusPayload = buildBackendPollingStatusPayload;
        window.buildBackendWebhookStatusPayload = buildBackendWebhookStatusPayload;
        window.getBlockBeeBackendContractExamples = getBlockBeeBackendContractExamples;
        window.BLOCKBEE_BACKEND_CONTRACT = {
            version: BLOCKBEE_BACKEND_CONTRACT_VERSION,
            ticker: BLOCKBEE_USDT_BSC_TICKER,
            builders: {
                createPayoutRequest: buildBlockBeeWithdrawalBackendPayload,
                pollingUpdate: buildBackendPollingStatusPayload,
                webhookUpdate: buildBackendWebhookStatusPayload
            },
            normalizers: {
                payoutRequest: normalizeBlockBeePayoutRequestResponse,
                payout: normalizeBlockBeePayoutResponse
            },
            statusUpdater: applyBlockBeeWithdrawalStatusUpdate,
            examples: getBlockBeeBackendContractExamples()
        };
