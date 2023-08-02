import { MemoryRegistry } from './types';

// const memory = {
//   toString: [
//     {
//       callId: '20230802.YYYY-MM-DDTHH:MM:SS.SSSTZ',
//       result: '2023-08-02T00:00:00.000+03:00',
//     },
//   ],
// };

// const memoryInstances: { memoryId: string; instance: Memory }[] = [];

class Memory {
  #registry: MemoryRegistry = {};

  constructor() {
    // const oldInstance = memoryInstances.find((data) => data.memoryId === memoryId);
    // if (oldInstance === undefined) {
    //   memoryInstances.unshift({ memoryId, instance: this });
    // } else {
    //   return oldInstance.instance;
    // }
  }

  /**
   *
   * @param
   * @param callId a unique identifier of a function call to distinguish from other calls of the same function.
   * Usually composed of all dependencies such as arguments and context.
   */
  memorizeCall({ functionName, callId, result }: { functionName: string; callId: string; result: unknown }): void {
    // TODO: implement
    // Unshift elements to an array
  }
}

export const memory = new Memory();
