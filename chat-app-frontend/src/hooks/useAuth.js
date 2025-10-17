import { useSelector } from "react-redux";

export function useAuth() {
  const { user, userId, loading, error} = useSelector((state) => state.authStore);

  return {
    user,
    userId,
    loading,
    error
  };
}