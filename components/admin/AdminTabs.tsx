"use client";

import { useState } from "react";
import { DashboardPanel } from "./DashboardPanel";
import { ViewTeamPanel } from "./ViewTeamPanel";
import { ViewEventPanel } from "./ViewEventPanel";
import { ManageCollegesPanel } from "./ManageCollegesPanel";

const TABS = [
  { id: "dashboard", label: " Dashboard", icon: "📊" },
  { id: "view-team", label: " View Team", icon: "👥" },
  { id: "view-event", label: " View Event Registrations", icon: "🎯" },
  { id: "manage-colleges", label: " Manage Colleges", icon: "🏫" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="bg-aion-card rounded-xl border border-aion overflow-hidden">
      <nav
        className="flex border-b border-aion overflow-x-auto"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
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

      <div className="p-6" role="tabpanel">
        {activeTab === "dashboard" && <DashboardPanel />}
        {activeTab === "view-team" && <ViewTeamPanel />}
        {activeTab === "view-event" && <ViewEventPanel />}
        {activeTab === "manage-colleges" && <ManageCollegesPanel />}
      </div>
    </div>
  );
}