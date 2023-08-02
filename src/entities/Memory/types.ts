export type MemoryRegistry = {
  [functionName: (string | symbol)]: { callId: string; result: unknown }[];
};
