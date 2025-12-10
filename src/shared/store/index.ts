import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { UserSlice } from './slices/user.slice';
import { createUserSlice } from './slices/user.slice';
import type { SettingsSlice } from './slices/settings.slice';
import { createSettingsSlice } from './slices/settings.slice';
import type { PlanningSlice } from './slices/planning.slice';
import { createPlanningSlice } from './slices/planning.slice';
import type { TransactionsSlice } from './slices/transactions.slice';
import { createTransactionsSlice } from './slices/transactions.slice';
import type { InvestmentsSlice } from './slices/investments.slice';
import { createInvestmentsSlice } from './slices/investments.slice';

export type GlobalState = UserSlice & SettingsSlice & PlanningSlice & TransactionsSlice & InvestmentsSlice;

const storeCreator: StateCreator<GlobalState> = (...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a),
  ...createPlanningSlice(...a),
  ...createTransactionsSlice(...a),
  ...createInvestmentsSlice(...a),
});

// Apply persist middleware (optional - can be disabled)
const persistConfig = {
  name: 'my-money-control-store',
  // Only persist specific slices if needed
  partialize: (state: GlobalState) => ({
    settings: state.settings,
    user: state.user,
    transactions: state.transactions,
    assets: state.assets,
    // Note: investment transactions and priceHistory are persisted separately in localStorage
    // Add other slices that should be persisted
  }),
};

// Apply persist first, then devtools in development
const persistedStore = persist(storeCreator, persistConfig);

// Apply devtools only in development
export const useStore = create<GlobalState>()(
  import.meta.env.DEV
    ? devtools(persistedStore, { name: 'MyMoneyControl' })
    : persistedStore
);
