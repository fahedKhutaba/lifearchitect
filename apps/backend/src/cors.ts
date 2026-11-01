export const DEFAULT_WEB_ORIGIN = 'http://localhost:3000';

export function corsOptions(webOrigin: string | undefined = process.env.WEB_ORIGIN) {
  return { origin: webOrigin || DEFAULT_WEB_ORIGIN };
}
