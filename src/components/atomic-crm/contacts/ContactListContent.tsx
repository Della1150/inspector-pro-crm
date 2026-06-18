import { format, parseISO } from "date-fns";
import { Mail, Phone, Globe, Gift, CalendarClock } from "lucide-react";
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
    <div className="grid gap-4 p-2">
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
  <div className="rounded-3xl bg-white p-8 text-center text-slate-500">
    No realtors found. Add a realtor or adjust your filters.
  </div>
);

const RealtorCard = ({ realtor }: { realtor: Realtor }) => (
  <Link
    to={`/contacts/${realtor.id}/show`}
    className="block rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5"
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
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
        <p className="mt-1 text-sm font-medium text-slate-600">
          {realtor.brokerage ?? realtor.company_name ?? "No brokerage added"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
          {realtor.followUpDate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <CalendarClock className="size-4" /> Follow up{" "}
              {format(parseISO(realtor.followUpDate), "MMM d")}
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {realtor.referralCount ?? 0} referrals
          </span>
          {realtor.preferredContactMethod && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Prefers {realtor.preferredContactMethod}
            </span>
          )}
        </div>
      </div>
      <div
        className="grid grid-cols-3 gap-2 md:w-auto"
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
