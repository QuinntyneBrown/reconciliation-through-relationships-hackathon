export const TEST_PASSWORD = "RTR-Acceptance-2026!";

export const testUsers = {
  gateOnboarding: {
    email: "e2e.gate-onboarding@rtr-demo.ca",
    firstName: "Gate",
    lastName: "Onboarding",
  },
  gateLearner: {
    email: "e2e.gate-learner@rtr-demo.ca",
    firstName: "Gate",
    lastName: "Learner",
  },
  onboarding: {
    email: "e2e.onboarding@rtr-demo.ca",
    firstName: "Olivia",
    lastName: "Onboarding",
  },
  learner: {
    email: "e2e.learner@rtr-demo.ca",
    firstName: "Lena",
    lastName: "Learner",
  },
  member: {
    email: "e2e.member@rtr-demo.ca",
    firstName: "Avery",
    lastName: "Acceptance",
  },
  partner: {
    email: "e2e.partner@rtr-demo.ca",
    firstName: "Iris",
    lastName: "Acceptance",
  },
  emptyMember: {
    email: "e2e.empty@rtr-demo.ca",
    firstName: "Emery",
    lastName: "Empty",
  },
  requester: {
    email: "e2e.requester@rtr-demo.ca",
    firstName: "Riley",
    lastName: "Requester",
  },
  accepter: {
    email: "e2e.accepter@rtr-demo.ca",
    firstName: "Casey",
    lastName: "Accepter",
  },
  approveIndigenous: {
    email: "e2e.approve-indigenous@rtr-demo.ca",
    firstName: "Approve",
    lastName: "Indigenous",
  },
  approveNonIndigenous: {
    email: "e2e.approve-non-indigenous@rtr-demo.ca",
    firstName: "Approve",
    lastName: "Neighbour",
  },
  rejectIndigenous: {
    email: "e2e.reject-indigenous@rtr-demo.ca",
    firstName: "Reject",
    lastName: "Indigenous",
  },
  rejectNonIndigenous: {
    email: "e2e.reject-non-indigenous@rtr-demo.ca",
    firstName: "Reject",
    lastName: "Neighbour",
  },
  manualIndigenous: {
    email: "e2e.manual-indigenous@rtr-demo.ca",
    firstName: "Manual",
    lastName: "Indigenous",
  },
  manualNonIndigenous: {
    email: "e2e.manual-non-indigenous@rtr-demo.ca",
    firstName: "Manual",
    lastName: "Neighbour",
  },
  facilitator: {
    email: "e2e.facilitator@rtr-demo.ca",
    firstName: "Faye",
    lastName: "Facilitator",
  },
} as const;

export type TestUserKey = keyof typeof testUsers;
