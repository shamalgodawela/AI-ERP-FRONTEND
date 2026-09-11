import axios from 'axios';

const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
const legacyBackendUrls = [
  'https://nihon-inventory.onrender.com',
  'http://localhost:5000',
];

const replaceLegacyBackendUrl = (requestUrl) => {
  if (!backendUrl || typeof requestUrl !== 'string') {
    return requestUrl;
  }

  return legacyBackendUrls.reduce(
    (url, legacyUrl) => url.startsWith(legacyUrl) ? `${backendUrl}${url.slice(legacyUrl.length)}` : url,
    requestUrl
  );
};

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string') {
    config.url = replaceLegacyBackendUrl(config.url);
  }
  return config;
});

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === 'string') {
    return originalFetch(replaceLegacyBackendUrl(input), init);
  }

  if (input instanceof Request) {
    const requestUrl = replaceLegacyBackendUrl(input.url);
    if (requestUrl !== input.url) {
      return originalFetch(new Request(requestUrl, input), init);
    }
  }

  return originalFetch(input, init);
};

export const BACKEND_URL = backendUrl;