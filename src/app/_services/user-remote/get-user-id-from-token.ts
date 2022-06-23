export function getUserIdFromToken(token: string): number {
  // 從 accessToken 取得 payload
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = Number(payload.sub);
  return userId;
}
