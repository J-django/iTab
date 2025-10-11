export function getApiURL() {
  const dev = import.meta.env.DEV;
  return dev ? "/search-api" : import.meta.env.VITE_SEARCH_API_URL;
}
