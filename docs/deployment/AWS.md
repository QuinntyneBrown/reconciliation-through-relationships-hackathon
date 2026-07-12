# AWS Lightsail deployment plan

Pricing checked **July 11, 2026**. Costs are **USD per month**, before tax.

## Outcome

Run the full Next.js 16 application on one Ubuntu Lightsail instance in **Canada (Central), `ca-central-1`**, with Caddy providing HTTPS and reverse proxying to `next start`. Keep database, authentication, realtime, and file storage on Supabase in Canada Central.

This is the lowest-cost sensible AWS design for this workload. ECS/Fargate, an Application Load Balancer, and RDS add cost and operational pieces that the current traffic assumptions do not justify.

## Architecture

```text
Internet
  -> Lightsail DNS or existing DNS
  -> attached static IPv4
  -> Caddy on ports 80/443 (automatic Let's Encrypt TLS)
  -> Next.js on 127.0.0.1:3000, managed by systemd
       -> Supabase ca-central-1 over TLS
       -> Zoom API over TLS
Browser -> Mapbox over TLS
```

The application host is disposable. Source lives in GitHub and participant data lives in Supabase; do not place durable user data on the Lightsail disk.

## Assumptions

- **Prototype:** 1 GiB RAM, 2 vCPU, 40 GB SSD and 2 TB transfer for $7/month. Build in CI or add swap because a Next.js production build can exceed the available RAM.
- **Production baseline:** 2 GiB RAM, 2 vCPU, 60 GB SSD and 3 TB transfer for $12/month.
- One instance and one Availability Zone; a host or zone failure causes downtime until recovery.
- Supabase is billed separately and remains the system of record.
- DNS is hosted in Lightsail, which includes up to six zones and 3 million monthly queries, or at an existing free DNS provider.
- Caddy/Let's Encrypt provides TLS for $0. No Lightsail load balancer is used.

## Monthly cost

| Item | Prototype | Small production | Notes |
| --- | ---: | ---: | --- |
| Lightsail Linux instance with public IPv4 | $7.00 | $12.00 | 1 GiB prototype; 2 GiB production |
| Attached static IPv4 | $0 | $0 | Charged only while left unattached |
| Lightsail DNS | $0 | $0 | Within 3 million queries/month |
| TLS certificate | $0 | $0 | Caddy with Let's Encrypt |
| Supabase | $0 Free | $25.00 Pro | Shared external database/auth cost |
| **Estimated total** | **$7.00** | **$37.00** | Before optional services and overages |

Optional instance snapshots cost $0.05 per stored GB-month. Because the app host is reproducible and stateless, the lower-cost recovery strategy is redeployment from Git rather than seven daily full-instance snapshots. A manually retained, lightly used 2–10 GB snapshot would add roughly $0.10–$0.50/month; changed blocks add to that amount.

Transfer beyond the regional allowance is $0.09/GB from Canada Central. A Lightsail load balancer would add $18/month and is deliberately excluded.

## Deployment prerequisites

1. Create or upgrade Supabase, apply `supabase/migrations`, seed only synthetic/demo data, and select `ca-central-1` where available.
2. In Supabase Auth, add the final HTTPS origin and `/auth/callback` URL to the permitted redirect URLs.
3. Provision an Ubuntu Lightsail instance and attach a static IPv4 address.
4. Allow inbound 80 and 443. Restrict port 22 to administrator IPs; do not expose port 3000.
5. Install Node.js 22 LTS, Caddy, Git, and system updates. The checked-in Next.js 16.2.10 package requires Node.js 20.9 or newer.
6. Create an unprivileged `rtr` service account and `/srv/rtr/releases` directory.

## Environment variables

Store runtime configuration in root-owned `/etc/rtr.env` with mode `0600`. Load the same file before `npm run build`, because `NEXT_PUBLIC_*` values are compiled into the browser bundle.

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

Do **not** deploy `SUPABASE_SERVICE_ROLE_KEY` to the web host. It is needed only by the seed script and bypasses Row Level Security.

## Deployment procedure

1. Create `/srv/rtr/releases/<git-sha>` and check out the exact commit there.
2. Load `/etc/rtr.env`, then run `npm ci`, `npm run typecheck`, `npm run test:boundary`, and `npm run build`.
3. Point `/srv/rtr/current` at the new release only after the build passes.
4. Configure a systemd unit with:

   - `User=rtr` and `WorkingDirectory=/srv/rtr/current`;
   - `EnvironmentFile=/etc/rtr.env`;
   - `ExecStart=/usr/bin/npm start`;
   - restart on failure; and
   - graceful `SIGTERM` with a 30-second stop timeout.

5. Configure Caddy for the production hostname with `reverse_proxy 127.0.0.1:3000`. Caddy obtains and renews TLS automatically.
6. Point DNS at the attached static IP.
7. Restart the systemd service, then verify `/`, `/auth/login`, an authenticated route, and `/api/participants` as appropriate.
8. Keep the previous two release directories for rollback; delete older releases after a healthy observation window.

Automate steps 1–8 with GitHub Actions using an SSH deploy key. Protect the production environment so a reviewer approves deployment after tests pass.

## Monitoring and cost controls

- Use Lightsail CPU, network, status-check, and burst-capacity metrics. Alert on failed status checks, sustained CPU above 80%, low burst capacity, and disk above 80%.
- Add an external HTTPS uptime check against a lightweight public route.
- Send `journalctl`/Caddy logs to short local retention; avoid paid log shipping until needed and never log auth tokens or participant message bodies.
- Configure an AWS Budget at $15 for prototype or $45 for production, with notifications at 70%, 90%, and 100%.
- Apply unattended security updates and schedule a monthly restart window if a kernel update requires it.
- Scale vertically to the 4 GiB/$24 bundle only after memory or CPU evidence justifies it.

## Rollback and recovery

### Application rollback

1. Repoint `/srv/rtr/current` to the preceding known-good Git SHA.
2. Restart the systemd service.
3. Confirm local health through `curl http://127.0.0.1:3000/`, then confirm public HTTPS.

Do not reverse a database migration merely by rolling back application code. Use backward-compatible migrations and a separately reviewed database recovery plan.

### Host recovery

Create a new Lightsail instance from the provisioning notes, attach the static IP to it, deploy the last known-good release, and verify health. If faster recovery is worth the small storage charge, retain one post-provisioning manual snapshot and recreate secrets after restore.

Supabase Pro provides daily database backups retained for seven days. Test database restore procedures separately; an app-host snapshot does not back up Supabase.

## Security and availability notes

- The production baseline is single-instance and has no AWS SLA architecture for application availability.
- Patch the OS and Node.js dependencies regularly, use key-only SSH, disable password login, and enforce least-privilege IAM.
- Keep all participant data in Supabase with Row Level Security enabled. Locating services in Canada reduces cross-region latency but does not by itself prove legal or contractual data residency for Mapbox, Zoom, email, logs, or backups.
- Add a second Lightsail instance and the $18/month load balancer only when downtime requirements justify at least $42/month for the app tier (two $12 instances plus load balancer).

## Pricing sources

- [Lightsail Linux/Unix bundles](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-bundles.html)
- [Lightsail billing, DNS, static IP, load balancer, and snapshot prices](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html)
- [Lightsail Canada Central availability](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html)
- [Lightsail data transfer overage prices](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html)
- [Supabase pricing](https://supabase.com/pricing)

