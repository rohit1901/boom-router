import mitt from "mitt";
import { useSyncExternalStore } from "./react-deps.js";

// Function to handle navigation
const navigateImplementation = (path, history, record, emitter) => {
  return (newPath, { replace = false } = {}) => {
    if (record) {
      if (replace) {
        history.splice(history.length - 1, 1, newPath);
      } else {
        history.push(newPath);
      }
    }

    path = newPath;
    emitter.emit("navigate", newPath);
  };
};

// Function to handle subscription
const subscribeImplementation = (emitter) => {
  return (cb) => {
    emitter.on("navigate", cb);
    return () => emitter.off("navigate", cb);
  };
};

// Function to reset the history
const resetImplementation = (path, history, navigate) => {
  return () => {
    // clean history array with mutation to preserve link
    history.splice(0, history.length);
    navigate(path);
  };
};

export const memoryLocation = ({
  path = "/",
  static: staticLocation,
  record,
} = {}) => {
  let currentPath = path;
  const history = [currentPath];
  const emitter = mitt();

  const navigate = !staticLocation
    ? navigateImplementation(currentPath, history, record, emitter)
    : () => null;

  const subscribe = subscribeImplementation(emitter);

  const useMemoryLocation = () => [
    useSyncExternalStore(subscribe, () => currentPath),
    navigate,
  ];

  const reset = record
    ? resetImplementation(path, history, navigate)
    : undefined;

  return {
    hook: useMemoryLocation,
    navigate,
    history: record ? history : undefined,
    reset,
  };
};
