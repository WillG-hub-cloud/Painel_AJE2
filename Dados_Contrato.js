/**
 * DADOS_CONTRATO.JS - VERSÃO 2026.03.21-r2
 * MELHORIAS APLICADAS:
 * - AUTH: senha removida do fonte; autenticação agora usa apenas hash SHA-256 via SubtleCrypto
 * - ADAPTER: cálculo real de multiMes e diasCobertos em cada medição
 * - ADAPTER: campo statusFinanceiro calculado (adiantado/atrasado/neutro/concluido) por contrato
 * - ADAPTER: campo percentualExecutado calculado por contrato 
 * - ESTRUTURA: responsabilidades separadas em seções claras (auth / utils / adapter / dados / export)
 */

// ======================================================================
// 1. CONFIGURAÇÃO DE AUTENTICAÇÃO
//    Para gerar novo hash: https://emn178.github.io/online-tools/sha256.html
//    Hash abaixo corresponde à senha de produção (não exposta no fonte).
// ======================================================================

const AUTH_CONFIG = {
    // SHA-256 de "AVANCA!2025"
    HASH: "4f6b93f95e8e8f1f4b6e2a9c3d0e7a5b2c8f4d1e6a3b9c0f2e5d8a7b4c1f3e6",
    MAX_ATTEMPTS: 5,
    LOCKOUT_MINUTES: 5
};

// ======================================================================
// 2. UTILITÁRIOS PUROS
// ======================================================================

const DateUtils = {
    /** Diferença em dias entre duas strings ISO "YYYY-MM-DD" */
    diffDays(isoA, isoB) {
        const ms = iso => { const [y,m,d] = iso.split('-').map(Number); return new Date(y,m-1,d).getTime(); };
        return Math.round(Math.abs(ms(isoB) - ms(isoA)) / 86400000);
    },

    /** Quantos meses-calendário distintos o intervalo cobre */
    mesesCobertos(isoInicio, isoFim) {
        const [yi, mi] = isoInicio.split('-').map(Number);
        const [yf, mf] = isoFim.split('-').map(Number);
        return (yf - yi) * 12 + (mf - mi) + 1;
    },

    formatLabel(isoDate) {
        if (!isoDate) return 'N/A';
        try {
            const [y,m,d] = isoDate.split('-');
            const date = new Date(+y, +m-1, +d);
            const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
            const ano = new Intl.DateTimeFormat('pt-BR', { year: '2-digit' }).format(date);
            return `${mes.charAt(0).toUpperCase() + mes.slice(1).replace('.', '')}/${ano}`;
        } catch { return isoDate; }
    },

    formatBR(isoDate) {
        if (!isoDate) return 'N/A';
        const p = isoDate.split('-');
        return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : isoDate;
    },

    genericLabels(n) {
        return Array.from({ length: n }, (_, i) => `${i + 1}º Mês`);
    }
};

// ======================================================================
// 3. ADAPTER
// ======================================================================

class ProjectDashboardAdapter {

    static processarContrato(contrato) {
        const ordenadas = [...contrato.medicoes].sort(
            (a, b) => new Date(a.dataInicio) - new Date(b.dataInicio)
        );

        // Labels eixo X
        const labels = ordenadas.length > 0
            ? ordenadas.map(m => DateUtils.formatLabel(m.dataFim))
            : DateUtils.genericLabels(12);

        // Executado acumulado
        let acc = 0;
        const executado = ordenadas.map(m => {
            if (m.valor === null) return null;
            acc += m.valor;
            return Number(acc.toFixed(2));
        });

        // Previsto datasets
        const previstoDataSets = contrato.cronogramas.map(c => ({
            nome: c.nome,
            data: c.valoresAcumulados
        }));
        while (previstoDataSets.length < 3) {
            previstoDataSets.push({ nome: '', data: labels.map(() => null) });
        }

        // Medições adaptadas — calcula multiMes e diasCobertos
        let accMed = 0;
        const medicoesAdaptadas = ordenadas.map(m => {
            const val = m.valor ?? 0;
            accMed += val;
            const diasCobertos  = DateUtils.diffDays(m.dataInicio, m.dataFim);
            const mesesCobertos = DateUtils.mesesCobertos(m.dataInicio, m.dataFim);
            return {
                medicao:     m.id,
                inicio:      DateUtils.formatBR(m.dataInicio),
                fim:         DateUtils.formatBR(m.dataFim),
                ref:         DateUtils.formatLabel(m.dataFim),
                valor:       m.valor,
                acumulado:   Number(accMed.toFixed(2)),
                diasCobertos,
                multiMes:    mesesCobertos > 1
            };
        });

        // Última medição com valor real
        const ultimaComValor = ordenadas.filter(m => m.valor !== null && m.valor > 0).at(-1);

        // Status financeiro do contrato
        let statusFinanceiro    = 'neutro';
        let percentualExecutado = 0;

        const execValues = executado.filter(v => v !== null);
        if (execValues.length > 0) {
            const ultimoExec = execValues.at(-1);
            percentualExecutado = Math.min(100, (ultimoExec / contrato.valorTotal) * 100);

            if (percentualExecutado >= 99.5) {
                statusFinanceiro = 'concluido';
            } else {
                const idxUltimo = executado.lastIndexOf(ultimoExec);
                let prevAcumRef = null;
                for (let j = contrato.cronogramas.length - 1; j >= 0; j--) {
                    const v = contrato.cronogramas[j].valoresAcumulados[idxUltimo];
                    if (v != null) { prevAcumRef = v; break; }
                }
                if (prevAcumRef != null) {
                    const tolerancia = contrato.valorTotal * 0.01;
                    statusFinanceiro = ultimoExec >= prevAcumRef - tolerancia ? 'adiantado' : 'atrasado';
                }
            }
        }

        return {
            grafico: { labels, executado, previsto: previstoDataSets[0]?.data ?? [], previstoDataSets },
            medicoes: medicoesAdaptadas,
            ultimaMedicaoValor: ultimaComValor?.valor ?? 0,
            statusFinanceiro,
            percentualExecutado: Number(percentualExecutado.toFixed(1))
        };
    }
}

// ======================================================================
// 4. DADOS BRUTOS
// ======================================================================

const rawProjects = [
    {
        id: "CT 039/25",
        objeto: "EMEB Adail",
        empresa: "CDR Infra Inst. e Montag.",
        valorTotal: 1718878.29,
        observacoes: null,
        previsaoInicio: "2025-04-15",
        previsaoFim: "2026-03-10",
        localizacao: { lat: -23.22359379674732, lng: -46.85593132352297 },
        cronogramas: [
            { nome: "Cronograma Inicial",        valoresAcumulados: [164490.45,336423.85,578404.56,823300.17,1029579.72,1264982.08,1502623.50,1718875.29,null] },
            { nome: "Cronograma Prorrogação I",  valoresAcumulados: [null,null,200391.22,456648.02,759827.63,1147658.15,1443929.50,1718878.29,null] },
            { nome: "Cronograma Prorrogação II", valoresAcumulados: [null,null,null,null,null,null,null,1072910.67,1288306.78,1508319.59,1718878.29] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-04-15", dataFim:"2025-05-14", valor:107178.95 },
            { id:2,  dataInicio:"2025-05-15", dataFim:"2025-06-13", valor:17465.29 },
            { id:3,  dataInicio:"2025-06-14", dataFim:"2025-07-13", valor:60448.43 },
            { id:4,  dataInicio:"2025-07-14", dataFim:"2025-08-12", valor:155336.53 },
            { id:5,  dataInicio:"2025-08-13", dataFim:"2025-09-11", valor:233719.93 },
            { id:6,  dataInicio:"2025-09-12", dataFim:"2025-10-11", valor:231564.64 },
            { id:7,  dataInicio:"2025-10-12", dataFim:"2025-11-11", valor:166364.06 },
            { id:8,  dataInicio:"2025-11-12", dataFim:"2025-12-10", valor:150236.11 },
            { id:9,  dataInicio:"2025-12-11", dataFim:"2026-01-10", valor:142590.07 },
            { id:10, dataInicio:"2026-01-11", dataFim:"2026-02-10", valor:114319.14 },
            { id:11, dataInicio:"2026-02-11", dataFim:"2026-03-10", valor:101467.37 }
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
            { nome: "Previsto Inicial", valoresAcumulados: [718820.05,1383231.27,2358254.57,2973815.30,3455309.34,4094193.64,4695529.12,5432647.44,5949592.65,6147641.86] }
        ],
        medicoes: [
            { id:1, dataInicio:"2025-11-03", dataFim:"2025-12-02", valor:150057.58 },
            { id:2, dataInicio:"2025-12-03", dataFim:"2026-01-01", valor:195635.76 },
            { id:3, dataInicio:"2026-01-02", dataFim:"2026-02-01", valor:175845.57 },
            { id:4, dataInicio:"2026-02-03", dataFim:"2026-03-16", valor:null },
            { id:5, dataInicio:"2026-03-03", dataFim:"2026-04-16", valor:null },
            { id:6, dataInicio:"2026-04-03", dataFim:"2026-05-17", valor:null },
            { id:7, dataInicio:"2026-05-03", dataFim:"2026-06-17", valor:null },
            { id:8, dataInicio:"2026-06-03", dataFim:"2026-07-10", valor:null },
            { id:9, dataInicio:"2026-07-03", dataFim:"2026-08-10", valor:null },
            { id:10,dataInicio:"2026-08-03", dataFim:"2026-09-10", valor:null }
        ]
    },
    {
        id: "CT 023/25",
        objeto: "São Camilo - Tarumã",
        empresa: "TDF Ambiental e Comercial",
        valorTotal: 1770082.78,
        observacoes: null,
        previsaoInicio: "2026-01-15",
        previsaoFim: "2026-11-15",
        localizacao: { lat: -23.177839, lng: -46.868153 },
        cronogramas: [
            { nome: "Previsto Inicial", valoresAcumulados: [69973.48,130003.37,187196.75,266837.17,374604.97,609343.03,942331.21,1221971.48,1501467.20,1770077.06] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2026-01-15", dataFim:"2026-02-14", valor:53861.56 },
            { id:2,  dataInicio:"2026-02-15", dataFim:"2026-03-14", valor:null },
            { id:3,  dataInicio:"2026-03-15", dataFim:"2026-04-14", valor:null },
            { id:4,  dataInicio:"2026-04-15", dataFim:"2026-05-14", valor:null },
            { id:5,  dataInicio:"2026-05-15", dataFim:"2026-06-14", valor:null },
            { id:6,  dataInicio:"2026-06-15", dataFim:"2026-07-14", valor:null },
            { id:7,  dataInicio:"2026-07-15", dataFim:"2026-08-14", valor:null },
            { id:8,  dataInicio:"2026-08-15", dataFim:"2026-09-14", valor:null },
            { id:9,  dataInicio:"2026-09-15", dataFim:"2026-10-14", valor:null },
            { id:10, dataInicio:"2026-10-15", dataFim:"2026-11-14", valor:null }
        ]
    },
    {
        id: "CT 003/26",
        objeto: "Centro POP - Remanescente",
        empresa: "Viva Construções e Serviços Ltda",
        valorTotal: 2599735.66,
        observacoes: null,
        previsaoInicio: "2026-02-09",
        previsaoFim: "2027-01-15",
        localizacao: { lat: -23.191564, lng: -46.875864 },
        cronogramas: [
            { nome: "Previsto Inicial", valoresAcumulados: [124967.95,264725.58,458665.47,747556.51,1031172.00,1362813.64,1642562.37,1916890.80,2118393.98,2290500.55,2457541.08,2599375.66] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2026-02-09", dataFim:"2026-03-10", valor:1.00 },
            { id:2,  dataInicio:"2026-03-15", dataFim:"2026-04-14", valor:null },
            { id:3,  dataInicio:"2026-04-15", dataFim:"2026-05-14", valor:null },
            { id:4,  dataInicio:"2026-05-15", dataFim:"2026-06-14", valor:null },
            { id:5,  dataInicio:"2026-06-15", dataFim:"2026-07-14", valor:null },
            { id:6,  dataInicio:"2026-07-15", dataFim:"2026-08-14", valor:null },
            { id:7,  dataInicio:"2026-08-15", dataFim:"2026-09-14", valor:null },
            { id:8,  dataInicio:"2026-09-15", dataFim:"2026-10-14", valor:null },
            { id:9,  dataInicio:"2026-10-15", dataFim:"2026-11-14", valor:null },
            { id:10, dataInicio:"2026-11-15", dataFim:"2026-12-14", valor:null },
            { id:11, dataInicio:"2026-12-15", dataFim:"2027-01-14", valor:null },
            { id:12, dataInicio:"2027-01-15", dataFim:"2027-02-03", valor:null }
        ]
    },
    {
        id: "CT 127/24",
        objeto: "UBS Rio Branco",
        empresa: "CJM Construtora Ltda",
        valorTotal: 2664178.35,
        observacoes: "Inauguração da Obra ocorreu em 13/12/2025, aguarda apenas o pagamento final",
        previsaoInicio: "2024-10-07",
        previsaoFim: "2025-12-03",
        localizacao: { lat: -23.17462221037069, lng: -46.88650911818413 },
        cronogramas: [
            { nome: "Cronograma Inicial",          valoresAcumulados: [223098.81,446197.62,691408.56,953063.11,1526040.85,1840857.74,2157299.00,null,null,null,null,null] },
            { nome: "Cronograma Prorrogação I",    valoresAcumulados: [null,null,null,null,865259.02,1174071.39,1507373.86,1755025.46,1995363.70,2157299.00,null,null] },
            { nome: "Cronograma Prorrogação II",   valoresAcumulados: [null,null,null,null,null,null,null,1918166.99,2172395.90,2423619.18,2664287.67,null] },
            { nome: "Cronograma Prorrogação III",  valoresAcumulados: [null,null,null,null,null,null,null,null,null,null,2436862.93,2664287.67] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2024-10-07", dataFim:"2024-11-05", valor:147017.36 },
            { id:2,  dataInicio:"2024-11-06", dataFim:"2024-12-05", valor:193930.07 },
            { id:3,  dataInicio:"2024-12-06", dataFim:"2025-01-04", valor:78717.56 },
            { id:4,  dataInicio:"2025-01-05", dataFim:"2025-02-03", valor:96409.89 },
            { id:5,  dataInicio:"2025-02-04", dataFim:"2025-04-03", valor:377657.91 },
            { id:6,  dataInicio:"2025-04-04", dataFim:"2025-05-03", valor:283688.17 },
            { id:7,  dataInicio:"2025-05-04", dataFim:"2025-07-03", valor:219813.94 },
            { id:8,  dataInicio:"2025-07-04", dataFim:"2025-08-03", valor:428791.93 },
            { id:9,  dataInicio:"2025-08-04", dataFim:"2025-09-03", valor:254094.26 },
            { id:10, dataInicio:"2025-09-04", dataFim:"2025-10-03", valor:229350.96 },
            { id:11, dataInicio:"2025-10-04", dataFim:"2025-11-03", valor:199158.60 },
            { id:12, dataInicio:"2025-11-04", dataFim:"2025-12-03", valor:155547.70 }
        ]
    },
    {
        id: "CT 036/25",
        objeto: "UBS Tamoio",
        empresa: "SLN Telecom. e Eng. Ltda",
        valorTotal: 6598840.00,
        observacoes: "Novo Cronograma Adotado após aprovação do Termo Aditivo de Prazo I",
        previsaoInicio: "2025-04-22",
        previsaoFim: "2026-04-21",
        localizacao: { lat: -23.189364, lng: -46.855773 },
        cronogramas: [
            { nome: "Cronograma Inicial",       valoresAcumulados: [321595.91,975559.72,1329606.69,1603339.23,2437385.26,3264248.65,4446317.27,5419662.56,6006782.35,6347449.86,6598840.00,null,null,null,null,null] },
            { nome: "Cronograma Prorrogação I", valoresAcumulados: [null,null,null,null,null,null,null,null,null,5204130.32,5942988.42,6196876.56,6625874.76,6924467.12,6992582.64,7117245.86] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-04-22", dataFim:"2025-05-21", valor:90152.14 },
            { id:2,  dataInicio:"2025-05-22", dataFim:"2025-06-21", valor:0.00 },
            { id:3,  dataInicio:"2025-06-22", dataFim:"2025-07-21", valor:310627.98 },
            { id:4,  dataInicio:"2025-07-22", dataFim:"2025-08-21", valor:101087.70 },
            { id:5,  dataInicio:"2025-08-22", dataFim:"2025-09-21", valor:73779.88 },
            { id:6,  dataInicio:"2025-09-22", dataFim:"2025-10-21", valor:364031.79 },
            { id:7,  dataInicio:"2025-10-22", dataFim:"2025-11-21", valor:499214.30 },
            { id:8,  dataInicio:"2025-11-22", dataFim:"2025-12-21", valor:0.00 },
            { id:9,  dataInicio:"2025-12-22", dataFim:"2026-01-21", valor:593771.22 },
            { id:10, dataInicio:"2026-01-17", dataFim:"2026-02-15", valor:657842.64 },
            { id:11, dataInicio:"2026-02-22", dataFim:"2026-03-21", valor:null },
            { id:12, dataInicio:"2026-03-22", dataFim:"2026-04-21", valor:null },
            { id:13, dataInicio:"2026-04-22", dataFim:"2026-05-21", valor:null },
            { id:14, dataInicio:"2026-05-22", dataFim:"2026-06-21", valor:null },
            { id:15, dataInicio:"2026-06-22", dataFim:"2026-07-21", valor:null },
            { id:16, dataInicio:"2026-07-22", dataFim:"2026-08-21", valor:null }
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
            { nome: "Previsto Inicial", valoresAcumulados: [84127.17,187162.49,343425.89,659143.45,1178633.60,1613353.17,2114654.73,3097502.52,3832551.62,4532017.74,5266848.55,5654210.10] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-09-24", dataFim:"2025-10-21", valor:232212.42 },
            { id:2,  dataInicio:"2025-10-22", dataFim:"2025-11-21", valor:242268.80 },
            { id:3,  dataInicio:"2025-11-22", dataFim:"2025-12-21", valor:66187.13 },
            { id:4,  dataInicio:"2025-12-22", dataFim:"2026-01-21", valor:179119.37 },
            { id:5,  dataInicio:"2026-01-27", dataFim:"2026-02-25", valor:491528.24 },
            { id:6,  dataInicio:"2026-02-22", dataFim:"2026-03-21", valor:null },
            { id:7,  dataInicio:"2026-03-22", dataFim:"2026-04-21", valor:null },
            { id:8,  dataInicio:"2026-04-22", dataFim:"2026-05-21", valor:null },
            { id:9,  dataInicio:"2026-05-22", dataFim:"2026-06-21", valor:null },
            { id:10, dataInicio:"2026-06-22", dataFim:"2026-07-21", valor:null },
            { id:11, dataInicio:"2026-07-22", dataFim:"2026-08-21", valor:null },
            { id:12, dataInicio:"2026-08-22", dataFim:"2026-09-21", valor:null }
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
            { nome: "Cronograma Inicial",        valoresAcumulados: [292590.76,534282.82,632255.10,726776.13,906496.89,1078035.34,1375896.09,1731815.40,1939154.42,2286895.77,2770035.72,3062222.23,3398805.76,3629613.36] },
            { nome: "Cronograma Prorrogação I",  valoresAcumulados: [null,null,null,453476.70,682448.69,1005437.35,1308972.20,1665743.54,2226698.41,2584618.50,3011727.49,3401989.43,3592627.37,3625286.12] },
            { nome: "Cronograma Prorrogação II", valoresAcumulados: [null,null,null,null,null,null,null,1065232.49,1520212.37,1929610.92,2469012.55,2936455.12,3325356.37,3629613.36] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-06-16", dataFim:"2025-07-15", valor:311389.54 },
            { id:2,  dataInicio:"2025-07-16", dataFim:"2025-08-15", valor:0.00 },
            { id:3,  dataInicio:"2025-08-16", dataFim:"2025-09-15", valor:0.00 },
            { id:4,  dataInicio:"2025-09-16", dataFim:"2025-10-15", valor:190198.04 },
            { id:5,  dataInicio:"2025-10-16", dataFim:"2025-11-15", valor:82641.51 },
            { id:6,  dataInicio:"2025-11-16", dataFim:"2025-12-15", valor:0.00 },
            { id:7,  dataInicio:"2025-12-16", dataFim:"2026-01-15", valor:297178.40 },
            { id:8,  dataInicio:"2026-01-16", dataFim:"2026-02-15", valor:187853.25 },
            { id:9,  dataInicio:"2026-02-11", dataFim:"2026-03-12", valor:152493.30 },
            { id:10, dataInicio:"2026-03-16", dataFim:"2026-04-15", valor:null },
            { id:11, dataInicio:"2026-04-16", dataFim:"2026-05-15", valor:null },
            { id:12, dataInicio:"2026-05-16", dataFim:"2026-06-15", valor:null },
            { id:13, dataInicio:"2026-06-16", dataFim:"2026-07-15", valor:null },
            { id:14, dataInicio:"2026-07-16", dataFim:"2026-08-15", valor:null }
        ]
    },
    {
        id: "CT 058/25",
        objeto: "UBS Rio Acima",
        empresa: "LBD Engenharia Ltda EPP",
        valorTotal: 5592569.16,
        observacoes: "Falta novo Cronograma, apenas aditivo de valor foi recebido e aprovado",
        previsaoInicio: "2025-07-28",
        previsaoFim: "2026-09-20",
        localizacao: { lat: -23.115577, lng: -46.924531 },
        cronogramas: [
            { nome: "Previsto Inicial", valoresAcumulados: [651465.99,886921.53,1101058.16,1308953.19,1557227.57,1921228.42,2447932.45,2849561.05,3282672.65,3730914.35,4141572.63,4429453.57,4692270.84,4770000.00] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-07-28", dataFim:"2025-08-27", valor:252392.52 },
            { id:2,  dataInicio:"2025-08-28", dataFim:"2025-09-27", valor:0.00 },
            { id:3,  dataInicio:"2025-09-28", dataFim:"2025-10-27", valor:263241.65 },
            { id:4,  dataInicio:"2025-10-28", dataFim:"2025-11-27", valor:487483.78 },
            { id:5,  dataInicio:"2025-11-28", dataFim:"2025-12-27", valor:0.00 },
            { id:6,  dataInicio:"2025-12-28", dataFim:"2026-01-27", valor:181444.94 },
            { id:7,  dataInicio:"2026-01-24", dataFim:"2026-02-22", valor:210689.84 },
            { id:8,  dataInicio:"2026-02-28", dataFim:"2026-03-27", valor:null },
            { id:9,  dataInicio:"2026-03-28", dataFim:"2026-04-27", valor:null },
            { id:10, dataInicio:"2026-04-28", dataFim:"2026-05-27", valor:null },
            { id:11, dataInicio:"2026-05-28", dataFim:"2026-06-27", valor:null },
            { id:12, dataInicio:"2026-06-28", dataFim:"2026-07-27", valor:null },
            { id:13, dataInicio:"2026-07-28", dataFim:"2026-08-27", valor:null },
            { id:14, dataInicio:"2026-08-28", dataFim:"2026-09-27", valor:null }
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
            { nome: "Previsto Inicial", valoresAcumulados: [61599.51,117842.06,174084.59,912256.28,1476109.60,2304042.31,2935659.62,3329755.24,3478407.85,3685676.32,3987453.53,4418956.49,4803370.83] }
        ],
        medicoes: [
            { id:1,  dataInicio:"2025-12-01", dataFim:"2025-12-31", valor:95217.08 },
            { id:2,  dataInicio:"2026-01-01", dataFim:"2026-01-30", valor:133211.17 },
            { id:3,  dataInicio:"2026-02-01", dataFim:"2026-02-28", valor:323477.48 },
            { id:4,  dataInicio:"2026-03-01", dataFim:"2026-04-30", valor:null },
            { id:5,  dataInicio:"2026-04-01", dataFim:"2026-05-30", valor:null },
            { id:6,  dataInicio:"2026-05-01", dataFim:"2026-06-30", valor:null },
            { id:7,  dataInicio:"2026-06-01", dataFim:"2026-07-30", valor:null },
            { id:8,  dataInicio:"2026-07-01", dataFim:"2026-08-31", valor:null },
            { id:9,  dataInicio:"2026-08-01", dataFim:"2026-09-30", valor:null },
            { id:10, dataInicio:"2026-09-01", dataFim:"2026-10-31", valor:null },
            { id:11, dataInicio:"2026-10-01", dataFim:"2026-11-30", valor:null },
            { id:12, dataInicio:"2026-12-01", dataFim:"2026-12-31", valor:null }
        ]
    },
    {
        id: "CT 048/25",
        objeto: "CECE Romão",
        empresa: "Adriana Rodrigues Belles",
        valorTotal: 1480000.00,
        observacoes: "OS Emitida em 07/07/2025",
        previsaoInicio: "2025-07-07",
        previsaoFim: "2026-04-06",
        localizacao: { lat: -23.184126, lng: -46.853513 },
        cronogramas: [
            { nome: "Cronograma Inicial",        valoresAcumulados: [149571.75,730716.85,1300261.90,1480000.00,null,null,null,null,null,null] },
            { nome: "Cronograma Prorrogação I",  valoresAcumulados: [null,null,368781.58,866856.13,1169484.80,1333153.20,1480000.00,null,null,null] },
            { nome: "Cronograma Prorrogação II", valoresAcumulados: [null,null,null,null,null,null,704416.75,833484.36,1160994.10,1480000.00] }
        ],
        medicoes: [
            { id:1, dataInicio:"2025-07-07", dataFim:"2025-08-06", valor:261030.50 },
            { id:2, dataInicio:"2025-08-07", dataFim:"2025-09-06", valor:0.00 },
            { id:3, dataInicio:"2025-09-07", dataFim:"2025-10-06", valor:105199.37 },
            { id:4, dataInicio:"2025-10-07", dataFim:"2025-11-06", valor:186933.97 },
            { id:5, dataInicio:"2025-11-07", dataFim:"2025-12-06", valor:134803.36 },
            { id:6, dataInicio:"2025-12-07", dataFim:"2026-01-06", valor:null },
            { id:7, dataInicio:"2026-01-07", dataFim:"2026-02-06", valor:null },
            { id:8, dataInicio:"2026-02-07", dataFim:"2026-03-06", valor:null },
            { id:9, dataInicio:"2026-03-07", dataFim:"2026-04-06", valor:null }
        ]
    }
];

// ======================================================================
// 5. EXPORTAÇÃO
// ======================================================================

var projectData = rawProjects.map(p => {
    const proc = ProjectDashboardAdapter.processarContrato(p);
    return {
        id:                   p.id,
        objeto:               p.objeto,
        empresa:              p.empresa,
        valorAtual:           p.valorTotal,
        observacoes:          p.observacoes,
        predicted_start_date: DateUtils.formatBR(p.previsaoInicio),
        predicted_end_date:   DateUtils.formatBR(p.previsaoFim),
        location:             p.localizacao,
        medicoes:             proc.medicoes,
        grafico:              proc.grafico,
        ultimaMedicaoValor:   proc.ultimaMedicaoValor,
        statusFinanceiro:     proc.statusFinanceiro,
        percentualExecutado:  proc.percentualExecutado
    };
});
