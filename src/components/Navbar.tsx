import { CreditCard as CreditCardIcon, Wallet, LayoutDashboard, CheckSquare, TrendingUp, Home, Heart, Target, Flag, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  currentFeature?: string;
  onFeatureChange?: (feature: string) => void;
}

const features = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'credit-card',
    label: 'Cartão de Crédito',
    icon: CreditCardIcon,
  },
  {
    id: 'expenses',
    label: 'Despesas',
    icon: Wallet,
  },
  {
    id: 'income',
    label: 'Receitas',
    icon: TrendingUp,
  },
  {
    id: 'fixed-costs',
    label: 'Custos Fixos',
    icon: Home,
  },
  {
    id: 'health',
    label: 'Saúde',
    icon: Heart,
  },
  {
    id: 'budgets',
    label: 'Orçamentos',
    icon: Target,
  },
  {
    id: 'savings-goals',
    label: 'Metas',
    icon: Flag,
  },
  {
    id: 'checklist',
    label: 'Checklist',
    icon: CheckSquare,
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: SettingsIcon,
  },
];

export function Navbar({ currentFeature, onFeatureChange }: NavbarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">My Money Control</h1>
          </div>
          <div className="flex items-center gap-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = currentFeature === feature.id;
              return (
                <Button
                  key={feature.id}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => onFeatureChange?.(feature.id)}
                  className={cn(
                    'flex items-center gap-2',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {feature.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

