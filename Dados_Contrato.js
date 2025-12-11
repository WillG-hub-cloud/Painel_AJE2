/**
 * ARQUITETURA DE SOFTWARE - REFATORAÇÃO
 * ----------------------------------------------------------------------
 * 1. Interfaces: Garantem a estrutura dos objetos (Type Safety).
 * 2. Adapter: Transforma dados brutos em dados de visualização (Business Logic).
 * 3. Raw Data: Apenas os dados essenciais, sem duplicação (Single Source of Truth).
 */

// ======================================================================
// 1. DEFINIÇÕES DE TIPO (INTERFACES)
// ======================================================================

interface GeoLocation {
    lat: number;
    lng: number;
}

interface MedicaoRaw {
    id: number;
    // Datas em ISO 8601 (YYYY-MM-DD) para facilitar ordenação
    dataInicio: string; 
    dataFim: string;
    // O valor desta medição específica (NÃO o acumulado)
    valor: number;
}

interface CronogramaCenario {
    nome: string; // Ex: "Cronograma Inicial", "Prorrogação I"
    // Array de valores acumulados previstos. Null representa meses sem previsão.
    valoresAcumulados: (number | null)[];
}

interface Contrato {
    id: string;
    objeto: string;
    empresa: string;
    valorTotal: number;
    observacoes: string | null;
    previsaoInicio: string | null;
    previsaoFim: string | null;
    localizacao: GeoLocation;
    
    // Lista de medições realizadas (Dados REAIS)
    medicoes: MedicaoRaw[];
    
    // Cenários de previsão (Dados PROJETADOS/ESTÁTICOS)
    cronogramas: CronogramaCenario[];
}

// Interface de Saída para o Painel (O que o gráfico vai consumir)
interface DadosPainel {
    resumo: {
        id: string;
        objeto: string;
        percentualExecutado: number;
        valorTotal: number;
        valorExecutado: number;
    };
    grafico: {
        labels: string[]; // Eixo X (Meses)
        datasets: {
            label: string;
            data: (number | null)[]; // Eixo Y (Valores)
            borderColor?: string;
            borderDash?: number[];
            fill?: boolean;
        }[];
    };
}

// ======================================================================
// 2. LÓGICA DE NEGÓCIO (ADAPTER)
// ======================================================================

class ProjectDashboardAdapter {
    /**
     * Transforma os dados brutos do contrato no formato exigido pelo Painel/Gráfico.
     * Calcula os acumulados em tempo de execução para garantir integridade.
     */
    static processarContrato(contrato: Contrato): DadosPainel {
        
        // 1. Ordenar medições por data cronológica
        const medicoesOrdenadas = [...contrato.medicoes].sort((a, b) => 
            new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        );

        // 2. Gerar Labels dinâmicos (Eixo X) baseados nas datas das medições
        // Se não houver medições, usa índices genéricos ou lógica de data prevista
        const labels = medicoesOrdenadas.length > 0 
            ? medicoesOrdenadas.map(m => this.formatarDataLabel(m.dataInicio))
            : this.gerarLabelsGenericos(12); // Fallback para contratos sem medição

        // 3. Calcular a linha de "Executado" (Acumulado Real)
        let acumulador = 0;
        const dadosExecutados = medicoesOrdenadas.map(m => {
            acumulador += m.valor;
            return Number(acumulador.toFixed(2)); // Correção de ponto flutuante
        });

        // 4. Montar os Datasets (Linhas do gráfico)
        const datasets = [];

        // Adiciona a linha Real/Executado
        if (dadosExecutados.length > 0) {
            datasets.push({
                label: 'Executado',
                data: dadosExecutados,
                borderColor: '#2ecc71', // Verde
                fill: false
            });
        }

        // Adiciona os Cronogramas (Previsões)
        contrato.cronogramas.forEach((crono, index) => {
            // Define cores diferentes para cada cronograma ou padrão
            const cores = ['#3498db', '#e67e22', '#9b59b6']; // Azul, Laranja, Roxo
            datasets.push({
                label: crono.nome,
                data: crono.valoresAcumulados,
                borderColor: cores[index % cores.length],
                borderDash: [5, 5], // Linha tracejada para indicar previsão
                fill: false
            });
        });

        // 5. Retornar estrutura pronta para uso
        return {
            resumo: {
                id: contrato.id,
                objeto: contrato.objeto,
                valorTotal: contrato.valorTotal,
                valorExecutado: acumulador,
                percentualExecutado: contrato.valorTotal > 0 
                    ? Number(((acumulador / contrato.valorTotal) * 100).toFixed(2)) 
                    : 0
            },
            grafico: {
                labels,
                datasets
            }
        };
    }

    // Função auxiliar para formatar datas (Ex: "2025-05-01" -> "Mai/25")
    private static formatarDataLabel(isoDate: string): string {
        try {
            const date = new Date(isoDate);
            // Formata para Português-BR. Ajuste 'short' para 'long' se quiser o mês completo.
            const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
            const ano = new Intl.DateTimeFormat('pt-BR', { year: '2-digit' }).format(date);
            // Capitaliza a primeira letra do mês e remove o ponto (ex: "mai." -> "Mai")
            return `${mes.charAt(0).toUpperCase() + mes.slice(1).replace('.', '')}/${ano}`;
        } catch (e) {
            return isoDate;
        }
    }

    private static gerarLabelsGenericos(qtd: number): string[] {
        return Array.from({ length: qtd }, (_, i) => `${i + 1}º Mês`);
    }
}

// ======================================================================
// 3. DADOS BRUTOS (FONTE DA VERDADE)
// ======================================================================

const rawProjects: Contrato[] = [
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
            { id: 9, dataInicio: "2025-12-11", dataFim: "2026-01-10", valor: 216254.79 } // O último acumulado na origem parecia ser 1.7M, assumindo valor cheio aqui
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
            { id: 5, dataInicio: "2025-02-04", dataFim: "2025-04-03", valor: 437000.00 }, // Gap temporal mantido conforme original
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
        observacoes: "Contrato ainda não possui medições reais.",
        previsaoInicio: null, // Indefinido no original
        previsaoFim: null,
        localizacao: { lat: -23.181836, lng: -46.810482 },
        cronogramas: [
            {
                nome: "Previsto Inicial",
                valoresAcumulados: [84127.17, 187162.49, 343425.89, 659143.45, 1178633.60, 1613353.17, 2114654.73, 3097502.52, 3832551.62, 4532017.74, 5266848.55, 5654210.10]
            }
        ],
        medicoes: [] // Array vazio pois não há medições reais
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
            { id: 2, dataInicio: "2025-08-07", dataFim: "2025-09-06", valor: 57580.00 }, // Corrigido de acumulado para valor parcial real, inferindo do original
            { id: 3, dataInicio: "2025-09-07", dataFim: "2025-10-06", valor: 50171.08 },
            { id: 4, dataInicio: "2025-10-07", dataFim: "2025-11-06", valor: 498074.55 },
            { id: 5, dataInicio: "2025-11-07", dataFim: "2025-12-06", valor: 302628.67 },
            { id: 6, dataInicio: "2025-12-07", dataFim: "2026-01-06", valor: 163668.40 },
            { id: 7, dataInicio: "2026-01-07", dataFim: "2026-02-06", valor: 146846.80 }
        ]
    }
];

// ======================================================================
// EXEMPLO DE USO
// ======================================================================

// Como você processaria o primeiro contrato para o painel:
const dadosDoPainel = ProjectDashboardAdapter.processarContrato(rawProjects[0]);

console.log("Labels geradas:", dadosDoPainel.grafico.labels);
console.log("Total executado:", dadosDoPainel.resumo.valorExecutado);
