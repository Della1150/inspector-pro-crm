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
  CalendarClock,
  CheckCircle2,
  Gift,
  Plus,
  Star,
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
  [r.first_name, r.last_name].filter(Boolean).join(" ");

export const InspectorDashboard = () => {
  const { data = [], isPending } = useGetList<Realtor>("contacts", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "createdAt", order: "DESC" },
  });

  if (isPending) return null;

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

  return (
    <div className="min-h-screen bg-slate-50 -m-4 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
                Inspector Pro CRM
              </p>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold">
                Realtor referral command center
              </h1>
              <p className="mt-3 max-w-2xl text-blue-100">
                Track office visits, freebies, follow-ups, and referral partners
                from your phone while you build relationships.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-14 rounded-2xl bg-white text-slate-950 hover:bg-blue-50"
            >
              <Link to="/contacts/create">
                <Plus className="mr-2" /> Add Realtor
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric icon={<Users />} label="Realtors" value={data.length} />
          <Metric
            icon={<CalendarClock />}
            label="Overdue follow-ups"
            value={overdue.length}
            tone="danger"
          />
          <Metric
            icon={<CheckCircle2 />}
            label="Due next 7 days"
            value={dueSoon.length}
          />
          <Metric
            icon={<Gift />}
            label="Freebies this month"
            value={freebiesThisMonth}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardList
            title="Upcoming follow-ups"
            items={upcoming}
            empty="No follow-ups scheduled yet."
            renderMeta={(r) =>
              r.followUpDate ? format(parseISO(r.followUpDate), "MMM d") : ""
            }
          />
          <DashboardList
            title="Top referral partners"
            items={topPartners}
            empty="Add referral counts to see your best partners."
            renderMeta={(r) => `${r.referralCount ?? 0} referrals`}
            icon={<Star className="size-4 text-amber-500" />}
          />
          <DashboardList
            title="Recently added realtors"
            items={recent}
            empty="Add your first realtor to get started."
            renderMeta={(r) => r.brokerage ?? r.company_name ?? "No brokerage"}
          />
        </div>
      </div>
    </div>
  );
};

const Metric = ({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "danger";
}) => (
  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="flex items-center gap-4 p-5">
      <div
        className={`rounded-2xl p-3 ${tone === "danger" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-900"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-950">{value}</p>
      </div>
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
  <Card className="rounded-3xl border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="text-slate-950">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{empty}</p>
      ) : (
        items.map((r) => (
          <Link
            key={r.id}
            to={`/contacts/${r.id}/show`}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 hover:bg-blue-50"
          >
            <div className="min-w-0">
              {" "}
              <p className="font-semibold text-slate-950 truncate">
                {fullName(r)}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {r.brokerage ?? r.company_name ?? r.preferredContactMethod}
              </p>
            </div>
            <div className="ml-3 flex items-center gap-1 text-sm font-medium text-blue-900">
              {icon}
              {renderMeta(r)}
            </div>
          </Link>
        ))
      )}
    </CardContent>
  </Card>
);
