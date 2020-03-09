let taskQueue = [];

export const resolveQueue = () => taskQueue;
export const resetQueue = () => (taskQueue = []);

const commitWork = () => {
  for (let i = 0; i < taskQueue.length; i++) {
    setTimeout(taskQueue[i]);
  }

  return true;
};

export default commitWork;
