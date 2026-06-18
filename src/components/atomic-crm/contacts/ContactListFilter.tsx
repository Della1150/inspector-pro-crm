import { addDays, startOfToday } from "date-fns";
import { CalendarClock, Gift, Phone, Star, Users } from "lucide-react";
import { ToggleFilterButton } from "@/components/admin/toggle-filter-button";
import { FilterCategory } from "../filters/FilterCategory";
import { ResponsiveFilters } from "../misc/ResponsiveFilters";
import { useIsMobile } from "@/hooks/use-mobile";

export const ContactListFilter = () => {
  const isMobile = useIsMobile();
  const size = isMobile ? "lg" : undefined;
  return (
    <ResponsiveFilters
      searchInput={{
        placeholder: "Search realtor name, brokerage, email, or phone",
      }}
    >
      <FilterCategory label="Follow-up date" icon={<CalendarClock />}>
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Overdue"
          value={{
            "followUpDate@lt": startOfToday().toISOString().slice(0, 10),
          }}
          size={size}
        />
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Due next 7 days"
          value={{
            "followUpDate@gte": startOfToday().toISOString().slice(0, 10),
            "followUpDate@lte": addDays(startOfToday(), 7)
              .toISOString()
              .slice(0, 10),
          }}
          size={size}
        />
      </FilterCategory>
      <FilterCategory label="Referral count" icon={<Star />}>
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Has referrals"
          value={{ "referralCount@gt": 0 }}
          size={size}
        />
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="5+ referrals"
          value={{ "referralCount@gte": 5 }}
          size={size}
        />
      </FilterCategory>
      <FilterCategory label="Freebie delivered" icon={<Gift />}>
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Delivered"
          value={{ freebieDelivered: true }}
          size={size}
        />
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Not delivered"
          value={{ freebieDelivered: false }}
          size={size}
        />
      </FilterCategory>
      <FilterCategory label="Preferred contact" icon={<Phone />}>
        {["Phone", "Email", "Text", "Office visit"].map((method) => (
          <ToggleFilterButton
            key={method}
            className="w-auto md:w-full justify-between h-10 md:h-8"
            label={method}
            value={{ preferredContactMethod: method }}
            size={size}
          />
        ))}
      </FilterCategory>
      <FilterCategory label="Brokerage" icon={<Users />}>
        <ToggleFilterButton
          className="w-auto md:w-full justify-between h-10 md:h-8"
          label="Has brokerage"
          value={{ "brokerage@neq": "" }}
          size={size}
        />
      </FilterCategory>
    </ResponsiveFilters>
  );
};
export const ContactListFilterSummary = () => null;
