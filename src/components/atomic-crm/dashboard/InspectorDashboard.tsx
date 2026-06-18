import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  parseISO,
  startOfToday,
} from "date-fns";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Gift,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { useGetList } from "ra-core";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from "../types";

type Realtor = Contact & {
  brokerage?: string;
  followUpDate?: string;
  freebieDelivered?: boolean;
  referralCount?: number;
  giftFreebieLeft?: string;
  preferredContactMethod?: string;
  createdAt?: string;
};

const today = startOfToday();
const inSevenDays = addDays(today, 7);

const getDate = (value?: string) => (value ? parseISO(value) : undefined);
const fullName = (r: Realtor) =>
  [r.first_name, r.last_name].filter(Boolean).join(" ") || "Unnamed realtor";

export const InspectorDashboard = () => {
  const { data = [], isPending } = useGetList<Realtor>("contacts", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "createdAt", order: "DESC" },
  });

  if (isPending) {
    return <div className="premium-panel h-[70dvh] animate-pulse" />;
  }

  const overdue = data.filter((r) => {
    const d = getDate(r.followUpDate);
    return d && isBefore(d, today);
  });
  const dueSoon = data.filter((r) => {
    const d = getDate(r.followUpDate);
    return d && !isBefore(d, today) && !isAfter(d, inSevenDays);
  });
  const upcoming = data
    .filter((r) => getDate(r.followUpDate))
    .sort((a, b) =>
      String(a.followUpDate).localeCompare(String(b.followUpDate)),
    )
    .slice(0, 6);
  const topPartners = [...data]
    .sort((a, b) => (b.referralCount ?? 0) - (a.referralCount ?? 0))
    .slice(0, 5);
  const recent = [...data]
    .sort((a, b) =>
      String(b.createdAt ?? b.first_seen).localeCompare(
        String(a.createdAt ?? a.first_seen),
      ),
    )
    .slice(0, 5);
  const freebiesThisMonth = data.filter((r) => {
    const d = getDate(r.officeVisitedDate as string | undefined);
    return r.freebieDelivered && d && isSameMonth(d, today);
  }).length;
  const totalReferrals = data.reduce(
    (sum, r) => sum + (r.referralCount ?? 0),
    0,
  );
  const conversion = data.length
    ? Math.round(
        (topPartners.filter((r) => (r.referralCount ?? 0) > 0).length /
          data.length) *
          100,
      )
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_28px_90px_-42px_rgba(15,23,42,0.9)]">
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr] lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.35),transparent_32rem),radial-gradient(circle_at_90%_0%,rgba(14,165,233,.24),transparent_28rem)]" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
              <Sparkles className="size-3.5" /> Premium growth workspace
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Realtor referral command center
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Track office visits, concierge gifts, follow-ups, and high-value
              referral partners from one polished mobile-first dashboard.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-white px-6 font-bold text-slate-950 hover:bg-blue-50"
              >
                <Link to="/contacts/create">
                  <Plus className="mr-2 size-5" /> Add Realtor
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-white/10 px-6 font-bold text-white hover:bg-white/20"
              >
                <Link to="/tasks">
                  <CalendarClock className="mr-2 size-5" /> Review follow-ups
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10 premium-card border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Referral momentum</p>
                <p className="mt-1 text-4xl font-black">{totalReferrals}</p>
              </div>
              <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
                <TrendingUp />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Progress label="Partners with referrals" value={conversion} />
              <Progress
                label="Follow-up readiness"
                value={Math.min(
                  100,
                  data.length
                    ? Math.round((dueSoon.length / data.length) * 100)
                    : 0,
                )}
              />
              <Progress
                label="Gift coverage"
                value={Math.min(
                  100,
                  data.length
                    ? Math.round((freebiesThisMonth / data.length) * 100)
                    : 0,
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Users />}
          label="Realtors"
          value={data.length}
          detail="Total relationship database"
        />
        <Metric
          icon={<CalendarClock />}
          label="Overdue follow-ups"
          value={overdue.length}
          detail="Need attention today"
          tone="danger"
        />
        <Metric
          icon={<CheckCircle2 />}
          label="Due next 7 days"
          value={dueSoon.length}
          detail="Warm touches queued"
        />
        <Metric
          icon={<Gift />}
          label="Freebies this month"
          value={freebiesThisMonth}
          detail="Office visit gifts delivered"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardList
          title="Upcoming follow-ups"
          items={upcoming}
          empty="Schedule your first follow-up to keep relationships warm."
          renderMeta={(r) =>
            r.followUpDate ? format(parseISO(r.followUpDate), "MMM d") : ""
          }
        />
        <DashboardList
          title="Top referral partners"
          items={topPartners}
          empty="Add referral counts to reveal your best partners."
          renderMeta={(r) => `${r.referralCount ?? 0} referrals`}
          icon={<Star className="size-4 fill-amber-400 text-amber-400" />}
        />
        <DashboardList
          title="Recently added realtors"
          items={recent}
          empty="Add your first realtor to get started."
          renderMeta={(r) => r.brokerage ?? r.company_name ?? "No brokerage"}
        />
      </div>
    </div>
  );
};

const Progress = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-200">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-300 to-cyan-200"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Metric = ({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  tone?: "danger";
}) => (
  <Card className="premium-card group overflow-hidden border-0">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`rounded-2xl p-3 shadow-inner ${tone === "danger" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-900"}`}
        >
          {icon}
        </div>
        <ArrowUpRight className="size-5 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-700" />
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>
    </CardContent>
  </Card>
);

const DashboardList = ({
  title,
  items,
  empty,
  renderMeta,
  icon,
}: {
  title: string;
  items: Realtor[];
  empty: string;
  renderMeta: (r: Realtor) => string;
  icon?: React.ReactNode;
}) => (
  <Card className="premium-panel border-0">
    <CardHeader className="pb-3">
      <CardTitle className="text-xl font-black text-slate-950">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <Sparkles className="mx-auto mb-3 size-8 text-blue-700" />
          <p className="text-sm font-medium text-slate-500">{empty}</p>
        </div>
      ) : (
        items.map((r) => (
          <Link
            key={r.id}
            to={`/contacts/${r.id}/show`}
            className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-950">{fullName(r)}</p>
              <p className="truncate text-sm text-slate-500">
                {r.brokerage ??
                  r.company_name ??
                  r.preferredContactMethod ??
                  "Relationship profile"}
              </p>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">
              {icon}
              {renderMeta(r)}
            </div>
          </Link>
        ))
      )}
    </CardContent>
  </Card>
);
