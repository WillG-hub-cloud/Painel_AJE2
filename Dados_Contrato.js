// Dados dos projetos/contratos
// Esta constante 'projectData' é um array de objetos, onde cada objeto representa um contrato.
// Os dados aqui são a fonte de informações para o painel.

const projectData = [
    {
        // ID do contrato: Usado para identificação única. Formato "CT XXX/YY" é recomendado.
        id: "CT 039/25",
        // Objeto do contrato: Descrição clara do que a obra/serviço abrange (ex: nome da escola, UBS).
        objeto: "EMEB Adail",
        // Empresa contratada: Nome completo da empresa responsável.
        empresa: "CDR Infra Inst. e Montag.",
        // Valor atual do contrato: O valor total do contrato, incluindo aditivos.
        valorAtual: 1718878.29,
        // Observações: Campo opcional para notas importantes sobre o contrato (prorrogações, status, etc.).
        observacoes: null, // Deixe como 'null' se não houver observações.

        // Medições do contrato: Array de objetos que detalham cada medição (prevista ou executada).
        // A ordem dos objetos neste array é importante para a cronologia.
        medicoes: [
            {
                // Número da medição (pode ser "1", "2", "1-5" para medições agrupadas, etc.)
                medicao: 1,
                // Data de início do período de medição. Formato 'DD/MM/AA' ou 'DD/MM/AAAA'.
                inicio: "15/04/25",
                // Data de fim do período de medição. Formato 'DD/MM/AA' ou 'DD/MM/AAAA'.
                fim: "14/05/25",
                // Referência do mês/ano da medição (ex: "Mai/25", "Jun/25"). Crucial para alinhamento com o gráfico.
                ref: "Mai/25",
                // Valor financeiro da medição para este período.
                valor: 124644.24,
                // Valor acumulado das medições até este período.
                acumulado: 124644.24
            },
            { medicao: 2, inicio: "16/05/25", fim: "15/06/25", ref: "Jun/25", valor: 171933.40, acumulado: 336423.85 },
            { medicao: 3, inicio: "16/06/25", fim: "16/07/25", ref: "Jul/25", valor: 241980.72, acumulado: 578404.57 },
            { medicao: 4, inicio: "17/07/25", fim: "16/08/25", ref: "Ago/25", valor: 244895.61, acumulado: 823300.18 },
            { medicao: 5, inicio: "17/08/25", fim: "16/09/25", ref: "Set/25", valor: 206279.55, acumulado: 1029579.73 },
            { medicao: 6, inicio: "17/09/25", fim: "17/10/25", ref: "Out/25", valor: 235402.36, acumulado: 1264982.09 },
            { medicao: 7, inicio: "18/10/25", fim: "17/11/25", ref: "Nov/25", valor: 237641.42, acumulado: 1502623.51 },
            { medicao: 8, inicio: "18/11/25", fim: "10/12/25", ref: "Dez/25", valor: 216254.79, acumulado: 1718878.30 },
        ],
        grafico: {
            labels: ["Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25"],
            previsto: [164490.45, 336423.85, 200391.22, 456648.02,  759827.63, 1147658.15, 1443929.50, 1718878.29],
            executado: [107178.95, 124644.24, 185092.67, 340430.46, 574149.13, null, null, null],
            previstoDataSets: null
        },
        // Data prevista de início do contrato. Formato 'DD/MM/AAAA'. Use 'N/A' se não aplicável.
        predicted_start_date: '15/04/2025',
        // Data prevista de fim do contrato. Formato 'DD/MM/AAAA'. Use 'N/A' se não aplicável.
        predicted_end_date: '10/12/2025',
        // Localização geográfica do contrato (Latitude e Longitude).
        location: { lat: -23.22359379674732, lng: -46.85593132352297 }
    },
    {
        id: "CT 127/24",
        objeto: "UBS Rio Branco",
        empresa: "CJM Construtora Ltda",
        valorAtual: 2664287.67, // Valor atualizado para o último acumulado do Cronograma Reajuste II
        observacoes: "Além do novo cronograma, adotado a partir de abril, foi protocolado novo aditivo que extenderá o contrato para término em novembro.", // Observação atualizada
        medicoes: [
            { medicao: 1, inicio: '07/10/24', fim: '05/11/24', ref: 'Nov/24', valor: 147017.36, acumulado: 147017.36 },
            { medicao: 2, inicio: '06/11/24', fim: '05/12/24', ref: 'Dez/24', valor: 193930.07, acumulado: 340947.43 },
            { medicao: 3, inicio: '06/12/24', fim: '04/01/25', ref: 'Jan/25', valor: 78717.56, acumulado: 419664.99 },
            { medicao: 4, inicio: '05/01/25', fim: '03/02/25', ref: 'Fev/25', valor: 96409.89, acumulado: 516074.88 },
            { medicao: 5, inicio: '04/02/25', fim: '03/04/25', ref: 'Abr/25', valor: 437000.00, acumulado: 1220155.93 }, // Este valor é a diferença entre o acumulado de Mar/25 (do reajuste 1) e o acumulado de Abr/25 (do reajuste 2)
            { medicao: 6, inicio: '04/04/25', fim: '03/05/25', ref: 'Mai/25', valor: 308812.37, acumulado: 1174071.39 },
            { medicao: 7, inicio: '04/05/25', fim: '03/06/25', ref: 'Jun/25', valor: 333302.47, acumulado: 1507373.86 },
            { medicao: 8, inicio: '04/06/25', fim: '03/08/25', ref: 'Jul/25', valor: 265536.22, acumulado: 1772910.08 }, 
            { medicao: 9, inicio: '04/07/25', fim: '03/09/25', ref: 'Ago/25', valor: 255395.87, acumulado: 2028305.95 }, 
            { medicao: 10, inicio: '04/08/25', fim: '03/10/25', ref: 'Set/25', valor: 149312.68, acumulado: 2177618.63 }, 
            { medicao: 11, inicio: '04/09/25', fim: '03/11/25', ref: 'Out/25', valor: 251223.27, acumulado: 2428841.90 }, 
            { medicao: 12, inicio: '04/10/25', fim: '03/11/25', ref: 'Nov/25', valor: 240668.48, acumulado: 2669510.38 }, 
        ],
        grafico: {
            labels: ["Nov/24", "Dez/24", "Jan/25", "Fev/25", "Abr/25", "Mai/25", "Jun/25", "Ago/25", "Set/25", "Out/25", "Nov/25"], // Labels estendidos até Mar/25 para o cronograma inicial
            previstoDataSets: [
                { label: "Cronograma Inicial", data: [223098.81, 446197.62, 691408.56, 953063.11, 1526040.85, null, null, null, null, null, null, null] }, // Termina em Mar/25
                { label: "Cronograma Prorrogação I", data: [null, null, null, null,  865259.02, 1174071.39, 1507373.86, null, null, null, null, null] }, // Nova série azul (reajuste 1)
                { label: "Cronograma Prorrogação II", data: [null, null, null, null, null, null, 1397234.90, 1918166.99, 2172395.90, 2423619.18, 2664287.67] } // Nova série laranja (reajuste 2) - Inicia em Jul/25 ou onde a laranja da sua imagem iniciar
            ],
            executado: [147017.36, 340947.43, 419664.99, 516074.88, 893732.79, 1177420.96, 1397234.9, 1826026.83, 2080121.09, null, null] // Executado até Jun/25
        },
        predicted_start_date: '07/10/2024',
        predicted_end_date: '03/11/2025', // Atualizado para novembro de 2025
        location: { lat: -23.17462221037069, lng: -46.88650911818413 }
    },
    {
        id: "CT 036/25",
        objeto: "UBS Tamoio",
        empresa: "SLN Telecom. e Eng. Ltda",
        valorAtual: 6598840.00,
        observacoes: null,
        medicoes: [
            { medicao: 1, inicio: "22/04/25", fim: "21/05/25", ref: "Mai/25", valor: 90152.14, acumulado: 90152.14 },
            { medicao: 2, inicio: "22/05/25", fim: "21/06/25", ref: "Jun/25", valor: 414541.33, acumulado: 736137.24 },
            { medicao: 3, inicio: "22/06/25", fim: "21/07/25", ref: "Jul/25", valor: 239422.48, acumulado: 975559.72 },
            { medicao: 4, inicio: "22/07/25", fim: "21/08/25", ref: "Ago/25", valor: 354046.97, acumulado: 1329606.69 },
            { medicao: 5, inicio: "22/08/25", fim: "21/09/25", ref: "Set/25", valor: 273732.54, acumulado: 1603339.23 },
            { medicao: 6, inicio: "22/09/25", fim: "21/10/25", ref: "Out/25", valor: 834046.03, acumulado: 2437385.26 },
            { medicao: 7, inicio: "22/10/25", fim: "21/11/25", ref: "Nov/25", valor: 826863.39, acumulado: 3264248.65 },
            { medicao: 8, inicio: "22/11/25", fim: "21/12/25", ref: "Dez/25", valor: 1182068.62, acumulado: 4446317.27 },
            { medicao: 9, inicio: "22/12/25", fim: "21/01/26", ref: "Jan/26", valor: 973345.29, acumulado: 5419662.56 },
            { medicao: 10, inicio: "22/01/26", fim: "21/02/26", ref: "Fev/26", valor: 587119.79, acumulado: 6006782.35 },
            { medicao: 11, inicio: "22/02/26", fim: "21/03/26", ref: "Mar/26", valor: 340667.51, acumulado: 6347449.86 },
            { medicao: 12, inicio: "22/03/26", fim: "21/04/26", ref: "Abr/26", valor: 251390.14, acumulado: 6598840.00 },
        ],
        grafico: {
            labels: ["Mai/25", "Jun/25", "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26"],
            previsto: [321595.91, 975559.72, 1329606.69, 1603339.23, 2437385.26, 3264248.65, 4446317.27, 5419662.56, 6006782.35, 6347449.86, 6598840.00],
            executado: [90152.14, 400780.12, 501867.82, null, null, null, null, null, null, null, null],
            previstoDataSets: null
        },
        predicted_start_date: '22/04/2025',
        predicted_end_date: '21/04/2026',
        location: { lat: -23.19038589001708, lng: -46.85558008684543 }
    },
    {
        id: "CT 052/25",
        objeto: "UBS Ivoturucaia",
        empresa: "J.S.O. Constr. Ltda.",
        valorAtual: 5654210.10,
        observacoes: "Contrato ainda não possui medições.", // Observação indica que é só cronograma
        medicoes: [
            { medicao: 1, inicio: "1º Mês", fim: "N/A", ref: null, valor: 84127.17, acumulado: 84127.17 },
            { medicao: 2, inicio: "2º Mês", fim: "N/A", ref: null, valor: 103035.32, acumulado: 187162.49 },
            { medicao: 3, inicio: "3º Mês", fim: "N/A", ref: null, valor: 156263.40, acumulado: 343425.89 },
            { medicao: 4, inicio: "4º Mês", fim: "N/A", ref: null, valor: 315717.56, acumulado: 659143.45 },
            { medicao: 5, inicio: "5º Mês", fim: "N/A", ref: null, valor: 519490.15, acumulado: 1178633.60 },
            { medicao: 6, inicio: "6º Mês", fim: "N/A", ref: null, valor: 434719.57, acumulado: 1613353.17 },
            { medicao: 7, inicio: "7º Mês", fim: "N/A", ref: null, valor: 501301.56, acumulado: 2114654.73 },
            { medicao: 8, inicio: "8º Mês", fim: "N/A", ref: null, valor: 982847.79, acumulado: 3097502.52 },
            { medicao: 9, inicio: "9º Mês", fim: "N/A", ref: null, valor: 735049.10, acumulado: 3832551.62 },
            { medicao: 10, inicio: "10º Mês", fim: "N/A", ref: null, valor: 699466.12, acumulado: 4532017.74 },
            { medicao: 11, inicio: "11º Mês", fim: "N/A", ref: null, "valor": 734830.81, "acumulado": 5266848.55 },
            { medicao: 12, inicio: "12º Mês", fim: "N/A", ref: null, "valor": 387361.55, "acumulado": 5654210.10 },
        ],
        grafico: { // Populated based on medicoes
            labels: ["1º Mês", "2º Mês", "3º Mês", "4º Mês", "5º Mês", "6º Mês", "7º Mês", "8º Mês", "9º Mês", "10º Mês", "11º Mês", "12º Mês"], // Pode usar ref ou Nº Mês
            previsto: [84127.17, 187162.49, 343425.89, 659143.45, 1178633.60, 1613353.17, 2114654.73, 3097502.52, 3832551.62, 4532017.74, 5266848.55, 5654210.10],
            executado: [], // Vazio para contratos sem medições reais
            previstoDataSets: null
        },
        // Datas fictícias para contratos que ainda não tem cronograma real de início e fim.
        predicted_start_date: 'N/A',
        predicted_end_date: 'N/A',
        location: { lat: -23.18183604007579, lng: -46.81048269582229 }
    },
    {
        id: "CT 054/25",
        objeto: "UBS Maringá",
        empresa: "Studio Sabino & Souza A",
        valorAtual: 3629613.36,
        observacoes: null,
        medicoes: [
            { medicao: 1, inicio: "1º Mês", fim: "15/07/2025", ref: "Jul/25", valor: 292590.76, acumulado: 292590.76 },
            { medicao: 2, inicio: "2º Mês", fim: "15/08/2025", ref: "Ago/25", valor: 241692.06, acumulado: 534282.82 },
            { medicao: 3, inicio: "3º Mês", fim: "15/09/2025", ref: "Set/25", valor: 97972.28, acumulado: 632255.10 },
            { medicao: 4, inicio: "4º Mês", fim: "15/10/2025", ref: "Out/25", valor: 94521.03, acumulado: 726776.13 },
            { medicao: 5, inicio: "5º Mês", fim: "15/11/2025", ref: "Nov/25", valor: 179720.76, acumulado: 906496.89 },
            { medicao: 6, inicio: "6º Mês", fim: "15/12/2025", ref: "Dez/25", valor: 171538.45, acumulado: 1078035.34 },
            { medicao: 7, inicio: "7º Mês", "fim": "15/01/2026", ref: "Jan/26", valor: 297860.75, acumulado: 1375896.09 },
            { medicao: 8, inicio: "8º Mês", fim: "15/02/2026", ref: "Fev/26", valor: 355919.31, acumulado: 1731815.40 },
            { medicao: 9, inicio: "9º Mês", fim: "15/03/2026", ref: "Mar/26", valor: 207339.02, acumulado: 1939154.42 },
            { medicao: 10, inicio: "10º Mês", fim: "15/04/2026", ref: "Abr/26", valor: 347741.35, acumulado: 2286895.77 },
            { medicao: 11, inicio: "11º Mês", fim: "15/05/2026", ref: "Mai/26", valor: 483139.95, acumulado: 2770035.72 },
            { medicao: 12, inicio: "12º Mês", fim: "15/06/2026", ref: "Jun/26", valor: 292186.51, acumulado: 3062222.23 },
            { medicao: 13, inicio: "13º Mês", fim: "15/07/2026", ref: "Jul/26", valor: 336583.53, acumulado: 3398805.76 },
            { medicao: 14, inicio: "14º Mês", fim: "15/08/2026", ref: "Ago/26", valor: 230807.60, acumulado: 3629613.36 },
        ],
        grafico: { // Populated based on medicoes
            labels: ["1º Mês", "2º Mês", "3º Mês", "4º Mês", "5º Mês", "6º Mês", "7º Mês", "8º Mês", "9º Mês", "10º Mês", "11º Mês", "12º Mês", "13º Mês", "14º Mês"],
            previsto: [292590.76, 534282.82, 632255.10, 726776.13, 906496.89, 1078035.34, 1375896.09, 1731815.40, 1939154.42, 2286895.77, 2770035.72, 3062222.23, 3398805.76, 3629613.36],
            executado: [311389.54, 311389.54, 311389.54, null, null, null, null, null, null, null, null, null, null, null],
            previstoDataSets: null
        },
        predicted_start_date: '16/06/2025',
        predicted_end_date: '10/08/2026',
        location: { lat: -23.22526128860949, lng: -46.88200264672982 }
    },
    {
        id: "CT 058/25",
        objeto: "UBS Rio Acima",
        empresa: "LBD Engenharia Ltda EPP",
        valorAtual: 4770000.00,
        observacoes: null,
        medicoes: [
            { medicao: 1, inicio: '1º Mês', fim: 'N/A', ref: null, valor: 651465.99, acumulado: 651465.99 },
            { medicao: 2, inicio: '2º Mês', fim: 'N/A', ref: null, valor: 235455.54, acumulado: 886921.53 },
            { medicao: 3, inicio: '3º Mês', fim: 'N/A', ref: null, valor: 214136.63, acumulado: 1101058.16 },
            { medicao: 4, inicio: '4º Mês', fim: 'N/A', ref: null, valor: 207896.03, acumulado: 1308953.19 },
            { medicao: 5, inicio: '5º Mês', fim: 'N/A', ref: null, valor: 248274.38, acumulado: 1557227.57 },
            { medicao: 6, inicio: '6º Mês', fim: 'N/A', ref: null, valor: 364000.85, acumulado: 1921228.42 },
            { medicao: 7, inicio: '7º Mês', fim: 'N/A', ref: null, valor: 526704.03, acumulado: 2447932.45 },
            { medicao: 8, inicio: "8º Mês", fim: 'N/A', ref: null, valor: 401628.60, acumulado: 2849561.05 },
            { medicao: 9, inicio: "9º Mês", fim: 'N/A', ref: null, valor: 433111.60, acumulado: 3282672.65 },
            { medicao: 10, inicio: "10º Mês", fim: "N/A", ref: null, valor: 448241.70, acumulado: 3730914.35 },
            { medicao: 11, inicio: "11º Mês", fim: "N/A", ref: null, valor: 410658.28, acumulado: 4141572.63 },
            { medicao: 12, inicio: "12º Mês", fim: "N/A", ref: null, valor: 287880.94, acumulado: 4429453.57 },
            { medicao: 13, inicio: "13º Mês", fim: 'N/A', ref: null, valor: 262817.27, acumulado: 4692270.84 },
            { medicao: 14, inicio: "14º Mês", fim: 'N/A', ref: null, valor: 77729.16, acumulado: 4770000.00 },
        ],
        grafico: { // Populated based on medicoes
            labels: ["1º Mês", "2º Mês", "3º Mês", "4º Mês", "5º Mês", "6º Mês", "7º Mês", "8º Mês", "9º Mês", "10º Mês", "11º Mês", "12º Mês", "13º Mês", "14º Mês"],
            previsto: [651465.99, 886921.53, 1101058.16, 1308953.19, 1557227.57, 1921228.42, 2447932.45, 2849561.05, 3282672.65, 3730914.35, 4141572.63, 4429453.57, 4692270.84, 4770000.00],
            executado: [],
            previstoDataSets: null
        },
        predicted_start_date: '28/07/2025', // OS 10/2025 emitida em 25/07/2025
        predicted_end_date: '20/09/2026', // 420 dias corridos de execução segundo a OS
        location: { lat: -23.11557702080163, lng: -46.92453149 }
    },
    {
        id: "CT 048/25",
        objeto: "CECE Romão",
        empresa: "Adriana Rodrigues Belles",
        valorAtual: 1480000.00,
        observacoes: "OS Emitida em 07/07/2025",
        medicoes: [
            { medicao: 1, inicio: '1º Mês', fim: 'N/A', ref: null, valor: 149571.75, acumulado: 149571.75 },
            { medicao: 2, inicio: '2º Mês', fim: 'N/A', ref: null, valor: 581145.10, acumulado: 730716.85 },
            { medicao: 3, inicio: '3º Mês', fim: 'N/A', ref: null, valor: 569545.05, acumulado: 1300261.90 },
            { medicao: 4, inicio: '4º Mês', fim: 'N/A', ref: null, valor: 179738.10, acumulado: 1480000.00 }
        ],
        grafico: { // Populated based on medicoes
            labels: ["1º Mês", "2º Mês", "3º Mês", "4º Mês"],
            previsto: [149571.75, 730716.85, 1300261.90, 1480000.00],
            executado: [261030.50, null, null, null],
            previstoDataSets: null
        },
        predicted_start_date: '07/07/2025', // OS 9/2025 emitida em 24/06/2025
        predicted_end_date: '03/11/2025', // 120 dias corridos de execução segundo a OS
        location: { lat: -23.18555067042124, lng: -46.85363796732586 }
    }
];






















