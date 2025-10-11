export function nextTick(cb?: () => void): Promise<unknown> | void {
  const p = new Promise((resolve) => {
    Promise.resolve().then(() => {
      requestAnimationFrame(() => {
        resolve(undefined);
      });
    });
  });

  if (typeof cb === "function") {
    p.then(cb);
  }

  return p;
}
