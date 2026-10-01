"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, ChevronUp, FileText, ClipboardList, AlertCircle, Info } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EVENT_RULES, type EventRules } from "@/lib/event-rules";

interface EventRulesDialogProps {
  eventName: EventRules["eventName"] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_BADGE = {
  technical: "bg-gradient-to-r from-blue-500 to-blue-700",
  "non-technical": "bg-gradient-to-r from-pink-500 to-pink-700",
};

const CATEGORY_LABEL = {
  technical: "Technical Event",
  "non-technical": "Non-Technical Event",
};

const CATEGORY_ICON = {
  technical: FileText,
  "non-technical": ClipboardList,
};

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = defaultOpen;
      setIsOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const handleToggle = () => {
    if (detailsRef.current) {
      setIsOpen(detailsRef.current.open);
    }
  };

  return (
    <details
      ref={detailsRef}
      onToggle={handleToggle}
      className="group border border-white/10 rounded-xl overflow-hidden bg-white/5"
    >
      <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none select-none">
        <div className="flex items-center gap-3 pl-2">
          <Icon className="h-5 w-5 text-blue-300 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-white">{title}</span>
          {count && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              {count}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-slate-300 transition-transform duration-200 group-[details[open]]:rotate-180">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </summary>
      <div className="px-4 py-4 animate-slide-down" style={{ animationDuration: "200ms" }}>
        {children}
      </div>
    </details>
  );
}

function RuleList({ rules, icon: Icon = AlertCircle }: { rules: string[]; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <ul className="space-y-3" role="list">
      {rules.map((rule, i) => (
        <li key={i} className="flex gap-3 text-sm text-white leading-relaxed">
          <Icon className="h-5 w-5 shrink-0 text-blue-300 mt-0.5" aria-hidden="true" />
          <span>{rule}</span>
        </li>
      ))}
    </ul>
  );
}

function PrerequisitesList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2" role="list">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function EventRulesDialog({ eventName, open, onOpenChange }: EventRulesDialogProps) {
  const rules = eventName ? EVENT_RULES[eventName] : null;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!rules || !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg sm:max-w-xl md:max-w-2xl max-h-[85vh] overflow-y-auto p-0 bg-[#0f172a] text-white"
        showCloseButton={false}
      >
        <DialogHeader className="relative p-6 pb-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${CATEGORY_BADGE[rules.category]}`}>
                {(() => {
                  const Icon = CATEGORY_ICON[rules.category];
                  return <Icon className="h-3 w-3" aria-hidden="true" />;
                })()}
                {CATEGORY_LABEL[rules.category]}
              </span>
              <DialogTitle className="mt-3 text-2xl font-bold text-white">{rules.eventName}</DialogTitle>
              {rules.format && (
                <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-slate-100">
                  <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="font-medium">Format:</span> {rules.format}
                </DialogDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
              aria-label="Close rules dialog"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <CollapsibleSection
            title="Rules & Regulations"
            icon={FileText}
            count={rules.rules.length}
            defaultOpen={true}
          >
            <RuleList rules={rules.rules} />
          </CollapsibleSection>

          {rules.prerequisites && rules.prerequisites.length > 0 && (
            <CollapsibleSection
              title="Prerequisites"
              icon={ClipboardList}
              count={rules.prerequisites.length}
              defaultOpen={true}
            >
              <PrerequisitesList items={rules.prerequisites} />
            </CollapsibleSection>
          )}

          {rules.specialNotes && rules.specialNotes.length > 0 && (
            <CollapsibleSection
              title="Important Notes"
              icon={AlertCircle}
              count={rules.specialNotes.length}
              defaultOpen={true}
            >
              <RuleList rules={rules.specialNotes} icon={AlertCircle} />
            </CollapsibleSection>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}