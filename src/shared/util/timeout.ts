export const safeTimeoutCall = (call: CallableFunction, timeout: number) =>
  new Promise<NodeJS.Timeout>((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(call());
      } catch (e) {
        reject(e);
      }
    }, timeout),
  );
