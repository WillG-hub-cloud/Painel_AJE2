/**
 * DADOS_CONTRATO.JS - VERSÃO 2025.12.12-50.11 (CORRIGIDO)
 * CORREÇÕES: 
 * - Datas inexistentes (31 de abril/junho) ajustadas.
 * - Erro de sintaxe numérica (01.00).
 * - Remoção de contrato duplicado/template (CT 0XX).
 * - Correção de cronologia invertida no CT 127/24.
 * */

// ======================================================================
// 1. CLASSE ADAPTER
// ======================================================================

class ProjectDashboardAdapter {
    
    static processarContrato(contrato) {
        // 1. Ordenar medições por data
        const medicoesOrdenadas = [...contrato.medicoes].sort((a, b) => 
            new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        );

        // 2. Gerar Labels (Eixo X)
        const labels = medicoesOrdenadas.length > 0 
            ? medicoesOrdenadas.map(m => this.formatarDataLabel(m.dataFim))
            : this.gerarLabelsGenericos(12);

        // 3. Calcular Executado Acumulado
        let acumulador = 0;
        const dadosExecutados = medicoesOrdenadas.map(m => {
            if (m.valor === null) return null; // Retorna null para não plotar linha futura
            acumulador += m.valor;

            return Number(acumulador.toFixed(2));
        });

        // 4. Preparar Datasets de Previsão
        // Mapear os cronogramas reais
        const previstoDataSets = contrato.cronogramas.map(crono => ({
            label: crono.nome,
            data: crono.valoresAcumulados
        }));

        while (previstoDataSets.length < 3) {
            previstoDataSets.push({
                label: '', // Label vazia para não aparecer na legenda
                data: labels.map(() => null) // Array de nulos para não desenhar linha
            });
        }
        // -----------------------------

        // Fallback para o 'previsto' simples (pega o primeiro cronograma real)
        // Nota: Se cronograma for maior que medições, isso corta o gráfico visualmente, mas mantém integridade
        const previstoSimples = previstoDataSets.length > 0 ? previstoDataSets[0].data : [];

        // Monta o objeto grafico
        const objetoGrafico = {
            labels: labels,
            executado: dadosExecutados,
            previsto: previstoSimples,
            previstoDataSets: previstoDataSets
        };

        // Adapta as medições para o acumulado explícito
        let acumuladorMedicao = 0;
        const medicoesAdaptadas = medicoesOrdenadas.map(m => {
            // Só soma se não for nulo, para evitar NaN ou soma incorreta
            const val = m.valor === null ? 0 : m.valor;
            acumuladorMedicao += val;
            
            return {
                medicao: m.id,
                inicio: this.formatarDataISOparaBR(m.dataInicio),
                fim: this.formatarDataISOparaBR(m.dataFim),
                ref: this.formatarDataLabel(m.dataFim),
                valor: m.valor,
                // Se o valor for null (futuro), mantemos o acumulado anterior ou null? 
                // A lógica abaixo mantém o acumulado até o momento.
                acumulado: Number(acumuladorMedicao.toFixed(2))
            };
        });

        return {
            grafico: objetoGrafico,
            medicoes: medicoesAdaptadas
        };
    }

    // Converter: 2025-05-01 -> Mai/25
    static formatarDataLabel(isoDate) {
        if (!isoDate) return 'N/A';
        try {
            // Força timezone para evitar problemas de virada de dia
            const parts = isoDate.split('-');
            const date = new Date(parts[0], parts[1] - 1, parts[2]); 
            const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
            const ano = new Intl.DateTimeFormat('pt-BR', { year: '2-digit' }).format(date);
            return `${mes.charAt(0).toUpperCase() + mes.slice(1).replace('.', '')}/${ano}`;
        } catch (e) { return isoDate; }
    }

    // Converter: 2025-05-01 -> 01/05/2025
    static formatarDataISOparaBR(isoDate) {
        if (!isoDate) return 'N/A';
        const parts = isoDate.split('-');
        if (parts.length !== 3) return isoDate;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    static gerarLabelsGenericos(qtd) {
        return Array.from({ length: qtd }, (_, i) => `${i + 1}º Mês`);
    }
}

// ======================================================================
// 2. DADOS
// ======================================================================

const rawProjects = [
    {
        id: "CT 039/25",
        objeto: "EMEB Adail",
        empresa: "CDR Infra Inst. e Montag.",
        valorTotal: 1718878.29,
        observacoes: null,
        previsaoInicio: "2025-04-15",
        previsaoFim: "2026-01-10",
        localizacao: { lat: -23.22359379674732, lng: -46.85593132352297 },
        cronogramas: [
            { 
                nome: "Cronograma Inicial", 
                valoresAcumulados: [164490.45, 336423.85, 578404.56, 823300.17, 1029579.72, 1264982.08, 1502623.50, 1718875.29, null] 
            },
            { 
                nome: "Cronograma Prorrogação I", 
                valoresAcumulados: [null, null, 200391.22, 456648.02, 759827.63, 1147658.15, 1443929.50, 1718878.29, null] 
            },
            {
                nome: "Cronograma Prorrogação II",
                valoresAcumulados: [null, null, null, null, null, null, 1008975.63, 1372929.56, 1718878.29]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-04-15", dataFim: "2025-05-14", valor: 107178.95 },
            { id: 2, dataInicio: "2025-05-16", dataFim: "2025-06-15", valor: 17465.29 },
            { id: 3, dataInicio: "2025-06-16", dataFim: "2025-07-16", valor: 60448.43 },
            { id: 4, dataInicio: "2025-07-17", dataFim: "2025-08-16", valor: 155336.53 },
            { id: 5, dataInicio: "2025-08-17", dataFim: "2025-09-16", valor: 233719.93 },
            { id: 6, dataInicio: "2025-09-17", dataFim: "2025-10-17", valor: 231564.64 },
            { id: 7, dataInicio: "2025-10-18", dataFim: "2025-11-17", valor: null },
            { id: 8, dataInicio: "2025-11-18", dataFim: "2025-12-10", valor: null },
            { id: 9, dataInicio: "2025-12-11", dataFim: "2026-01-10", valor: null } 
        ]
    },
    {
        id: "CT 068/25",
        objeto: "EMEB Helena Galimberti",
        empresa: "SLN Telecom. e Eng. Ltda.",
        valorTotal: 6147641.86,
        observacoes: null,
        previsaoInicio: "2025-11-03",
        previsaoFim: "2026-08-29",
        localizacao: { lat: -23.190272, lng: -46.846775 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [718820.05, 1383231.27, 2358254.57, 2973815.30, 3455309.34, 4094193.64, 4695529.12, 5432647.44, 5949592.65, 6147641.86]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-11-03", dataFim: "2025-12-02", valor: null },
            { id: 2, dataInicio: "2025-12-03", dataFim: "2026-01-15", valor: null },
            { id: 3, dataInicio: "2026-01-03", dataFim: "2026-02-16", valor: null },
            { id: 4, dataInicio: "2026-02-03", dataFim: "2026-03-16", valor: null },
            { id: 5, dataInicio: "2026-03-03", dataFim: "2026-04-16", valor: null },
            { id: 6, dataInicio: "2026-04-03", dataFim: "2026-05-17", valor: null },
            { id: 7, dataInicio: "2026-05-03", dataFim: "2026-06-17", valor: null },
            { id: 8, dataInicio: "2026-06-03", dataFim: "2026-07-10", valor: null },
            { id: 9, dataInicio: "2026-07-03", dataFim: "2026-08-10", valor: null },
            { id: 10, dataInicio: "2026-08-03", dataFim: "2026-09-10", valor: null }
        ]
    },
    {
        id: "CT XX/25",
        objeto: "São Camilo - Tarumã",
        empresa: "TDF Ambiental e Comercial",
        valorTotal: 1770082.78,
        observacoes: null,
        previsaoInicio: "2026-01-15",
        previsaoFim: "2027-01-15",
        localizacao: { lat: -23.177839, lng: -46.868153 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [69973.48, 130003.37, 187196.75, 266837.17, 374604.97, 609343.03, 942331.21, 1221971.48, 1501467.20, 1770077.06]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2026-01-15", dataFim: "2026-02-14", valor: 1.00 },
            { id: 2, dataInicio: "2026-02-15", dataFim: "2026-03-14", valor: null },
            { id: 3, dataInicio: "2026-03-15", dataFim: "2026-04-14", valor: null },
            { id: 4, dataInicio: "2026-04-15", dataFim: "2026-05-14", valor: null },
            { id: 5, dataInicio: "2026-05-15", dataFim: "2026-06-14", valor: null },
            { id: 6, dataInicio: "2026-06-15", dataFim: "2026-07-14", valor: null },
            { id: 7, dataInicio: "2026-07-15", dataFim: "2026-08-14", valor: null },
            { id: 8, dataInicio: "2026-08-15", dataFim: "2026-09-14", valor: null },
            { id: 9, dataInicio: "2026-09-15", dataFim: "2026-10-14", valor: null },
            { id: 10, dataInicio: "2026-10-15", dataFim: "2026-11-14", valor: null },
            { iid: 11, dataInicio: "2026-11-15", dataFim: "2026-12-14", valor: null },
            { id: 12, dataInicio: "2027-12-15", dataFim: "2027-01-14", valor: null }
        ]
    },
    {
        id: "CT XXX/25",
        objeto: "Centro POP - Remanescente",
        empresa: "Viva Construções e Serviços Ltda",
        valorTotal: 2599735.66,
        observacoes: null,
        previsaoInicio: "2026-01-15",
        previsaoFim: "2027-01-15",
        localizacao: { lat: -23.191564, lng: -46.875864 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [124967.95, 264725.58, 458665.47, 747556.51, 1031172.00, 1362813.64, 1642562.37, 1916890.80, 2118393.98, 2290500.55, 2457541.08, 2599375.66]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2026-01-15", dataFim: "2026-02-14", valor: 1.00 },
            { id: 2, dataInicio: "2026-02-15", dataFim: "2026-03-14", valor: null },
            { id: 3, dataInicio: "2026-03-15", dataFim: "2026-04-14", valor: null },
            { id: 4, dataInicio: "2026-04-15", dataFim: "2026-05-14", valor: null },
            { id: 5, dataInicio: "2026-05-15", dataFim: "2026-06-14", valor: null },
            { id: 6, dataInicio: "2026-06-15", dataFim: "2026-07-14", valor: null },
            { id: 7, dataInicio: "2026-07-15", dataFim: "2026-08-14", valor: null },
            { id: 8, dataInicio: "2026-08-15", dataFim: "2026-09-14", valor: null },
            { id: 9, dataInicio: "2026-09-15", dataFim: "2026-10-14", valor: null },
            { id: 10, dataInicio: "2026-10-15", dataFim: "2026-11-14", valor: null },
            { iid: 11, dataInicio: "2026-11-15", dataFim: "2026-12-14", valor: null },
            { id: 12, dataInicio: "2027-12-15", dataFim: "2027-01-14", valor: null }
        ]
    },
    {
        id: "CT 127/24",
        objeto: "UBS Rio Branco",
        empresa: "CJM Construtora Ltda",
        valorTotal: 2664287.67,
        observacoes: "Aditivo extendendo término para novembro.",
        previsaoInicio: "2024-10-07",
        previsaoFim: "2025-11-03",
        localizacao: { lat: -23.17462221037069, lng: -46.88650911818413 },
        cronogramas: [
            {
                nome: "Cronograma Inicial",
                valoresAcumulados: [223098.81, 446197.62, 691408.56, 953063.11, 1526040.85, 1840857.74, 2157299.00, null, null, null, null, null]
            },
            {
                nome: "Cronograma Prorrogação I",
                valoresAcumulados: [null, null, null, null, 865259.02, 1174071.39, 1507373.86, 1755025.46, 1995363.70, 2157299.00, null, null]
            },
            {
                nome: "Cronograma Prorrogação II",
                valoresAcumulados: [null, null, null, null, null, null, 1397234.90, 1918166.99, 2172395.90, 2423619.18, 2664287.67]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2024-10-07", dataFim: "2024-11-05", valor: 147017.36 },
            { id: 2, dataInicio: "2024-11-06", dataFim: "2024-12-05", valor: 193930.07 },
            { id: 3, dataInicio: "2024-12-06", dataFim: "2025-01-04", valor: 78717.56 },
            { id: 4, dataInicio: "2025-01-05", dataFim: "2025-02-03", valor: 96409.89 },
            { id: 5, dataInicio: "2025-02-04", dataFim: "2025-04-03", valor: 377657.91 },
            { id: 6, dataInicio: "2025-04-04", dataFim: "2025-05-03", valor: 283688.17 },
            { id: 7, dataInicio: "2025-05-04", dataFim: "2025-07-03", valor: 219813.94 },
            { id: 8, dataInicio: "2025-07-04", dataFim: "2025-08-03", valor: 428791.93 },
            { id: 9, dataInicio: "2025-08-04", dataFim: "2025-09-03", valor: 254094.26 },
            { id: 10, dataInicio: "2025-09-04", dataFim: "2025-10-03", valor: 229350.96 },
            { id: 11, dataInicio: "2025-10-04", dataFim: "2025-11-03", valor: 199158.60},
            { id: 12, dataInicio: "2025-11-04", dataFim: "2025-12-03", valor: null } 
            // CORRIGIDO: dataFim estava 2025-11-03 (anterior ao inicio)
        ]
    },
    {
        id: "CT 036/25",
        objeto: "UBS Tamoio",
        empresa: "SLN Telecom. e Eng. Ltda",
        valorTotal: 6598840.00,
        observacoes: null,
        previsaoInicio: "2025-04-22",
        previsaoFim: "2026-04-21",
        localizacao: { lat: -23.189364, lng: -46.855773 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [321595.91, 975559.72, 1329606.69, 1603339.23, 2437385.26, 3264248.65, 4446317.27, 5419662.56, 6006782.35, 6347449.86, 6598840.00]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-04-22", dataFim: "2025-05-21", valor: 90152.14 },
            { id: 2, dataInicio: "2025-05-22", dataFim: "2025-06-21", valor: 0.00 },
            { id: 3, dataInicio: "2025-06-22", dataFim: "2025-07-21", valor: 310627.98 },
            { id: 4, dataInicio: "2025-07-22", dataFim: "2025-08-21", valor: 101087.70 },
            { id: 5, dataInicio: "2025-08-22", dataFim: "2025-09-21", valor: 73779.88 },
            { id: 6, dataInicio: "2025-09-22", dataFim: "2025-10-21", valor: 364031.79 },
            { id: 7, dataInicio: "2025-10-22", dataFim: "2025-11-21", valor: null },
            { id: 8, dataInicio: "2025-11-22", dataFim: "2025-12-21", valor: null },
            { id: 9, dataInicio: "2025-12-22", dataFim: "2026-01-21", valor: null },
            { id: 10, dataInicio: "2026-01-22", dataFim: "2026-02-21", valor: null },
            { id: 11, dataInicio: "2026-02-22", dataFim: "2026-03-21", valor: null },
            { id: 12, dataInicio: "2026-03-22", dataFim: "2026-04-21", valor: null }
        ]
    },
    {
        id: "CT 052/25",
        objeto: "UBS Ivoturucaia",
        empresa: "J.S.O. Constr. Ltda.",
        valorTotal: 5654210.10,
        observacoes: null,
        previsaoInicio: "2025-09-24",
        previsaoFim: "2026-09-23",
        localizacao: { lat: -23.181836, lng: -46.810482 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [84127.17, 187162.49, 343425.89, 659143.45, 1178633.60, 1613353.17, 2114654.73, 3097502.52, 3832551.62, 4532017.74, 5266848.55, 5654210.10]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-09-24", dataFim: "2025-10-21", valor: 232212.42 },
            { id: 2, dataInicio: "2025-10-22", dataFim: "2025-11-21", valor: 242268.80 },
            { id: 3, dataInicio: "2025-11-22", dataFim: "2025-12-21", valor: null },
            { id: 4, dataInicio: "2025-12-22", dataFim: "2026-01-21", valor: null },
            { id: 5, dataInicio: "2026-01-22", dataFim: "2026-02-21", valor: null },
            { id: 6, dataInicio: "2026-02-22", dataFim: "2026-03-21", valor: null },
            { id: 7, dataInicio: "2026-03-22", dataFim: "2026-04-21", valor: null },
            { id: 8, dataInicio: "2026-04-22", dataFim: "2026-05-21", valor: null },
            { id: 9, dataInicio: "2026-05-22", dataFim: "2026-06-21", valor: null },
            { id: 10, dataInicio: "2026-06-22", dataFim: "2026-07-21", valor: null },
            { id: 11, dataInicio: "2026-07-22", dataFim: "2026-08-21", valor: null },
            { id: 12, dataInicio: "2026-08-22", dataFim: "2026-09-21", valor: null }
        ]
    },
    {
        id: "CT 054/25",
        objeto: "UBS Maringá",
        empresa: "Studio Sabino & Souza A",
        valorTotal: 3629613.36,
        observacoes: null,
        previsaoInicio: "2025-06-16",
        previsaoFim: "2026-08-15",
        localizacao: { lat: -23.225261, lng: -46.882002 },
        cronogramas: [
            {
                nome: "Cronograma Inicial",
                valoresAcumulados: [292590.76, 534282.82, 632255.10, 726776.13, 906496.89, 1078035.34, 1375896.09, 1731815.40, 1939154.42, 2286895.77, 2770035.72, 3062222.23, 3398805.76, 3629613.36]
            },
            {
                nome: "Cronograma Prorrogação I",
                valoresAcumulados: [null, null, null, 453476.70, 682448.69, 1005437.35, 1308972.20, 1665743.54, 2226698.41, 2584618.50, 3011727.49, 3401989.43, 3592627.37, 3625286.12]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-06-16", dataFim: "2025-07-15", valor: 236656.05 },
            { id: 2, dataInicio: "2025-07-16", dataFim: "2025-08-15", valor: 0.00 },
            { id: 3, dataInicio: "2025-08-16", dataFim: "2025-09-15", valor: 0.00 },
            { id: 4, dataInicio: "2025-09-16", dataFim: "2025-10-15", valor: 190198.04 },
            { id: 5, dataInicio: "2025-10-16", dataFim: "2025-11-15", valor: 82641.51 },
            { id: 6, dataInicio: "2025-11-16", dataFim: "2025-12-15", valor: null },
            { id: 7, dataInicio: "2025-12-16", dataFim: "2026-01-15", valor: null },
            { id: 8, dataInicio: "2026-01-16", dataFim: "2026-02-15", valor: null },
            { id: 9, dataInicio: "2026-02-16", dataFim: "2026-03-15", valor: null },
            { id: 10, dataInicio: "2026-03-16", dataFim: "2026-04-15", valor: null },
            { id: 11, dataInicio: "2026-04-16", dataFim: "2026-05-15", valor: null },
            { id: 12, dataInicio: "2026-05-16", dataFim: "2026-06-15", valor: null },
            { id: 13, dataInicio: "2026-06-16", dataFim: "2026-07-15", valor: null },
            { id: 14, dataInicio: "2026-07-16", dataFim: "2026-08-15", valor: null }
        ]
    },
    {
        id: "CT 058/25",
        objeto: "UBS Rio Acima",
        empresa: "LBD Engenharia Ltda EPP",
        valorTotal: 4770000.00,
        observacoes: null,
        previsaoInicio: "2025-07-28",
        previsaoFim: "2026-09-20",
        localizacao: { lat: -23.115577, lng: -46.924531 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [651465.99, 886921.53, 1101058.16, 1308953.19, 1557227.57, 1921228.42, 2447932.45, 2849561.05, 3282672.65, 3730914.35, 4141572.63, 4429453.57, 4692270.84, 4770000.00]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-07-28", dataFim: "2025-08-27", valor: 252392.52 },
            { id: 2, dataInicio: "2025-08-28", dataFim: "2025-09-27", valor: 0.00 },
            { id: 3, dataInicio: "2025-09-28", dataFim: "2025-10-27", valor: 263241.65 },
            { id: 4, dataInicio: "2025-10-28", dataFim: "2025-11-27", valor: 487483.78 },
            { id: 5, dataInicio: "2025-11-28", dataFim: "2025-12-27", valor: null },
            { id: 6, dataInicio: "2025-12-28", dataFim: "2026-01-27", valor: null },
            { id: 7, dataInicio: "2026-01-28", dataFim: "2026-02-27", valor: null },
            { id: 8, dataInicio: "2026-02-28", dataFim: "2026-03-27", valor: null },
            { id: 9, dataInicio: "2026-03-28", dataFim: "2026-04-27", valor: null },
            { id: 10, dataInicio: "2026-04-28", dataFim: "2026-05-27", valor: null },
            { id: 11, dataInicio: "2026-05-28", dataFim: "2026-06-27", valor: null },
            { id: 12, dataInicio: "2026-06-28", dataFim: "2026-07-27", valor: null },
            { id: 13, dataInicio: "2026-07-28", dataFim: "2026-08-27", valor: null },
            { id: 14, dataInicio: "2026-08-28", dataFim: "2026-09-27", valor: null }
        ]
    },
    {
        id: "CT 097/25",
        objeto: "CEPA Vila Progresso - Remanescente",
        empresa: "Viva Construções e Serviços Ltda",
        valorTotal: 4803370.83,
        observacoes: "Remanescente da Obra, Continuidade do Contrato 001/23",
        previsaoInicio: "2025-12-01",
        previsaoFim: "2026-12-31",
        localizacao: { lat: -23.206561, lng: -46.872850 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [82138.49, 157129.44, 232120.39, 1216355.96, 1968161.70, 3072098.54, 3914259.62, 4439726.60, 4637938.52, 4914306.34, 5316700.21, 5891994.49, 6404494.44]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-12-01", dataFim: "2026-12-31", valor: 1.00 }, // CORRIGIDO: 01.00 -> 1.00
            { id: 2, dataInicio: "2026-01-01", dataFim: "2026-01-30", valor: null },
            { id: 3, dataInicio: "2026-02-01", dataFim: "2026-02-28", valor: null },
            { id: 4, dataInicio: "2026-03-01", dataFim: "2026-04-30", valor: null }, // CORRIGIDO: 31/04 -> 30/04
            { id: 5, dataInicio: "2026-04-01", dataFim: "2026-05-30", valor: null },
            { id: 6, dataInicio: "2026-05-01", dataFim: "2026-06-30", valor: null }, // CORRIGIDO: 31/06 -> 30/06
            { id: 7, dataInicio: "2026-06-01", dataFim: "2026-07-30", valor: null },
            { id: 8, dataInicio: "2026-07-01", dataFim: "2026-08-31", valor: null },
            { id: 9, dataInicio: "2026-08-01", dataFim: "2026-09-30", valor: null },
            { id: 10, dataInicio: "2026-09-01", dataFim: "2026-10-31", valor: null },
            { id: 11, dataInicio: "2026-10-01", dataFim: "2026-11-30", valor: null },
            { id: 12, dataInicio: "2026-12-01", dataFim: "2026-12-31", valor: null }
        ]
    },

    {
        id: "CT 048/25",
        objeto: "CECE Romão",
        empresa: "Adriana Rodrigues Belles",
        valorTotal: 1480000.00,
        observacoes: "OS Emitida em 07/07/2025",
        previsaoInicio: "2025-07-07",
        previsaoFim: "2026-02-06",
        localizacao: { lat: -23.184126, lng: -46.853513 },
        cronogramas: [
            {
                nome: "Cronograma Inicial",
                valoresAcumulados: [149571.75, 730716.85, 1300261.90, 1480000.00, null, null, null]
            },
            {
                nome: "Cronograma Prorrogação I",
                valoresAcumulados: [null, null, 368781.58, 866856.13, 1169484.80, 1333153.20, 1480000.00]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-07-07", dataFim: "2025-08-06", valor: 261030.50 },
            { id: 2, dataInicio: "2025-08-07", dataFim: "2025-09-06", valor: 0.00 },
            { id: 3, dataInicio: "2025-09-07", dataFim: "2025-10-06", valor: 105199.37 },
            { id: 4, dataInicio: "2025-10-07", dataFim: "2025-11-06", valor: 186933.97 },
            { id: 5, dataInicio: "2025-11-07", dataFim: "2025-12-06", valor: null },
            { id: 6, dataInicio: "2025-12-07", dataFim: "2026-01-06", valor: null },
            { id: 7, dataInicio: "2026-01-07", dataFim: "2026-02-06", valor: null }
        ]
    }
];

// ======================================================================
// 3. EXPORTAÇÃO COMPATÍVEL (PONTE PARA O HTML)
// ======================================================================

// Cria a variável 'projectData' que o HTML espera
var projectData = rawProjects.map(p => {

    const processado = ProjectDashboardAdapter.processarContrato(p);

    // Retorna o objeto no formato que o HTML exige
    return {
        id: p.id,
        objeto: p.objeto,
        empresa: p.empresa,
        valorAtual: p.valorTotal, //'valorAtual' mapeado de 'valorTotal'
        observacoes: p.observacoes,
        predicted_start_date: ProjectDashboardAdapter.formatarDataISOparaBR(p.previsaoInicio),
        predicted_end_date: ProjectDashboardAdapter.formatarDataISOparaBR(p.previsaoFim),
        location: p.localizacao,
        
        medicoes: processado.medicoes,
        grafico: processado.grafico
    };
});










