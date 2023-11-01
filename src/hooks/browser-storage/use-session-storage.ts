import { createStorageHook } from "$/hooks/browser-storage/_lib/create-storage-hook";
import { getStorage } from "$/hooks/browser-storage/_lib/get-storage";

export const useSessionStorage = createStorageHook(getStorage("session"));
