export interface PublishDecision {
  publish: boolean;
  reason: string;
}

/**
 * Decides whether a site build may carry event data.
 * Two locks, both required:
 *  1. SITE_PUBLISH must be exactly "1".
 *  2. On Cloudflare (Pages or Workers Builds) the build must be for `main`. A preview build,
 *     or a build whose branch cannot be identified, stays empty. This does not depend on how
 *     the host scopes environment variables.
 */
export function shouldPublish(env: Record<string, string | undefined>): PublishDecision {
  if (env.SITE_PUBLISH !== '1') return { publish: false, reason: 'SITE_PUBLISH no es 1' };
  const onCloudflare = env.CF_PAGES === '1' || env.WORKERS_CI === '1';
  if (!onCloudflare) return { publish: true, reason: 'construcción fuera de Cloudflare' };
  const branch = env.CF_PAGES_BRANCH ?? env.WORKERS_CI_BRANCH;
  if (branch === 'main') return { publish: true, reason: 'rama main en Cloudflare' };
  return { publish: false, reason: `rama "${branch ?? 'desconocida'}" en Cloudflare: solo main publica datos` };
}
