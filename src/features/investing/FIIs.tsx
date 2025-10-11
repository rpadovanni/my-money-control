import { useState, useMemo } from 'react';

interface FIIInput {
  ativo: string;
  quantidade: number;
  objetivo: number;
  cotacao: number;
}

interface FIICalculated extends FIIInput {
  total: number;
  participacao: number;
  diferenca: number;
}

const FIIs = () => {
  const [fiisInput] = useState<FIIInput[]>([
    {
      ativo: 'ALZR11',
      quantidade: 160,
      objetivo: 10,
      cotacao: 10.54,
    },
    {
      ativo: 'BTCI11',
      quantidade: 150,
      objetivo: 10,
      cotacao: 9.93,
    },
    {
      ativo: 'CPTS11',
      quantidade: 196,
      objetivo: 10,
      cotacao: 7.6,
    },
    {
      ativo: 'HGLG11',
      quantidade: 6,
      objetivo: 7,
      cotacao: 160.0,
    },
    {
      ativo: 'HGRU11',
      quantidade: 8,
      objetivo: 7,
      cotacao: 126.3,
    },
    {
      ativo: 'HSML11',
      quantidade: 10,
      objetivo: 6,
      cotacao: 84.25,
    },
    {
      ativo: 'KNCR11',
      quantidade: 14,
      objetivo: 10,
      cotacao: 104.7,
    },
    {
      ativo: 'KNRI11',
      quantidade: 8,
      objetivo: 8,
      cotacao: 145.76,
    },
    {
      ativo: 'MXRF11',
      quantidade: 150,
      objetivo: 10,
      cotacao: 9.55,
    },
    {
      ativo: 'OUJP11',
      quantidade: 20,
      objetivo: 10,
      cotacao: 75.6,
    },
    {
      ativo: 'XPLG11',
      quantidade: 9,
      objetivo: 6,
      cotacao: 100.87,
    },
    {
      ativo: 'XPML11',
      quantidade: 9,
      objetivo: 6,
      cotacao: 105.65,
    },
  ]);

  // Validação: verificar se a soma dos objetivos não excede 100%
  const totalObjetivo = fiisInput.reduce((sum, fii) => sum + fii.objetivo, 0);
  const isValidAllocation = totalObjetivo <= 100;

  // Calcular valores automaticamente
  const fiis = useMemo((): FIICalculated[] => {
    // Calcular total de todos os FIIs
    const totalValue = fiisInput.reduce((sum, fii) => sum + fii.quantidade * fii.cotacao, 0);

    return fiisInput.map((fii) => {
      const total = fii.quantidade * fii.cotacao;
      // Fórmula do Excel: =(ROUND((totalDoFII/somaDoValorDeTodosFIIs)*100;2))/100
      // A participação deve ser em percentual (0-100), não em decimal (0-1)
      const participacao = Math.round((total / totalValue) * 100 * 100) / 100; // ROUND com 2 casas decimais em percentual
      // Fórmula: =(participacaoDoFIINaCarteira-ObjetivoDoFIINaCarteira)/100
      // A diferença deve ser a diferença entre participação e objetivo, dividida por 100 para converter para decimal
      const diferenca = (participacao - fii.objetivo) / 100;

      return {
        ...fii,
        total,
        participacao,
        diferenca,
      };
    });
  }, [fiisInput]);

  const totalValue = fiis.reduce((sum, fii) => sum + fii.total, 0);
  // Calcular a menor diferença (SMALL function do Excel)
  const totalDiferenca = Math.min(...fiis.map((fii) => fii.diferenca));

  // Encontrar o FII com maior diferença negativa para recomendação
  const recommendation = fiis.reduce((min, fii) => (fii.diferenca < min.diferenca ? fii : min));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">FIIs</h2>

      {!isValidAllocation && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">⚠️ Atenção: A soma dos objetivos ({totalObjetivo.toFixed(2)}%) excede 100%!</p>
          <p className="text-sm">Ajuste os percentuais para que a soma não ultrapasse 100%.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ATIVO</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">QTD.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">OBJ.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">COTAÇÃO</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">TOTAL</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">% PARTICIP.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">% DIFERENÇA</th>
            </tr>
          </thead>
          <tbody>
            {fiis.map((fii, index) => (
              <tr key={fii.ativo} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{fii.ativo}</td>
                <td className="border border-gray-300 px-4 py-2">{fii.quantidade}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(fii.objetivo)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(fii.cotacao)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(fii.total)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(fii.participacao)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    fii.diferenca > 0 ? 'text-green-600' : fii.diferenca < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {fii.diferenca > 0 ? '+' : ''}
                  {formatPercentage(fii.diferenca)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 px-4 py-2">TOTAL</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td className="border border-gray-300 px-4 py-2">{formatPercentage(totalObjetivo)}</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td className="border border-gray-300 px-4 py-2">{formatCurrency(totalValue)}</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td
                className={`border border-gray-300 px-4 py-2 ${
                  totalDiferenca > 0 ? 'text-green-600' : totalDiferenca < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {totalDiferenca > 0 ? '+' : ''}
                {formatPercentage(totalDiferenca)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-lg bg-green-600 p-4 text-white">
        <p className="font-semibold">NA PRÓXIMA OPORTUNIDADE, COMPRE: {recommendation.ativo}</p>
      </div>
    </div>
  );
};

export default FIIs;
