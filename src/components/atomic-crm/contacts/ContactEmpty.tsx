import { CreateButton } from "@/components/admin/create-button";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Gift, Plus, Sparkles, UsersRound } from "lucide-react";
import { useTranslate } from "ra-core";

import useAppBarHeight from "../misc/useAppBarHeight";
import { ContactImportButton } from "./ContactImportButton";
import { ContactCreateSheet } from "./ContactCreateSheet";
import { useIsMobile } from "@/hooks/use-mobile";

export const ContactEmpty = () => {
  const appbarHeight = useAppBarHeight();
  const isMobile = useIsMobile();
  const translate = useTranslate();
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <ContactCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
      <div
        className="flex flex-col justify-center items-center gap-5 px-4"
        style={{
          height: `calc(100dvh - ${appbarHeight}px)`,
        }}
      >
        <div className="premium-panel relative w-full max-w-3xl overflow-hidden p-6 text-center sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-cyan-500 to-slate-900" />
          <div className="absolute -right-16 -top-16 size-44 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 size-52 rounded-full bg-slate-200/80 blur-3xl" />
          <div className="relative mx-auto flex size-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-800 text-white shadow-2xl shadow-blue-950/20">
            <UsersRound className="size-9" />
          </div>
          <div className="relative mt-6 flex flex-col items-center gap-2">
            <p className="premium-kicker">Realtor pipeline</p>
            <h6 className="max-w-xl text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {translate("resources.contacts.empty.title")}
            </h6>
            <p className="mb-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              {translate("resources.contacts.empty.description")}
            </p>
          </div>
          <div className="relative mb-6 grid gap-3 text-left sm:grid-cols-3">
            <EmptyFeature icon={<Building2 />} label="Brokerage profiles" />
            <EmptyFeature icon={<Gift />} label="Gift tracking" />
            <EmptyFeature icon={<Sparkles />} label="Follow-up reminders" />
          </div>
          <div className="relative flex flex-col justify-center gap-2 sm:flex-row">
            {isMobile ? (
              <Button
                onClick={() => setCreateOpen(true)}
                className="h-12 rounded-full px-6 font-bold shadow-lg shadow-blue-950/15"
              >
                <Plus className="h-4 w-4" />
                {translate("resources.contacts.action.new")}
              </Button>
            ) : (
              <>
                <CreateButton label="resources.contacts.action.new" />
                <ContactImportButton />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const EmptyFeature = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-4 shadow-sm">
    <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
      {icon}
    </div>
    <p className="text-sm font-bold text-slate-700">{label}</p>
  </div>
);
