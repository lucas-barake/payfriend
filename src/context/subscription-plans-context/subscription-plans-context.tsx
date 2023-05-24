import React from "react";
import { api } from "$/lib/utils/api";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "$/server/api/root";
import { TimeInMs } from "$/lib/enums/time";

type SubscriptionPlansContext = inferProcedureOutput<
  AppRouter["mercadoPago"]["getActivePlans"]
>;

const initialContext: SubscriptionPlansContext = {
  paging: {
    limit: 0,
    offset: 0,
    total: 0,
  },
  results: [],
};

export const SubscriptionPlansContext = React.createContext(initialContext);

export function useSubscriptionPlans(): SubscriptionPlansContext {
  const context = React.useContext(SubscriptionPlansContext);

  if (context === undefined) {
    throw new Error(
      "useSubscriptionPlans must be used within a SubscriptionPlansProvider"
    );
  }

  return context;
}

type Props = {
  children: React.ReactNode;
};

export const SubscriptionPlansProvider: React.FC<Props> = ({ children }) => {
  const query = api.mercadoPago.getActivePlans.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: TimeInMs.FiveMinutes,
  });

  return (
    <SubscriptionPlansContext.Provider value={query.data ?? initialContext}>
      {children}
    </SubscriptionPlansContext.Provider>
  );
};
