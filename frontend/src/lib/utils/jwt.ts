export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
  } catch {

      return true;
  }
}