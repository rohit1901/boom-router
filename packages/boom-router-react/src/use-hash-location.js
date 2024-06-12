import { useSyncExternalStore } from "./react-deps.js";

// Array of callbacks subscribed to hash updates
const hashUpdateListeners = {
  v: [],
};

// Function to handle hash changes
const handleHashChange = () => hashUpdateListeners.v.forEach((cb) => cb());

// Function to subscribe to hash updates
const subscribeToHashUpdates = (callback) => {
  if (hashUpdateListeners.v.push(callback) === 1)
    addEventListener("hashchange", handleHashChange);

  return () => {
    hashUpdateListeners.v = hashUpdateListeners.v.filter((i) => i !== callback);
    if (!hashUpdateListeners.v.length)
      removeEventListener("hashchange", handleHashChange);
  };
};

// Function to get the current hash location
const getCurrentHashLocation = () => "/" + location.hash.replace(/^#?\/?/, "");

// Function to navigate
export const navigate = (to, { state = null } = {}) => {
  // Calling `replaceState` allows us to set the history
  // state without creating an extra entry
  history.replaceState(
    state,
    "",
    // Keep the current pathname, current query string, but replace the hash
    location.pathname +
      location.search +
      // Update location hash, this will cause `hashchange` event to fire
      // Normalize the value before updating, so it's always preceded with "#/"
      (location.hash = `#/${to.replace(/^#?\/?/, "")}`)
  );
};

// Function to use the hash location
export const useHashLocation = ({ ssrPath = "/" } = {}) => [
  useSyncExternalStore(
    subscribeToHashUpdates,
    getCurrentHashLocation,
    () => ssrPath
  ),
  navigate,
];

// Function to get hrefs
useHashLocation.hrefs = (href) => "#" + href;
