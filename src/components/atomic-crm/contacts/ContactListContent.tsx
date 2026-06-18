import { format, parseISO } from "date-fns";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Gift,
  CalendarClock,
  Sparkles,
  Star,
} from "lucide-react";
import { RecordContextProvider, useListContext } from "ra-core";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "../types";

type Realtor = Contact & {
  brokerage?: string;
  phone?: string;
  email?: string;
  website?: string;
  followUpDate?: string;
  freebieDelivered?: boolean;
  referralCount?: number;
  preferredContactMethod?: string;
};
const name = (r: Realtor) =>
  [r.first_name, r.last_name].filter(Boolean).join(" ");
const email = (r: Realtor) => r.email ?? r.email_jsonb?.[0]?.email;
const phone = (r: Realtor) => r.phone ?? r.phone_jsonb?.[0]?.number;

export const ContactListContent = () => {
  const { data = [], isPending, error } = useListContext<Realtor>();
  if (isPending) return <Skeleton className="h-20 w-full rounded-3xl" />;
  if (error) return null;
  return (
    <div className="grid gap-4 py-2 sm:grid-cols-2 xl:grid-cols-3">
      {data.length === 0 ? (
        <Empty />
      ) : (
        data.map((r) => (
          <RecordContextProvider key={r.id} value={r}>
            <RealtorCard realtor={r} />
          </RecordContextProvider>
        ))
      )}
    </div>
  );
};

export const ContactListContentMobile = ContactListContent;

const Empty = () => (
  <div className="premium-panel col-span-full p-10 text-center">
    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-800">
      <Sparkles className="size-7" />
    </div>
    <h3 className="text-xl font-black text-slate-950">No realtors found</h3>
    <p className="mt-2 text-sm text-slate-500">
      Add a realtor or adjust your filters to start building your referral
      network.
    </p>
  </div>
);

const RealtorCard = ({ realtor }: { realtor: Realtor }) => (
  <Link
    to={`/contacts/${realtor.id}/show`}
    className="group block overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-[0_18px_55px_-38px_rgba(15,23,42,0.65)] transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_24px_70px_-42px_rgba(15,23,42,0.75)] md:p-5"
  >
    <div className="flex h-full flex-col justify-between gap-5">
      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-lg font-black text-white shadow-inner">
            {name(realtor).slice(0, 1) || "R"}
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {realtor.referralCount ?? 0} referrals
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-xl font-bold text-slate-950">
            {name(realtor)}
          </h3>
          {realtor.freebieDelivered && (
            <Badge className="rounded-full bg-blue-50 text-blue-900 hover:bg-blue-50">
              <Gift className="mr-1 size-3" /> Freebie delivered
            </Badge>
          )}
        </div>
        <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Building2 className="size-4 text-blue-700" />
          {realtor.brokerage ?? realtor.company_name ?? "No brokerage added"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
          {realtor.followUpDate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <CalendarClock className="size-4" /> Follow up{" "}
              {format(parseISO(realtor.followUpDate), "MMM d")}
            </span>
          )}
          {realtor.preferredContactMethod && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Prefers {realtor.preferredContactMethod}
            </span>
          )}
        </div>
      </div>
      <div
        className="grid grid-cols-3 gap-2"
        onClick={(e) => e.preventDefault()}
      >
        {phone(realtor) && (
          <Button asChild size="lg" className="rounded-2xl">
            <a href={`tel:${phone(realtor)}`}>
              <Phone />
            </a>
          </Button>
        )}
        {email(realtor) && (
          <Button asChild size="lg" variant="secondary" className="rounded-2xl">
            <a href={`mailto:${email(realtor)}`}>
              <Mail />
            </a>
          </Button>
        )}
        {realtor.website && (
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <a href={realtor.website} target="_blank" rel="noreferrer">
              <Globe />
            </a>
          </Button>
        )}
      </div>
    </div>
  </Link>
);
