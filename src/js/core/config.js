        // Variável de controle de áudio
        let audioMuted = false;

        // Configurações Globais Balanceadas do Jogo
        const GAME_CONFIG = {
            cycleTimeSeconds: 15, // Mantido apenas para compatibilidade visual com códigos legados.
            cycleDisplayLabel: "6h por turno",
            mineCycleDurationMs: 6 * 60 * 60 * 1000,
            minePulseDurationMs: 5 * 60 * 1000,
            minePulseCount: 72,
            mineAutoCollectorCostGbc: 200,
            mineAutoCollectorDurationDays: 7,
            usdtToGbc: 100, // $1 = 100 GnoCripto
            initialGbc: 1000,
            initialUsdt: 10.00,
            xpPerLevelFactor: 150, // XP necessário por nível = nível * factor
        };

        // Banco de Dados Estático de Personagens (Os 5 Gnomos do Planejamento)
        const GNOME_DATABASE = {
            gnorin: {
                key: "gnorin",
                name: "Gnorin",
                gender: "Macho",
                role: "Minerador Veterano",
                quote: "Devagar e com foco! Um bloco firme por vez.",
                description: "Gnorin é o minerador mais antigo das fendas de GnoCripto. Seus cabelos grisalhos são o reflexo de anos de experiência sob condições de calor extremo. Embora não possua equipamentos sofisticados, sua intuição garante uma produção estável e livre de surpresas desagradáveis.",
                rarity: "Comum",
                bonusText: "Produção estável +10%, consome apenas 1% de energia",
                bonusProduction: 0.10,
                bonusBreakReduction: 0,
                bonusLuck: 0.05,
                maintenanceFactor: 0.01,
                costGbc: 150,
                durationDays: 7,
                svgId: "svg-gnorin",
                // Estatísticas de Ficha para a UI do popup (0-100)
                stats: { production: 55, luck: 30, resistance: 80, energy: 90 }
            },
            bortok: {
                key: "bortok",
                name: "Bortok",
                gender: "Macho",
                role: "Força Bruta",
                quote: "MAIS MARRETADAS! Quebre tudo de uma vez!",
                description: "Equipado com marretas pesadas e um temperamento explosivo, Bortok não acredita em medições geológicas. Ele entra na mina e quebra tudo à força bruta. Isso acelera imensamente a extração de recursos, mas sua falta de cuidado costuma avariar trilhos e detonar fusíveis, gerando riscos adicionais de quebras estruturais.",
                rarity: "Especial",
                bonusText: "Super produção +30%, mas consome 4% de energia e eleva riscos de quebra",
                bonusProduction: 0.30,
                bonusBreakReduction: -0.12, // Aumenta chance de quebrar
                bonusLuck: 0.10,
                maintenanceFactor: 0.04,
                costGbc: 300,
                durationDays: 14,
                svgId: "svg-bortok",
                stats: { production: 95, luck: 45, resistance: 20, energy: 35 }
            },
            zeldrik: {
                key: "zeldrik",
                name: "Zeldrik",
                gender: "Macho",
                role: "Engenheiro de Minas",
                quote: "Rolamento engraxado, engrenagem feliz. Nenhum colapso hoje!",
                description: "Formado pela Academia Imperial de Gnomos, Zeldrik é obcecado por metodologias e manutenções preventivas. Sob sua supervisão, os motores nunca superaquecem e as vigas de sustentação suportam o dobro do peso normal. Excelente para proteger investimentos de grande porte nas profundezas.",
                rarity: "Especial",
                bonusText: "Reduz chance de quebra em 50% nas minas",
                bonusProduction: 0.05,
                bonusBreakReduction: 0.50,
                bonusLuck: 0.05,
                maintenanceFactor: 0.02,
                costGbc: 250,
                durationDays: 7,
                svgId: "svg-zeldrik",
                stats: { production: 40, luck: 35, resistance: 95, energy: 75 }
            },
            faggro: {
                key: "faggro",
                name: "Faggro",
                gender: "Macho",
                role: "Minerador de Risco",
                quote: "Sinto cheiro de pepita de Polygonita purinha por perto!",
                description: "Faggro possui o lendário brinco dourado do Clã da Sorte. Ele parece ouvir os minérios chamando sob as superfícies de rochas opacas. Alocá-lo em minas avançadas quase sempre garante a descoberta de fragmentos cripto colecionáveis de altíssimo valor e raridade.",
                rarity: "Especial",
                bonusText: "+35% de chance de extrair fragmentos temáticos raros",
                bonusProduction: 0.12,
                bonusBreakReduction: 0.05,
                bonusLuck: 0.35,
                maintenanceFactor: 0.03,
                costGbc: 350,
                durationDays: 10,
                svgId: "svg-faggro",
                stats: { production: 65, luck: 95, resistance: 50, energy: 60 }
            },
            nyra: {
                key: "nyra",
                name: "Nyra",
                gender: "Fêmea",
                role: "Gnoma-Chefe Lendária",
                quote: "Eficiência total, equipe! Trabalhem felizes e ricos!",
                description: "Nyra é a líder indiscutível das equipes de mineração do clã. Com sua postura otimista e apito de comando de ouro, ela organiza as extrações em linhas de alta eficiência. O resultado é um aumento exponencial na produção concomitante a uma drástica redução de desperdício energético.",
                rarity: "Lendário",
                bonusText: "Sinergia: +25% eficiência de mineração e excelente otimização de energia",
                bonusProduction: 0.25,
                bonusBreakReduction: 0.20,
                bonusLuck: 0.15,
                maintenanceFactor: 0.015,
                costGbc: 500,
                durationDays: 30,
                svgId: "svg-nyra",
                stats: { production: 85, luck: 80, resistance: 85, energy: 88 }
            }
        };

        // Definição das 5 Minas Planejadas e Atributos de Equilíbrio (ROI 15% - 45% ao mês)
        // ROI diário calculado de 0.5% a 1.5% ao dia
        const MINE_DATABASE = [
            {
                id: "mine_1",
                name: "Mina Iniciante",
                baseCostGbc: 0, // Desbloqueada de início
                unlocked: true,
                resources: ["Ferro", "Bronze", "Prata"],
                collectibleName: "Fragmento Polygonita",
                stars: 1,
                assignedGnomes: [],
                capacityMax: 2,
                baseYieldGbc: 15, // Produção base por ciclo
                capitalBaseGbc: 1400,
                dailyRoiMin: 0.005,
                dailyRoiMax: 0.0075,
                breakChance: 0.05,
                reqText: "Disponível desde o início",
                themeColor: "from-slate-600 to-slate-400"
            },
            {
                id: "mine_2",
                name: "Mina Intermediária",
                baseCostGbc: 500,
                unlocked: false,
                unlockRequirement: {
                    level: 2,
                    resource: "Ferro",
                    amount: 40
                },
                resources: ["Chumbo", "Zinco", "Cobre"],
                collectibleName: "Fragmento Dogecrita",
                stars: 1,
                assignedGnomes: [],
                capacityMax: 2,
                baseYieldGbc: 45,
                capitalBaseGbc: 3200,
                dailyRoiMin: 0.006,
                dailyRoiMax: 0.0095,
                breakChance: 0.08,
                reqText: "Requer Nível 2 + 40 Ferro bruto no Inventário",
                themeColor: "from-amber-700 to-amber-900"
            },
            {
                id: "mine_3",
                name: "Mina Avançada",
                baseCostGbc: 1500,
                unlocked: false,
                unlockRequirement: {
                    level: 3,
                    resource: "Prata",
                    amount: 5
                },
                resources: ["Ouro", "Platina"],
                collectibleName: "Fragmento Tronita",
                stars: 1,
                assignedGnomes: [],
                capacityMax: 3,
                baseYieldGbc: 110,
                capitalBaseGbc: 7200,
                dailyRoiMin: 0.0075,
                dailyRoiMax: 0.0115,
                breakChance: 0.12,
                reqText: "Requer Nível 3 + 5 Prata acumulados",
                themeColor: "from-yellow-600 to-amber-500"
            },
            {
                id: "mine_4",
                name: "Mina Épica",
                baseCostGbc: 4000,
                unlocked: false,
                unlockRequirement: {
                    level: 4,
                    resource: "Ouro",
                    amount: 1
                },
                resources: ["Diamante", "Titânio"],
                collectibleName: "Fragmento Cardanita",
                stars: 1,
                assignedGnomes: [],
                capacityMax: 3,
                baseYieldGbc: 280,
                capitalBaseGbc: 14500,
                dailyRoiMin: 0.009,
                dailyRoiMax: 0.013,
                breakChance: 0.15,
                reqText: "Requer Nível 4 + 1 Ouro",
                themeColor: "from-cyan-600 to-indigo-600"
            },
            {
                id: "mine_5",
                name: "Mina Lendária",
                baseCostGbc: 9000,
                unlocked: false,
                unlockRequirement: {
                    level: 5,
                    resource: "Diamante",
                    amount: 1
                },
                resources: ["Adamantium", "Vibranium"],
                collectibleName: "Fragmento Xarpita",
                stars: 1,
                assignedGnomes: [],
                capacityMax: 4,
                baseYieldGbc: 650,
                capitalBaseGbc: 28000,
                dailyRoiMin: 0.0105,
                dailyRoiMax: 0.015,
                breakChance: 0.20,
                reqText: "Requer Nível 5 + 1 Diamante",
                themeColor: "from-purple-700 to-fuchsia-900"
            }
        ];

