/**
 * ARQUITETURA DE DADOS E INTERFACES
 * ----------------------------------------------------------------------
 * Define o contrato estrito para os dados do projeto.
 */

// Interface para geo-localização
interface GeoLocation {
  lat: number;
  lng: number;
}

// Interface para cada medição individual
interface ContractMeasurement {
  id: number;               // Identificador sequencial da medição
  label: string;            // Rótulo visual (ex: "1", "1º Mês")
  startDate: string | null; // Data ISO 8601 (YYYY-MM-DD) ou null se não definido
  endDate: string | null;   // Data ISO 8601 (YYYY-MM-DD) ou null
  refMonth: string | null;  // Referência (ex: "2025-05")
  value: number;            // Valor da medição (mantido float para compatibilidade com os dados originais, idealmente seria integer/centavos)
  accumulated: number;      // Valor acumulado
}

// Interface para os datasets do gráfico (Padrão Chart.js)
interface ChartDataset {
  label: string;
  data: (number | null)[];
  borderColor?: string;     // Opcional para customização de cor
}

// Interface unificada para os dados do gráfico
interface ContractChartData {
  labels: string[];
  datasets: ChartDataset[];       // Substitui 'previsto' e 'previstoDataSets'
  executedData: (number | null)[]; // Dados reais executados
}

// Interface principal do Contrato
interface ProjectContract {
  id: string;
  objectName: string;         // 'objeto'
  companyName: string;        // 'empresa'
  currentValue: number;       // 'valorAtual'
  notes: string | null;       // 'observacoes'
  measurements: ContractMeasurement[];
  chartData: ContractChartData;
  predictedStartDate: string | null; // ISO 8601
  predictedEndDate: string | null;   // ISO 8601
  location: GeoLocation;
}

/**
 * FONTE DE DADOS DO PROJETO
 * ----------------------------------------------------------------------
 * Dados normalizados e prontos para produção.
 */
export const projectData: ProjectContract[] = [
    {
        id: "CT 039/25",
        objectName: "EMEB Adail",
        companyName: "CDR Infra Inst. e Montag.",
        currentValue: 1718878.29,
        notes: null,
        measurements: [
            { id: 1, label: "1", startDate: "2025-04-15", endDate: "2025-05-14", refMonth: "Mai/25", value: 124644.24, accumulated: 124644.24 },
            { id: 2, label: "2", startDate: "2025-05-16", endDate: "2025-06-15", refMonth: "Jun/25", value: 171933.40, accumulated: 336423.85 },
            { id: 3, label: "3", startDate: "2025-06-16", endDate: "2025-07-16", refMonth: "Jul/25", value: 241980.72, accumulated: 578404.57 },
            { id: 4, label: "4", startDate: "2025-07-17", endDate: "2025-08-16", refMonth: "Ago/25", value: 244895.61, accumulated: 823300.18 },
            { id: 5, label: "5", startDate: "2025-08-17", endDate: "2025-09-16", refMonth: "Set/25", value: 206279.55, accumulated: 1029579.73 },
            { id: 6, label: "6", startDate: "2025-09-17", endDate: "2025-10-17", refMonth: "Out/25", value: 235402.36, accumulated: 1264982.09 },
            { id: 7, label: "7", startDate: "2025-10-18", endDate: "2025-11-17", refMonth: "Nov/25", value: 237641.42, accumulated: 1502623.51 },
            { id: 8, label: "8", startDate: "2025-11-18", endDate: "2025-12-10", refMonth: "Dez/25", value: 216254.79, accumulated: 1372929.56 },
            { id: 9, label: "9", startDate: "2025-12-11", endDate: "2026-01-10", refMonth: "Jan/26", value: 216254.79, accumulated: 1718878.30 },
        ],
        chartData: {
            labels: ["Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26"],
            datasets: [
                { label: "Cronograma Inicial", data: [164490.45, 336423.85, 578404.56, 823300.17, 1029579.72, 1264982.08, 1502623.50, 1718875.29, null] },
                { label: "Cronograma Prorrogação I", data: [null, null, 200391.22, 456648.02, 759827.63, 1147658.15, 1443929.50, 1718878.29, null] },
                { label: "Cronograma Prorrogação II", data: [null, null, null, null, null, null, 1008975.63, 1372929.56, 1718878.29] }
            ],
            executedData: [107178.95, 124644.24, 185092.67, 340430.46, 574149.13, 805713.77, 972077.83, null, null],
        },
        predictedStartDate: '2025-04-15',
        predictedEndDate: '2026-01-10',
        location: { lat: -23.22359379674732, lng: -46.85593132352297 }
    },
    {
        id: "CT 127/24",
        objectName: "UBS Rio Branco",
        companyName: "CJM Construtora Ltda",
        currentValue: 2664287.67,
        notes: "Além do novo cronograma, adotado a partir de abril, foi protocolado novo aditivo que extenderá o contrato para término em novembro.",
        measurements: [
            { id: 1, label: "1", startDate: '2024-10-07', endDate: '2024-11-05', refMonth: 'Nov/24', value: 147017.36, accumulated: 147017.36 },
            { id: 2, label: "2", startDate: '2024-11-06', endDate: '2024-12-05', refMonth: 'Dez/24', value: 193930.07, accumulated: 340947.43 },
            { id: 3, label: "3", startDate: '2024-12-06', endDate: '2025-01-04', refMonth: 'Jan/25', value: 78717.56, accumulated: 419664.99 },
            { id: 4, label: "4", startDate: '2025-01-05', endDate: '2025-02-03', refMonth: 'Fev/25', value: 96409.89, accumulated: 516074.88 },
            { id: 5, label: "5", startDate: '2025-02-04', endDate: '2025-04-03', refMonth: 'Abr/25', value: 437000.00, accumulated: 1220155.93 },
            { id: 6, label: "6", startDate: '2025-04-04', endDate: '2025-05-03', refMonth: 'Mai/25', value: 308812.37, accumulated: 1174071.39 },
            { id: 7, label: "7", startDate: '2025-05-04', endDate: '2025-06-03', refMonth: 'Jun/25', value: 333302.47, accumulated: 1507373.86 },
            { id: 8, label: "8", startDate: '2025-06-04', endDate: '2025-08-03', refMonth: 'Jul/25', value: 265536.22, accumulated: 1772910.08 },
            { id: 9, label: "9", startDate: '2025-07-04', endDate: '2025-09-03', refMonth: 'Ago/25', value: 255395.87, accumulated: 2028305.95 },
            { id: 10, label: "10", startDate: '2025-08-04', endDate: '2025-10-03', refMonth: 'Set/25', value: 149312.68, accumulated: 2177618.63 },
            { id: 11, label: "11", startDate: '2025-09-04', endDate: '2025-11-03', refMonth: 'Out/25', value: 251223.27, accumulated: 2428841.90 },
            { id: 12, label: "12", startDate: '2025-10-04', endDate: '2025-11-03', refMonth: 'Nov/25', value: 240668.48, accumulated: 2669510.38 },
        ],
        chartData: {
            labels: ["Nov/24", "Dez/24", "Jan/25", "Fev/25", "Abr/25", "Mai/25", "Jun/25", "Ago/25", "Set/25", "Out/25", "Nov/25"],
            datasets: [
                { label: "Cronograma Inicial", data: [223098.81, 446197.62, 691408.56, 953063.11, 1526040.85, null, null, null, null, null, null, null] },
                { label: "Cronograma Prorrogação I", data: [null, null, null, null, 865259.02, 1174071.39, 1507373.86, null, null, null, null, null] },
                { label: "Cronograma Prorrogação II", data: [null, null, null, null, null, null, 1397234.90, 1918166.99, 2172395.90, 2423619.18, 2664287.67] }
            ],
            executedData: [147017.36, 340947.43, 419664.99, 516074.88, 893732.79, 1177420.96, 1397234.9, 1826026.83, 2080121.09, 2309472.05, 2508630.65]
        },
        predictedStartDate: '2024-10-07',
        predictedEndDate: '2025-11-03',
        location: { lat: -23.17462221037069, lng: -46.88650911818413 }
    },
    {
        id: "CT 036/25",
        objectName: "UBS Tamoio",
        companyName: "SLN Telecom. e Eng. Ltda",
        currentValue: 6598840.00,
        notes: null,
        measurements: [
            { id: 1, label: "1", startDate: "2025-05-22", endDate: "2025-06-21", refMonth: "Mai/25", value: 90152.14, accumulated: 90152.14 },
            { id: 2, label: "2", startDate: "2025-05-22", endDate: "2025-06-21", refMonth: "Jun/25", value: 414541.33, accumulated: 736137.24 },
            { id: 3, label: "3", startDate: "2025-06-22", endDate: "2025-07-21", refMonth: "Jul/25", value: 239422.48, accumulated: 975559.72 },
            { id: 4, label: "4", startDate: "2025-07-22", endDate: "2025-08-21", refMonth: "Ago/25", value: 354046.97, accumulated: 1329606.69 },
            { id: 5, label: "5", startDate: "2025-08-22", endDate: "2025-09-21", refMonth: "Set/25", value: 273732.54, accumulated: 1603339.23 },
            { id: 6, label: "6", startDate: "2025-09-22", endDate: "2025-10-21", refMonth: "Out/25", value: 834046.03, accumulated: 2437385.26 },
            { id: 7, label: "7", startDate: "2025-10-22", endDate: "2025-11-21", refMonth: "Nov/25", value: 826863.39, accumulated: 3264248.65 },
            { id: 8, label: "8", startDate: "2025-11-22", endDate: "2025-12-21", refMonth: "Dez/25", value: 1182068.62, accumulated: 4446317.27 },
            { id: 9, label: "9", startDate: "2025-12-22", endDate: "2026-01-21", refMonth: "Jan/26", value: 973345.29, accumulated: 5419662.56 },
            { id: 10, label: "10", startDate: "2026-01-22", endDate: "2026-02-21", refMonth: "Fev/26", value: 587119.79, accumulated: 6006782.35 },
            { id: 11, label: "11", startDate: "2026-02-22", endDate: "2026-03-21", refMonth: "Mar/26", value: 340667.51, accumulated: 6347449.86 },
            { id: 12, label: "12", startDate: "2026-03-22", endDate: "2026-04-21", refMonth: "Abr/26", value: 251390.14, accumulated: 6598840.00 },
        ],
        chartData: {
            labels: ["Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26"],
            // Normalização: Array 'previsto' convertido para 'datasets'
            datasets: [
                {
                    label: "Cronograma Inicial",
                    data: [321595.91, 975559.72, 1329606.69, 1603339.23, 2437385.26, 3264248.65, 4446317.27, 5419662.56, 6006782.35, 6347449.86, 6598840.00]
                }
            ],
            executedData: [90152.14, 400780.12, 501867.82, 575647.70 , 939679.49, null, null, null, null, null, null],
        },
        predictedStartDate: '2025-04-22',
        predictedEndDate: '2026-04-21',
        location: { lat: -23.189364, lng: -46.855773 },
    },
    {
        id: "CT 052/25",
        objectName: "UBS Ivoturucaia",
        companyName: "J.S.O. Constr. Ltda.",
        currentValue: 5654210.10,
        notes: "Contrato ainda não possui medições.",
        measurements: [
            // Datas como "1º Mês" foram mantidas no Label, mas startDate definido como null pois são genéricas
            { id: 1, label: "1º Mês", startDate: null, endDate: null, refMonth: null, value: 84127.17, accumulated: 84127.17 },
            { id: 2, label: "2º Mês", startDate: null, endDate: null, refMonth: null, value: 103035.32, accumulated: 187162.49 },
            { id: 3, label: "3º Mês", startDate: null, endDate: null, refMonth: null, value: 156263.40, accumulated: 343425.89 },
            { id: 4, label: "4º Mês", startDate: null, endDate: null, refMonth: null, value: 315717.56, accumulated: 659143.45 },
            { id: 5, label: "5º Mês", startDate: null, endDate: null, refMonth: null, value: 519490.15, accumulated: 1178633.60 },
            { id: 6, label: "6º Mês", startDate: null, endDate: null, refMonth: null, value: 434719.57, accumulated: 1613353.17 },
            { id: 7, label: "7º Mês", startDate: null, endDate: null, refMonth: null, value: 501301.56, accumulated: 2114654.73 },
            { id: 8, label: "8º Mês", startDate: null, endDate: null, refMonth: null, value: 982847.79, accumulated: 3097502.52 },
            { id: 9, label: "9º Mês", startDate: null, endDate: null, refMonth: null, value: 735049.10, accumulated: 3832551.62 },
            { id: 10, label: "10º Mês", startDate: null, endDate: null, refMonth: null, value: 699466.12, accumulated: 4532017.74 },
            { id: 11, label: "11º Mês", startDate: null, endDate: null, refMonth: null, value: 734830.81, accumulated: 5266848.55 },
            { id: 12, label: "12º Mês", startDate: null, endDate: null, refMonth: null, value: 387361.55, accumulated: 5654210.10 },
        ],
        chartData: {
            labels: ["1º Mês", "2º Mês", "3º Mês", "4º Mês", "5º Mês", "6º Mês", "7º Mês", "8º Mês", "9º Mês", "10º Mês", "11º Mês", "12º Mês"],
            // Normalização: Array 'previsto' convertido para 'datasets'
            datasets: [
                {
                    label: "Cronograma Previsto",
                    data: [84127.17, 187162.49, 343425.89, 659143.45, 1178633.60, 1613353.17, 2114654.73, 3097502.52, 3832551.62, 4532017.74, 5266848.55, 5654210.10]
                }
            ],
            executedData: [],
        },
        predictedStartDate: null, // "N/A" convertido para null
        predictedEndDate: null,   // "N/A" convertido para null
        location: { lat: -23.18183604007579, lng: -46.81048269582229 }
    },
    {
        id: "CT 054/25",
        objectName: "UBS Maringá",
        companyName: "Studio Sabino & Souza A",
        currentValue: 3629613.36,
        notes: null,
        measurements: [
            { id: 1, label: "1", startDate: "2025-06-16", endDate: "2025-07-15", refMonth: "Jul/25", value: 292590.76, accumulated: 292590.76 },
            { id: 2, label: "2", startDate: "2025-07-16", endDate: "2025-08-15", refMonth: "Ago/25", value: 241692.06, accumulated: 534282.82 },
            { id: 3, label: "3", startDate: "2025-08-16", endDate: "2025-09-15", refMonth: "Set/25", value: 97972.28, accumulated: 632255.10 },
            { id: 4, label: "4", startDate: "2025-09-16", endDate: "2025-10-15", refMonth: "Out/25", value: 94521.03, accumulated: 453476.70 },
            { id: 5, label: "5", startDate: "2025-10-16", endDate: "2025-11-15", refMonth: "Nov/25", value: 179720.76, accumulated: 682448.69 },
            { id: 6, label: "6", startDate: "2025-11-16", endDate: "2025-12-15", refMonth: "Dez/25", value: 171538.45, accumulated: 1005437.35 },
            { id: 7, label: "7", startDate: "2025-12-16", endDate: "2026-01-15", refMonth: "Jan/26", value: 297860.75, accumulated: 1308972.20 },
            { id: 8, label: "8", startDate: "2026-01-16", endDate: "2026-02-15", refMonth: "Fev/26", value: 355919.31, accumulated: 1665743.54 },
            { id: 9, label: "9", startDate: "2026-02-16", endDate: "2026-03-15", refMonth: "Mar/26", value: 207339.02, accumulated: 2226698.41 },
            { id: 10, label: "10", startDate: "2026-03-16", endDate: "2026-04-15", refMonth: "Abr/26", value: 347741.35, accumulated: 2584618.50 },
            { id: 11, label: "11", startDate: "2026-04-16", endDate: "2026-05-15", refMonth: "Mai/26", value: 483139.95, accumulated: 3011727.49 },
            { id: 12, label: "12", startDate: "2026-05-16", endDate: "2026-06-15", refMonth: "Jun/26", value: 292186.51, accumulated: 3401989.43 },
            { id: 13, label: "13", startDate: "2026-06-16", endDate: "2026-07-15", refMonth: "Jul/26", value: 336583.53, accumulated: 3592627.37 },
            { id: 14, label: "14", startDate: "2026-07-16", endDate: "2026-08-15", refMonth: "Ago/26", value: 230807.60, accumulated: 3625286.12 },
        ],
        chartData: {
            labels: ["Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26", "Jul/26", "Ago/26"],
            datasets: [
                { label: "Cronograma Inicial", data: [292590.76, 534282.82, 632255.10, 726776.13, 906496.89, 1078035.34, 1375896.09, 1731815.40, 1939154.42, 2286895.77, 2770035.72, 3062222.23, 3398805.76, 3629613.36] },
                { label: "Cronograma Prorrogação I", data: [null, null, null, 453476.70, 682448.69, 1005437.35, 1308972.20, 1665743.54, 2226698.41, 2584618.50, 3011727.49, 3401989.43, 3592627.37, 3625286.12] }
            ],
            executedData: [311389.54, 311389.54, 311389.54, 501587.58, null, null, null, null, null, null, null, null, null, null],
        },
        predictedStartDate: '2025-06-16',
        predictedEndDate: '2026-08-15',
        location: { lat: -23.22526128860949, lng: -46.88200264672982 }
    },
    {
        id: "CT 058/25",
        objectName: "UBS Rio Acima",
        companyName: "LBD Engenharia Ltda EPP",
        currentValue: 4770000.00,
        notes: null,
        measurements: [
            { id: 1, label: "1", startDate: "2025-07-28", endDate: "2025-08-27", refMonth: "Ago/25", value: 651465.99, accumulated: 651465.99 },
            { id: 2, label: "2", startDate: "2025-08-28", endDate: "2025-09-27", refMonth: "Set/25", value: 235455.54, accumulated: 886921.53 },
            { id: 3, label: "3", startDate: "2025-09-28", endDate: "2025-10-27", refMonth: "Out/25", value: 214136.63, accumulated: 1101058.16 },
            { id: 4, label: "4", startDate: "2025-10-28", endDate: "2025-11-27", refMonth: "Nov/25", value: 207896.03, accumulated: 1308953.19 },
            { id: 5, label: "5", startDate: "2025-11-28", endDate: "2025-12-27", refMonth: "Dez/25", value: 248274.38, accumulated: 1557227.57 },
            { id: 6, label: "6", startDate: "2025-12-28", endDate: "2026-01-27", refMonth: "Jan/26", value: 364000.85, accumulated: 1921228.42 },
            { id: 7, label: "7", startDate: "2026-01-28", endDate: "2026-02-27", refMonth: "Fev/26", value: 526704.03, accumulated: 2447932.45 },
            { id: 8, label: "8", startDate: "2026-02-28", endDate: "2026-03-27", refMonth: "Mar/26", value: 401628.60, accumulated: 2849561.05 },
            { id: 9, label: "9", startDate: "2026-03-28", endDate: "2026-04-27", refMonth: "Abr/26", value: 433111.60, accumulated: 3282672.65 },
            { id: 10, label: "10", startDate: "2026-04-28", endDate: "2026-05-27", refMonth: "Mai/26", value: 448241.70, accumulated: 3730914.35 },
            { id: 11, label: "11", startDate: "2026-05-28", endDate: "2026-06-27", refMonth: "Jun/26", value: 410658.28, accumulated: 4141572.63 },
            { id: 12, label: "12", startDate: "2026-06-28", endDate: "2026-07-27", refMonth: "Jul/26", value: 287880.94, accumulated: 4429453.57 },
            { id: 13, label: "13", startDate: "2026-07-28", endDate: "2026-08-27", refMonth: "Ago/26", value: 262817.27, accumulated: 4692270.84 },
            { id: 14, label: "14", startDate: "2026-08-28", endDate: "2026-09-27", refMonth: "Set/26", value: 77729.16, accumulated: 4770000.00 },
        ],
        chartData: {
            labels: ["Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26", "Jul/26", "Ago/26", "Set/26"],
            // Normalização: Array 'previsto' convertido para 'datasets'
            datasets: [
                {
                    label: "Cronograma Inicial",
                    data: [651465.99, 886921.53, 1101058.16, 1308953.19, 1557227.57, 1921228.42, 2447932.45, 2849561.05, 3282672.65, 3730914.35, 4141572.63, 4429453.57, 4692270.84, 4770000.00]
                }
            ],
            executedData: [252392.52 , 252392.52, 515634.17, null, null, null, null, null, null, null, null, null, null, null],
        },
        predictedStartDate: '2025-07-28',
        predictedEndDate: '2026-09-20',
        location: { lat: -23.11557702080163, lng: -46.92453149 }
    },
    {
        id: "CT 048/25",
        objectName: "CECE Romão",
        companyName: "Adriana Rodrigues Belles",
        currentValue: 1480000.00,
        notes: "OS Emitida em 07/07/2025",
        measurements: [
            { id: 1, label: "1", startDate: '2025-07-07', endDate: '2025-08-06', refMonth: "Jul/25", value: 149571.75, accumulated: 149571.75 },
            { id: 2, label: "2", startDate: '2025-08-07', endDate: '2025-09-06', refMonth: "Ago/25", value: 57580.00, accumulated: 318610.50 },
            { id: 3, label: "3", startDate: '2025-09-07', endDate: '2025-10-06', refMonth: "Set/25", value: 50171.08, accumulated: 368781.58 },
            { id: 4, label: "4", startDate: '2025-10-07', endDate: '2025-11-06', refMonth: "Out/25", value: 498074.55, accumulated: 866856.13 },
            { id: 5, label: "5", startDate: "2025-11-07", endDate: "2025-12-06", refMonth: "Nov/25", value: 302628.67, accumulated: 1169484.80 },
            { id: 6, label: "6", startDate: "2025-12-07", endDate: "2026-01-06", refMonth: "Dez/25", value: 163668.40, accumulated: 1333153.20 },
            { id: 7, label: "7", startDate: "2026-01-07", endDate: "2026-02-06", refMonth: "Jan/26", value: 146846.80, accumulated: 1480000.00 },
        ],
        chartData: {
            labels: ["Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26"],
            datasets: [
                { label: "Cronograma Inicial", data: [149571.75, 730716.85, 1300261.90, 1480000.00, null, null, null] },
                { label: "Cronograma Prorrogação I", data: [null, 318610.50, 368781.58, 866856.13, 1169484.80, 1333153.20, 1480000.00] }
            ],
            executedData: [261030.50, 261030.50, 261030.50, 366229.87, 553163.84, null, null],
        },
        predictedStartDate: '2025-07-07',
        predictedEndDate: '2026-02-06',
        location: { lat: -23.184126, lng: -46.853513 },
    }
];
