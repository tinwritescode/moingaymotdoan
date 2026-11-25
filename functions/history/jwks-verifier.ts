import { createRemoteJWKSet, jwtVerify } from "jose";
import type { TokenVerifier } from "../../lib/history/ports";

export type JwksVerifierConfig = {
  jwksUrl: string;
  issuers: string | string[];
  audience?: string | string[];
};

/** Generic OIDC/JWKS bearer-token verifier implementing the TokenVerifier seam. */
export function createJwksTokenVerifier(config: JwksVerifierConfig): TokenVerifier {
  const jwks = createRemoteJWKSet(new URL(config.jwksUrl));
  return async (token: string) => {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.issuers,
      ...(config.audience ? { audience: config.audience } : {}),
    });
    return typeof payload.sub === "string" && payload.sub.length > 0 ? payload.sub : null;
  };
}

/** Convenience preset configuring the generic JWKS verifier for WorkOS AuthKit. */
export function createWorkosTokenVerifier(config: {
  clientId: string;
  apiHostname?: string;
}): TokenVerifier {
  const host = (config.apiHostname?.trim() || "api.workos.com")
    .replace(/^https?:\/\//u, "")
    .replace(/\/+$/u, "");
  return createJwksTokenVerifier({
    jwksUrl: `https://${host}/sso/jwks/${config.clientId}`,
    issuers: [`https://${host}/user_management/${config.clientId}`, `https://${host}`],
  });
}
