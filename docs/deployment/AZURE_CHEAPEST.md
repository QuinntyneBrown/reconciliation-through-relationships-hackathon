# The cheapest way to deploy this app on Azure

Pricing checked **September 4, 2026** against the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) for **Canada Central**. Costs are **USD per month**, before tax, using a 730-hour month.

This document answers one question: of the Azure services that can host this application, which produces the smallest bill, and what does it actually cost? [AZURE.md](AZURE.md) is the operational runbook for the winning option — environment variables, CI/CD, rollback, monitoring. Read this one to decide; read that one to deploy.

## The answer

**Azure Container Apps on the Consumption plan, one container, `min-replicas=0`, `max-replicas=1`, 0.5 vCPU and 1 GiB, with the free managed TLS certificate.**

For a hackathon demo or a low-traffic pilot this costs **$0/month for the Azure portion**, because the Consumption free grant covers roughly 100 active replica-hours and 2 million requests per subscription per calendar month. You pay only when you exceed the grant or pin a replica warm.

The trade is a cold start. When the app has scaled to zero, the first request pays container start plus Next.js boot before it responds.

## Why it wins

Every Azure service that can run this app, priced for a low-traffic deployment:

| Option | Azure cost | Why it is not the pick |
| --- | ---: | --- |
| **Container Apps, Consumption, scale to zero** | **$0 within grants** | **This is the pick.** Cold start on the first request after idle. |
| Static Web Apps, Free plan | $0 | Next.js hybrid rendering is still a **preview** feature, the app is capped at 250 MB per environment, there is no SLA, and Free has no bandwidth overage — traffic past 100 GB is cut off, not billed. Next.js 16 support is not something to assume. |
| App Service, Free (F1) Linux | $0 | Hard quota of **60 CPU-minutes per day**, no custom domain, and no TLS beyond `*.azurewebsites.net`. It cannot host a real deployment. |
| App Service, Basic (B1) Linux | $13.14 | $0.018/hour, always on, no cold start, 99.95% SLA. The cheapest option with a _predictable_ bill — see below. |
| Virtual machine, `B2pts_v2` + static IP + 32 GiB SSD | ~$13.74 | $6.72 compute + $4.38 IPv4 + $2.64 disk, and you own patching, TLS, systemd, and rollback. Costs more than B1 and does more work. |
| App Service, Basic (B2) Linux | $25.55 | More resources than this workload needs. |

Static Web Apps Free and App Service F1 both print `$0`, so they look like ties. They are not: F1's daily CPU quota and missing TLS rule it out for anything public, and Static Web Apps asks you to bet a Next.js 16 app on preview-stage hybrid support with a 250 MB ceiling. Container Apps runs the same container you can run locally, on a generally available service.

### If a cold start is unacceptable

Two ways to keep a replica warm, both real costs rather than $0:

| Configuration | Monthly | Note |
| --- | ---: | --- |
| App Service B1 | **$13.14** | Fixed. Predictable to the cent, includes an SLA. |
| Container Apps, `min-replicas=1`, 0.25 vCPU / 0.5 GiB, fully idle | ~$5.72 | Cheapest warm option, but 0.5 GiB is tight for a Next.js server. Load-test before trusting it. |
| Container Apps, `min-replicas=1`, 0.5 vCPU / 1 GiB, fully idle | ~$13.61 | An idle _lower bound_, not a fixed price. |
| Container Apps, `min-replicas=1`, 0.5 vCPU / 1 GiB, fully active | ~$47.63 | What the same replica costs if it never qualifies as idle. |

**If you need a warm replica, take App Service B1 at $13.14 rather than Container Apps at "about $13.61."** The App Service number is a ceiling; the Container Apps number is a floor that rises with every request. Container Apps only wins on cost while it is allowed to scale to zero.

## The rates behind those numbers

Canada Central Consumption plan meters, as returned by the Retail Prices API on September 4, 2026:

| Meter | Rate |
| --- | ---: |
| Active vCPU | $0.000034 per vCPU-second |
| Idle vCPU | $0.000004 per vCPU-second |
| Memory, active or idle | $0.000004 per GiB-second |
| Requests above the grant | $0.40 per million |

Free per subscription per calendar month: **180,000 vCPU-seconds, 360,000 GiB-seconds, 2 million HTTP requests**. Health-probe requests are not billable, and requests originating inside the environment are not billable.

At 0.5 vCPU / 1 GiB both compute grants run out at the same point:

```text
vCPU:   180,000 / 0.5 = 360,000 s = 100 hours
memory: 360,000 / 1.0 = 360,000 s = 100 hours
```

So the grant is worth **100 active replica-hours**. At 0.25 vCPU / 0.5 GiB it is worth 200.

A replica held at the minimum count bills at idle rates only while _all_ of these hold: every container has started, it is serving no HTTP request, it is using under 0.01 vCPU, and it is receiving under 1,000 bytes/second. Anything else bills at the active rate. The warm-idle figure above is therefore a floor:

```text
vCPU:   (0.5 x 730 x 3,600 - 180,000) x $0.000004 = $4.536
memory: (1.0 x 730 x 3,600 - 360,000) x $0.000004 = $9.072
                                          total     $13.608
```

## What this repository needs first

Three things in the current tree affect the cost story and the deploy:

**There is no Dockerfile.** Container Apps needs an image. Add a multi-stage Node.js 22 build — `next@16.2.10` requires Node.js >= 20.9 — that installs with `npm ci`, runs `npm run build`, drops dev dependencies, and starts with `npm start` on port 3000.

**`output: "standalone"` is not set** in `next.config.ts`. Turning it on cuts the image to the traced dependency set instead of the whole `node_modules`, which shortens cold starts and lowers the memory floor — both of which are directly what you are paying for here. Set it alongside the existing `distDir` line.

**`DATA_SOURCE=supabase` does not work today.** `src/data/supabase/supabase-repository.ts:14` is a stub whose every method throws `not implemented yet`. The application currently runs on the in-memory mock repository, so `DATA_SOURCE` must stay `mock` until that class is written. This differs from the instruction in [AZURE.md](AZURE.md), which assumes the Supabase repository is production-ready.

Two consequences for cost. Supabase is still needed for **authentication** — `src/data/supabase/browser-client.ts`, `server-client.ts`, and `session-proxy.ts` call Supabase Auth directly and do not go through the repository — so the Free tier is still required for a working login. But there is no participant data in Postgres yet, so nothing here justifies Supabase Pro at $25/month. **The cheapest honest total today is $0: Container Apps within its grants, plus Supabase Free for auth.**

Mock data lives in process memory. It resets on every deploy, restart, and scale-to-zero. That is acceptable for a demo and disqualifying for real participant data.

## Deploying it

```bash
az group create --name rg-rtr --location canadacentral

# A Consumption-only environment. Workload-profile environments work too --
# the Consumption profile carries no management fee either way -- but this
# removes any chance of accidentally adding a Dedicated profile later.
az containerapp env create \
  --name env-rtr --resource-group rg-rtr --location canadacentral \
  --enable-workload-profiles false \
  --logs-destination none

az containerapp create \
  --name rtr --resource-group rg-rtr --environment env-rtr \
  --image ghcr.io/<org>/rtr:<git-sha> \
  --target-port 3000 --ingress external \
  --cpu 0.5 --memory 1.0Gi \
  --min-replicas 0 --max-replicas 1 \
  --env-vars DATA_SOURCE=mock PORT=3000 HOSTNAME=0.0.0.0
```

Push images to GitHub Container Registry, not Azure Container Registry — even the Basic ACR tier is a monthly charge this design does not need. Tag every image with its commit SHA rather than deploying `latest`, so a rollback is a revision switch.

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_MAPBOX_TOKEN` are inlined into the browser bundle by `next build`. They must be present as build arguments, not only as runtime environment variables — changing them on the Container App afterwards will not change the already-built bundle. Never ship `SUPABASE_SERVICE_ROLE_KEY` to the app.

Bind a custom domain and enable the free managed certificate; Container Apps issues and renews it at no charge.

## What turns $0 into a bill

These are the mistakes that break the estimate, in rough order of how much they cost:

- **Adding a Dedicated workload profile, an environment private endpoint, or planned maintenance.** Any of these triggers a management charge of $0.10–$0.12 per hour — up to about **$87/month** — regardless of the Consumption plan. This single line item dwarfs everything else in this document.
- **Setting `min-replicas` above 0.** This is the difference between $0 and $13.61–$47.63.
- **Raising `max-replicas` above 1.** Beyond the minimum count, _every_ running replica bills at the active rate. Before raising it, check Next.js cache coordination and Server Action encryption keys across instances.
- **Forgetting the grant is per subscription, per calendar month.** A staging Container App in the same subscription eats the same 180,000 vCPU-seconds. Put throwaway environments in a separate subscription or accept that they consume the production allowance.
- **Log ingestion.** The commands above set `--logs-destination none`, which suits a demo. If you attach Log Analytics, ingestion is billed separately and is a common surprise; cap retention and never log participant content.
- **Creating an Azure Container Registry, a NAT Gateway, a public IP, or a custom VNet** out of habit. None are required here. Check Cost Management after the first deploy to confirm none appeared.

Set an Azure budget of $10 with alerts at 50%, 80%, and 100%. On a scale-to-zero design, a budget alert is the fastest signal that something is now running that should not be.

## When to stop optimizing for cost

Scale-to-zero optimizes the bill, not availability or latency. One replica in one region has no redundancy and no SLA, and the first visitor after an idle period waits for a cold start.

For a scheduled demo, a public launch, or anything time-sensitive, set `min-replicas=1` an hour beforehand and accept the charge, or move to App Service B1 for the month. For real participant data, the blocker is not hosting cost — it is the unimplemented Supabase repository, plus the privacy, security, and accessibility review this repository's README already calls for.

## Sources

- [Azure Container Apps billing](https://learn.microsoft.com/en-us/azure/container-apps/billing) — free grants, active vs. idle conditions, and confirmation that plan management fees apply only to Dedicated profiles, private endpoints, and planned maintenance
- [Azure Container Apps pricing](https://azure.microsoft.com/en-us/pricing/details/container-apps/)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) — all rates in this document
- [App Service limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) — F1 quotas and B1 capabilities
- [Static Web Apps plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans) and [quotas](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas)
- [Deploying hybrid Next.js on Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid) — preview status and the 250 MB cap
- [Container Apps scaling](https://learn.microsoft.com/en-us/azure/container-apps/scale-app) and [free managed certificates](https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-managed-certificates)
