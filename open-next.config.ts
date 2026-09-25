import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Default R2 incremental cache + queue providers; Cloudflare auto-provisions
  // these bindings on first deploy. Override here if you want to point at
  // specific R2 buckets / KV namespaces.
});
