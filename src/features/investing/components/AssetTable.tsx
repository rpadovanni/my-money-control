import type { ReactNode } from 'react';
import type { Asset, TableConfig } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface AssetTableProps {
  assets: Asset[];
  config: TableConfig;
  totalValue: number;
  totalTarget: number;
  recommendation: Asset;
  isValidAllocation: boolean;
  children?: ReactNode;
}

// Enhanced AssetTable with improved visual design
const AssetTable = ({
  assets,
  config,
  totalValue,
  totalTarget,
  recommendation,
  isValidAllocation,
  children,
}: AssetTableProps) => {
  const totalDifference = Math.min(...assets.map((asset) => asset.difference));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="mb-1 text-lg font-medium text-gray-100">{config.title}</h2>
        <div className="h-0.5 w-42 rounded-full bg-gradient-to-r from-blue-300 to-purple-400"></div>
      </div>

      {!isValidAllocation && (
        <div className="bg-orange-25 mb-4 rounded-lg border-l-2 border-orange-300 p-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-2">
              <h3 className="text-sm font-medium text-orange-600">Atenção!</h3>
              <p className="text-xs text-orange-500">A soma dos objetivos ({totalTarget.toFixed(2)}%) excede 100%!</p>
              <p className="text-xs text-orange-400">Ajuste os percentuais para que a soma não ultrapasse 100%.</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-cyan-600 text-gray-100">
              <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Ativo</th>
              {assets[0]?.currentValue && (
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Valor</th>
              )}
              {assets[0]?.quantity && (
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Quantidade</th>
              )}
              <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Objetivo (%)</th>
              {assets[0]?.price && (
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Cotação</th>
              )}
              {assets[0]?.total && (
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Total</th>
              )}
              <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Particip. (%)</th>
              <th className="px-4 py-2 text-left text-xs font-medium tracking-wide uppercase">Diferença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {assets.map((asset, index) => (
              <tr
                key={asset.asset}
                className={`transition-colors duration-150 hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-2 font-medium text-gray-600">{asset.asset}</td>
                {asset.currentValue && (
                  <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(asset.currentValue)}</td>
                )}
                {asset.quantity && <td className="px-4 py-2 text-sm text-gray-500">{asset.quantity}</td>}
                <td className="px-4 py-2 text-sm text-gray-500">{formatPercentage(asset.target)}</td>
                {asset.price && <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(asset.price)}</td>}
                {asset.total && <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(asset.total)}</td>}
                <td className="px-4 py-2 text-sm text-gray-500">{formatPercentage(asset.participation)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      asset.difference > 0
                        ? 'bg-green-25 text-green-600'
                        : asset.difference < 0
                          ? 'bg-red-25 text-red-600'
                          : 'bg-gray-25 text-gray-500'
                    }`}
                  >
                    {asset.difference > 0 ? '+' : ''}
                    {formatPercentage(asset.difference)}
                  </span>
                </td>
              </tr>
            ))}
            {/* Soft total row */}
            <tr className="bg-gray-25 border-t border-gray-100 font-medium">
              <td className="px-4 py-2 text-gray-600">TOTAL</td>
              {assets[0]?.currentValue && <td className="px-4 py-2 text-gray-600">{formatCurrency(totalValue)}</td>}
              {assets[0]?.quantity && <td className="px-4 py-2 text-gray-300">-</td>}
              <td className="px-4 py-2 text-gray-600">{formatPercentage(totalTarget)}</td>
              {assets[0]?.price && <td className="px-4 py-2 text-gray-300">-</td>}
              {assets[0]?.total && <td className="px-4 py-2 text-gray-600">{formatCurrency(totalValue)}</td>}
              <td className="px-4 py-2 text-gray-300">-</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    totalDifference > 0
                      ? 'bg-green-50 text-green-600'
                      : totalDifference < 0
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {totalDifference > 0 ? '+' : ''}
                  {formatPercentage(totalDifference)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`mt-4 w-fit rounded-lg bg-teal-700 p-3 text-white opacity-90`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="ml-2">
            <p className="text-sm font-medium">Recomendação de Compra</p>
            <p className="text-xs opacity-80">
              Na próxima oportunidade, compre: <span className="font-medium">{recommendation.asset}</span>
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default AssetTable;
