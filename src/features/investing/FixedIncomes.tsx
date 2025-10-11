import { useState, useMemo } from 'react';

interface FixedIncomeInput {
  ativo: string;
  valorAtual: number;
  objetivo: number;
}

interface FixedIncomeCalculated extends FixedIncomeInput {
  participacao: number;
  diferenca: number;
}

const FixedIncomes = () => {
  const [fixedIncomesInput] = useState<FixedIncomeInput[]>([
    {
      ativo: 'CDB Mercado Pago',
      valorAtual: 40000.0,
      objetivo: 80,
    },
    {
      ativo: 'MP - Tesouro Direto',
      valorAtual: 1246.52,
      objetivo: 5,
    },
    {
      ativo: 'MP - Fundos',
      valorAtual: 0.0,
      objetivo: 0,
    },
    {
      ativo: 'LP - Fundos',
      valorAtual: 2652.63,
      objetivo: 5,
    },
    {
      ativo: 'AP - Previdência',
      valorAtual: 0.0,
      objetivo: 5,
    },
    {
      ativo: 'AP - IPCA+ 2045',
      valorAtual: 514.22,
      objetivo: 5,
    },
  ]);

  // Validação: verificar se a soma dos objetivos não excede 100%
  const totalObjetivo = fixedIncomesInput.reduce((sum, asset) => sum + asset.objetivo, 0);
  const isValidAllocation = totalObjetivo <= 100;

  // Calcular valores automaticamente
  const fixedIncomes = useMemo((): FixedIncomeCalculated[] => {
    // Calcular total de todos os ativos
    const totalValue = fixedIncomesInput.reduce((sum, asset) => sum + asset.valorAtual, 0);

    return fixedIncomesInput.map((asset) => {
      // Fórmula do Excel: =(ROUND((valorAtual/somaDoValorDeTodosAtivos)*100;2))/100
      // A participação deve ser em percentual (0-100), não em decimal (0-1)
      const participacao = Math.round((asset.valorAtual / totalValue) * 100 * 100) / 100; // ROUND com 2 casas decimais em percentual
      // Fórmula: =(participacaoDoAtivoNaCarteira-ObjetivoDoAtivoNaCarteira)/100
      // A diferença deve ser a diferença entre participação e objetivo, dividida por 100 para converter para decimal
      const diferenca = (participacao - asset.objetivo) / 100;

      return {
        ...asset,
        participacao,
        diferenca,
      };
    });
  }, [fixedIncomesInput]);

  const totalValue = fixedIncomes.reduce((sum, asset) => sum + asset.valorAtual, 0);
  // Calcular a menor diferença (SMALL function do Excel)
  const totalDiferenca = Math.min(...fixedIncomes.map((asset) => asset.diferenca));

  // Encontrar o ativo com maior diferença negativa para recomendação
  const recommendation = fixedIncomes.reduce((min, asset) => (asset.diferenca < min.diferenca ? asset : min));

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
      <h2 className="mb-6 text-2xl font-bold text-gray-800">RENDA FIXA</h2>

      {!isValidAllocation && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">⚠️ Atenção: A soma dos objetivos ({totalObjetivo.toFixed(2)}%) excede 100%!</p>
          <p className="text-sm">Ajuste os percentuais para que a soma não ultrapasse 100%.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ATIVO</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">VALOR ATUAL</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">OBJETIVO (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">% PARTICIP.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">% DIFERENÇA</th>
            </tr>
          </thead>
          <tbody>
            {fixedIncomes.map((asset, index) => (
              <tr key={asset.ativo} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{asset.ativo}</td>
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(asset.valorAtual)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(asset.objetivo)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(asset.participacao)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    asset.diferenca > 0 ? 'text-green-600' : asset.diferenca < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {asset.diferenca > 0 ? '+' : ''}
                  {formatPercentage(asset.diferenca)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 px-4 py-2">TOTAL</td>
              <td className="border border-gray-300 px-4 py-2">{formatCurrency(totalValue)}</td>
              <td className="border border-gray-300 px-4 py-2">{formatPercentage(totalObjetivo)}</td>
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

      <div className="mt-6 rounded-lg bg-blue-600 p-4 text-white">
        <p className="font-semibold">NA PRÓXIMA OPORTUNIDADE, COMPRE: {recommendation.ativo}</p>
      </div>
    </div>
  );
};

export default FixedIncomes;
