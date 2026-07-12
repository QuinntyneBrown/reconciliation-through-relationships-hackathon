# DigitalOcean App Platform deployment plan

Pricing checked **July 11, 2026**. Costs are **USD per month**, before tax.

## Outcome

Run the full Next.js 16 application as one Node.js web service on **DigitalOcean App Platform in Toronto (`tor`)**. Deploy directly from GitHub with the Node.js buildpack, automatic builds, automatic HTTPS, and built-in rollback. Keep database/auth on Supabase Canada Central.

This is the recommended low-cost production baseline because it has a fixed bill, no cold start, and much less infrastructure maintenance than AWS Lightsail.

## Architecture

```text
Internet
  -> DigitalOcean App Platform ingress and managed TLS
  -> one Node.js/Next.js service on port 3000
       -> Supabase ca-central-1 over TLS
       -> Zoom API over TLS
Browser -> Mapbox over TLS

GitHub main branch -> App Platform buildpack -> managed deployment
```

App Platform handles the host OS, build environment, routing, TLS, deployment history, and health-based rollback. The service filesystem is ephemeral, so all durable data remains in Supabase.

## Assumptions

- **Prototype:** one fixed shared 1 vCPU/512 MiB container with 50 GiB transfer for $5/month.
- **Production baseline:** one fixed shared 1 vCPU/1 GiB container with 100 GiB transfer for $10/month.
- One instance only. Fixed-size plans cannot manually scale and are not highly available.
- Supabase is billed separately and remains the system of record.
- The Next.js build completes within App Platform's build environment; the selected instance size applies to runtime.
- The Toronto App Platform region is available to the account.
- App logs and built-in metrics remain within included platform features; no paid external log drain is used.

## Monthly cost

| Item | Prototype | Small production | Two-instance app tier |
| --- | ---: | ---: | ---: |
| App Platform web service | $5.00 | $10.00 | $24.00 |
| Included transfer | 50 GiB | 100 GiB | 300 GiB total |
| Managed ingress, TLS, deploys, metrics | $0 | $0 | $0 |
| Supabase | $0 Free | $25.00 Pro | $25.00 Pro |
| **Estimated total** | **$5.00** | **$35.00** | **$49.00** |

The two-instance option uses two non-fixed shared 1 vCPU/1 GiB containers at $12 each; it supports manual scaling and removes a single application-container failure, though regional/platform and Supabase dependencies remain.

Additional outbound transfer is $0.02/GiB. A dedicated egress IP adds $25/month and is not required for the current Supabase, Zoom, or Mapbox integrations. DigitalOcean's $7 development database is also excluded because duplicating the existing Supabase database/auth stack would add cost and migration work.

## Deployment prerequisites

1. Create Supabase in `ca-central-1`, apply migrations, and configure the production site and `/auth/callback` redirect URLs.
2. Connect the GitHub repository to App Platform and select the production branch.
3. Select the Toronto region, Node.js buildpack, and one web service.
4. Use build command `npm run build`, run command `npm start`, and HTTP port `3000`.
5. Start with `apps-s-1vcpu-0.5gb` for a disposable demo or `apps-s-1vcpu-1gb-fixed` for production.
6. Enable deploy-on-push only for the protected production branch and require the test workflow to pass before merge.

The checked-in `package-lock.json`, `build` script, and `start` script match App Platform's Node.js buildpack model. No Dockerfile is required.

An app-spec starting point is:

```yaml
name: rtr
region: tor
services:
  - name: web
    environment_slug: node-js
    github:
      repo: <github-owner>/<github-repository>
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    http_port: 3000
    instance_count: 1
    instance_size_slug: apps-s-1vcpu-1gb-fixed
    health_check:
      http_path: /
```

Download the generated spec from App Platform after the first setup, keep a sanitized copy under version control, and never commit secret values.

## Environment variables

Give `NEXT_PUBLIC_*` variables **RUN_AND_BUILD_TIME** scope because Next.js compiles them into the browser bundle. Give server-only variables **RUN_TIME** scope and mark Zoom credentials as encrypted secrets.

| Variable | App Platform scope | Secret | Required |
| --- | --- | --- | --- |
| `DATA_SOURCE=supabase` | RUN_TIME | No | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | RUN_AND_BUILD_TIME | Public | Full journey |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | RUN_AND_BUILD_TIME | Public client credential | Full journey |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | RUN_AND_BUILD_TIME | Public, URL-restrict it | Map feature |
| `ZOOM_ACCESS_TOKEN` | RUN_TIME | Yes | Optional alternative auth |
| `ZOOM_CLIENT_ID` | RUN_TIME | Yes | Optional Zoom OAuth |
| `ZOOM_CLIENT_SECRET` | RUN_TIME | Yes | Optional Zoom OAuth |
| `ZOOM_ACCOUNT_ID` | RUN_TIME | Yes | Optional Zoom OAuth |
| `PORT=3000` | RUN_TIME | No | Yes |

Do **not** set `SUPABASE_SERVICE_ROLE_KEY` on App Platform. It is for controlled seeding only and bypasses Row Level Security.

## Deployment procedure

1. On each pull request, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:boundary`, and `npm run build`.
2. Merge only after required checks pass. App Platform pulls the exact production-branch commit, installs with `npm ci`, builds, and starts a replacement deployment.
3. App Platform checks the configured port/path and promotes only a healthy deployment. A failed health check returns traffic to the last healthy deployment.
4. After promotion, smoke-test `/`, `/auth/login`, an authenticated participant flow, a facilitator flow, and Zoom meeting creation if enabled.
5. Add the custom hostname in the Networking tab, create the displayed DNS records, and wait for the managed certificate to become active.

For the cheapest prototype, use the included `ondigitalocean.app` hostname and avoid buying a domain. For production, point the existing domain at App Platform; custom-domain ingress and certificates add $0.

## Monitoring and cost controls

- Enable deployment-failed, domain-failed, CPU, memory, and restart alerts. Add an independent HTTPS uptime check.
- Watch runtime memory closely on 512 MiB. Upgrade to the fixed 1 GiB plan before production or immediately if the process approaches 80% memory or restarts.
- Set a DigitalOcean billing alert at $10 for prototype or $40 for the baseline production account.
- Keep one fixed container until latency/error/load evidence requires scaling. Moving to a $12 non-fixed plan is required before adding instances.
- Review bandwidth monthly. Compress responses, keep image assets optimized, and add a CDN only when transfer or latency evidence supports its cost/complexity.
- Use short log retention and never log tokens, auth links, participant messages, or sensitive profile content.

## Rollback and recovery

App Platform retains the ten most recent successful deployments.

1. Open the app's **Activity** tab.
2. Select **Rollback** beside the preceding known-good deployment.
3. Review the code and app-spec diff, optionally pause automatic deploys, and confirm rollback.
4. Smoke-test the restored deployment and fix forward in a pull request.

Rollback restores code, configuration, and the app spec, but not database data. Keep database migrations backward compatible. Use Supabase Pro daily backups for data recovery and test that process separately.

Because the app is stateless, a platform-region recovery consists of creating the same app spec in another supported App Platform region, applying secrets, updating DNS, and deploying the known-good Git SHA. Document the secrets recovery owner before launch.

## Security and availability notes

- Use a GitHub App connection with minimal repository access, protected branches, required reviews, and encrypted platform secrets.
- The $10 baseline is one container and is not an HA architecture. Use two $12 containers ($24 app tier) when the downtime requirement justifies it.
- Restrict the Mapbox public token by hostname, rotate Zoom secrets, and keep Supabase Row Level Security enabled.
- Toronto app hosting plus Supabase Canada Central minimizes application/database distance, but legal data-residency review must also cover Mapbox, Zoom, SMTP, logs, support access, and backups.

## Pricing sources

- [DigitalOcean App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/)
- [App Platform Node.js buildpack behavior](https://docs.digitalocean.com/products/app-platform/reference/buildpacks/nodejs/)
- [Build and run command configuration](https://docs.digitalocean.com/products/app-platform/how-to/build-run-commands/)
- [App Platform custom domains](https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/)
- [Deployment history and rollback](https://docs.digitalocean.com/products/app-platform/how-to/manage-deployments/)
- [App Platform regional availability](https://docs.digitalocean.com/products/app-platform/details/availability/)
- [Supabase pricing](https://supabase.com/pricing)

