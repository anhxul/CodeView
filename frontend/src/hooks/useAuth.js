import { useAuthContext } from '@/context/AuthContext';

/**
 * Convenience hook for accessing authentication state and actions.
 * @returns {{
 *  user: object|null,
 *  loading: boolean,
 *  isAuthenticated: boolean,
 *  signup: Function,
 *  login: Function,
 *  logout: Function,
 *  updateUser: Function,
 *  refreshUser: Function
 * }}
 */
export function useAuth() {
  return useAuthContext();
}