import { useState } from "react";
import { type NonEmptyArray } from "$/lib/types/type-contraints";

type TabList = Readonly<NonEmptyArray<string>>;

type TabSetters<T extends TabList> = {
  next: () => void;
  prev: () => void;
  set: (tab: T[number]) => void;
  reset: () => void;
};

type Options<T extends TabList> = {
  initialTab?: T[number];
};

function useTabs<T extends TabList>(
  tabs: T,
  { initialTab }: Options<T> = {}
): [T[number], TabSetters<T>] {
  const [currentTab, setCurrentTab] = useState(initialTab ?? tabs[0]);

  const tabSetters: TabSetters<T> = {
    next() {
      const currentIndex = tabs.findIndex((tab) => tab === currentTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex] ?? tabs[0];
      setCurrentTab(nextTab);
    },
    prev() {
      const currentIndex = tabs.findIndex((tab) => tab === currentTab);
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIndex] ?? tabs[0];
      setCurrentTab(prevTab);
    },
    set(tab) {
      setCurrentTab(tab);
    },
    reset() {
      setCurrentTab(tabs[0]);
    },
  };

  return [currentTab, tabSetters];
}

export { useTabs, type TabSetters, type TabList };
