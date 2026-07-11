import Link from "next/link";

import { Weave } from "@/components/rtr-brand";

export function AppFooter() {
  return (
    <footer className="bg-spruce-900 text-on-dark-soft mt-auto px-4 py-10 text-[14.5px] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h4 className="text-on-dark mb-2">Reconciliation Through Relationships</h4>
            <p>Building meaningful relationships between Indigenous and non-Indigenous people.</p>
            <p className="mt-1">
              <Link
                href="https://rightrelationship.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-dark-soft hover:text-on-dark"
              >
                rightrelationship.ca
              </Link>
            </p>
          </div>
          <Weave onDark className="w-full sm:w-[240px]" />
        </div>
        <p className="border-on-dark/15 mt-6 max-w-3xl border-t pt-6 italic">
          Each gathering begins by acknowledging the treaty territory and traditional lands on which
          it takes place. Region-specific acknowledgments are confirmed with local Indigenous
          partners.
        </p>
      </div>
    </footer>
  );
}
