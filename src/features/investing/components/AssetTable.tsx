import type { ReactNode } from 'react';
import type { Asset, TableConfig } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface AssetTableProps<T extends Asset> {
  assets: T[];
  config: TableConfig;
  totalValue: number;
  totalTarget: number;
  recommendation: T;
  isValidAllocation: boolean;
  children?: ReactNode;
}

// Simplified AssetTable - applying YAGNI principle
const AssetTable = <T extends Asset>({
  assets,
  config,
  totalValue,
  totalTarget,
  recommendation,
  isValidAllocation,
  children,
}: AssetTableProps<T>) => {
  const totalDifference = Math.min(...assets.map((asset) => asset.difference));

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">{config.title}</h2>

      {!isValidAllocation && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">⚠️ Atenção: A soma dos objetivos ({totalTarget.toFixed(2)}%) excede 100%!</p>
          <p className="text-sm">Ajuste os percentuais para que a soma não ultrapasse 100%.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${config.headerColor} text-white`}>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ATIVO</th>
              {'currentValue' in assets[0] && (
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">VALOR</th>
              )}
              {'quantity' in assets[0] && (
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">QUANTIDADE</th>
              )}
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">OBJETIVO (%)</th>
              {'price' in assets[0] && (
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">COTAÇÃO</th>
              )}
              {'total' in assets[0] && (
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">TOTAL</th>
              )}
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">PARTICIP. (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">DIFERENÇA</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.asset} className={index % 2 === 0 ? config.rowColor : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{asset.asset}</td>
                {'currentValue' in asset && (
                  <td className="border border-gray-300 px-4 py-2">{formatCurrency(asset.currentValue as number)}</td>
                )}
                {'quantity' in asset && (
                  <td className="border border-gray-300 px-4 py-2">{asset.quantity as number}</td>
                )}
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(asset.target as number)}</td>
                {'price' in asset && (
                  <td className="border border-gray-300 px-4 py-2">{formatCurrency(asset.price as number)}</td>
                )}
                {'total' in asset && (
                  <td className="border border-gray-300 px-4 py-2">{formatCurrency(asset.total as number)}</td>
                )}
                <td className="border border-gray-300 px-4 py-2">{formatPercentage(asset.participation as number)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    asset.difference > 0 ? 'text-green-600' : asset.difference < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {asset.difference > 0 ? '+' : ''}
                  {formatPercentage(asset.difference as number)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 px-4 py-2">TOTAL</td>
              {'currentValue' in assets[0] && (
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(totalValue)}</td>
              )}
              {'quantity' in assets[0] && <td className="border border-gray-300 px-4 py-2">-</td>}
              <td className="border border-gray-300 px-4 py-2">{formatPercentage(totalTarget)}</td>
              {'price' in assets[0] && <td className="border border-gray-300 px-4 py-2">-</td>}
              {'total' in assets[0] && (
                <td className="border border-gray-300 px-4 py-2">{formatCurrency(totalValue)}</td>
              )}
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td
                className={`border border-gray-300 px-4 py-2 ${
                  totalDifference > 0 ? 'text-green-600' : totalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {totalDifference > 0 ? '+' : ''}
                {formatPercentage(totalDifference)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`mt-6 rounded-lg ${config.recommendationColor} p-4 text-white`}>
        <p className="font-semibold">NA PRÓXIMA OPORTUNIDADE, COMPRE: {recommendation.asset}</p>
      </div>

      {children}
    </div>
  );
};

export default AssetTable;
