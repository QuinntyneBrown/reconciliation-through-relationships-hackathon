# Azure Container Apps deployment plan

Pricing checked **July 11, 2026**. Costs are **USD per month**, before tax.

## Outcome

Run the full Next.js 16 application as one container on **Azure Container Apps Consumption** in **Canada Central**. Configure 0.5 vCPU, 1 GiB RAM, zero minimum replicas, one maximum replica, external HTTPS ingress, and a free managed custom-domain certificate. Keep database/auth on Supabase in Canada Central.

This produces the lowest bill of the three plans for an idle or lightly used service. It trades that saving for cold starts and variable usage charges.

## Architecture

```text
Internet
  -> Azure Container Apps HTTPS ingress and managed TLS
  -> Next.js container on port 3000 (0–1 replicas)
       -> Supabase ca-central-1 over TLS
       -> Zoom API over TLS
Browser -> Mapbox over TLS

GitHub Actions -> GHCR -> immutable Container Apps revision
```

Use GitHub Container Registry (GHCR), not Azure Container Registry Basic, to avoid an additional registry charge. A private GHCR package needs a read-only package token; a public package does not.

## Assumptions

- Consumption free grants are unused by other Container Apps in the Azure subscription.
- The app stays below 100 active replica-hours and 2 million requests per month in the low-traffic case.
- The container uses 0.5 vCPU and 1 GiB, which is a supported Consumption allocation and is safer for Next.js than 0.25 vCPU/0.5 GiB.
- `min-replicas=0` and `max-replicas=1`; the first request after scale-down may be slow.
- Supabase is billed separately and remains the durable system of record.
- Build minutes and GHCR storage/transfer remain inside the GitHub account's allowance.
- Default monitoring/log volume remains small; Azure Monitor or Log Analytics overages are not included.

## Monthly cost

Azure Container Apps includes the first 180,000 vCPU-seconds, 360,000 GiB-seconds, and 2 million requests per subscription each month. With a 0.5 vCPU/1 GiB replica, both compute grants cover about **100 active replica-hours**.

Canada Central Retail Prices API rates observed on July 11, 2026 were:

- active vCPU: $0.000034 per vCPU-second;
- idle vCPU: $0.000004 per vCPU-second;
- active or idle memory: $0.000004 per GiB-second; and
- requests above the grant: $0.40 per million.

| Item | Prototype/low traffic | Small production, scale to zero | Always-idle warm replica |
| --- | ---: | ---: | ---: |
| Container Apps compute and requests | $0 within grants | $0 within grants | about $13.61 minimum |
| Managed ingress and TLS | $0 | $0 | $0 |
| GHCR | $0 within GitHub allowance | $0 within GitHub allowance | $0 within GitHub allowance |
| Supabase | $0 Free | $25.00 Pro | $25.00 Pro |
| **Estimated total** | **$0** | **$25.00** | **about $38.61+** |

The warm-replica calculation uses 730 hours and assumes the replica qualifies for idle rates throughout:

```text
vCPU:   (0.5 * 730 * 3,600 - 180,000) * $0.000004 = $4.536
memory: (1.0 * 730 * 3,600 - 360,000) * $0.000004 = $9.072
total:                                                   $13.608
```

Real warm-replica cost is higher whenever CPU/network activity triggers active billing. Budget $15–$25/month for the app if setting one minimum replica. At 200 fully active single-replica hours and under 2 million requests, the same formula produces about $7.56 after grants; at 730 fully active hours it is about $47.63.

## Deployment prerequisites

1. Create Supabase in `ca-central-1`, apply migrations, and configure production Auth redirect URLs.
2. Add a production Dockerfile based on Node.js 22 that runs `npm ci`, `npm run build`, prunes development dependencies, exposes port 3000, and starts with `npm start`.
3. Build an immutable image tagged with the Git commit SHA and push it to GHCR. Never deploy only a mutable `latest` tag.
4. Create a resource group and a workload-profiles Container Apps environment in Canada Central, using its built-in Consumption profile.
5. Create the Container App with external ingress, target port 3000, 0.5 vCPU, 1 GiB, `min-replicas=0`, and `max-replicas=1`.
6. Bind the custom hostname and enable Azure's free managed certificate.

The repository currently has no Dockerfile, so adding and testing that deployment asset is a prerequisite rather than an assumed existing capability. The current `npm run build`/`npm start` scripts support the standard Node.js deployment model.

## Environment variables

`NEXT_PUBLIC_*` values must be provided both while the image is built and at runtime. Next.js inlines them during `next build`; changing only the Container App environment later will not change the existing browser bundle.

| Variable | Build | Runtime | Secret | Required |
| --- | --- | --- | --- | --- |
| `DATA_SOURCE=supabase` | No | Yes | No | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Public | Full journey |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Public client credential | Full journey |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Yes | Public, URL-restrict it | Map feature |
| `ZOOM_ACCESS_TOKEN` | No | Yes | Yes | Optional alternative auth |
| `ZOOM_CLIENT_ID` | No | Yes | Yes | Optional Zoom OAuth |
| `ZOOM_CLIENT_SECRET` | No | Yes | Yes | Optional Zoom OAuth |
| `ZOOM_ACCOUNT_ID` | No | Yes | Yes | Optional Zoom OAuth |
| `PORT=3000` | No | Yes | No | Yes |
| `HOSTNAME=0.0.0.0` | No | Yes | No | Container ingress |

Store Zoom values as Container Apps secrets and reference them with `secretref`. The Supabase URL, anon key, and Mapbox browser token are intentionally public values but should still be managed centrally. Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to the app.

## Deployment procedure

1. On a pull request, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:boundary`, and `npm run build`.
2. Build the image with the production `NEXT_PUBLIC_*` arguments and tag it `ghcr.io/<org>/rtr:<git-sha>`.
3. Push the immutable image to GHCR.
4. Authenticate GitHub Actions to Azure with OpenID Connect and least-privilege access to the deployment resource group; avoid a long-lived service-principal secret.
5. Deploy with `azure/container-apps-deploy-action`, specifying the SHA-tagged GHCR image, app name, and resource group.
6. Wait for the new revision to become ready and verify `/`, `/auth/login`, an authenticated journey, and Zoom meeting creation when enabled.
7. Direct 100% of traffic to the new revision only after health verification. Keep the preceding revision available for rollback.

Set a single HTTP scale rule and cap replicas at one. If traffic grows enough to require multiple replicas, review Next.js multi-instance cache coordination and Server Action encryption-key requirements before raising the cap.

## Monitoring and cost controls

- Monitor requests, replica count, response time, 5xx responses, restarts, CPU, and memory. Alert on sustained 5xx errors, restart loops, and p95 response latency.
- Enable an external uptime check. A scale-to-zero application can have a slower first response, so use a suitable timeout and track cold-start latency separately.
- Create an Azure budget at $10 for prototype or $50 for production, with alerts at 50%, 80%, and 100%.
- Keep `max-replicas=1`, then raise it only after a load test and cost review.
- Set short log retention and avoid logging participant content or credentials. Review Azure Monitor ingestion separately if logs approach its free allowance.
- Use the Azure Cost Management view to confirm that no accidental Azure Container Registry, public IP, NAT Gateway, private endpoint, or dedicated workload profile was created.

## Rollback and recovery

Each successful deployment creates an immutable Container Apps revision.

1. Leave the prior healthy revision inactive but retained.
2. If health checks or smoke tests fail, direct 100% of traffic back to that revision and deactivate the faulty revision.
3. Pin GitHub Actions back to the known-good SHA while diagnosing the failure.

Application rollback does not roll back Supabase. Use backward-compatible migrations. Supabase Pro supplies daily backups retained for seven days; test its restore process independently.

The container filesystem is ephemeral. This is intentional: all durable participant data and uploads must remain in Supabase, and every replica must be replaceable from its image and configuration.

## Security and availability notes

- Scale-to-zero optimizes cost, not availability or latency. For a public event or time-sensitive launch, temporarily set one minimum replica and budget for it.
- Use GHCR credentials with `read:packages` only, rotate them, and prefer a public package if repository policy permits.
- Use free managed TLS, HTTPS-only ingress, least-privilege Azure roles, and secret references.
- Locating services in Canadian regions improves latency and may support residency goals, but Mapbox, Zoom, SMTP, logs, support access, and backups need separate privacy/contract review.

## Pricing sources

- [Azure Container Apps pricing and free grants](https://azure.microsoft.com/en-us/pricing/details/container-apps/)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices)
- [Supported Consumption vCPU/memory allocations](https://learn.microsoft.com/en-ca/azure/container-apps/containers#vcpus-and-memory-allocation-requirements)
- [Scale-to-zero behavior](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)
- [Free custom-domain managed certificates](https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-managed-certificates)
- [Deploying Container Apps from GitHub Actions and GHCR](https://learn.microsoft.com/en-us/azure/container-apps/github-actions)
- [Supabase pricing](https://supabase.com/pricing)

