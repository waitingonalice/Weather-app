export const pollFreshData = (callback: () => void) => {
  const startTime = new Date().getTime();
  const interval = setInterval(() => {
    // poll for 1 hour
    if (new Date().getTime() - startTime > 3600000) {
      // stop the poll after one hour. This is necessary as API has rate limiter.
      clearInterval(interval);
      return;
    }
    callback();
    // make a request every 10 mins
  }, 1000 * 10 * 60);
  return () => clearInterval(interval);
};
