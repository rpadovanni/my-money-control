import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Target, Receipt, TrendingUp } from 'lucide-react';

type Page = 'dashboard' | 'planning' | 'transactions' | 'investments';

interface AppLayoutProps extends PropsWithChildren {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function AppLayout({ children, currentPage, onPageChange }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 border-r bg-card p-4">
        <nav className="space-y-2">
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onPageChange('dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={currentPage === 'planning' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onPageChange('planning')}
          >
            <Target className="mr-2 h-4 w-4" />
            Planejamento
          </Button>
          <Button
            variant={currentPage === 'transactions' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onPageChange('transactions')}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Transações
          </Button>
          <Button
            variant={currentPage === 'investments' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onPageChange('investments')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Investimentos
          </Button>
        </nav>
      </aside>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
