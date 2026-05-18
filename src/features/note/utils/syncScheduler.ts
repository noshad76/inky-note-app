let timer: ReturnType<typeof setTimeout> | null = null;

export const scheduleSync = (sync: () => void) => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    sync();
  }, 10000);
};
