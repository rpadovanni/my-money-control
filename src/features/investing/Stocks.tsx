import { useState, useMemo } from 'react';

interface StockInput {
  ativo: string;
  quantidade: number;
  objetivo: number;
  cotacao: number;
}

interface StockCalculated extends StockInput {
  total: number;
  participacao: number;
  diferenca: number;
}

const Stocks = () => {
  const [stocksInput] = useState<StockInput[]>([
    {
      ativo: 'BBAS3',
      quantidade: 70,
      objetivo: 8,
      cotacao: 20.61,
    },
    {
      ativo: 'BPAC11',
      quantidade: 50,
      objetivo: 6,
      cotacao: 47.14,
    },
    {
      ativo: 'CXSE3',
      quantidade: 138,
      objetivo: 10,
      cotacao: 14.92,
    },
    {
      ativo: 'EALT4',
      quantidade: 40,
      objetivo: 3,
      cotacao: 11.22,
    },
    {
      ativo: 'ITSA4',
      quantidade: 368,
      objetivo: 15,
      cotacao: 10.95,
    },
    {
      ativo: 'KLBN11',
      quantidade: 102,
      objetivo: 10,
      cotacao: 17.37,
    },
    {
      ativo: 'NEOE3',
      quantidade: 105,
      objetivo: 10,
      cotacao: 27.4,
    },
    {
      ativo: 'PSSA3',
      quantidade: 35,
      objetivo: 10,
      cotacao: 46.34,
    },
    {
      ativo: 'RDOR3',
      quantidade: 40,
      objetivo: 8,
      cotacao: 39.79,
    },
    {
      ativo: 'SAPR4',
      quantidade: 430,
      objetivo: 15,
      cotacao: 6.83,
    },
    {
      ativo: 'WEGE3',
      quantidade: 23,
      objetivo: 5,
      cotacao: 36.69,
    },
  ]);

  // Validação: verificar se a soma dos objetivos não excede 100%
  const totalObjetivo = stocksInput.reduce((sum, stock) => sum + stock.objetivo, 0);
  const isValidAllocation = totalObjetivo <= 100;

  // Calcular valores automaticamente
  const stocks = useMemo((): StockCalculated[] => {
    // Calcular total de todos os ativos
    const totalValue = stocksInput.reduce((sum, stock) => sum + stock.quantidade * stock.cotacao, 0);

    return stocksInput.map((stock) => {
      const total = stock.quantidade * stock.cotacao;
      // Fórmula do Excel: =(ROUND((totalDoAtivo/somaDoValorDeTodosAtivos)*100;2))/100
      // A participação deve ser em percentual (0-100), não em decimal (0-1)
      const participacao = Math.round((total / totalValue) * 100 * 100) / 100; // ROUND com 2 casas decimais em percentual
      // Fórmula: =(participacaoDoAtivoNaCarteira-ObjetivoDoAtivoNaCarteira)/100
      // A diferença deve ser a diferença entre participação e objetivo, dividida por 100 para converter para decimal
      const diferenca = (participacao - stock.objetivo) / 100;

      return {
        ...stock,
        total,
        participacao,
        diferenca,
      };
    });
  }, [stocksInput]);

  const totalValue = stocks.reduce((sum, stock) => sum + stock.total, 0);
  // Calcular a menor diferença (SMALL function do Excel)
  const totalDiferenca = Math.min(...stocks.map((stock) => stock.diferenca));

  // Encontrar o ativo com maior diferença negativa para recomendação
  const recommendation = stocks.reduce((min, stock) => (stock.diferenca < min.diferenca ? stock : min));

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
      <h2 className="mb-6 text-2xl font-bold text-gray-800">AÇÕES</h2>

      {!isValidAllocation && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">⚠️ Atenção: A soma dos objetivos ({totalObjetivo.toFixed(2)}%) excede 100%!</p>
          <p className="text-sm">Ajuste os percentuais para que a soma não ultrapasse 100%.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ATIVO</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">QUANTIDADE</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">OBJETIVO (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">COTAÇÃO (R$)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">TOTAL</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">PARTICIP. (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">DIFERENÇA</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.ativo} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{stock.ativo}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.quantidade}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(stock.objetivo)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(stock.cotacao)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(stock.total)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(stock.participacao)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    stock.diferenca > 0 ? 'text-green-600' : stock.diferenca < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {stock.diferenca > 0 ? '+' : ''}
                  {formatPercentage(stock.diferenca)}
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

export default Stocks;
