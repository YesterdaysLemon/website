#!/usr/bin/env node
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

const {
  DEPLOY_BRANCH = "master",
  DEPLOY_EVENT = "push",
  DEPLOY_SCRIPT = "/opt/website/deploy/deploy.sh",
  DEPLOY_WEBHOOK_SECRET,
  DEPLOY_WEBHOOK_HOST = "127.0.0.1",
  DEPLOY_WEBHOOK_PORT = "9000",
  DEPLOY_WEBHOOK_MAX_BYTES = "65536",
} = process.env;

if (!DEPLOY_WEBHOOK_SECRET) {
  throw new Error("DEPLOY_WEBHOOK_SECRET is required");
}

let isDeploying = false;

function send(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = Buffer.from(
    `sha256=${createHmac("sha256", DEPLOY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")}`,
  );
  const received = Buffer.from(signatureHeader);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

function runDeploy(payload) {
  return new Promise((resolve, reject) => {
    const child = spawn(DEPLOY_SCRIPT, [payload.sha], {
      env: {
        ...process.env,
        DEPLOY_SHA: payload.sha,
        DEPLOY_BRANCH,
      },
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`deploy script exited with status ${code}`));
    });
  });
}

const server = createServer((request, response) => {
  if (request.method !== "POST" || request.url !== "/deploy") {
    send(response, 404, { ok: false, error: "not_found" });
    return;
  }

  const chunks = [];
  let bytes = 0;
  const maxBytes = Number(DEPLOY_WEBHOOK_MAX_BYTES);

  request.on("data", (chunk) => {
    bytes += chunk.length;

    if (bytes > maxBytes) {
      request.destroy();
      return;
    }

    chunks.push(chunk);
  });

  request.on("end", async () => {
    const rawBody = Buffer.concat(chunks);

    if (!verifySignature(rawBody, request.headers["x-hub-signature-256"])) {
      send(response, 401, { ok: false, error: "bad_signature" });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      send(response, 400, { ok: false, error: "bad_json" });
      return;
    }

    if (
      request.headers["x-github-event"] !== DEPLOY_EVENT ||
      payload.event !== DEPLOY_EVENT ||
      payload.branch !== DEPLOY_BRANCH
    ) {
      send(response, 202, { ok: true, skipped: true });
      return;
    }

    if (!/^[0-9a-f]{40}$/i.test(payload.sha ?? "")) {
      send(response, 400, { ok: false, error: "bad_sha" });
      return;
    }

    if (isDeploying) {
      send(response, 409, { ok: false, error: "deploy_in_progress" });
      return;
    }

    isDeploying = true;

    try {
      await runDeploy(payload);
      send(response, 200, { ok: true, sha: payload.sha });
    } catch (error) {
      send(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : "deploy_failed",
      });
    } finally {
      isDeploying = false;
    }
  });

  request.on("error", () => {
    send(response, 400, { ok: false, error: "request_error" });
  });
});

server.listen(Number(DEPLOY_WEBHOOK_PORT), DEPLOY_WEBHOOK_HOST, () => {
  console.log(
    `deploy webhook listening on http://${DEPLOY_WEBHOOK_HOST}:${DEPLOY_WEBHOOK_PORT}/deploy`,
  );
});
