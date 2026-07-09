        const I18N_TRANSLATIONS = {
            "pt-BR": {
                app: {
                    title: "GnoMiner — Gnomos da Mina Tycoon MVP",
                    lang: "pt-BR"
                },
                language: {
                    changed: "Idioma selecionado: {language}.",
                    names: {
                        "pt-BR": "Português",
                        en: "English",
                        es: "Español"
                    }
                },
                topbar: {
                    level: "Nível",
                    toggleAudio: "Alternar Som",
                    openSettings: "Abrir Configurações",
                    language: "Idioma",
                    wallet: "Wallet"
                },
                nav: {
                    mines: "Minas",
                    shop: "Loja",
                    inventory: "Inventário",
                    affiliates: "Afiliados",
                    missions: "Missões"
                },
                alert: {
                    activeCrisis: "Aviso de Evento de Crise Ativo!",
                    resolve: "Resolver Evento!"
                },
                tutorial: {
                    title: "Guia de Início Rápido (Tutorial)",
                    copy: "Bem-vindo, supervisor! Comece comprando Energia e contratando o gnomo <strong>Gnorin</strong> na loja para automatizar a <strong>Mina 1</strong>. Colete recursos brutos para desbloquear as próximas minas e acumular GnoCriptos para trocar por USDT real!",
                    dismiss: "Entendi, ocultar!",
                    hidden: "Tutorial ocultado. Você pode jogar livremente!"
                },
                mines: {
                    advisorTitle: "Balanceador Automático de Investimento",
                    advisorCalculating: "Calculando dados de eficiência das suas minas...",
                    active: "Ativa",
                    broken: "Quebrada",
                    noEnergy: "Sem Energia",
                    noTeam: "Sem Equipe",
                    shiftClosed: "Turno Fechado",
                    auto: "Auto",
                    shift6h: "Turno de 6h",
                    cycle6h: "Ciclo de 6h",
                    readings: "leituras",
                    partialChest: "Baú parcial",
                    pendingOre: "{value} minérios pendentes",
                    dailyRoi: "ROI diário",
                    rangePerDay: "Faixa {min}-{max} GBC/dia",
                    gnomes: "Gnomos ({count}/{capacity})",
                    noGnomeWorking: "Nenhum gnomo trabalhando",
                    nextReading: "Próxima leitura",
                    fullShift: "Turno completo",
                    automation: "Automação",
                    manual: "Manual",
                    unlockFor: "Desbloquear por",
                    repairMine: "Reparar Mina (Dano Estrutural)",
                    closeShiftRestart: "Fechar Turno e Reiniciar",
                    restartShift: "Reiniciar Turno",
                    collectWindow: "Coletar Janela (+{value} GBC)",
                    assignToStart: "Aloque gnomos para começar",
                    recoverEnergy: "Recupere energia para retomar",
                    nextReadingIn: "Próxima leitura em {time}",
                    live: "LIVE",
                    moveGnomes: "Mudar Gnomos",
                    liveNoTeam: "Sem equipe ativa. Aloque gnomos para ver a frente trabalhando ao vivo.",
                    clanWorker: "Operário do clã",
                    tools: {
                        drill: "Broca",
                        hammer: "Marreta",
                        pickaxe: "Picarete"
                    },
                    workerSets: {
                        gnorin: "Pico-Martelete",
                        bortok: "Marreta Titã",
                        zeldrik: "Kit Turbo",
                        faggro: "Martelo Tático",
                        nyra: "Martelo Estelar"
                    },
                    workerFlair: {
                        gnorin: "Batida constante, limpa e sempre no veio certo.",
                        bortok: "Golpe pesado de chefe para abrir a frente no bruto.",
                        zeldrik: "Conjunto premium de engenharia para perfuração precisa.",
                        faggro: "Impacto arriscado e rápido em busca do drop raro.",
                        nyra: "Ritmo lendário com impacto elegante e comando total."
                    },
                    liveShiftRhythm: "{role} em ritmo de turno 6h.",
                    liveReadyNoTeam: "A frente está pronta, mas sem equipe ativa no túnel.",
                    liveNoEnergy: "A frente está sem energia. Recarregue para retomar a mineração.",
                    liveBroken: "A operação foi interrompida por dano estrutural.",
                    livePulseProfit: "Pulso atual: +{value} GBC | próxima leitura em {time}.",
                    livePulseDry: "Pulso atual: janela sem lucro | próxima leitura em {time}.",
                    liveAutoActive: "Auto ativo • {time}",
                    liveManualCollection: "Coleta manual",
                    dailyGoal: "Meta diária",
                    dailyGoalCopy: "A frente libera entre {minRate}% e {maxRate}% ao dia. O valor exato sobe com estrelas, ocupação e upgrades.",
                    shift6hTitle: "Turno de 6 horas",
                    shift6hCopy: "Próxima leitura em {time}. Você pode coletar de 5 em 5 minutos ou só no fechamento do turno.",
                    pendingLoad: "Carga pendente",
                    oresLabel: "{value} minérios",
                    shiftClosedCopy: "Turno fechado. Colete e reinicie, ou deixe o coletor automático fazer isso.",
                    accumulatingCopy: "Os gnomos seguem acumulando material até a próxima coleta.",
                    advice: {
                        harmony: "Suas minas estão operando em harmonia perfeita! Continue coletando.",
                        none: "Nenhuma mina operacional ativa. Desbloqueie a primeira para começar!",
                        broken: "⚠ ATENÇÃO: A <strong>{name}</strong> está parada por danos de ruptura! Repare-a imediatamente!",
                        autoCollector: "🤖 Há turnos encerrados aguardando coleta manual. O Coletor Automático por 7 dias mantém as minas reiniciando sozinhas e reduz ociosidade.",
                        lowEnergy: "⚡ Energia extremamente baixa! O clã precisa de pacotes de energia para continuar as extrações.",
                        occupancy: "🛠 A <strong>{name}</strong> possui vagas livres para trabalhadores ({allocated}/{capacity} gnomos). Aloque gnomos nela para otimizar o rendimento!",
                        stars: "🚀 Sugestão: Aumente as estrelas da <strong>{name}</strong> para o nível {level} para otimizar dividendos acumulados de GBC."
                    },
                    actions: {
                        repairNow: "Consertar Agora",
                        activateCollector: "Ativar Coletor",
                        buyEnergy: "Comprar Energia",
                        moveGnomes: "Mudar Gnomos",
                        upgradeStar: "Subir Estrela ({cost} GBC)"
                    },
                    unlockErrors: {
                        insufficientGbc: "GnoCriptos insuficientes para desbloquear esta mina!",
                        requirements: "Requisitos não atingidos! Requer Nível {level} + {amount} {resource}.",
                        unlocked: "{name} desbloqueada com sucesso! Contrate gnomos para começar."
                    },
                    upgradeErrors: {
                        insufficientGbc: "GnoCriptos insuficientes para evoluir a estrela desta mina!",
                        upgraded: "Estrela da {name} evoluída para nível {level}! Produção aumentada em +10%."
                    },
                    allocation: {
                        empty: "Você ainda não tem Gnomos ativos. Vá até a Loja para contratar sua primeira equipe!",
                        deallocate: "Desalocar",
                        moveFrom: "Mover da {name}",
                        work: "Trabalhar",
                        title: "Supervisão da {name}",
                        subtitle: "Gerencie quais gnomos estão ativos extraindo riquezas desta mina. Capacidade máxima: {capacity} gnomos.",
                        closePanel: "Fechar Painel",
                        capacityReached: "Esta mina já atingiu a capacidade máxima de gnomos!",
                        allocated: "Trabalhador alocado com sucesso!",
                        idle: "Trabalhador movido para o ócio."
                    },
                    collect: {
                        notReady: "Ainda não há leitura liberada para coleta. Aguarde a próxima janela de 5 minutos."
                    },
                    repair: {
                        insufficientGbc: "GnoCriptos insuficientes para fazer reparo de urgência!",
                        success: "O clã de engenheiros consertou a {name}! Pronto para a extração."
                    },
                    events: {
                        frontRupture: "Ruptura na Frente de Mina",
                        wornOut: "⚠ {name} sofreu desgaste no fechamento do turno e precisa de reparo para voltar ao pico."
                    },
                    reward: {
                        oreText: " +{value} minérios",
                        collectibleJoiner: " e {items}",
                        autoPrefix: "🤖 Coletor automático",
                        collectPrefix: "⛏ Coleta",
                        summary: "{prefix} da {name}: +{gbc} GBC{resourceText}{collectibleText}."
                    },
                    offlineSummary: "⏱ Você ficou fora por {time}. As minas avançaram {pulseText} e {cycleText}{stashText}.",
                    offlinePulseSingle: "1 pulso de 5 min",
                    offlinePulsePlural: "{count} pulsos de 5 min",
                    offlineCycleSingle: "1 fechamento de turno de 6h",
                    offlineCyclePlural: "{count} fechamentos de turno de 6h",
                    offlineStash: " e acumularam +{gbc} GBC no stash",
                    levelUp: {
                        feedback: "🎉 Incrível! Você avançou para o NÍVEL {level}! Novas melhorias estão disponíveis na loja."
                    },
                    autoCollectorInactive: "Inativo",
                    autoCollectorRemaining: "{days}d {hours}h restantes"
                },
                shop: {
                    title: "Mercado do Clã",
                    subtitle: "Gerencie e contrate recursos vitais de mineração. Clique em qualquer Gnomo para ver sua ficha detalhada de habilidades!",
                    yourEnergy: "Sua Energia",
                    tabs: {
                        gnomes: "Gnomos",
                        gear: "Equipar",
                        supplies: "Suprimentos"
                    },
                    detail: "Ficha",
                    hire: "Contratar",
                    techSheet: "Ver ficha técnica",
                    contract: "Contrato ({days} dias)",
                    uniqueCost: "Custo Único",
                    buy: "Comprar",
                    levelOwned: "Nível atual adquirido",
                    statusCurrent: "Status atual",
                    active: "Ativo",
                    inactive: "Inativo",
                    rent7days: "Aluguel 7 dias",
                    renew: "Renovar",
                    activate: "Ativar",
                    drillName: "Broca Reforçada",
                    drillDesc: "Aumenta a eficiência e rendimento base de todas as minas ativas em +5%.",
                    engineName: "Motor Eficiente",
                    engineDesc: "Reduz o consumo de energia em todas as coletas por ciclo em -1.5 de energia.",
                    railcarName: "Vagonete Reforçado",
                    railcarDesc: "Garante +5% de chance de encontrar fragmentos colecionáveis e materiais extras raros.",
                    collectorName: "Coletor Automático",
                    collectorDesc: "Aluga por 7 dias um coletor que fecha o turno de 6h, guarda o que foi minerado e reinicia a frente sozinho.",
                    batteryCompact: "Bateria de Fusão Compacta",
                    batteryCompactDesc: "Recarrega instantaneamente 25% de energia das minas.",
                    batteryMax: "Célula Térmica Máxima",
                    batteryMaxDesc: "Recarga total de 100% da matriz energética.",
                    errors: {
                        insufficientHire: "GnoCriptos insuficientes para contratar este gnomo!",
                        insufficientGear: "GnoCriptos insuficientes para adquirir esta melhoria tecnológica!",
                        insufficientEnergy: "GnoCriptos insuficientes para suprimento de energia!",
                        energyFull: "A rede de energia já está com capacidade total!"
                    },
                    success: {
                        hired: "{name} contratado com sucesso! Aloque-o em uma mina para iniciar os trabalhos.",
                        gearInstalled: "Melhoria de infraestrutura adquirida e instalada em todas as minas!",
                        collectorActivated: "Coletor automático ativado por 7 dias. As minas passam a reiniciar sozinhas ao fim do turno.",
                        energyRecharged: "Recarga de energia efetuada! +{qty}% adicionado."
                    }
                },
                inventory: {
                    title: "Armazém de Recursos",
                    subtitle: "Materiais minerados bruto e fragmentos cripto temáticos colecionados.",
                    rawTitle: "Minérios Extraídos",
                    collectibleTitle: "Fragmentos Temáticos Colecionáveis",
                    gearTitle: "Sua Infraestrutura e Equipamentos",
                    level: "Nível",
                    effects: {
                        drill: "+{value}% Produção Geral",
                        engine: "-{value} Energia por ciclo",
                        railcar: "+{value}% Chance Fragmento Raro"
                    }
                },
                referrals: {
                    title: "Residual & Programa de Afiliados",
                    subtitle: "Multiplique os lucros com rede multinível de indicação virtual (até 8 níveis).",
                    yourLink: "Seu Link",
                    copyLink: "Copiar Link",
                    leadershipRank: "Grau de Patente de Liderança",
                    rankCopy: "Sua comissão residual aumenta progressivamente com base no volume de vendas indicado. Aumente seu volume de indicação para avançar de Gno1 a Gno5!",
                    volumeAccumulated: "Volume Indicado Acumulado",
                    directLevel: "1º Nível (Diretos)",
                    level23: "2º ao 3º Nível",
                    level48: "4º ao 8º Nível",
                    nextRank: "Próxima Patente",
                    networkTitle: "Painel de Indicados Ativos (Simulação de Rede)",
                    networkSubtitle: "Use o simulador abaixo para gerar amigos e receber residuais em tempo real.",
                    inviteSimulated: "Convidar Amigo Simulado",
                    table: {
                        friend: "Amigo",
                        lineLevel: "Nível de Linha",
                        dailyYield: "Rendimento Diário",
                        activeVolume: "Volume Ativo",
                        yourCommission: "Sua Comissão (Residual)",
                        empty: "Nenhum convidado simulado ainda. Clique para convidar acima!",
                        residualLevel: "Nível {line} (Residual)",
                        received: "Recebido"
                    },
                    rates: {
                        residual: "{rate} Residual"
                    },
                    copied: "Link de indicação copiado para a Área de Transferência!",
                    invited: "Convidado Simulado {name} entrou no nível {line}! Residual de rede ativado!"
                },
                wheel: {
                    title: "Roleta da Fortuna de GnoCripto",
                    subtitle: "Gire uma vez gratuitamente a cada rodada de jogo para coletar suprimentos!",
                    spin: "Girar e Revelar!",
                    surpriseResult: "Resultado Surpresa",
                    waitingSpin: "Aguardando giro",
                    hiddenPrize: "O prêmio real só aparece quando a roleta parar.",
                    laneHidden: "Faixa parada: oculto",
                    lane: "Cor: {color} • Item: {item}",
                    coolingDown: "Aguarde o resfriamento da roleta da sorte!",
                    revealing: "Revelando surpresa",
                    spinning: "Girando",
                    pendingLane: "Faixa parada: oculto",
                    feedback: "🎰 Roleta da Fortuna: {text}",
                    segments: {
                        gbcBag: "Bolsa GBC",
                        gbcBagTitle: "Bolsa revelada",
                        vitalLoad: "Carga Vital",
                        vitalLoadTitle: "Carga de energia",
                        turboBox: "Caixa Turbo",
                        turboBoxTitle: "Caixa turbo",
                        bscReserve: "Reserva BSC",
                        bscReserveTitle: "Reserva em USDT",
                        fog: "Névoa",
                        fogTitle: "Névoa da sorte",
                        jackpot: "Jackpot",
                        jackpotTitle: "Jackpot do clã",
                        amber: "Âmbar",
                        blue: "Azul",
                        pink: "Rosa",
                        green: "Verde",
                        gray: "Cinza",
                        gold: "Dourado",
                        noGain: "Sem ganho"
                    }
                },
                missionUi: {
                    activeBoardTitle: "Quadro de Missões Ativas",
                    activeBoardCopy: "Avance por várias fases, acompanhe o progresso e colete cada recompensa no momento certo.",
                    globalStatsTitle: "Conquistas e Estatísticas Globais",
                    globalStatsCopy: "Marcos e marcas históricas da sua administração nas minas.",
                    readyToClaim: "Missão pronta para coleta: {phase} de \"{title}\".",
                    completedAll: "Missão \"{title}\" concluída por completo! Recompensa final: +{reward} GBC.",
                    rewardClaimed: "Recompensa coletada em \"{title}\" ({phase}): +{reward} GBC.",
                    claimed: "Coletado",
                    collectPrize: "Coletar Prêmio",
                    inProgress: "Em andamento",
                    locked: "Bloqueada",
                    phaseTrail: "Trilha de fases",
                    boardDone: "Quadro concluído",
                    boardDoneCopy: "Todas as fases foram coletadas. Aguarde a próxima rodada de objetivos.",
                    noNextPhase: "Sem próxima fase",
                    noNextPhaseCopy: "Esse quadro já foi concluído por completo.",
                    lastPhase: "Última fase na pista",
                    lastPhaseCopy: "Finalize e colete a fase atual para fechar esse quadro.",
                    phasePrize: "Prêmio desta fase",
                    nextPrize: "Próximo prêmio",
                    status: "Status",
                    nextPhaseUnlock: "A próxima fase é desbloqueada automaticamente assim que a fase atual for coletada.",
                    finalReward: "Recompensa final",
                    everythingClaimed: "Tudo coletado",
                    finishBoard: "Feche o quadro para ganhar tudo",
                    finalized: "Finalizado",
                    remainingGbc: "{value} GBC restantes",
                    boardTotal: "Total do quadro",
                    xpTotal: "+{value} XP no total",
                    xpDistributed: "XP distribuído nas fases",
                    toReceive: "A receber",
                    noPending: "Sem pendências",
                    xpRemaining: "{value} XP restante",
                    phasesClaimed: "{claimed}/{total} fases coletadas",
                    boardPercent: "{value}% do quadro",
                    currentPhase: "Fase atual",
                    finished: "Finalizada",
                    noPendingPrize: "Sem prêmio pendente",
                    currentTab: "Fase atual",
                    nextTab: "Próxima",
                    finalTab: "Final",
                    missionTrail: "Trilha de missão",
                    stats: {
                        totalMined: "Total Minerado",
                        swappedUsdt: "Swap USDT",
                        luckySpins: "Giros Sorte",
                        currentRank: "Patente Atual"
                    },
                    crisis: {
                        alert: "🚨 ALERTA GERAL: Ocorreu um evento de <strong>{type}</strong>! Resolva para restabelecer produção integral.",
                        insufficient: "GnoCriptos insuficientes para agir e estancar a crise!",
                        resolved: "Excelente! A crise foi resolvida e seus gnomos voltaram ao trabalho regular."
                    }
                },
                audio: {
                    enabled: "Ativado",
                    disabled: "Desativado",
                    enabledFeedback: "Sons ativados",
                    disabledFeedback: "Sons desativados"
                },
                settings: {
                    platformTitle: "Configurações da Plataforma",
                    platformCopy: "Gerencie sua carteira de saque, preferências de som e ações sensíveis da conta.",
                    withdrawalsEnabled: "Saques habilitados:",
                    walletIntro: "Cadastre varias carteiras USDT na rede BSC, escolha a carteira ativa e use essa selecao no momento do saque.",
                    currentDestination: "Destino atual",
                    preferencesTitle: "Preferências",
                    preferencesCopy: "Ajustes rápidos para a sua experiência dentro do painel.",
                    soundEffects: "Efeitos Sonoros",
                    soundEffectsCopy: "Controla feedbacks de coleta, upgrade, alerta e roleta.",
                    toggleSound: "Alternar Som",
                    historyTitle: "Historico de Transacoes",
                    historyCopy: "Registra compras de GnoCripto e saques em USDT BSC executados no painel.",
                    securityTitle: "Segurança e Dados",
                    securityCopy: "Ações críticas do perfil e do progresso da conta local.",
                    resetLocal: "Redefinir progresso local",
                    resetLocalCopy: "Apaga o estado salvo no navegador e reinicia minas, inventário, missões e saldo do MVP.",
                    resetGame: "Redefinir Jogo",
                    walletMain: "Carteira Principal",
                    withdrawalWallet: "Carteira de Saque",
                    walletName: "Nome da Carteira",
                    walletNamePlaceholder: "Ex.: Carteira Principal",
                    walletAddress: "Endereço da Carteira",
                    cancel: "Cancelar",
                    registeredWallets: "Carteiras Cadastradas",
                    noWalletConfigured: "Nenhuma carteira configurada",
                    noWalletRegistered: "Nenhuma carteira cadastrada",
                    addFirstWallet: "Adicione sua primeira carteira USDT na rede BSC para liberar os saques.",
                    active: "Ativa",
                    walletInUse: "Carteira em Uso",
                    useForWithdrawal: "Usar no Saque",
                    edit: "Editar",
                    delete: "Excluir",
                    withdrawalRequestTitle: "Solicitação de Saque em USDT",
                    purchaseTitle: "Compra de GnoCripto",
                    nextTransactions: "Os próximos swaps e saques aparecerão aqui.",
                    noTransactions: "Nenhuma transação registrada",
                    internalSwap: "Swap Interno",
                    source: "Origem",
                    destination: "Destino",
                    destinationWallet: "Carteira de Destino",
                    internalBalance: "Saldo interno",
                    status: "Status",
                    requestId: "Request ID",
                    payoutId: "Payout ID",
                    remainingProcessing: "Em processamento",
                    currentWalletNone: "Nenhuma carteira configurada para saque",
                    currentWalletHint: "Os saques de USDT via Swap serão enviados para a carteira ativa selecionada abaixo.",
                    currentWalletHintEmpty: "Cadastre ao menos uma carteira USDT na rede BSC para liberar saques.",
                    addWallet: "Adicionar Carteira",
                    saveChanges: "Salvar Alterações",
                    askWalletBeforeSaving: "Informe a carteira de saque antes de salvar.",
                    invalidWallet: "Informe um endereço compatível com carteira USDT na rede BSC/BEP20.",
                    duplicatedWallet: "Essa carteira ja esta cadastrada na lista.",
                    walletSaved: "Carteira de saque salva com sucesso.",
                    walletActivated: "{label} definida como carteira ativa de saque.",
                    removeWalletConfirm: "Deseja remover a carteira \"{label}\" da lista de saques?",
                    walletDeleted: "Carteira removida com sucesso."
                },
                statuses: {
                    queued_for_backend: "Na fila do backend",
                    payout_created: "Payout criado",
                    processing: "Processando payout",
                    done: "Pago com sucesso",
                    error: "Erro no payout",
                    rejected: "Saque rejeitado"
                },
                swap: {
                    walletActionTitle: "Wallet",
                    walletActionCopy: "Escolha a operacao que deseja abrir no painel financeiro do MVP.",
                    walletActionDepositTitle: "1. Deposito",
                    walletActionDepositCopy: "Converte USDT em GnoCripto e envia o valor para o saldo interno do jogo.",
                    walletActionWithdrawalTitle: "2. Saque",
                    walletActionWithdrawalCopy: "Converte GnoCripto em USDT e usa a carteira BSC ativa cadastrada em Configuracoes.",
                    walletActionSwapTitle: "3. Swap",
                    walletActionSwapMode: "Modo geral",
                    walletActionSwapCopy: "Abre o conversor geral para alternar entre deposito e saque dentro do mesmo modal.",
                    depositTitle: "Deposito via BlockBee",
                    depositSubtitle: "Somente USDT BSC (BEP-20). Informe o valor, gere o QR e envie para o endereco de deposito retornado ao usuario.",
                    depositNetwork: "Rede de Deposito",
                    depositFlowCopy: "Fluxo preparado para integracao futura com BlockBee via backend.",
                    depositAmountLabel: "Valor do Deposito em USDT",
                    depositMinCopy: "O usuario deve informar no minimo US$ 5.00.",
                    depositCreditPreview: "Credito Previsto no Jogo",
                    blockbeeNote: "BlockBee: na fase com backend, a aplicacao chamara a API no servidor para criar a solicitacao de deposito, obter endereco/QR e validar o pagamento por webhook. A API key nao fica exposta no front-end.",
                    generateDeposit: "Gerar Deposito BlockBee",
                    generatedRequest: "Solicitacao Gerada",
                    copyWallet: "Copiar Carteira",
                    exactAmount: "Valor Exato",
                    confirmedCredit: "Credito Apos Confirmacao",
                    futureUxCopy: "MVP ajustado para UX futura da BlockBee. Quando o backend entrar, este card recebera o endereco/QR reais retornados pela API e o saldo sera creditado somente apos confirmacao do pagamento.",
                    openPaymentUri: "Abrir payment_uri",
                    awaitingPayment: "Aguardando pagamento",
                    source: "Origem",
                    destination: "Destino",
                    sourceAsset: "Origem do Ativo",
                    destinationAsset: "Destino do Ativo (Simulado)",
                    withdrawalDestination: "Destino do Saque",
                    changeInSettings: "Alterar em Configurações",
                    importantNote: "Nota Importante: Os saques externos deste MVP sao limitados a USDT na rede BSC. A carteira ativa selecionada em Configuracoes sera usada como destino.",
                    confirmWithdrawalTitle: "Confirmar Saque em USDT",
                    reviewTransfer: "Revise os dados da transferencia antes de confirmar.",
                    fixedNetwork: "Rede fixa: BSC / BEP20",
                    selectedWallet: "Carteira Selecionada",
                    confirmWithdrawal: "Confirmar Saque",
                    withdrawalTitle: "Saque de GnoCripto para USDT",
                    withdrawalSubtitle: "Converta GnoCripto em USDT e envie o valor para a carteira BSC ativa configurada no painel.",
                    swapTitle: "GnoCripto & USDT Swap Instantaneo",
                    swapSubtitleBuy: "Converta USDT em GnoCripto no saldo interno usando a taxa fixa do MVP.",
                    swapSubtitleSell: "Converta GnoCripto em USDT para saque na carteira BSC ativa do painel.",
                    requestWithdrawal: "Solicitar Saque",
                    confirmSwap: "Confirmar Transacao de Swap",
                    waitingPayment: "Aguardando pagamento em USDT BSC",
                    minDepositWarning: "O deposito minimo e de US$ 5.00 em USDT BSC (BEP-20).",
                    depositGenerated: "Solicitacao de deposito gerada. O endereco BlockBee foi copiado para a area de transferencia.",
                    generateAddressFirst: "Gere primeiro um endereco de deposito para copiar.",
                    depositWalletCopied: "Carteira de deposito copiada para a area de transferencia.",
                    generateValidRequestFirst: "Gere primeiro uma solicitacao de deposito valida.",
                    internalPlatformBalance: "Saldo interno da plataforma",
                    internalPlatformHelper: "Ao comprar GnoCripto, o valor convertido entra diretamente no seu saldo do jogo.",
                    noWalletConfigured: "Nenhuma carteira configurada",
                    configureWallet: "Cadastre sua carteira BSC em Configurações para liberar saques em USDT.",
                    withdrawalHelper: "Ao sacar, o USDT sera enviado para a carteira ativa selecionada na rede BSC.",
                    configureAndSelectWallet: "Configure e selecione uma carteira USDT BSC antes de sacar.",
                    insufficientGbc: "Saldo de GnoCripto de jogo insuficiente!",
                    backendRequestNote: "Solicitacao preparada para o backend gerar o payout request da BlockBee em USDT BSC. Ref: {requestId}.",
                    withdrawalSent: "Saque em USDT BSC encaminhado: payout request criado e payout em processamento para {label} ({address}).",
                    valueMustBePositive: "Valor de swap deve ser superior a zero!",
                    insufficientUsdt: "Saldo simulado de USDT insuficiente!",
                    internalDestination: "Saldo interno da plataforma",
                    successPurchase: "Sucesso! Swap concluído. {amount} USDT convertido em {gbc} GnoCriptos.",
                    completed: "Saque em USDT BSC concluido com sucesso para {label}.",
                    updated: "Saque em USDT BSC atualizado: {status}.",
                    failed: "Saque em USDT BSC com falha: {status}.",
                    swapInternal: "Swap Interno"
                }
            },
            en: {
                app: {
                    title: "GnoMiner - Mining Gnomes Tycoon MVP",
                    lang: "en"
                },
                language: {
                    changed: "Language changed to {language}.",
                    names: {
                        "pt-BR": "Portuguese",
                        en: "English",
                        es: "Spanish"
                    }
                },
                topbar: {
                    level: "Level",
                    toggleAudio: "Toggle Sound",
                    openSettings: "Open Settings",
                    language: "Language",
                    wallet: "Wallet"
                },
                nav: {
                    mines: "Mines",
                    shop: "Shop",
                    inventory: "Inventory",
                    affiliates: "Affiliates",
                    missions: "Missions"
                },
                alert: {
                    activeCrisis: "Active crisis event warning!",
                    resolve: "Resolve Event!"
                },
                tutorial: {
                    title: "Quick Start Guide (Tutorial)",
                    copy: "Welcome, supervisor! Start by buying Energy and hiring the gnome <strong>Gnorin</strong> in the shop to automate <strong>Mine 1</strong>. Collect raw resources to unlock the next mines and stack GnoCripto to swap for real USDT!",
                    dismiss: "Got it, hide!",
                    hidden: "Tutorial hidden. You can now play freely!"
                },
                mines: {
                    advisorTitle: "Automatic Investment Advisor",
                    advisorCalculating: "Scanning your mining front for the next best move...",
                    active: "Active",
                    broken: "Broken",
                    noEnergy: "No Energy",
                    noTeam: "No Team",
                    shiftClosed: "Shift Closed",
                    auto: "Auto",
                    shift6h: "6h Shift",
                    cycle6h: "6h Cycle",
                    readings: "readings",
                    partialChest: "Stash",
                    pendingOre: "{value} pending ores",
                    dailyRoi: "Daily ROI",
                    rangePerDay: "Range {min}-{max} GBC/day",
                    gnomes: "Gnomes ({count}/{capacity})",
                    noGnomeWorking: "No gnomes on shift",
                    nextReading: "Next pulse",
                    fullShift: "Full shift",
                    automation: "Automation",
                    manual: "Manual",
                    unlockFor: "Unlock for",
                    repairMine: "Repair Mine (Structural Damage)",
                    closeShiftRestart: "Close Shift and Restart",
                    restartShift: "Restart Shift",
                    collectWindow: "Claim Pulse (+{value} GBC)",
                    assignToStart: "Assign gnomes to start the run",
                    recoverEnergy: "Recharge to get the run going again",
                    nextReadingIn: "Next pulse in {time}",
                    live: "LIVE",
                    moveGnomes: "Move Gnomes",
                    liveNoTeam: "No active crew yet. Assign gnomes to bring this front to life.",
                    clanWorker: "Clan worker",
                    tools: {
                        drill: "Drill",
                        hammer: "Hammer",
                        pickaxe: "Pickaxe"
                    },
                    workerSets: {
                        gnorin: "Pick-Hammer",
                        bortok: "Titan Maul",
                        zeldrik: "Turbo Rig",
                        faggro: "Tactical Hammer",
                        nyra: "Star Hammer"
                    },
                    workerFlair: {
                        gnorin: "Steady, clean strikes right on the richest vein.",
                        bortok: "Boss-level heavy hits built to crack the front wide open.",
                        zeldrik: "Premium engineering rig tuned for precise drilling.",
                        faggro: "Fast, risky impact chasing the rarest drops.",
                        nyra: "Legendary rhythm with elegant impact and full control."
                    },
                    liveShiftRhythm: "{role} is on a steady 6h mining loop.",
                    liveReadyNoTeam: "The front is ready, but no crew is down in the tunnel yet.",
                    liveNoEnergy: "The front is out of power. Recharge it to get mining again.",
                    liveBroken: "The run was interrupted by structural damage.",
                    livePulseProfit: "Current pulse: +{value} GBC | next pulse in {time}.",
                    livePulseDry: "Current pulse: no gain this round | next pulse in {time}.",
                    liveAutoActive: "Auto active • {time}",
                    liveManualCollection: "Manual collection",
                    dailyGoal: "Daily target",
                    dailyGoalCopy: "This front can release between {minRate}% and {maxRate}% per day. Stars, staffing, and upgrades push the real rate higher.",
                    shift6hTitle: "6-hour shift",
                    shift6hCopy: "Next pulse in {time}. You can claim every 5 minutes or wait for the full shift to end.",
                    pendingLoad: "Stored haul",
                    oresLabel: "{value} ores",
                    shiftClosedCopy: "Shift complete. Claim the haul and relaunch, or let the Auto Collector handle it.",
                    accumulatingCopy: "Your gnomes keep stacking loot until the next claim.",
                    advice: {
                        harmony: "Your mining front is running smoothly. Keep the haul flowing.",
                        none: "No mining front is active yet. Unlock your first mine to kick things off.",
                        broken: "⚠ WARNING: <strong>{name}</strong> is offline due to structural damage. Repair it now!",
                        autoCollector: "🤖 Completed shifts are waiting to be claimed. The 7-day Auto Collector keeps the whole loop running with less downtime.",
                        lowEnergy: "⚡ Energy is running dangerously low. Stock up to keep the mining loop alive.",
                        occupancy: "🛠 <strong>{name}</strong> still has open worker slots ({allocated}/{capacity} gnomes). Fill them to push output higher.",
                        stars: "🚀 Best next move: upgrade <strong>{name}</strong> to star level {level} and boost your GBC run."
                    },
                    actions: {
                        repairNow: "Repair Now",
                        activateCollector: "Activate Collector",
                        buyEnergy: "Buy Energy",
                        moveGnomes: "Move Gnomes",
                        upgradeStar: "Upgrade Star ({cost} GBC)"
                    },
                    unlockErrors: {
                        insufficientGbc: "Not enough GnoCriptos to unlock this mine!",
                        requirements: "Requirements not met! Requires Level {level} + {amount} {resource}.",
                        unlocked: "{name} unlocked successfully! Hire gnomes to begin."
                    },
                    upgradeErrors: {
                        insufficientGbc: "Not enough GnoCriptos to upgrade this mine star!",
                        upgraded: "{name} star upgraded to level {level}! Production increased by +10%."
                    },
                    allocation: {
                        empty: "You do not have any active Gnomes yet. Head to the Shop and recruit your first crew.",
                        deallocate: "Deallocate",
                        moveFrom: "Move from {name}",
                        work: "Work",
                        title: "{name} Supervision",
                        subtitle: "Choose which gnomes are actively running this mine. Maximum capacity: {capacity} gnomes.",
                        closePanel: "Close Panel",
                        capacityReached: "This mine has already reached maximum gnome capacity!",
                        allocated: "Worker assigned successfully!",
                        idle: "Worker moved to idle."
                    },
                    collect: {
                        notReady: "There is nothing ready to claim yet. Wait for the next 5-minute pulse."
                    },
                    repair: {
                        insufficientGbc: "Not enough GnoCriptos for emergency repair!",
                        success: "The engineer clan patched up {name}. The mining run is ready to resume."
                    },
                    events: {
                        frontRupture: "Mine Front Rupture",
                        wornOut: "⚠ {name} took heavy wear at shift end and needs repairs before it can get back to full output."
                    },
                    reward: {
                        oreText: " +{value} ores",
                        collectibleJoiner: " and {items}",
                        autoPrefix: "🤖 Auto Collector",
                        collectPrefix: "⛏ Claim",
                        summary: "{prefix} from {name}: +{gbc} GBC{resourceText}{collectibleText}."
                    },
                    offlineSummary: "⏱ You were away for {time}. Your mines advanced {pulseText} and {cycleText}{stashText}.",
                    offlinePulseSingle: "1 five-minute pulse",
                    offlinePulsePlural: "{count} five-minute pulses",
                    offlineCycleSingle: "1 completed 6-hour shift",
                    offlineCyclePlural: "{count} completed 6-hour shifts",
                    offlineStash: " and stacked +{gbc} GBC in the stash",
                    levelUp: {
                        feedback: "🎉 Level up! You reached LEVEL {level}. Fresh upgrades are now waiting in the shop."
                    },
                    autoCollectorInactive: "Inactive",
                    autoCollectorRemaining: "{days}d {hours}h left"
                },
                shop: {
                    title: "Clan Market",
                    subtitle: "Manage and hire vital mining resources. Click any Gnome to open their detailed skill profile!",
                    yourEnergy: "Your Energy",
                    tabs: {
                        gnomes: "Gnomes",
                        gear: "Gear",
                        supplies: "Supplies"
                    },
                    detail: "Profile",
                    hire: "Hire",
                    techSheet: "View technical sheet",
                    contract: "Contract ({days} days)",
                    uniqueCost: "One-time Cost",
                    buy: "Buy",
                    levelOwned: "Current owned level",
                    statusCurrent: "Current status",
                    active: "Active",
                    inactive: "Inactive",
                    rent7days: "7-day rental",
                    renew: "Renew",
                    activate: "Activate",
                    drillName: "Reinforced Drill",
                    drillDesc: "Increases efficiency and base yield of all active mines by +5%.",
                    engineName: "Efficient Engine",
                    engineDesc: "Reduces energy consumption in every cycle collection by -1.5 energy.",
                    railcarName: "Reinforced Railcar",
                    railcarDesc: "Grants +5% chance to find collectible shards and extra rare materials.",
                    collectorName: "Auto Collector",
                    collectorDesc: "Rents a collector for 7 days that closes the 6h shift, stores mined goods, and restarts the front automatically.",
                    batteryCompact: "Compact Fusion Battery",
                    batteryCompactDesc: "Instantly restores 25% mine energy.",
                    batteryMax: "Maximum Thermal Cell",
                    batteryMaxDesc: "Full recharge of the energy matrix by 100%.",
                    errors: {
                        insufficientHire: "Not enough GnoCriptos to hire this gnome!",
                        insufficientGear: "Not enough GnoCriptos to acquire this technological upgrade!",
                        insufficientEnergy: "Not enough GnoCriptos for energy supplies!",
                        energyFull: "The energy grid is already at full capacity!"
                    },
                    success: {
                        hired: "{name} hired successfully! Assign them to a mine to start working.",
                        gearInstalled: "Infrastructure upgrade acquired and installed across all mines!",
                        collectorActivated: "Auto Collector activated for 7 days. Mines now restart automatically at the end of each shift.",
                        energyRecharged: "Energy recharge completed! +{qty}% added."
                    }
                },
                inventory: {
                    title: "Resource Warehouse",
                    subtitle: "Raw mined materials and collected themed crypto shards.",
                    rawTitle: "Extracted Ores",
                    collectibleTitle: "Collectible Themed Shards",
                    gearTitle: "Your Infrastructure and Equipment",
                    level: "Level",
                    effects: {
                        drill: "+{value}% Overall Production",
                        engine: "-{value} Energy per cycle",
                        railcar: "+{value}% Rare Shard Chance"
                    }
                },
                referrals: {
                    title: "Residual & Affiliate Program",
                    subtitle: "Multiply profits with a virtual multi-level referral network (up to 8 levels).",
                    yourLink: "Your Link",
                    copyLink: "Copy Link",
                    leadershipRank: "Leadership Rank Tier",
                    rankCopy: "Your residual commission increases progressively based on referred sales volume. Grow your referral volume to advance from Gno1 to Gno5!",
                    volumeAccumulated: "Accumulated Referred Volume",
                    directLevel: "1st Level (Direct)",
                    level23: "2nd to 3rd Level",
                    level48: "4th to 8th Level",
                    nextRank: "Next Rank",
                    networkTitle: "Active Referrals Panel (Network Simulation)",
                    networkSubtitle: "Use the simulator below to generate friends and earn residuals in real time.",
                    inviteSimulated: "Invite Simulated Friend",
                    table: {
                        friend: "Friend",
                        lineLevel: "Line Level",
                        dailyYield: "Daily Yield",
                        activeVolume: "Active Volume",
                        yourCommission: "Your Commission (Residual)",
                        empty: "No simulated guest yet. Click above to invite one!",
                        residualLevel: "Level {line} (Residual)",
                        received: "Received"
                    },
                    rates: {
                        residual: "{rate} Residual"
                    },
                    copied: "Referral link copied to the clipboard!",
                    invited: "Simulated guest {name} joined at level {line}! Network residual activated!"
                },
                wheel: {
                    title: "GnoCripto Fortune Wheel",
                    subtitle: "Spin once for free each game round to collect supplies!",
                    spin: "Spin and Reveal!",
                    surpriseResult: "Surprise Result",
                    waitingSpin: "Waiting for spin",
                    hiddenPrize: "The real prize only appears when the wheel stops.",
                    laneHidden: "Stopped lane: hidden",
                    lane: "Color: {color} • Item: {item}",
                    coolingDown: "Wait for the fortune wheel cooldown!",
                    revealing: "Revealing surprise",
                    spinning: "Spinning",
                    pendingLane: "Stopped lane: hidden",
                    feedback: "🎰 Fortune Wheel: {text}",
                    segments: {
                        gbcBag: "GBC Bag",
                        gbcBagTitle: "Bag revealed",
                        vitalLoad: "Vital Charge",
                        vitalLoadTitle: "Energy charge",
                        turboBox: "Turbo Crate",
                        turboBoxTitle: "Turbo crate",
                        bscReserve: "BSC Reserve",
                        bscReserveTitle: "USDT reserve",
                        fog: "Fog",
                        fogTitle: "Lucky fog",
                        jackpot: "Jackpot",
                        jackpotTitle: "Clan jackpot",
                        amber: "Amber",
                        blue: "Blue",
                        pink: "Pink",
                        green: "Green",
                        gray: "Gray",
                        gold: "Gold",
                        noGain: "No gain"
                    }
                },
                missionUi: {
                    activeBoardTitle: "Active Mission Board",
                    activeBoardCopy: "Push through each phase, track your progress, and claim every reward as you climb the board.",
                    globalStatsTitle: "Achievements and Global Statistics",
                    globalStatsCopy: "Your major milestones and the long-term stats behind your mining run.",
                    readyToClaim: "Mission ready to claim: {phase} from \"{title}\".",
                    completedAll: "Mission \"{title}\" fully completed! Final reward: +{reward} GBC.",
                    rewardClaimed: "Reward claimed in \"{title}\" ({phase}): +{reward} GBC.",
                    claimed: "Claimed",
                    collectPrize: "Claim Prize",
                    inProgress: "In progress",
                    locked: "Locked",
                    phaseTrail: "Phase trail",
                    boardDone: "Board cleared",
                    boardDoneCopy: "Every phase has been claimed. Wait for the next set of objectives.",
                    noNextPhase: "No next phase",
                    noNextPhaseCopy: "This board has already been fully completed.",
                    lastPhase: "Final phase",
                    lastPhaseCopy: "Complete and claim the current phase to wrap up this board.",
                    phasePrize: "This phase reward",
                    nextPrize: "Next reward",
                    status: "Status",
                    nextPhaseUnlock: "The next phase unlocks automatically as soon as the current phase is claimed.",
                    finalReward: "Final reward",
                    everythingClaimed: "Everything claimed",
                    finishBoard: "Clear the board to collect it all",
                    finalized: "Finished",
                    remainingGbc: "{value} GBC remaining",
                    boardTotal: "Board total",
                    xpTotal: "+{value} XP total",
                    xpDistributed: "XP distributed across phases",
                    toReceive: "To receive",
                    noPending: "No pending rewards",
                    xpRemaining: "{value} XP remaining",
                    phasesClaimed: "{claimed}/{total} claimed phases",
                    boardPercent: "{value}% of board",
                    currentPhase: "Current phase",
                    finished: "Finished",
                    noPendingPrize: "No pending prize",
                    currentTab: "Current phase",
                    nextTab: "Next",
                    finalTab: "Final",
                    missionTrail: "Mission track",
                    stats: {
                        totalMined: "Total Mined",
                        swappedUsdt: "USDT Swapped",
                        luckySpins: "Lucky Spins",
                        currentRank: "Current Rank"
                    },
                    crisis: {
                        alert: "🚨 GENERAL ALERT: A <strong>{type}</strong> event occurred! Resolve it to restore full production.",
                        insufficient: "Not enough GnoCriptos to act and stop the crisis!",
                        resolved: "Excellent! The crisis was resolved and your gnomes returned to regular work."
                    }
                },
                audio: {
                    enabled: "Enabled",
                    disabled: "Disabled",
                    enabledFeedback: "Sounds enabled",
                    disabledFeedback: "Sounds disabled"
                },
                settings: {
                    platformTitle: "Platform Settings",
                    platformCopy: "Manage your withdrawal wallet, sound settings, and sensitive account actions.",
                    withdrawalsEnabled: "Withdrawals enabled:",
                    walletIntro: "Add multiple USDT wallets on the BSC network, choose the active one, and use it for withdrawals.",
                    currentDestination: "Current destination",
                    preferencesTitle: "Preferences",
                    preferencesCopy: "Quick controls for your in-game experience.",
                    soundEffects: "Sound Effects",
                    soundEffectsCopy: "Toggles sound feedback for collecting, upgrades, alerts, and the wheel.",
                    toggleSound: "Toggle Sound",
                    historyTitle: "Transaction History",
                    historyCopy: "Tracks GnoCripto purchases and USDT withdrawals made through the panel.",
                    securityTitle: "Security and Data",
                    securityCopy: "Sensitive actions related to your profile and local game progress.",
                    resetLocal: "Reset local progress",
                    resetLocalCopy: "Clears the saved browser state and resets your mines, inventory, missions, and MVP balances.",
                    resetGame: "Reset Game",
                    walletMain: "Main Wallet",
                    withdrawalWallet: "Withdrawal Wallet",
                    walletName: "Wallet Name",
                    walletNamePlaceholder: "Ex.: Main Wallet",
                    walletAddress: "Wallet Address",
                    cancel: "Cancel",
                    registeredWallets: "Registered Wallets",
                    noWalletConfigured: "No wallet configured",
                    noWalletRegistered: "No wallet registered",
                    addFirstWallet: "Add your first USDT wallet on the BSC network to enable withdrawals.",
                    active: "Active",
                    walletInUse: "Wallet In Use",
                    useForWithdrawal: "Use for Withdrawal",
                    edit: "Edit",
                    delete: "Delete",
                    withdrawalRequestTitle: "USDT Withdrawal Request",
                    purchaseTitle: "GnoCripto Purchase",
                    nextTransactions: "Your next swaps and withdrawals will appear here.",
                    noTransactions: "No transactions recorded",
                    internalSwap: "Internal Swap",
                    source: "Source",
                    destination: "Destination",
                    destinationWallet: "Destination Wallet",
                    internalBalance: "Internal balance",
                    status: "Status",
                    requestId: "Request ID",
                    payoutId: "Payout ID",
                    remainingProcessing: "Processing",
                    currentWalletNone: "No wallet configured for withdrawal",
                    currentWalletHint: "USDT withdrawals made through Swap will be sent to the active wallet selected below.",
                    currentWalletHintEmpty: "Register at least one USDT wallet on the BSC network to enable withdrawals.",
                    addWallet: "Add Wallet",
                    saveChanges: "Save Changes",
                    askWalletBeforeSaving: "Enter the withdrawal wallet before saving.",
                    invalidWallet: "Enter an address compatible with a USDT wallet on the BSC/BEP20 network.",
                    duplicatedWallet: "This wallet is already registered in the list.",
                    walletSaved: "Withdrawal wallet saved successfully.",
                    walletActivated: "{label} set as the active withdrawal wallet.",
                    removeWalletConfirm: "Do you want to remove the wallet \"{label}\" from the withdrawal list?",
                    walletDeleted: "Wallet removed successfully."
                },
                statuses: {
                    queued_for_backend: "Queued in backend",
                    payout_created: "Payout created",
                    processing: "Processing payout",
                    done: "Paid successfully",
                    error: "Payout error",
                    rejected: "Withdrawal rejected"
                },
                swap: {
                    walletActionTitle: "Wallet",
                    walletActionCopy: "Choose which action you want to open in the MVP finance panel.",
                    walletActionDepositTitle: "1. Deposit",
                    walletActionDepositCopy: "Convert USDT into GnoCripto and credit it to your in-game balance.",
                    walletActionWithdrawalTitle: "2. Withdraw",
                    walletActionWithdrawalCopy: "Convert GnoCripto into USDT and send it to the active BSC wallet saved in Settings.",
                    walletActionSwapTitle: "3. Swap",
                    walletActionSwapMode: "All-in-one mode",
                    walletActionSwapCopy: "Open the main converter to switch between deposit and withdrawal in the same modal.",
                    depositTitle: "BlockBee Deposit",
                    depositSubtitle: "USDT BSC (BEP-20) only. Enter the amount, generate the QR code, and send funds to the deposit address returned to the user.",
                    depositNetwork: "Deposit Network",
                    depositFlowCopy: "This flow is ready for future BlockBee integration through the backend.",
                    depositAmountLabel: "Deposit Amount in USDT",
                    depositMinCopy: "The minimum deposit is US$ 5.00.",
                    depositCreditPreview: "Expected In-Game Credit",
                    blockbeeNote: "BlockBee: in the backend phase, the application will call the server API to create the deposit request, obtain address/QR, and validate payment through webhook. The API key is never exposed on the front-end.",
                    generateDeposit: "Generate BlockBee Deposit",
                    generatedRequest: "Generated Request",
                    copyWallet: "Copy Wallet",
                    exactAmount: "Exact Amount",
                    confirmedCredit: "Credit After Confirmation",
                    futureUxCopy: "This MVP is already prepared for the future BlockBee flow. Once the backend is connected, this card will receive the real address and QR returned by the API, and the balance will only be credited after payment confirmation.",
                    openPaymentUri: "Open payment_uri",
                    awaitingPayment: "Awaiting payment",
                    source: "Source",
                    destination: "Destination",
                    sourceAsset: "Source Asset",
                    destinationAsset: "Destination Asset (Simulated)",
                    withdrawalDestination: "Withdrawal Destination",
                    changeInSettings: "Change in Settings",
                    importantNote: "Important: external withdrawals in this MVP are limited to USDT on the BSC network. The active wallet selected in Settings will be used as the destination.",
                    confirmWithdrawalTitle: "Confirm USDT Withdrawal",
                    reviewTransfer: "Review the transfer details before confirming.",
                    fixedNetwork: "Fixed network: BSC / BEP20",
                    selectedWallet: "Selected Wallet",
                    confirmWithdrawal: "Confirm Withdrawal",
                    withdrawalTitle: "GnoCripto to USDT Withdrawal",
                    withdrawalSubtitle: "Convert GnoCripto into USDT and send it to the active BSC wallet configured in the panel.",
                    swapTitle: "Instant GnoCripto & USDT Swap",
                    swapSubtitleBuy: "Convert USDT into GnoCripto at the fixed MVP rate and credit it to your internal balance.",
                    swapSubtitleSell: "Convert GnoCripto into USDT and withdraw it to the active BSC wallet.",
                    requestWithdrawal: "Request Withdrawal",
                    confirmSwap: "Confirm Swap Transaction",
                    waitingPayment: "Waiting for USDT BSC payment",
                    minDepositWarning: "The minimum deposit is US$ 5.00 in USDT BSC (BEP-20).",
                    depositGenerated: "Deposit request generated. The BlockBee address was copied to the clipboard.",
                    generateAddressFirst: "Generate a deposit address first before copying.",
                    depositWalletCopied: "Deposit wallet copied to the clipboard.",
                    generateValidRequestFirst: "Generate a valid deposit request first.",
                    internalPlatformBalance: "Platform internal balance",
                    internalPlatformHelper: "When you buy GnoCripto, the converted amount is credited directly to your in-game balance.",
                    noWalletConfigured: "No wallet configured",
                    configureWallet: "Register your BSC wallet in Settings to enable USDT withdrawals.",
                    withdrawalHelper: "When you withdraw, the USDT will be sent to the selected active wallet on the BSC network.",
                    configureAndSelectWallet: "Configure and select a USDT BSC wallet before withdrawing.",
                    insufficientGbc: "Not enough in-game GnoCripto balance!",
                    backendRequestNote: "Request prepared for the backend to generate the BlockBee payout in USDT BSC. Ref: {requestId}.",
                    withdrawalSent: "USDT BSC withdrawal sent: the payout request was created and is now processing for {label} ({address}).",
                    valueMustBePositive: "Swap amount must be greater than zero!",
                    insufficientUsdt: "Insufficient simulated USDT balance!",
                    internalDestination: "Platform internal balance",
                    successPurchase: "Success! Swap completed. {amount} USDT converted into {gbc} GnoCripto.",
                    completed: "USDT BSC withdrawal completed successfully for {label}.",
                    updated: "USDT BSC withdrawal updated: {status}.",
                    failed: "USDT BSC withdrawal failed: {status}.",
                    swapInternal: "Internal Swap"
                }
            },
            es: {
                app: {
                    title: "GnoMiner - MVP Tycoon de Gnomos Mineros",
                    lang: "es"
                },
                language: {
                    changed: "Idioma cambiado a {language}.",
                    names: {
                        "pt-BR": "Portugués",
                        en: "Inglés",
                        es: "Español"
                    }
                },
                topbar: {
                    level: "Nivel",
                    toggleAudio: "Cambiar sonido",
                    openSettings: "Abrir ajustes",
                    language: "Idioma",
                    wallet: "Billetera"
                },
                nav: {
                    mines: "Minas",
                    shop: "Tienda",
                    inventory: "Inventario",
                    affiliates: "Afiliados",
                    missions: "Misiones"
                },
                alert: {
                    activeCrisis: "Advertencia de evento de crisis activo!",
                    resolve: "Resolver Evento!"
                },
                tutorial: {
                    title: "Guía de inicio rápido (Tutorial)",
                    copy: "Bienvenido, supervisor! Empieza comprando Energía y contratando al gnomo <strong>Gnorin</strong> en la tienda para automatizar la <strong>Mina 1</strong>. Recolecta recursos brutos para desbloquear las próximas minas y acumular GnoCripto para cambiar por USDT real!",
                    dismiss: "Entendido, ocultar!",
                    hidden: "Tutorial ocultado. Ya puedes jugar libremente!"
                },
                mines: {
                    advisorTitle: "Asesor automático de inversión",
                    advisorCalculating: "Revisando tu frente minera para detectar la mejor jugada...",
                    active: "Activa",
                    broken: "Rota",
                    noEnergy: "Sin Energía",
                    noTeam: "Sin Equipo",
                    shiftClosed: "Turno Cerrado",
                    auto: "Auto",
                    shift6h: "Turno de 6h",
                    cycle6h: "Ciclo de 6h",
                    readings: "lecturas",
                    partialChest: "Botín",
                    pendingOre: "{value} minerales pendientes",
                    dailyRoi: "ROI diario",
                    rangePerDay: "Rango {min}-{max} GBC/día",
                    gnomes: "Gnomos ({count}/{capacity})",
                    noGnomeWorking: "No hay gnomos en turno",
                    nextReading: "Próximo pulso",
                    fullShift: "Turno completo",
                    automation: "Automatización",
                    manual: "Manual",
                    unlockFor: "Desbloquear por",
                    repairMine: "Reparar Mina (Daño Estructural)",
                    closeShiftRestart: "Cerrar Turno y Reiniciar",
                    restartShift: "Reiniciar Turno",
                    collectWindow: "Cobrar Pulso (+{value} GBC)",
                    assignToStart: "Asigna gnomos para iniciar la corrida",
                    recoverEnergy: "Recarga energía para reactivar la corrida",
                    nextReadingIn: "Próximo pulso en {time}",
                    live: "LIVE",
                    moveGnomes: "Mover gnomos",
                    liveNoTeam: "Todavía no hay equipo activo. Asigna gnomos para dar vida a este frente.",
                    clanWorker: "Operario del clan",
                    tools: {
                        drill: "Broca",
                        hammer: "Martillo",
                        pickaxe: "Pico"
                    },
                    workerSets: {
                        gnorin: "Pico-Martillo",
                        bortok: "Marrota Titán",
                        zeldrik: "Kit Turbo",
                        faggro: "Martillo Táctico",
                        nyra: "Martillo Estelar"
                    },
                    workerFlair: {
                        gnorin: "Golpe firme, limpio y siempre sobre la mejor veta.",
                        bortok: "Impacto brutal de jefe para abrir el frente a pura fuerza.",
                        zeldrik: "Conjunto premium de ingeniería para perforar con precisión.",
                        faggro: "Impacto rápido y arriesgado en busca del drop raro.",
                        nyra: "Ritmo legendario con impacto elegante y mando total."
                    },
                    liveShiftRhythm: "{role} está trabajando en un bucle minero de 6h.",
                    liveReadyNoTeam: "El frente está listo, pero aún no hay equipo dentro del túnel.",
                    liveNoEnergy: "El frente se quedó sin energía. Recárgalo para volver a minar.",
                    liveBroken: "La corrida fue interrumpida por daño estructural.",
                    livePulseProfit: "Pulso actual: +{value} GBC | próximo pulso en {time}.",
                    livePulseDry: "Pulso actual: sin ganancia en esta ronda | próximo pulso en {time}.",
                    liveAutoActive: "Auto activo • {time}",
                    liveManualCollection: "Cobro manual",
                    dailyGoal: "Meta diaria",
                    dailyGoalCopy: "Este frente puede soltar entre {minRate}% y {maxRate}% al día. El valor real sube con estrellas, ocupación y mejoras.",
                    shift6hTitle: "Turno de 6 horas",
                    shift6hCopy: "Próximo pulso en {time}. Puedes cobrar cada 5 minutos o esperar al cierre total del turno.",
                    pendingLoad: "Botín guardado",
                    oresLabel: "{value} minerales",
                    shiftClosedCopy: "Turno completado. Cobra el botín y relanza la mina, o deja que el Colector Automático lo haga.",
                    accumulatingCopy: "Tus gnomos siguen acumulando botín hasta el próximo cobro.",
                    advice: {
                        harmony: "Tu frente minero va fino. Mantén el botín en movimiento.",
                        none: "Todavía no hay ningún frente minero activo. Desbloquea la primera mina para arrancar.",
                        broken: "⚠ ATENCIÓN: <strong>{name}</strong> quedó fuera de juego por daños estructurales. Repárala ahora mismo.",
                        autoCollector: "🤖 Hay turnos completados esperando cobro. El Colector Automático de 7 días mantiene el bucle andando con menos inactividad.",
                        lowEnergy: "⚡ La energía está al límite. Recárgala para que la corrida minera no se detenga.",
                        occupancy: "🛠 <strong>{name}</strong> todavía tiene huecos libres ({allocated}/{capacity} gnomos). Llénalos para empujar el rendimiento.",
                        stars: "🚀 La mejor jugada ahora es subir <strong>{name}</strong> a estrella {level} y apretar más el rendimiento en GBC."
                    },
                    actions: {
                        repairNow: "Reparar ahora",
                        activateCollector: "Activar colector",
                        buyEnergy: "Comprar energía",
                        moveGnomes: "Mover gnomos",
                        upgradeStar: "Subir estrella ({cost} GBC)"
                    },
                    unlockErrors: {
                        insufficientGbc: "No hay suficientes GnoCriptos para desbloquear esta mina!",
                        requirements: "Requisitos no cumplidos! Requiere Nivel {level} + {amount} {resource}.",
                        unlocked: "{name} desbloqueada con éxito! Contrata gnomos para comenzar."
                    },
                    upgradeErrors: {
                        insufficientGbc: "No hay suficientes GnoCriptos para subir la estrella de esta mina!",
                        upgraded: "La estrella de {name} subió al nivel {level}! La producción aumentó en +10%."
                    },
                    allocation: {
                        empty: "Aún no tienes Gnomos activos. Ve a la Tienda y recluta tu primer equipo.",
                        deallocate: "Desasignar",
                        moveFrom: "Mover desde {name}",
                        work: "Trabajar",
                        title: "Supervisión de {name}",
                        subtitle: "Elige qué gnomos estarán corriendo esta mina. Capacidad máxima: {capacity} gnomos.",
                        closePanel: "Cerrar Panel",
                        capacityReached: "Esta mina ya alcanzó la capacidad máxima de gnomos!",
                        allocated: "Trabajador asignado con éxito!",
                        idle: "Trabajador movido al ocio."
                    },
                    collect: {
                        notReady: "Todavía no hay nada listo para cobrar. Espera al próximo pulso de 5 minutos.",
                    },
                    repair: {
                        insufficientGbc: "No hay suficientes GnoCriptos para una reparación de urgencia!",
                        success: "El clan de ingenieros dejó {name} lista otra vez. La corrida minera puede continuar."
                    },
                    events: {
                        frontRupture: "Ruptura en el Frente de Mina",
                        wornOut: "⚠ {name} terminó el turno con desgaste serio y necesita reparación para volver al máximo.",
                    },
                    reward: {
                        oreText: " +{value} minerales",
                        collectibleJoiner: " y {items}",
                        autoPrefix: "🤖 Colector automático",
                        collectPrefix: "⛏ Cobro",
                        summary: "{prefix} de {name}: +{gbc} GBC{resourceText}{collectibleText}."
                    },
                    offlineSummary: "⏱ Estuviste fuera durante {time}. Las minas avanzaron {pulseText} y {cycleText}{stashText}.",
                    offlinePulseSingle: "1 pulso de 5 min",
                    offlinePulsePlural: "{count} pulsos de 5 min",
                    offlineCycleSingle: "1 cierre de turno de 6h",
                    offlineCyclePlural: "{count} cierres de turno de 6h",
                    offlineStash: " y acumularon +{gbc} GBC en el botín",
                    levelUp: {
                        feedback: "🎉 ¡Subiste de nivel! Llegaste al NIVEL {level}. Ya tienes nuevas mejoras esperándote en la tienda."
                    },
                    autoCollectorInactive: "Inactivo",
                    autoCollectorRemaining: "{days}d {hours}h restantes"
                },
                shop: {
                    title: "Mercado del clan",
                    subtitle: "Gestiona y contrata recursos vitales de minería. Haz clic en cualquier Gnomo para ver su ficha detallada de habilidades!",
                    yourEnergy: "Tu Energía",
                    tabs: {
                        gnomes: "Gnomos",
                        gear: "Equipar",
                        supplies: "Suministros"
                    },
                    detail: "Ficha",
                    hire: "Contratar",
                    techSheet: "Ver ficha técnica",
                    contract: "Contrato ({days} días)",
                    uniqueCost: "Costo único",
                    buy: "Comprar",
                    levelOwned: "Nivel actual adquirido",
                    statusCurrent: "Estado actual",
                    active: "Activo",
                    inactive: "Inactivo",
                    rent7days: "Alquiler 7 días",
                    renew: "Renovar",
                    activate: "Activar",
                    drillName: "Broca Reforzada",
                    drillDesc: "Aumenta la eficiencia y el rendimiento base de todas las minas activas en +5%.",
                    engineName: "Motor Eficiente",
                    engineDesc: "Reduce el consumo de energía en cada recolección por ciclo en -1.5 de energía.",
                    railcarName: "Vagoneta Reforzada",
                    railcarDesc: "Garantiza +5% de probabilidad de encontrar fragmentos coleccionables y materiales raros extra.",
                    collectorName: "Colector Automático",
                    collectorDesc: "Alquila por 7 días un colector que cierra el turno de 6h, guarda lo minado y reinicia el frente automáticamente.",
                    batteryCompact: "Batería de Fusión Compacta",
                    batteryCompactDesc: "Recarga instantáneamente 25% de energía de las minas.",
                    batteryMax: "Célula Térmica Máxima",
                    batteryMaxDesc: "Recarga total del 100% de la matriz energética.",
                    errors: {
                        insufficientHire: "No hay suficientes GnoCriptos para contratar este gnomo!",
                        insufficientGear: "No hay suficientes GnoCriptos para adquirir esta mejora tecnológica!",
                        insufficientEnergy: "No hay suficientes GnoCriptos para el suministro de energía!",
                        energyFull: "La red de energía ya está a capacidad máxima!"
                    },
                    success: {
                        hired: "{name} contratado con éxito! Asígnalo a una mina para iniciar el trabajo.",
                        gearInstalled: "Mejora de infraestructura adquirida e instalada en todas las minas!",
                        collectorActivated: "Colector automático activado por 7 días. Las minas se reinician solas al final del turno.",
                        energyRecharged: "Recarga de energía realizada! +{qty}% añadido."
                    }
                },
                inventory: {
                    title: "Almacén de Recursos",
                    subtitle: "Materiales minados en bruto y fragmentos cripto temáticos coleccionados.",
                    rawTitle: "Minerales Extraídos",
                    collectibleTitle: "Fragmentos Temáticos Coleccionables",
                    gearTitle: "Tu Infraestructura y Equipos",
                    level: "Nivel",
                    effects: {
                        drill: "+{value}% Producción General",
                        engine: "-{value} Energía por ciclo",
                        railcar: "+{value}% Prob. de Fragmento Raro"
                    }
                },
                referrals: {
                    title: "Residual y Programa de Afiliados",
                    subtitle: "Multiplica las ganancias con una red virtual multinivel de referidos (hasta 8 niveles).",
                    yourLink: "Tu Link",
                    copyLink: "Copiar Link",
                    leadershipRank: "Grado de Rango de Liderazgo",
                    rankCopy: "Tu comisión residual aumenta progresivamente según el volumen de ventas referido. Aumenta tu volumen de referidos para avanzar de Gno1 a Gno5!",
                    volumeAccumulated: "Volumen Referido Acumulado",
                    directLevel: "1er Nivel (Directos)",
                    level23: "2º al 3º Nivel",
                    level48: "4º al 8º Nivel",
                    nextRank: "Próximo Rango",
                    networkTitle: "Panel de Referidos Activos (Simulación de Red)",
                    networkSubtitle: "Usa el simulador de abajo para generar amigos y recibir residuales en tiempo real.",
                    inviteSimulated: "Invitar Amigo Simulado",
                    table: {
                        friend: "Amigo",
                        lineLevel: "Nivel de Línea",
                        dailyYield: "Rendimiento Diario",
                        activeVolume: "Volumen Activo",
                        yourCommission: "Tu Comisión (Residual)",
                        empty: "Todavía no hay invitados simulados. Haz clic arriba para invitar!",
                        residualLevel: "Nivel {line} (Residual)",
                        received: "Recibido"
                    },
                    rates: {
                        residual: "{rate} Residual"
                    },
                    copied: "Enlace de referido copiado al portapapeles!",
                    invited: "El invitado simulado {name} entró en el nivel {line}! Residual de red activado!"
                },
                wheel: {
                    title: "Ruleta de la Fortuna de GnoCripto",
                    subtitle: "Gira una vez gratis en cada ronda del juego para recolectar suministros!",
                    spin: "Girar y Revelar!",
                    surpriseResult: "Resultado Sorpresa",
                    waitingSpin: "Esperando giro",
                    hiddenPrize: "El premio real solo aparece cuando la ruleta se detiene.",
                    laneHidden: "Franja detenida: oculta",
                    lane: "Color: {color} • Item: {item}",
                    coolingDown: "Espera el enfriamiento de la ruleta de la fortuna!",
                    revealing: "Revelando sorpresa",
                    spinning: "Girando",
                    pendingLane: "Franja detenida: oculta",
                    feedback: "🎰 Ruleta de la Fortuna: {text}",
                    segments: {
                        gbcBag: "Bolsa GBC",
                        gbcBagTitle: "Bolsa revelada",
                        vitalLoad: "Carga Vital",
                        vitalLoadTitle: "Carga de energía",
                        turboBox: "Caja Turbo",
                        turboBoxTitle: "Caja turbo",
                        bscReserve: "Reserva BSC",
                        bscReserveTitle: "Reserva en USDT",
                        fog: "Niebla",
                        fogTitle: "Niebla de la suerte",
                        jackpot: "Jackpot",
                        jackpotTitle: "Jackpot del clan",
                        amber: "Ámbar",
                        blue: "Azul",
                        pink: "Rosa",
                        green: "Verde",
                        gray: "Gris",
                        gold: "Dorado",
                        noGain: "Sin ganancia"
                    }
                },
                missionUi: {
                    activeBoardTitle: "Tablero de Misiones Activas",
                    activeBoardCopy: "Supera cada fase, sigue tu avance y cobra cada recompensa mientras subes por el tablero.",
                    globalStatsTitle: "Logros y Estadísticas Globales",
                    globalStatsCopy: "Tus grandes hitos y las estadísticas que cuentan la historia de tu operación minera.",
                    readyToClaim: "Misión lista para cobrar: {phase} de \"{title}\".",
                    completedAll: "Misión \"{title}\" completada por completo! Recompensa final: +{reward} GBC.",
                    rewardClaimed: "Recompensa cobrada en \"{title}\" ({phase}): +{reward} GBC.",
                    claimed: "Cobrado",
                    collectPrize: "Cobrar premio",
                    inProgress: "En progreso",
                    locked: "Bloqueada",
                    phaseTrail: "Ruta de fases",
                    boardDone: "Tablero completado",
                    boardDoneCopy: "Ya cobraste todas las fases. Espera la próxima ronda de objetivos.",
                    noNextPhase: "Sin próxima fase",
                    noNextPhaseCopy: "Este tablero ya fue completado por completo.",
                    lastPhase: "Última fase",
                    lastPhaseCopy: "Termina y cobra la fase actual para cerrar este tablero.",
                    phasePrize: "Premio de esta fase",
                    nextPrize: "Próximo premio",
                    status: "Estado",
                    nextPhaseUnlock: "La próxima fase se desbloquea automáticamente cuando la fase actual sea cobrada.",
                    finalReward: "Recompensa final",
                    everythingClaimed: "Todo cobrado",
                    finishBoard: "Completa el tablero para llevártelo todo",
                    finalized: "Finalizado",
                    remainingGbc: "{value} GBC restantes",
                    boardTotal: "Total del tablero",
                    xpTotal: "+{value} XP total",
                    xpDistributed: "XP distribuido en las fases",
                    toReceive: "Por recibir",
                    noPending: "Sin pendientes",
                    xpRemaining: "{value} XP restante",
                    phasesClaimed: "{claimed}/{total} fases cobradas",
                    boardPercent: "{value}% del tablero",
                    currentPhase: "Fase actual",
                    finished: "Finalizada",
                    noPendingPrize: "Sin premio pendiente",
                    currentTab: "Fase actual",
                    nextTab: "Próxima",
                    finalTab: "Final",
                    missionTrail: "Ruta de progreso",
                    stats: {
                        totalMined: "Total Minado",
                        swappedUsdt: "Swap USDT",
                        luckySpins: "Giros de Suerte",
                        currentRank: "Rango Actual"
                    },
                    crisis: {
                        alert: "🚨 ALERTA GENERAL: Ocurrió un evento de <strong>{type}</strong>! Resuélvelo para restablecer la producción total.",
                        insufficient: "No hay suficientes GnoCriptos para actuar y frenar la crisis!",
                        resolved: "Excelente! La crisis fue resuelta y tus gnomos volvieron al trabajo regular."
                    }
                },
                audio: {
                    enabled: "Activado",
                    disabled: "Desactivado",
                    enabledFeedback: "Sonidos activados",
                    disabledFeedback: "Sonidos desactivados"
                },
                settings: {
                    platformTitle: "Configuración de la Plataforma",
                    platformCopy: "Gestiona tu billetera de retiro, opciones de sonido y acciones sensibles de la cuenta.",
                    withdrawalsEnabled: "Retiros habilitados:",
                    walletIntro: "Agrega varias billeteras USDT en la red BSC, elige la activa y úsala al retirar.",
                    currentDestination: "Destino actual",
                    preferencesTitle: "Preferencias",
                    preferencesCopy: "Controles rápidos para tu experiencia dentro del panel.",
                    soundEffects: "Efectos de Sonido",
                    soundEffectsCopy: "Activa o desactiva los sonidos de recolección, mejoras, alertas y ruleta.",
                    toggleSound: "Cambiar sonido",
                    historyTitle: "Historial de Transacciones",
                    historyCopy: "Muestra las compras de GnoCripto y los retiros en USDT realizados desde el panel.",
                    securityTitle: "Seguridad y Datos",
                    securityCopy: "Acciones sensibles relacionadas con tu perfil y tu progreso local.",
                    resetLocal: "Restablecer progreso local",
                    resetLocalCopy: "Borra el estado guardado en el navegador y reinicia minas, inventario, misiones y saldos del MVP.",
                    resetGame: "Restablecer Juego",
                    walletMain: "Billetera principal",
                    withdrawalWallet: "Billetera de Retiro",
                    walletName: "Nombre de la Billetera",
                    walletNamePlaceholder: "Ej.: Billetera principal",
                    walletAddress: "Dirección de la Billetera",
                    cancel: "Cancelar",
                    registeredWallets: "Billeteras Registradas",
                    noWalletConfigured: "Ninguna billetera configurada",
                    noWalletRegistered: "Ninguna billetera registrada",
                    addFirstWallet: "Agrega tu primera billetera USDT en la red BSC para habilitar los retiros.",
                    active: "Activa",
                    walletInUse: "Billetera en uso",
                    useForWithdrawal: "Usar para retiro",
                    edit: "Editar",
                    delete: "Eliminar",
                    withdrawalRequestTitle: "Solicitud de retiro en USDT",
                    purchaseTitle: "Compra de GnoCripto",
                    nextTransactions: "Tus próximos swaps y retiros aparecerán aquí.",
                    noTransactions: "No hay transacciones registradas",
                    internalSwap: "Swap interno",
                    source: "Origen",
                    destination: "Destino",
                    destinationWallet: "Billetera de destino",
                    internalBalance: "Saldo interno",
                    status: "Estado",
                    requestId: "ID de Solicitud",
                    payoutId: "ID de Payout",
                    remainingProcessing: "En proceso",
                    currentWalletNone: "Ninguna billetera configurada para retiro",
                    currentWalletHint: "Los retiros en USDT realizados por Swap se enviarán a la billetera activa seleccionada abajo.",
                    currentWalletHintEmpty: "Registra al menos una billetera USDT en la red BSC para habilitar retiros.",
                    addWallet: "Agregar billetera",
                    saveChanges: "Guardar cambios",
                    askWalletBeforeSaving: "Ingresa la billetera de retiro antes de guardar.",
                    invalidWallet: "Ingresa una dirección compatible con una billetera USDT en la red BSC/BEP20.",
                    duplicatedWallet: "Esta billetera ya está registrada en la lista.",
                    walletSaved: "Billetera de retiro guardada correctamente.",
                    walletActivated: "{label} definida como billetera activa de retiro.",
                    removeWalletConfirm: "¿Deseas eliminar la billetera \"{label}\" de la lista de retiros?",
                    walletDeleted: "Billetera eliminada correctamente."
                },
                statuses: {
                    queued_for_backend: "En cola del backend",
                    payout_created: "Payout creado",
                    processing: "Procesando payout",
                    done: "Pago realizado",
                    error: "Error en el payout",
                    rejected: "Retiro rechazado"
                },
                swap: {
                    walletActionTitle: "Billetera",
                    walletActionCopy: "Elige qué operación quieres abrir en el panel financiero del MVP.",
                    walletActionDepositTitle: "1. Depósito",
                    walletActionDepositCopy: "Convierte USDT en GnoCripto y acredita el valor en tu saldo interno del juego.",
                    walletActionWithdrawalTitle: "2. Retiro",
                    walletActionWithdrawalCopy: "Convierte GnoCripto en USDT y envíalo a la billetera BSC activa guardada en Ajustes.",
                    walletActionSwapTitle: "3. Swap",
                    walletActionSwapMode: "Modo todo en uno",
                    walletActionSwapCopy: "Abre el conversor principal para alternar entre depósito y retiro dentro del mismo modal.",
                    depositTitle: "Depósito vía BlockBee",
                    depositSubtitle: "Solo USDT BSC (BEP-20). Ingresa el valor, genera el QR y envía al usuario la dirección de depósito devuelta.",
                    depositNetwork: "Red de Depósito",
                    depositFlowCopy: "Este flujo ya está preparado para una futura integración con BlockBee a través del backend.",
                    depositAmountLabel: "Valor del Depósito en USDT",
                    depositMinCopy: "El depósito mínimo es de US$ 5.00.",
                    depositCreditPreview: "Crédito Previsto en el Juego",
                    blockbeeNote: "BlockBee: en la fase con backend, la aplicación llamará a la API del servidor para crear la solicitud de depósito, obtener dirección/QR y validar el pago por webhook. La API key no queda expuesta en el front-end.",
                    generateDeposit: "Generar Depósito BlockBee",
                    generatedRequest: "Solicitud Generada",
                    copyWallet: "Copiar Billetera",
                    exactAmount: "Valor Exacto",
                    confirmedCredit: "Crédito Tras Confirmación",
                    futureUxCopy: "Este MVP ya está preparado para el flujo futuro de BlockBee. Cuando llegue el backend, esta tarjeta recibirá la dirección y el QR reales devueltos por la API, y el saldo solo se acreditará tras la confirmación del pago.",
                    openPaymentUri: "Abrir payment_uri",
                    awaitingPayment: "Esperando pago",
                    source: "Origen",
                    destination: "Destino",
                    sourceAsset: "Origen del Activo",
                    destinationAsset: "Destino del Activo (Simulado)",
                    withdrawalDestination: "Destino del Retiro",
                    changeInSettings: "Cambiar en Ajustes",
                    importantNote: "Importante: los retiros externos de este MVP están limitados a USDT en la red BSC. La billetera activa seleccionada en Ajustes se usará como destino.",
                    confirmWithdrawalTitle: "Confirmar Retiro en USDT",
                    reviewTransfer: "Revisa los detalles de la transferencia antes de confirmar.",
                    fixedNetwork: "Red fija: BSC / BEP20",
                    selectedWallet: "Billetera Seleccionada",
                    confirmWithdrawal: "Confirmar Retiro",
                    withdrawalTitle: "Retiro de GnoCripto a USDT",
                    withdrawalSubtitle: "Convierte GnoCripto en USDT y envíalo a la billetera BSC activa configurada en el panel.",
                    swapTitle: "Swap instantáneo de GnoCripto y USDT",
                    swapSubtitleBuy: "Convierte USDT en GnoCripto con la tasa fija del MVP y acréditalo en tu saldo interno.",
                    swapSubtitleSell: "Convierte GnoCripto en USDT para retirarlo a la billetera BSC activa.",
                    requestWithdrawal: "Solicitar retiro",
                    confirmSwap: "Confirmar transacción de swap",
                    waitingPayment: "Esperando pago en USDT BSC",
                    minDepositWarning: "El depósito mínimo es de US$ 5.00 en USDT BSC (BEP-20).",
                    depositGenerated: "Solicitud de depósito generada. La dirección de BlockBee fue copiada al portapapeles.",
                    generateAddressFirst: "Primero genera una dirección de depósito para copiar.",
                    depositWalletCopied: "Billetera de depósito copiada al portapapeles.",
                    generateValidRequestFirst: "Primero genera una solicitud de depósito válida.",
                    internalPlatformBalance: "Saldo interno de la plataforma",
                    internalPlatformHelper: "Cuando compras GnoCripto, el valor convertido entra directamente en tu saldo del juego.",
                    noWalletConfigured: "Ninguna billetera configurada",
                    configureWallet: "Registra tu billetera BSC en Ajustes para habilitar retiros en USDT.",
                    withdrawalHelper: "Cuando retires, el USDT se enviará a la billetera activa seleccionada en la red BSC.",
                    configureAndSelectWallet: "Configura y selecciona una billetera USDT BSC antes de retirar.",
                    insufficientGbc: "Saldo de GnoCripto del juego insuficiente!",
                    backendRequestNote: "Solicitud preparada para que el backend genere el payout de BlockBee en USDT BSC. Ref: {requestId}.",
                    withdrawalSent: "Retiro en USDT BSC enviado: la solicitud de payout fue creada y ya está en procesamiento para {label} ({address}).",
                    valueMustBePositive: "El valor del swap debe ser mayor que cero!",
                    insufficientUsdt: "Saldo simulado de USDT insuficiente!",
                    internalDestination: "Saldo interno de la plataforma",
                    successPurchase: "Éxito! Swap completado. {amount} USDT convertidos en {gbc} GnoCripto.",
                    completed: "Retiro en USDT BSC completado con éxito para {label}.",
                    updated: "Retiro en USDT BSC actualizado: {status}.",
                    failed: "Retiro en USDT BSC con fallo: {status}.",
                    swapInternal: "Swap interno"
                }
            }
        };

        const I18N_DOMAIN_CONTENT = {
            en: {
                mines: {
                    mine_1: { name: "Starter Mine", reqText: "Available from the start", rhythm: "Steady Operation" },
                    mine_2: { name: "Intermediate Mine", reqText: "Requires Level 2 + 40 raw Iron in Inventory", rhythm: "Tactical Furnace" },
                    mine_3: { name: "Advanced Mine", reqText: "Requires Level 3 + 5 stored Silver", rhythm: "Gold Pressure" },
                    mine_4: { name: "Epic Mine", reqText: "Requires Level 4 + 1 Gold", rhythm: "Epic Crystallization" },
                    mine_5: { name: "Legendary Mine", reqText: "Requires Level 5 + 1 Diamond", rhythm: "Legendary Pulse" }
                },
                resources: {
                    "Ferro": "Iron",
                    "Bronze": "Bronze",
                    "Prata": "Silver",
                    "Chumbo": "Lead",
                    "Zinco": "Zinc",
                    "Cobre": "Copper",
                    "Ouro": "Gold",
                    "Platina": "Platinum",
                    "Diamante": "Diamond",
                    "Titânio": "Titanium",
                    "Adamantium": "Adamantium",
                    "Vibranium": "Vibranium"
                },
                collectibles: {
                    "Fragmento Polygonita": "Polygonite Shard",
                    "Fragmento Dogecrita": "Dogecrite Shard",
                    "Fragmento Tronita": "Tronite Shard",
                    "Fragmento Cardanita": "Cardanite Shard",
                    "Fragmento Xarpita": "Xarpita Shard"
                },
                gnomes: {
                    gnorin: {
                        role: "Veteran Miner",
                        gender: "Male",
                        rarity: "Common",
                        quote: "Slow and steady! One solid block at a time.",
                        bonusText: "Stable output +10%, consumes only 1% energy"
                    },
                    bortok: {
                        role: "Brute Force",
                        gender: "Male",
                        rarity: "Special",
                        quote: "MORE HAMMER BLOWS! Smash it all at once!",
                        bonusText: "Super output +30%, but consumes 4% energy and raises break risk"
                    },
                    zeldrik: {
                        role: "Mining Engineer",
                        gender: "Male",
                        rarity: "Special",
                        quote: "Greased bearings, happy gears. No collapse today!",
                        bonusText: "Reduces mine break chance by 50%"
                    },
                    faggro: {
                        role: "Risk Miner",
                        gender: "Male",
                        rarity: "Special",
                        quote: "I can smell pure Polygonite nearby!",
                        bonusText: "+35% chance to extract rare themed shards"
                    },
                    nyra: {
                        role: "Legendary Lead Gnome",
                        gender: "Female",
                        rarity: "Legendary",
                        quote: "Total efficiency, team! Work happy and rich!",
                        bonusText: "Synergy: +25% mining efficiency and excellent energy optimization"
                    }
                },
                missions: {
                    m1: {
                        title: "Collection Operation",
                        description: "Keep the mine rhythm and collect rewards in stages.",
                        phases: {
                            m1p1: { label: "Phase 1", text: "Perform 3 collections on the panel" },
                            m1p2: { label: "Phase 2", text: "Perform 5 more collections on the panel" },
                            m1p3: { label: "Phase 3", text: "Perform 8 more collections on the panel" }
                        }
                    },
                    m2: {
                        title: "Wheel Circuit",
                        description: "Advance through strategic spins and reveal progressive bonuses.",
                        phases: {
                            m2p1: { label: "Phase 1", text: "Spin the Fortune Wheel 1 time" },
                            m2p2: { label: "Phase 2", text: "Spin the Fortune Wheel 2 times" },
                            m2p3: { label: "Phase 3", text: "Spin the Fortune Wheel 3 times" }
                        }
                    },
                    m3: {
                        title: "Clan Expansion",
                        description: "Hire new gnomes and unlock tactical bonuses through recruitment.",
                        phases: {
                            m3p1: { label: "Phase 1", text: "Hire 1 new gnome in the shop" },
                            m3p2: { label: "Phase 2", text: "Hire 2 more gnomes in the shop" },
                            m3p3: { label: "Phase 3", text: "Hire 3 more gnomes in the shop" }
                        }
                    }
                },
                referralNames: {
                    "Patente Máxima Atingida": "Maximum rank reached"
                }
            },
            es: {
                mines: {
                    mine_1: { name: "Mina Inicial", reqText: "Disponible desde el inicio", rhythm: "Operación Estable" },
                    mine_2: { name: "Mina Intermedia", reqText: "Requiere Nivel 2 + 40 Hierro bruto en el Inventario", rhythm: "Horno Táctico" },
                    mine_3: { name: "Mina Avanzada", reqText: "Requiere Nivel 3 + 5 Plata acumuladas", rhythm: "Presión de Oro" },
                    mine_4: { name: "Mina Épica", reqText: "Requiere Nivel 4 + 1 Oro", rhythm: "Cristalización Épica" },
                    mine_5: { name: "Mina Legendaria", reqText: "Requiere Nivel 5 + 1 Diamante", rhythm: "Pulso Legendario" }
                },
                resources: {
                    "Ferro": "Hierro",
                    "Bronze": "Bronce",
                    "Prata": "Plata",
                    "Chumbo": "Plomo",
                    "Zinco": "Zinc",
                    "Cobre": "Cobre",
                    "Ouro": "Oro",
                    "Platina": "Platino",
                    "Diamante": "Diamante",
                    "Titânio": "Titanio",
                    "Adamantium": "Adamantium",
                    "Vibranium": "Vibranium"
                },
                collectibles: {
                    "Fragmento Polygonita": "Fragmento de Polygonita",
                    "Fragmento Dogecrita": "Fragmento de Dogecrita",
                    "Fragmento Tronita": "Fragmento de Tronita",
                    "Fragmento Cardanita": "Fragmento de Cardanita",
                    "Fragmento Xarpita": "Fragmento de Xarpita"
                },
                gnomes: {
                    gnorin: {
                        role: "Minero Veterano",
                        gender: "Macho",
                        rarity: "Común",
                        quote: "Despacio y con enfoque! Un bloque firme a la vez.",
                        bonusText: "Producción estable +10%, consume solo 1% de energía"
                    },
                    bortok: {
                        role: "Fuerza Bruta",
                        gender: "Macho",
                        rarity: "Especial",
                        quote: "MÁS GOLPES DE MARTILLO! Rompe todo de una vez!",
                        bonusText: "Súper producción +30%, pero consume 4% de energía y aumenta el riesgo de rotura"
                    },
                    zeldrik: {
                        role: "Ingeniero de Minas",
                        gender: "Macho",
                        rarity: "Especial",
                        quote: "Rodamiento engrasado, engranaje feliz. Ningún colapso hoy!",
                        bonusText: "Reduce en 50% la probabilidad de rotura en las minas"
                    },
                    faggro: {
                        role: "Minero de Riesgo",
                        gender: "Macho",
                        rarity: "Especial",
                        quote: "Siento olor a Polygonita pura por aquí!",
                        bonusText: "+35% de probabilidad de extraer fragmentos temáticos raros"
                    },
                    nyra: {
                        role: "Gnoma Jefa Legendaria",
                        gender: "Hembra",
                        rarity: "Legendaria",
                        quote: "Eficiencia total, equipo! Trabajen felices y ricos!",
                        bonusText: "Sinergia: +25% de eficiencia minera y excelente optimización de energía"
                    }
                },
                missions: {
                    m1: {
                        title: "Operación de Recolección",
                        description: "Mantén el ritmo de las minas y recoge recompensas por etapas.",
                        phases: {
                            m1p1: { label: "Fase 1", text: "Realiza 3 recolecciones en el panel" },
                            m1p2: { label: "Fase 2", text: "Realiza 5 recolecciones más en el panel" },
                            m1p3: { label: "Fase 3", text: "Realiza 8 recolecciones más en el panel" }
                        }
                    },
                    m2: {
                        title: "Circuito de la Ruleta",
                        description: "Avanza con giros estratégicos y revela bonos progresivos.",
                        phases: {
                            m2p1: { label: "Fase 1", text: "Gira la Ruleta de la Fortuna 1 vez" },
                            m2p2: { label: "Fase 2", text: "Gira la Ruleta de la Fortuna 2 veces" },
                            m2p3: { label: "Fase 3", text: "Gira la Ruleta de la Fortuna 3 veces" }
                        }
                    },
                    m3: {
                        title: "Expansión del Clan",
                        description: "Contrata nuevos gnomos y desbloquea bonos tácticos por reclutamiento.",
                        phases: {
                            m3p1: { label: "Fase 1", text: "Contrata 1 nuevo gnomo en la tienda" },
                            m3p2: { label: "Fase 2", text: "Contrata 2 gnomos más en la tienda" },
                            m3p3: { label: "Fase 3", text: "Contrata 3 gnomos más en la tienda" }
                        }
                    }
                },
                referralNames: {
                    "Patente Máxima Atingida": "Rango máximo alcanzado"
                }
            }
        };

        function getCurrentLanguage() {
            return gameState?.settings?.language || "pt-BR";
        }

        function getLocalizedDomainSection(section) {
            return I18N_DOMAIN_CONTENT[getCurrentLanguage()]?.[section] || {};
        }

        function getLocalizedMineField(id, field, fallback = "") {
            return getLocalizedDomainSection("mines")[id]?.[field] || fallback;
        }

        function getLocalizedResourceName(name) {
            return getLocalizedDomainSection("resources")[name] || name;
        }

        function getLocalizedCollectibleName(name) {
            return getLocalizedDomainSection("collectibles")[name] || name;
        }

        function getLocalizedGnomeField(key, field, fallback = "") {
            return getLocalizedDomainSection("gnomes")[key]?.[field] || fallback;
        }

        function getLocalizedMissionText(missionId, field, fallback = "") {
            return getLocalizedDomainSection("missions")[missionId]?.[field] || fallback;
        }

        function getLocalizedMissionPhase(missionId, phaseId, field, fallback = "") {
            return getLocalizedDomainSection("missions")[missionId]?.phases?.[phaseId]?.[field] || fallback;
        }

        function getLocaleForLanguage(language = getCurrentLanguage()) {
            if (language === "en") return "en-US";
            if (language === "es") return "es-ES";
            return "pt-BR";
        }

        function resolveTranslationPath(source, key) {
            return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), source);
        }

        function interpolateTranslation(template, vars = {}) {
            return String(template).replace(/\{(\w+)\}/g, (_, token) => vars[token] ?? `{${token}}`);
        }

        function t(key, vars = {}) {
            const currentLanguage = getCurrentLanguage();
            const selectedDictionary = I18N_TRANSLATIONS[currentLanguage] || I18N_TRANSLATIONS["pt-BR"];
            const fallbackDictionary = I18N_TRANSLATIONS["pt-BR"];
            const selectedValue = resolveTranslationPath(selectedDictionary, key);
            const fallbackValue = resolveTranslationPath(fallbackDictionary, key);
            const finalValue = selectedValue ?? fallbackValue ?? key;
            return typeof finalValue === "string" ? interpolateTranslation(finalValue, vars) : finalValue;
        }

        function formatGameNumber(value, options = {}) {
            return new Intl.NumberFormat(getLocaleForLanguage(), options).format(Number(value || 0));
        }

        function formatGameDate(timestamp, options) {
            return new Date(timestamp).toLocaleString(getLocaleForLanguage(), options);
        }

        function getLanguageDisplayName(language) {
            return t(`language.names.${language}`) || language;
        }

        function applyStaticTranslations(root = document) {
            if (!root?.querySelectorAll) return;

            root.querySelectorAll("[data-i18n]").forEach((element) => {
                element.textContent = t(element.dataset.i18n);
            });

            root.querySelectorAll("[data-i18n-html]").forEach((element) => {
                element.innerHTML = t(element.dataset.i18nHtml);
            });

            root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
                element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
            });

            root.querySelectorAll("[data-i18n-title]").forEach((element) => {
                element.setAttribute("title", t(element.dataset.i18nTitle));
            });

            document.title = t("app.title");
            document.documentElement.lang = t("app.lang");
        }

        function rerenderLocalizedUI() {
            applyStaticTranslations();

            if (typeof syncLanguageUI === "function") syncLanguageUI();
            if (typeof syncAudioUI === "function") syncAudioUI();
            if (typeof renderShop === "function") renderShop();
            if (typeof renderInventario === "function") renderInventario();
            if (typeof updateAffiliateSystem === "function") updateAffiliateSystem();
            if (typeof renderMissions === "function") renderMissions();
            if (typeof renderSettings === "function") renderSettings();
            if (typeof updateInvestmentAdvisor === "function") updateInvestmentAdvisor();
            if (typeof syncSwapModeLayout === "function") syncSwapModeLayout();
            if (typeof updateSwapPreview === "function") updateSwapPreview("language");
            if (typeof syncDepositPreview === "function") syncDepositPreview();
        }

        window.t = t;
        window.getCurrentLanguage = getCurrentLanguage;
        window.getLocaleForLanguage = getLocaleForLanguage;
        window.getLanguageDisplayName = getLanguageDisplayName;
        window.applyStaticTranslations = applyStaticTranslations;
        window.rerenderLocalizedUI = rerenderLocalizedUI;
        window.formatGameNumber = formatGameNumber;
        window.formatGameDate = formatGameDate;
        window.getLocalizedResourceName = getLocalizedResourceName;
        window.getLocalizedCollectibleName = getLocalizedCollectibleName;
        window.getLocalizedGnomeField = getLocalizedGnomeField;
        window.getLocalizedMissionText = getLocalizedMissionText;
        window.getLocalizedMissionPhase = getLocalizedMissionPhase;
        window.getLocalizedDomainSection = getLocalizedDomainSection;
        window.getLocalizedMineField = getLocalizedMineField;
