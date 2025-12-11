/**
 * ARQUITETURA DE DADOS - VERSÃO JAVASCRIPT (COMPATÍVEL)
 * Este arquivo contém os dados brutos e uma camada de adaptação
 * para alimentar o HTML existente sem necessidade de alterá-lo.
 */

// ======================================================================
// 1. CLASSE ADAPTER (LÓGICA DE NEGÓCIO)
// ======================================================================

class ProjectDashboardAdapter {
    
    static processarContrato(contrato) {
        // 1. Ordenar medições por data
        const medicoesOrdenadas = [...contrato.medicoes].sort((a, b) => 
            new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        );

        // 2. Gerar Labels (Eixo X)
        const labels = medicoesOrdenadas.length > 0 
            ? medicoesOrdenadas.map(m => this.formatarDataLabel(m.dataInicio))
            : this.gerarLabelsGenericos(12);

        // 3. Calcular Executado Acumulado
        let acumulador = 0;
        const dadosExecutados = medicoesOrdenadas.map(m => {
            acumulador += m.valor;
            return Number(acumulador.toFixed(2));
        });

        // 4. Preparar Datasets de Previsão
        // Mapeia os cronogramas novos para o formato que o HTML espera (previstoDataSets)
        const previstoDataSets = contrato.cronogramas.map(crono => ({
            label: crono.nome,
            data: crono.valoresAcumulados
        }));

        // Fallback para o 'previsto' simples (pega o primeiro cronograma)
        const previstoSimples = previstoDataSets.length > 0 ? previstoDataSets[0].data : [];

        // Monta o objeto grafico no formato antigo
        const objetoGrafico = {
            labels: labels,
            executado: dadosExecutados,
            previsto: previstoSimples,
            previstoDataSets: previstoDataSets
        };

        // Adapta as medições para o formato antigo (com acumulado explícito)
        let acumuladorMedicao = 0;
        const medicoesAdaptadas = medicoesOrdenadas.map(m => {
            acumuladorMedicao += m.valor;
            return {
                medicao: m.id,
                inicio: this.formatarDataISOparaBR(m.dataInicio),
                fim: this.formatarDataISOparaBR(m.dataFim),
                ref: this.formatarDataLabel(m.dataInicio),
                valor: m.valor,
                acumulado: Number(acumuladorMedicao.toFixed(2))
            };
        });

        return {
            grafico: objetoGrafico,
            medicoes: medicoesAdaptadas
        };
    }

    // Auxiliar: 2025-05-01 -> Mai/25
    static formatarDataLabel(isoDate) {
        if (!isoDate) return 'N/A';
        try {
            // Ajuste de fuso horário simples adicionando horas para evitar dia anterior
            const date = new Date(isoDate + 'T12:00:00'); 
            const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
            const ano = new Intl.DateTimeFormat('pt-BR', { year: '2-digit' }).format(date);
            return `${mes.charAt(0).toUpperCase() + mes.slice(1).replace('.', '')}/${ano}`;
        } catch (e) { return isoDate; }
    }

    // Auxiliar: 2025-05-01 -> 01/05/2025
    static formatarDataISOparaBR(isoDate) {
        if (!isoDate) return 'N/A';
        const parts = isoDate.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    static gerarLabelsGenericos(qtd) {
        return Array.from({ length: qtd }, (_, i) => `${i + 1}º Mês`);
    }
}

// ======================================================================
// 2. DADOS BRUTOS (FONTE DA VERDADE LIMPA)
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
            { id: 1, dataInicio: "2025-04-15", dataFim: "2025-05-14", valor: 124644.24 },
            { id: 2, dataInicio: "2025-05-16", dataFim: "2025-06-15", valor: 171933.40 },
            { id: 3, dataInicio: "2025-06-16", dataFim: "2025-07-16", valor: 241980.72 },
            { id: 4, dataInicio: "2025-07-17", dataFim: "2025-08-16", valor: 244895.61 },
            { id: 5, dataInicio: "2025-08-17", dataFim: "2025-09-16", valor: 206279.55 },
            { id: 6, dataInicio: "2025-09-17", dataFim: "2025-10-17", valor: 235402.36 },
            { id: 7, dataInicio: "2025-10-18", dataFim: "2025-11-17", valor: 237641.42 },
            { id: 8, dataInicio: "2025-11-18", dataFim: "2025-12-10", valor: 216254.79 },
            { id: 9, dataInicio: "2025-12-11", dataFim: "2026-01-10", valor: 216254.79 } 
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
                valoresAcumulados: [223098.81, 446197.62, 691408.56, 953063.11, 1526040.85, null, null, null, null, null, null, null]
            },
            {
                nome: "Cronograma Prorrogação I",
                valoresAcumulados: [null, null, null, null, 865259.02, 1174071.39, 1507373.86, null, null, null, null, null]
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
            { id: 5, dataInicio: "2025-02-04", dataFim: "2025-04-03", valor: 437000.00 },
            { id: 6, dataInicio: "2025-04-04", dataFim: "2025-05-03", valor: 308812.37 },
            { id: 7, dataInicio: "2025-05-04", dataFim: "2025-06-03", valor: 333302.47 },
            { id: 8, dataInicio: "2025-06-04", dataFim: "2025-08-03", valor: 265536.22 },
            { id: 9, dataInicio: "2025-07-04", dataFim: "2025-09-03", valor: 255395.87 },
            { id: 10, dataInicio: "2025-08-04", dataFim: "2025-10-03", valor: 149312.68 },
            { id: 11, dataInicio: "2025-09-04", dataFim: "2025-11-03", valor: 251223.27 },
            { id: 12, dataInicio: "2025-10-04", dataFim: "2025-11-03", valor: 240668.48 }
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
            { id: 2, dataInicio: "2025-05-22", dataFim: "2025-06-21", valor: 414541.33 },
            { id: 3, dataInicio: "2025-06-22", dataFim: "2025-07-21", valor: 239422.48 },
            { id: 4, dataInicio: "2025-07-22", dataFim: "2025-08-21", valor: 354046.97 },
            { id: 5, dataInicio: "2025-08-22", dataFim: "2025-09-21", valor: 273732.54 },
            { id: 6, dataInicio: "2025-09-22", dataFim: "2025-10-21", valor: 834046.03 },
            { id: 7, dataInicio: "2025-10-22", dataFim: "2025-11-21", valor: 826863.39 },
            { id: 8, dataInicio: "2025-11-22", dataFim: "2025-12-21", valor: 1182068.62 },
            { id: 9, dataInicio: "2025-12-22", dataFim: "2026-01-21", valor: 973345.29 },
            { id: 10, dataInicio: "2026-01-22", dataFim: "2026-02-21", valor: 587119.79 },
            { id: 11, dataInicio: "2026-02-22", dataFim: "2026-03-21", valor: 340667.51 },
            { id: 12, dataInicio: "2026-03-22", dataFim: "2026-04-21", valor: 251390.14 }
        ]
    },
    {
        id: "CT 052/25",
        objeto: "UBS Ivoturucaia",
        empresa: "J.S.O. Constr. Ltda.",
        valorTotal: 5654210.10,
        observacoes: "Contrato ainda não possui medições.",
        previsaoInicio: null, 
        previsaoFim: null,
        localizacao: { lat: -23.181836, lng: -46.810482 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [84127.17, 187162.49, 343425.89, 659143.45, 1178633.60, 1613353.17, 2114654.73, 3097502.52, 3832551.62, 4532017.74, 5266848.55, 5654210.10]
            }
        ],
        medicoes: []
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
            { id: 1, dataInicio: "2025-06-16", dataFim: "2025-07-15", valor: 292590.76 },
            { id: 2, dataInicio: "2025-07-16", dataFim: "2025-08-15", valor: 241692.06 },
            { id: 3, dataInicio: "2025-08-16", dataFim: "2025-09-15", valor: 97972.28 },
            { id: 4, dataInicio: "2025-09-16", dataFim: "2025-10-15", valor: 94521.03 },
            { id: 5, dataInicio: "2025-10-16", dataFim: "2025-11-15", valor: 179720.76 },
            { id: 6, dataInicio: "2025-11-16", dataFim: "2025-12-15", valor: 171538.45 },
            { id: 7, dataInicio: "2025-12-16", dataFim: "2026-01-15", valor: 297860.75 },
            { id: 8, dataInicio: "2026-01-16", dataFim: "2026-02-15", valor: 355919.31 },
            { id: 9, dataInicio: "2026-02-16", dataFim: "2026-03-15", valor: 207339.02 },
            { id: 10, dataInicio: "2026-03-16", dataFim: "2026-04-15", valor: 347741.35 },
            { id: 11, dataInicio: "2026-04-16", dataFim: "2026-05-15", valor: 483139.95 },
            { id: 12, dataInicio: "2026-05-16", dataFim: "2026-06-15", valor: 292186.51 },
            { id: 13, dataInicio: "2026-06-16", dataFim: "2026-07-15", valor: 336583.53 },
            { id: 14, dataInicio: "2026-07-16", dataFim: "2026-08-15", valor: 230807.60 }
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
            { id: 1, dataInicio: "2025-07-28", dataFim: "2025-08-27", valor: 651465.99 },
            { id: 2, dataInicio: "2025-08-28", dataFim: "2025-09-27", valor: 235455.54 },
            { id: 3, dataInicio: "2025-09-28", dataFim: "2025-10-27", valor: 214136.63 },
            { id: 4, dataInicio: "2025-10-28", dataFim: "2025-11-27", valor: 207896.03 },
            { id: 5, dataInicio: "2025-11-28", dataFim: "2025-12-27", valor: 248274.38 },
            { id: 6, dataInicio: "2025-12-28", dataFim: "2026-01-27", valor: 364000.85 },
            { id: 7, dataInicio: "2026-01-28", dataFim: "2026-02-27", valor: 526704.03 },
            { id: 8, dataInicio: "2026-02-28", dataFim: "2026-03-27", valor: 401628.60 },
            { id: 9, dataInicio: "2026-03-28", dataFim: "2026-04-27", valor: 433111.60 },
            { id: 10, dataInicio: "2026-04-28", dataFim: "2026-05-27", valor: 448241.70 },
            { id: 11, dataInicio: "2026-05-28", dataFim: "2026-06-27", valor: 410658.28 },
            { id: 12, dataInicio: "2026-06-28", dataFim: "2026-07-27", valor: 287880.94 },
            { id: 13, dataInicio: "2026-07-28", dataFim: "2026-08-27", valor: 262817.27 },
            { id: 14, dataInicio: "2026-08-28", dataFim: "2026-09-27", valor: 77729.16 }
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
                nome: "Previsto Inicial",
                valoresAcumulados: [149571.75, 318610.50, 368781.58, 866856.13, 1169484.80, 1333153.20, 1480000.00]
            }
        ],
        medicoes: [
            { id: 1, dataInicio: "2025-07-07", dataFim: "2025-08-06", valor: 149571.75 },
            { id: 2, dataInicio: "2025-08-07", dataFim: "2025-09-06", valor: 57580.00 },
            { id: 3, dataInicio: "2025-09-07", dataFim: "2025-10-06", valor: 50171.08 },
            { id: 4, dataInicio: "2025-10-07", dataFim: "2025-11-06", valor: 498074.55 },
            { id: 5, dataInicio: "2025-11-07", dataFim: "2025-12-06", valor: 302628.67 },
            { id: 6, dataInicio: "2025-12-07", dataFim: "2026-01-06", valor: 163668.40 },
            { id: 7, dataInicio: "2026-01-07", dataFim: "2026-02-06", valor: 146846.80 }
        ]
    }
];

// ======================================================================
// 3. EXPORTAÇÃO COMPATÍVEL (PONTE PARA O HTML ANTIGO)
// ======================================================================

// Aqui está a mágica: Criamos a variável 'projectData' que o HTML espera,
// mas usamos o Adapter para gerar os dados calculados automaticamente.

var projectData = rawProjects.map(p => {
    // Processa os dados brutos usando a lógica do Adapter
    const processado = ProjectDashboardAdapter.processarContrato(p);

    // Retorna o objeto no formato EXATO que o HTML antigo exige
    return {
        id: p.id,
        objeto: p.objeto,
        empresa: p.empresa,
        valorAtual: p.valorTotal, // HTML usa 'valorAtual', nós mapeamos de 'valorTotal'
        observacoes: p.observacoes,
        predicted_start_date: ProjectDashboardAdapter.formatarDataISOparaBR(p.previsaoInicio),
        predicted_end_date: ProjectDashboardAdapter.formatarDataISOparaBR(p.previsaoFim),
        location: p.localizacao,
        
        // O Adapter já gerou 'medicoes' com acumulados e 'grafico' com arrays prontos
        medicoes: processado.medicoes,
        grafico: processado.grafico
    };
});
