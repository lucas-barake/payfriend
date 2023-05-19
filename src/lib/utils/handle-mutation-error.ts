export function handleMutationError(error: unknown, message?: string): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (message !== undefined) return message;
  return "An unknown error occurred";
}
