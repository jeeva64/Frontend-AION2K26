"use client";

import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { ViewTeamPanel } from "./ViewTeamPanel";
import { ViewEventPanel } from "./ViewEventPanel";
import { ManageCollegesPanel } from "./ManageCollegesPanel";
import { PaymentsPanel } from "./PaymentsPanel";

const TABS = [
  { id: "dashboard", label: " Dashboard", icon: "📊", superAdminOnly: true },
  {
    id: "payments",
    label: " Payment Verification",
    icon: "💳",
    superAdminOnly: true,
  },
  { id: "view-team", label: " View Team", icon: "👥", superAdminOnly: true },
  {
    id: "view-event",
    label: " View Event Registrations",
    icon: "🎯",
    superAdminOnly: false,
  },
  {
    id: "manage-colleges",
    label: " Manage Colleges",
    icon: "🏫",
    superAdminOnly: true,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminTabs({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    isSuperAdmin ? "dashboard" : "view-event"
  );

  const visibleTabs = TABS.filter((tab) => isSuperAdmin || !tab.superAdminOnly);

  return (
    <div className="bg-aion-card rounded-xl border border-aion overflow-hidden">
      <nav
        className="flex border-b border-aion overflow-x-auto"
        role="tablist"
        aria-label="Admin panels"
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`admin-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-aion-primary text-aion-primary"
                : "border-transparent text-aion-muted hover:text-aion-text hover:border-aion-muted"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <div
        id={`admin-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`admin-tab-${activeTab}`}
        className="p-6"
      >
        {activeTab === "dashboard" && <DashboardPanel />}
        {activeTab === "payments" && <PaymentsPanel />}
        {activeTab === "view-team" && <ViewTeamPanel />}
        {activeTab === "view-event" && <ViewEventPanel />}
        {activeTab === "manage-colleges" && <ManageCollegesPanel />}
      </div>
    </div>
  );
}
