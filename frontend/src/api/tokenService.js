import { BigInteger } from "jsbn";
import { modInv, modPow, randBetween, gcd } from "bigint-crypto-utils";
import API from "./auth";

export async function issueBlindToken() {
  // 1) Fetch RSA key
  const { modulus, exponent } = (await API.get("/api/vote/generate")).data;
  const n = BigInt(modulus);
  const e = BigInt(exponent);

  // 2) pick random message m
  const m = randBetween(n - 1n);
  // pick blinding factor r s.t. gcd(r,n) == 1
  let r;
  do {
    r = randBetween(n - 1n);
  } while (gcd(r, n) !== 1n);

  // 3) compute blinded m' = (r^e * m) mod n
  const blinded = (modPow(r, e, n) * m) % n;

  // 4) request blind signature (base64)
  const { data: sigBlindedB64 } = await API.post("/api/vote/challenge", {
    blinded: blinded.toString(),
  });

  // 5) decode base64 → Uint8Array → BigInt
  const binStr = atob(sigBlindedB64);
  const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  const sigBlinded = BigInt("0x" + hex);

  // 6) unblind
  const rInv = modInv(r, n);
  const s = (sigBlinded * rInv) % n;

  // now s is your decimal signature
  return { token: m.toString(), signature: s.toString() };
}

export default { issueBlindToken };
