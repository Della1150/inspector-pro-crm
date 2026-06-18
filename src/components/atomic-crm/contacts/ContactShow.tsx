import { format, parseISO } from "date-fns";
import {
  CalendarPlus,
  Edit,
  Facebook,
  Gift,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import {
  ShowBase,
  useNotify,
  useShowContext,
  useUpdate,
  type ShowBaseProps,
} from "ra-core";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from "../types";

type Realtor = Contact & {
  brokerage?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleBusinessUrl?: string;
  followUpDate?: string;
  freebieDelivered?: boolean;
  referralCount?: number;
  notes?: string;
  officeVisitedDate?: string;
  giftFreebieLeft?: string;
  preferredContactMethod?: string;
  brokerageOfficeAddress?: string;
};
const fullName = (r: Realtor) =>
  [r.first_name, r.last_name].filter(Boolean).join(" ");
const email = (r: Realtor) => r.email ?? r.email_jsonb?.[0]?.email;
const phone = (r: Realtor) => r.phone ?? r.phone_jsonb?.[0]?.number;

export const ContactShow = (props: ShowBaseProps = {}) => (
  <ShowBase {...props}>
    <RealtorShow />
  </ShowBase>
);

const RealtorShow = () => {
  const { record, isPending } = useShowContext<Realtor>();
  const [update] = useUpdate<Realtor>();
  const notify = useNotify();
  if (isPending || !record) return null;
  const markFreebie = () =>
    update(
      "contacts",
      {
        id: record.id,
        previousData: record,
        data: {
          freebieDelivered: true,
          officeVisitedDate: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        mutationMode: "optimistic",
        onSuccess: () =>
          notify("Freebie marked delivered", { type: "success" }),
      },
    );
  return (
    <div className="min-h-screen bg-slate-50 -m-4 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
          <div className="bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
                  Realtor partner
                </p>
                <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                  {fullName(record)}
                </h1>
                <p className="mt-2 text-lg text-blue-100">
                  {record.brokerage ?? "No brokerage added"}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-blue-50"
              >
                <Link to={`/contacts/${record.id}`}>
                  {" "}
                  <Edit className="mr-2" /> Edit
                </Link>
              </Button>
            </div>
          </div>
          <CardContent className="grid gap-3 p-4 md:grid-cols-4 md:p-6">
            {phone(record) && (
              <Quick
                href={`tel:${phone(record)}`}
                icon={<Phone />}
                label="Call Realtor"
              />
            )}
            {email(record) && (
              <Quick
                href={`mailto:${email(record)}`}
                icon={<Mail />}
                label="Email Realtor"
              />
            )}
            {record.website && (
              <Quick
                href={record.website}
                icon={<Globe />}
                label="Open Website"
              />
            )}
            {record.facebookUrl && (
              <Quick
                href={record.facebookUrl}
                icon={<Facebook />}
                label="Facebook"
              />
            )}
            {record.instagramUrl && (
              <Quick
                href={record.instagramUrl}
                icon={<Instagram />}
                label="Instagram"
              />
            )}
            {record.googleBusinessUrl && (
              <Quick
                href={record.googleBusinessUrl}
                icon={<MapPin />}
                label="Google Business"
              />
            )}
            <Button
              size="lg"
              variant={record.freebieDelivered ? "secondary" : "default"}
              className="h-14 rounded-2xl"
              onClick={markFreebie}
            >
              <Gift className="mr-2" />{" "}
              {record.freebieDelivered
                ? "Freebie delivered"
                : "Mark freebie delivered"}
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-2xl"
            >
              <Link to={`/contacts/${record.id}`}>
                <CalendarPlus className="mr-2" /> Update follow-up
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Info
            title="Follow-up"
            value={
              record.followUpDate
                ? format(parseISO(record.followUpDate), "MMMM d, yyyy")
                : "Not scheduled"
            }
          />
          <Info
            title="Referral count"
            value={`${record.referralCount ?? 0}`}
            icon={<Star className="text-amber-500" />}
          />
          <Info
            title="Preferred contact"
            value={record.preferredContactMethod ?? "Not set"}
          />
        </div>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Relationship notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Detail
              label="Office visited"
              value={
                record.officeVisitedDate
                  ? format(parseISO(record.officeVisitedDate), "MMMM d, yyyy")
                  : "Not recorded"
              }
            />
            <Detail label="Gift/freebie left" value={record.giftFreebieLeft} />
            <Detail
              label="Brokerage office address"
              value={record.brokerageOfficeAddress}
            />
            <Detail label="Notes" value={record.notes ?? record.background} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Quick = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Button
    asChild
    size="lg"
    variant="outline"
    className="h-14 rounded-2xl justify-start"
  >
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </a>
  </Button>
);
const Info = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <Card className="rounded-3xl border-0 shadow-sm">
    <CardContent className="p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-950">
        {icon}
        {value}
      </p>
    </CardContent>
  </Card>
);
const Detail = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-1 whitespace-pre-wrap text-slate-950">{value || "—"}</p>
  </div>
);
