#!/usr/bin/env node
/* ============================================================
   STUTI — is sync-corpus.mjs signing its requests correctly?

   The sync command signs its own S3 requests rather than carry an SDK, and
   until today it had only ever been rehearsed with `--to <dir>`, which signs
   nothing. Three faults were sitting in it, each of which R2 answers with the
   same unhelpful SignatureDoesNotMatch:

     1. the listing addressed /<bucket> but signed /<bucket>/;
     2. the canonical request always carried an empty query string, while the
        listing is the one call that has one;
     3. path segments were escaped with encodeURIComponent, which leaves
        !'()* alone where SigV4 does not.

   A credential is not the place to discover that. This checks the signing
   against Amazon's own published vectors, which are the only way to know the
   HMAC chain is right without an account, and then checks the shapes the three
   faults above would break.

     node tools/sync-corpus-selftest.mjs
   ============================================================ */
import { createHmac } from "node:crypto";
import { sign } from "./sync-corpus.mjs";

let pass = 0;
const fail = [];
function check(what, got, want) {
  if (got === want) { pass++; return; }
  fail.push(`${what}\n    got:  ${got}\n    want: ${want}`);
}
function ok(what, cond) { check(what, cond ? "ok" : "not ok", "ok"); }

/* ---- 1. the signing key, against Amazon's published vector ----
   AWS's "Examples of how to derive a signing key" gives this exact answer for
   this exact secret, date, region and service. If the HMAC chain is wrong in
   any link, this number comes out different. */
{
  const hmac = (k, s) => createHmac("sha256", k).update(s).digest();
  let k = hmac(Buffer.from("AWS4wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY"), "20120215");
  for (const part of ["us-east-1", "iam", "aws4_request"]) k = hmac(k, part);
  check("AWS published signing-key vector",
    k.toString("hex"),
    "f4780e2d9f65fa895f9c67b32ce1baf0b0d8a43505a000a1a9e090d414db404d");
}

const creds = {
  accountId: "85555d9d0eff687ef2bc7d34f5fb1c27",
  bucket: "stuti-corpus",
  accessKey: "TESTKEYID",
  secret: "TESTSECRET",
};

/* ---- 2. fault 1: a bucket-level request has no trailing slash ---- */
{
  const { url } = sign({ method: "GET", key: "", query: { "list-type": "2" }, ...creds });
  const path = new URL(url).pathname;
  check("listing addresses /<bucket>, not /<bucket>/", path, "/stuti-corpus");
}

/* ---- 3. fault 2: the query string is signed ----
   Two listings that differ only in their continuation token must not come out
   with the same signature. Before the fix they did, because the canonical
   request carried "" for the query either way. */
{
  const a = sign({ method: "GET", key: "", query: { "list-type": "2", prefix: "t/" }, ...creds });
  const b = sign({ method: "GET", key: "", query: { "list-type": "2", prefix: "t/", "continuation-token": "abc" }, ...creds });
  const sigOf = (h) => h.authorization.split("Signature=")[1];
  ok("a different query gives a different signature", sigOf(a.headers) !== sigOf(b.headers));
  /* and what is sent must be what was signed */
  ok("the sent query is the canonical one", a.url.endsWith("?list-type=2&prefix=t%2F"));
  ok("query parameters are sorted by name", b.url.includes("?continuation-token=abc&list-type=2&prefix=t%2F"));
}

/* ---- 4. fault 3: RFC 3986, not encodeURIComponent ----
   No id in the corpus carries one of these today, but the five characters
   encodeURIComponent leaves alone are exactly the ones that would upload under
   a name the index does not point at, and nobody would see it. */
{
  const { url } = sign({ method: "PUT", key: "t/a'b(c)d!e*f.json", ...creds });
  const path = new URL(url).pathname;
  ok("!'()* are escaped in the key", !/['()!*]/.test(path));
  check("the slash between prefix and name is kept", path, "/stuti-corpus/t/a%27b%28c%29d%21e%2Af.json");
}

/* ---- 5. what each kind of request actually says ---- */
{
  const put = sign({ method: "PUT", key: "index.json", body: Buffer.from("{}"),
    contentType: "application/json", cacheControl: "no-cache", ...creds });
  ok("a body is hashed, not sent unsigned", !put.headers["x-amz-content-sha256"].includes("UNSIGNED"));
  ok("cache-control is signed", put.headers.authorization.includes("cache-control"));
  ok("content-type is signed", put.headers.authorization.includes("content-type"));
  ok("the credential scope is R2's", put.headers.authorization.includes("/auto/s3/aws4_request"));

  const del = sign({ method: "DELETE", key: "t/old.json", ...creds });
  check("a bodiless request is UNSIGNED-PAYLOAD", del.headers["x-amz-content-sha256"], "UNSIGNED-PAYLOAD");
  ok("no cache-control is signed when none is given", !del.headers.authorization.includes("cache-control"));
}

if (fail.length) {
  console.error(`sync-corpus selftest: ${pass} passed, ${fail.length} FAILED\n`);
  for (const f of fail) console.error("  " + f + "\n");
  process.exit(1);
}
console.log(`sync-corpus selftest: all ${pass} checks passed`);
