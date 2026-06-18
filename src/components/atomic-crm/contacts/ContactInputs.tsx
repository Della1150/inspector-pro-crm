import { required } from "ra-core";
import { Separator } from "@/components/ui/separator";
import { BooleanInput } from "@/components/admin/boolean-input";
import { TextInput } from "@/components/admin/text-input";
import { SelectInput } from "@/components/admin/select-input";
import { DateInput } from "@/components/admin/date-input";
import { NumberInput } from "@/components/admin/number-input";
import { useIsMobile } from "@/hooks/use-mobile";

const preferredContactChoices = [
  { id: "Phone", name: "Phone" },
  { id: "Email", name: "Email" },
  { id: "Text", name: "Text" },
  { id: "Facebook", name: "Facebook" },
  { id: "Instagram", name: "Instagram" },
  { id: "Office visit", name: "Office visit" },
];

export const ContactInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="premium-panel p-4 md:p-6">
      <div className="mb-6 rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
          Inspector Pro CRM
        </p>
        <h2 className="text-2xl font-bold">Realtor relationship details</h2>
        <p className="text-sm text-slate-300">
          Capture the details you need before, during, and after office visits.
        </p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <section className="flex flex-1 flex-col gap-4">
          <h3 className="text-lg font-black text-slate-950">
            Realtor & brokerage
          </h3>
          <TextInput
            source="first_name"
            label="Realtor name"
            validate={required()}
            helperText={false}
          />
          <TextInput source="brokerage" label="Brokerage" helperText={false} />
          <TextInput source="title" label="Role / niche" helperText={false} />
          <TextInput
            source="brokerageOfficeAddress"
            label="Brokerage office address"
            multiline
            helperText={false}
          />
          <SelectInput
            source="preferredContactMethod"
            label="Preferred contact method"
            choices={preferredContactChoices}
            helperText={false}
          />
        </section>
        {!isMobile && <Separator orientation="vertical" />}
        <section className="flex flex-1 flex-col gap-4">
          <h3 className="text-lg font-black text-slate-950">
            Quick contact links
          </h3>
          <TextInput
            source="email"
            label="Email"
            type="email"
            helperText={false}
          />
          <TextInput
            source="phone"
            label="Phone"
            type="tel"
            helperText={false}
          />
          <TextInput
            source="website"
            label="Website"
            type="url"
            helperText={false}
          />
          <TextInput
            source="facebookUrl"
            label="Facebook URL"
            type="url"
            helperText={false}
          />
          <TextInput
            source="instagramUrl"
            label="Instagram URL"
            type="url"
            helperText={false}
          />
          <TextInput
            source="googleBusinessUrl"
            label="Google Business URL"
            type="url"
            helperText={false}
          />
        </section>
        {!isMobile && <Separator orientation="vertical" />}
        <section className="flex flex-1 flex-col gap-4">
          <h3 className="text-lg font-black text-slate-950">
            Referral follow-up
          </h3>
          <DateInput
            source="followUpDate"
            label="Follow-up date"
            helperText={false}
          />
          <DateInput
            source="officeVisitedDate"
            label="Office visited date"
            helperText={false}
          />
          <BooleanInput
            source="freebieDelivered"
            label="Freebie delivered"
            helperText={false}
          />
          <TextInput
            source="giftFreebieLeft"
            label="Gift/freebie left"
            helperText={false}
          />
          <NumberInput
            source="referralCount"
            label="Referral count"
            min={0}
            helperText={false}
          />
          <TextInput
            source="notes"
            label="Notes"
            multiline
            helperText={false}
          />
        </section>
      </div>
    </div>
  );
};

export const ContactStatusSelector = () => null;
