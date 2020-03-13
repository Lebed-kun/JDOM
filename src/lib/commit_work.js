import { initUnblock } from "./render";

let taskQueue = [];

export const resolveQueue = () => taskQueue;
const resetQueue = () => (taskQueue = []);

const commitWork = () => {
  let i = 0;

  const performTask = () => {
    taskQueue[i]();
    if (++i < taskQueue.length) setTimeout(performTask);
    else {
      initUnblock();
      resetQueue();
    }
  };

  setTimeout(performTask);
};

export default commitWork;
