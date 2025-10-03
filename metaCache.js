// metaCache.js
let cache = {
  data: null,
  timestamp: null,
};

export function getMetaCache() {
  return cache;
}

export function setMetaCache(data) {
  cache = {
    data,
    timestamp: Date.now(),
  };
}
