import {
  company as fakerCompany,
  internet,
  lorem,
  name,
  phone,
  random,
} from "faker/locale/en_US";

import { defaultNoteStatuses } from "../../../root/defaultConfiguration";
import { contactGender } from "../../../contacts/contactModel";
import type { Company, Contact } from "../../../types";
import type { Db } from "./types";
import { randomDate, weightedBoolean } from "./utils";

const maxContacts = {
  1: 1,
  10: 4,
  50: 12,
  250: 25,
  500: 50,
};

const getRandomContactDetailsType = () =>
  random.arrayElement(["Work", "Home", "Other"]) as "Work" | "Home" | "Other";

export const generateContacts = (db: Db, size = 500): Required<Contact>[] => {
  const nbAvailblePictures = 223;
  let numberOfContacts = 0;

  return Array.from(Array(size).keys()).map((id) => {
    const has_avatar =
      weightedBoolean(25) && numberOfContacts < nbAvailblePictures;
    const gender = random.arrayElement(contactGender).value;
    const first_name = name.firstName(gender as any);
    const last_name = name.lastName();
    const email_jsonb = [
      {
        email: internet.email(first_name, last_name),
        type: getRandomContactDetailsType(),
      },
    ];
    const phone_jsonb = [
      {
        number: phone.phoneNumber(),
        type: getRandomContactDetailsType(),
      },
      {
        number: phone.phoneNumber(),
        type: getRandomContactDetailsType(),
      },
    ];
    const avatar = {
      src: has_avatar
        ? "https://marmelab.com/posters/avatar-" +
          (223 - numberOfContacts) +
          ".jpeg"
        : undefined,
    };
    const title = "Realtor";
    const brokerage = `${fakerCompany.companyName()} Realty`;

    if (has_avatar) {
      numberOfContacts++;
    }

    // choose company with people left to know
    let company: Company;
    do {
      company = random.arrayElement(db.companies);
    } while ((company.nb_contacts ?? 0) >= maxContacts[company.size]);
    company.nb_contacts = (company.nb_contacts ?? 0) + 1;

    const first_seen = randomDate(new Date(company.created_at)).toISOString();
    const last_seen = first_seen;
    const createdAt = first_seen;

    return {
      id,
      first_name,
      last_name,
      gender,
      title: title.charAt(0).toUpperCase() + title.substr(1),
      company_id: company.id,
      company_name: brokerage,
      brokerage,
      email_jsonb,
      phone_jsonb,
      background: lorem.sentence(),
      notes: lorem.sentence(),
      phone: phone_jsonb[0].number,
      email: email_jsonb[0].email,
      website: internet.url(),
      facebookUrl: `https://facebook.com/${first_name}.${last_name}`,
      instagramUrl: `https://instagram.com/${first_name.toLowerCase()}${last_name.toLowerCase()}`,
      googleBusinessUrl: internet.url(),
      followUpDate: randomDate(new Date()).toISOString().slice(0, 10),
      freebieDelivered: weightedBoolean(35),
      referralCount: random.number({ min: 0, max: 12 }),
      officeVisitedDate: randomDate(new Date(company.created_at))
        .toISOString()
        .slice(0, 10),
      giftFreebieLeft: random.arrayElement([
        "Coffee cards",
        "Donuts",
        "Inspection checklist",
        "Branded pens",
        "None yet",
      ]),
      preferredContactMethod: random.arrayElement([
        "Phone",
        "Email",
        "Text",
        "Office visit",
        "Instagram",
      ]),
      brokerageOfficeAddress: `${random.number({ min: 100, max: 9999 })} Main St`,
      createdAt,
      updatedAt: last_seen,
      acquisition: random.arrayElement(["inbound", "outbound"]),
      avatar,
      first_seen: first_seen,
      last_seen: last_seen,
      has_newsletter: weightedBoolean(30),
      status: random.arrayElement(defaultNoteStatuses).value,
      tags: random
        .arrayElements(db.tags, random.arrayElement([0, 0, 0, 1, 1, 2]))
        .map((tag) => tag.id), // finalize
      sales_id: company.sales_id!,
      nb_tasks: 0,
      linkedin_url: null,
    };
  });
};
