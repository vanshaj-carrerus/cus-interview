import { SignJWT, jwtVerify } from "jose";

const COOKIE_MAX_SECONDS = 60 * 60 * 24;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 16 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  email: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
  });
  const sub = payload.sub;
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!sub) {
    throw new Error("Invalid token");
  }
  return { sub, email };
}

export const SESSION_MAX_AGE_SECONDS = COOKIE_MAX_SECONDS;
