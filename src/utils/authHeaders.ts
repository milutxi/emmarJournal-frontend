const tokenStorageKey = "emmarToken";

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(tokenStorageKey);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};