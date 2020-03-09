let taskQueue = [];

export const resolveQueue = () => taskQueue;
export const resetQueue = () => (taskQueue = []);

const commitWork = () => {
  let i = 0;

  const performTask = () => {
    taskQueue[i]();
    if (++i < taskQueue.length) setTimeout(performTask);
  };

  setTimeout(performTask);
};

export default commitWork;
