# Low-cost deployment comparison

Pricing checked **July 11, 2026**. All amounts are **USD per month**, before tax. Provider prices and free allowances can change, so recheck the linked pricing sources before purchase.

## Recommendation

- **Lowest possible bill:** [Azure Container Apps](AZURE.md), configured with zero minimum replicas. The app portion is usually $0 for up to roughly 100 active replica-hours and 2 million requests per month, but the first request after an idle period has a cold start.
- **Best low-cost production default:** [DigitalOcean App Platform](DIGITALOCEAN.md) on the fixed 1 GiB plan. It is $10/month for the app, includes deployment automation and managed TLS, and avoids Azure's cold start and AWS server maintenance.
- **Best when the team already operates AWS:** [AWS Lightsail](AWS.md) on the 2 GiB plan. Its $12/month app bill is predictable, but the team owns Linux patching, process supervision, TLS, and rollback automation.

For this project, start with Azure for a hackathon/demo or DigitalOcean for a small public launch. Move from Supabase Free to Pro before relying on the service for production participant data.

## Cost comparison

The prototype uses Supabase Free. The production baseline uses Supabase Pro at $25/month because it removes inactivity pausing and adds daily backups. Each option uses one application replica; it is not highly available.

| Provider plan | App | Supabase | Estimated total | Important trade-off |
| --- | ---: | ---: | ---: | --- |
| Azure, scale to zero | $0 at low traffic | $0 Free | **$0 prototype** | Cold starts; usage becomes variable above free grants |
| DigitalOcean, 512 MiB fixed | $5 | $0 Free | **$5 prototype** | Memory is tight; use only for a demo |
| AWS Lightsail, 1 GiB | $7 | $0 Free | **$7 prototype** | Self-managed VM; build with swap or CI |
| Azure, scale to zero | $0 at low traffic | $25 Pro | **$25 small production** | Lowest total if cold starts are acceptable |
| DigitalOcean, 1 GiB fixed | $10 | $25 Pro | **$35 small production** | Recommended predictable baseline |
| AWS Lightsail, 2 GiB | $12 | $25 Pro | **$37 small production** | Predictable, but most operational work |
| Azure, one always-idle 0.5 vCPU/1 GiB replica | about $13.61 minimum | $25 Pro | **about $38.61+** | Active periods cost more than the idle estimate |
| DigitalOcean, two scalable 1 GiB instances | $24 | $25 Pro | **$49 high-availability app tier** | Two app instances; Supabase remains a separate dependency |

Azure's $13.61 figure is an idle lower bound, not a fixed price. Budget **$15–$25 for the Azure app** if keeping one replica warm, and set a billing alert. Details and formulas are in the Azure plan.

## Shared architecture and assumptions

```text
Browser
  -> provider HTTPS ingress
  -> one Next.js 16 / Node.js application
       -> Supabase (Postgres, authentication, realtime)
       -> Zoom API (optional meeting creation)
  -> Mapbox GL JS (map tiles loaded directly by the browser)
```

These estimates assume:

- users are primarily in Canada, so the app and Supabase should use a Canadian region where possible;
- fewer than 50,000 monthly active users, a database under 500 MB for the prototype, and under 5 GB of Supabase egress;
- fewer than 50,000 Mapbox GL JS map loads per month;
- under 50–100 GiB of app transfer per month, depending on the provider plan;
- one production environment only; staging is temporary or uses free/scale-to-zero capacity;
- the existing domain and DNS provider can be reused at $0 incremental cost;
- GitHub Actions usage remains within the repository/account allowance; and
- prices exclude tax, currency conversion, paid support, domain registration, transactional email/SMTP, and any Zoom host licence.

The app is not a static site: authentication proxying, route handlers, server rendering, and the Zoom route require a Node.js server. Production must set `DATA_SOURCE=supabase`; the mock repository is in-memory and is not durable across deploys or restarts.

## Shared service costs

| Service | Low-cost starting point | Production baseline | Notes |
| --- | ---: | ---: | --- |
| Supabase | Free, $0 | Pro, from $25 | Free includes 500 MB database, 50,000 MAU and 5 GB egress, but may pause after one inactive week. Pro includes 8 GB disk, 250 GB egress and seven days of daily backups. |
| Mapbox GL JS | $0 through 50,000 map loads | Usage based above that | At the next tier, 50,001–100,000 loads are listed at $5 per 1,000. |
| Zoom | Existing account or licence | Account-dependent | The app creates meetings through Zoom; meeting limits and host licensing are not cloud-hosting charges. |
| Domain and DNS | Existing registrar/DNS, $0 incremental | TLD-dependent | Registration is excluded because it varies by TLD and registrar. TLS is free in all three plans. |
| Production email | Provider-dependent | Provider-dependent | Configure custom SMTP for Supabase Auth before launch; it is intentionally not guessed into totals. |

## Cost controls common to every plan

1. Keep Supabase's spend cap enabled and alert at 70%, 90%, and 100% of quotas.
2. Cap application replicas at one until monitoring shows a need to scale.
3. Restrict Mapbox tokens by allowed URL and configure Mapbox usage notifications.
4. Do not store uploads or logs on the application filesystem; use Supabase Storage and short log retention.
5. Keep staging scaled to zero or delete it between test cycles.
6. Review the bill and service quotas monthly for the first three months.

## Pricing sources

- [AWS Lightsail instance bundles](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-bundles.html)
- [Azure Container Apps pricing](https://azure.microsoft.com/en-us/pricing/details/container-apps/)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices)
- [DigitalOcean App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/)
- [Supabase pricing](https://supabase.com/pricing)
- [Mapbox pricing](https://www.mapbox.com/pricing)

## Provider plans

- [AWS Lightsail deployment plan](AWS.md)
- [Azure Container Apps deployment plan](AZURE.md)
- [DigitalOcean App Platform deployment plan](DIGITALOCEAN.md)

