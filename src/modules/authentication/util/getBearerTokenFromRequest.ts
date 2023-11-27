export const getBearerTokenFromRequest = (req: unknown): string | null => {
  if (!req) {
    return null;
  }

  if (
    typeof req !== 'object' ||
    !('headers' in req) ||
    !req.headers ||
    typeof req.headers !== 'object'
  ) {
    console.log('not passing req validation');
    return null;
  }

  const headers = req.headers as Record<string, string>;
  const authHeader = headers['authorization'] || headers['Authorization'];

  if (!authHeader) {
    return null;
  }

  return authHeader.slice('Bearer '.length);
};
