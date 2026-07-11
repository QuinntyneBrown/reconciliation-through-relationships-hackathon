import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: "🤝",
    title: "Meaningful Connections",
    description:
      "We match Indigenous and non-Indigenous participants based on shared interests, location, and values — creating space for genuine relationship-building.",
  },
  {
    icon: "📚",
    title: "Guided Learning",
    description:
      "Before connecting, participants complete a tailored learning journey to build understanding and prepare for respectful conversation.",
  },
  {
    icon: "🗺️",
    title: "Local Cohorts",
    description:
      "Discover reconciliation circles forming in your region. Come together for local events on National Indigenous Peoples Day and the National Day for Truth and Reconciliation.",
  },
  {
    icon: "🌿",
    title: "Facilitator-Supported",
    description:
      "Trained facilitators review every match before connection, ensuring a safe and thoughtful experience for all participants.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-primary">RTR</span>
            <span className="hidden sm:block text-sm text-muted-foreground">
              Reconciliation Through Relationships
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 bg-gradient-to-b from-background to-secondary/30">
        <Badge variant="secondary" className="mb-6 text-sm">
          In response to the Truth and Reconciliation Commission
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-tight">
          Building Bridges,{" "}
          <span className="text-primary">One Relationship</span> at a Time
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          RTR connects Indigenous and non-Indigenous Canadians for meaningful
          conversations, shared learning, and lasting relationships — guided by
          trained facilitators every step of the way.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-base px-8">
            <Link href="/auth/login">Join the journey</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8">
            <a
              href="https://rightrelationship.ca"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn about RTR
            </a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-3">
            Your journey starts here
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            A structured, welcoming path from first introduction to real local action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-background p-6 flex flex-col gap-3"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey steps */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground mb-12">
            Four intentional steps, at your own pace.
          </p>
          <ol className="space-y-6 text-left">
            {[
              ["Create your profile", "Share who you are, what you value, and how you prefer to connect."],
              ["Complete the learning journey", "Work through curated materials that prepare you for meaningful conversation."],
              ["Get matched", "Our facilitators review compatibility and suggest a meaningful connection for you."],
              ["Build the relationship", "Chat, schedule video calls, and join local reconciliation events together."],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button size="lg" asChild className="mt-12 px-8">
            <Link href="/auth/login">Begin your journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-sm text-muted-foreground bg-card">
        <p>
          © {new Date().getFullYear()} Reconciliation Through Relationships ·{" "}
          <a
            href="https://rightrelationship.ca"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            rightrelationship.ca
          </a>
        </p>
        <p className="mt-1">
          RTR was founded in response to the Truth and Reconciliation Commission&apos;s Call to Action.
        </p>
      </footer>
    </div>
  );
}
