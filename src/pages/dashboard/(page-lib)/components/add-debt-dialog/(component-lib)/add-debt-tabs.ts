import { type TabList } from "$/hooks/use-tabs/use-tabs";

export const addDebtTabs = [
  "general-info-form",
  "members-form",
] as const satisfies TabList;
export type AddDebtTab = typeof addDebtTabs[number];
