const tokenStorageKey = "emmarToken";

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(tokenStorageKey)?.trim();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};