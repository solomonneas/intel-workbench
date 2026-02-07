import { useLocation } from 'react-router-dom';

/**
 * Returns the variant base path prefix for navigation.
 * If the current URL starts with /v1, /v2, etc., returns that prefix.
 * If at /default, returns '/default'.
 * Otherwise returns empty string (root-level routing).
 */
export function useBasePath(): string {
  const location = useLocation();
  const match = location.pathname.match(/^\/(v[1-5]|default)/);
  return match ? `/${match[1]}` : '';
}
