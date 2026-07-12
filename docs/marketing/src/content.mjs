/**
 * Copy for the RTR marketing one-sheets.
 * Source of truth for claims: README.md, docs/guide/, docs/design-system/.
 */

// Lucide-style line icons (24×24, stroke currentColor), matching the app's
// iconography foundation. The "mark" icon is the BrandMark itself.
export const icons = {
  mark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4a12 12 0 0 1 0 24" fill="none" stroke="#D89543" stroke-width="3.4" stroke-linecap="round"/><path d="M16 28a12 12 0 0 1 0-24" fill="none" stroke="#37767C" stroke-width="3.4" stroke-linecap="round"/><circle cx="12.4" cy="16" r="2.1" fill="#D89543"/><circle cx="19.6" cy="16" r="2.1" fill="#37767C"/></svg>`,
  markOnDark: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4a12 12 0 0 1 0 24" fill="none" stroke="#E0A34E" stroke-width="3.4" stroke-linecap="round"/><path d="M16 28a12 12 0 0 1 0-24" fill="none" stroke="#7FB5AE" stroke-width="3.4" stroke-linecap="round"/><circle cx="12.4" cy="16" r="2.1" fill="#E0A34E"/><circle cx="19.6" cy="16" r="2.1" fill="#7FB5AE"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>`,
  map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.2 7.8 14.3 14.3 7.8 16.2 9.7 9.7 16.2 7.8"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-9V5.5L12 2 4 5.5V13c0 5.4 8 9 8 9Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  hands: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4a12 12 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M16 28a12 12 0 0 1 0-24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/><circle cx="12.4" cy="16" r="2.1" fill="currentColor"/><circle cx="19.6" cy="16" r="2.1" fill="currentColor"/></svg>`,
  seats: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4.5" r="1.9" fill="currentColor" stroke="none"/><circle cx="19.5" cy="12" r="1.9" fill="currentColor" stroke="none"/><circle cx="12" cy="19.5" r="1.9"/><circle cx="4.5" cy="12" r="1.9"/></svg>`,
};

export const journeySteps = [
  {
    title: "Create your profile",
    text: "Share who you are, what you value, and how you like to connect — in five welcoming steps.",
  },
  {
    title: "Complete the learning journey",
    text: "Videos and readings that build a shared foundation for respectful conversation.",
  },
  {
    title: "Meet your match",
    text: "A facilitator reviews every recommendation. You always choose whether to connect.",
  },
  {
    title: "Build the relationship",
    text: "Talk, listen, and take part in reconciliation in your own community.",
  },
];

export const docs = [
  {
    id: "rtr-platform-overview",
    eyebrow: "Platform overview",
    title: "Reconciliation begins with a relationship.",
    lead: "A digital platform for learning, listening, and building meaningful relationships between Indigenous and non-Indigenous people — in their own communities.",
    features: [
      {
        icon: "user",
        title: "A guided welcome",
        text: "Five gentle steps introduce you: who you are, what you value, and how you like to connect. Plain words, large type — if you can use email, you can join.",
      },
      {
        icon: "book",
        title: "A shared learning journey",
        text: "Videos and readings build a common foundation of truth and understanding, with progress you can see — completed before anyone is matched.",
      },
      {
        icon: "mark",
        title: "Matching, guided by people",
        text: "A trained facilitator reviews every recommendation before two people are introduced — and both must agree before contact opens.",
      },
      {
        icon: "map",
        title: "Community at local scale",
        text: "Discover participants and watch regional circles form on the map. Locations stay at city and region level — never addresses.",
      },
      {
        icon: "message",
        title: "Conversation and connection",
        text: "Send a connection request, message one another, and schedule a video call when you are both ready to talk.",
      },
      {
        icon: "dashboard",
        title: "Support for facilitators",
        text: "Progress dashboards, a matching queue, and cohort settings keep facilitators focused on people, not paperwork.",
      },
    ],
    steps: journeySteps,
    stepsTitle: "How the journey works",
    highlight: {
      quote: "The relationship is the work.",
      text: "Developed in partnership with Reconciliation Through Relationships in response to the Truth and Reconciliation Commission of Canada’s Calls to Action.",
    },
  },
  {
    id: "rtr-the-journey",
    eyebrow: "How it works",
    title: "Not a program to complete. A relationship to begin.",
    lead: "Everyone moves through the same four steps, at their own pace — and matching opens only after learning, so every relationship starts from shared understanding.",
    numberedFeatures: true,
    features: journeySteps.map((s) => ({ icon: null, ...s })),
    steps: null,
    commitments: {
      title: "Designed with care",
      items: [
        {
          icon: "eye",
          title: "Welcome before wow",
          text: "Large type, plain words, one clear action per screen. The body typeface, Atkinson Hyperlegible, was designed by the Braille Institute for maximum legibility.",
        },
        {
          icon: "shield",
          title: "Consent is a design element",
          text: "Nothing about a person is shown until they choose to share it. Photos are exchanged only after both people agree to connect.",
        },
        {
          icon: "hands",
          title: "Abstract, not appropriated",
          text: "Our motifs — the open circle, the woven strands — are geometric abstractions of relationship, deliberately not imitations of any nation’s visual culture.",
        },
      ],
    },
    highlight: {
      quote: "Everyone starts from a place of understanding.",
      text: "Matching opens only after the learning journey is complete. This is on purpose.",
    },
  },
  {
    id: "rtr-guided-onboarding",
    eyebrow: "Capability · Getting started",
    title: "A welcome, not a form.",
    lead: "If you can use email and a web browser, you can join RTR. Five gentle steps introduce you to the community — at your own pace, in your own words.",
    features: [
      {
        icon: "user",
        title: "Five steps, plain words",
        text: "Who you are, what you value, how you like to connect. Every question is asked in everyday language — no jargon, nothing technical.",
      },
      {
        icon: "eye",
        title: "Built to be readable",
        text: "Generous type set in Atkinson Hyperlegible — a typeface designed by the Braille Institute for maximum legibility — with large, comfortable touch targets.",
      },
      {
        icon: "check",
        title: "One clear action per screen",
        text: "Every screen has exactly one primary button, named for what it actually does — “Schedule call,” never “Submit.”",
      },
      {
        icon: "shield",
        title: "You control the pace",
        text: "Save and return anytime. Your profile is yours to shape, and nothing is shared until you choose to share it.",
      },
    ],
    highlight: {
      quote: "Nothing about you is shown until you choose to share it.",
      text: "Consent is a design element of the platform — encoded in the components themselves, so no screen can accidentally break it.",
    },
  },
  {
    id: "rtr-learning-journey",
    eyebrow: "Capability · Learning journey",
    title: "Shared understanding comes first.",
    lead: "Before anyone is matched, everyone completes the same journey of videos and readings — a common foundation for truth, listening, and respectful conversation.",
    features: [
      {
        icon: "book",
        title: "Videos and readings",
        text: "A short, curated set of learning materials builds the shared context every relationship deserves — at whatever pace works for you.",
      },
      {
        icon: "compass",
        title: "Progress you can see",
        text: "Mark each step complete and watch your journey advance. You always know where you are and what comes next.",
      },
      {
        icon: "mark",
        title: "Learning unlocks matching",
        text: "Recommendations open only after the journey is complete — so both people in every introduction begin from understanding.",
      },
    ],
    highlight: {
      quote: "It makes sure everyone starts from a place of understanding.",
      text: "The learning-before-matching rule is deliberate. It is the foundation the whole platform is built on.",
    },
  },
  {
    id: "rtr-guided-matching",
    eyebrow: "Capability · Guided matching",
    title: "Introduced with care. Connected by consent.",
    lead: "RTR never auto-matches. A trained facilitator reviews every recommendation, and both people must say yes before any contact opens.",
    features: [
      {
        icon: "eye",
        title: "Reviewed by a person",
        text: "Every recommendation passes through a facilitator who knows the community before an introduction is ever made.",
      },
      {
        icon: "check",
        title: "Mutual consent, always",
        text: "Both people must agree before contact opens. Either person can decline — quietly, and without explanation.",
      },
      {
        icon: "shield",
        title: "Privacy until yes",
        text: "Profiles show initials, not photos, by design. Photos are exchanged in conversation, after both people agree to connect.",
      },
    ],
    highlight: {
      quote: "Matching is mediated. People are introduced by people.",
      text: "Technology suggests; human judgment and mutual consent decide.",
    },
  },
  {
    id: "rtr-community-map",
    eyebrow: "Capability · Community & regional map",
    title: "Local by design. Private by default.",
    lead: "Reconciliation happens in communities, not in feeds. RTR shows circles forming near you — while keeping every location at region level.",
    features: [
      {
        icon: "map",
        title: "The regional map",
        text: "Watch local groups take shape across the country and find the circle forming closest to you.",
      },
      {
        icon: "seats",
        title: "Cohort circles",
        text: "Each region gathers a small cohort, seat by seat. When a circle fills, a local community is ready to walk together.",
      },
      {
        icon: "shield",
        title: "Regions, never addresses",
        text: "Locations display at city and region granularity only. Precise location is visible to no one — and city detail only to facilitators.",
      },
    ],
    highlight: {
      quote: "The map shows regions, never addresses.",
      text: "Privacy controls let each participant decide exactly what the community sees.",
    },
  },
  {
    id: "rtr-messaging-meetings",
    eyebrow: "Capability · Messaging & meetings",
    title: "From first hello to sitting down together.",
    lead: "Once two people agree to connect, RTR gives the relationship room to grow — requests, messages, and meetings in one calm place.",
    features: [
      {
        icon: "mark",
        title: "Connection requests",
        text: "A warm, low-pressure way to say “I would like to talk.” Nothing opens until the other person says yes.",
      },
      {
        icon: "message",
        title: "Direct messaging",
        text: "A private, one-to-one conversation — a quiet space to introduce yourselves and find common ground.",
      },
      {
        icon: "calendar",
        title: "Meeting scheduling",
        text: "Move from messages to a real conversation: schedule a video call or plan to meet locally, without leaving the platform.",
      },
    ],
    highlight: {
      quote: "Conversation opens only after both people agree.",
      text: "Every connection is consensual, private, and paced by the two people in it.",
    },
  },
  {
    id: "rtr-facilitator-tools",
    eyebrow: "Capability · Facilitator tools",
    title: "Care for the people doing the caring.",
    lead: "Facilitators guide the community — reviewing matches, supporting journeys, forming local groups. RTR keeps their time where it belongs: with people.",
    features: [
      {
        icon: "dashboard",
        title: "Progress dashboards",
        text: "See where every participant is on the learning journey at a glance, and know who is ready for the next step.",
      },
      {
        icon: "check",
        title: "A matching queue",
        text: "Review recommendations side by side and approve or hold each introduction with a single, deliberate action.",
      },
      {
        icon: "seats",
        title: "Cohort settings",
        text: "Set regional group sizes, watch seats fill, and open a new circle when a community is ready.",
      },
    ],
    highlight: {
      quote: "Every introduction passes through human judgment.",
      text: "Facilitator tools exist so that care scales — without ever becoming automatic.",
    },
  },
];
