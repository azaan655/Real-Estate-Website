// Single source of truth for VESTA brand, contact details, social links and legal info
// Strictly ASCII only - escape non-ASCII characters

export const BRAND_NAME = "VESTA";
export const FOUNDED_YEAR = 2014;

export const ADDRESS_LINES = [
  "Plot 00, Road No. 00",
  "Banjara Hills, Hyderabad",
  "Telangana 500034"
];

export const PHONES = ["+91 00000 00000", "+91 00000 00001"];
export const CONTACT_PHONE = PHONES[0];

export const EMAILS = ["vip@vesta.example", "concierge@vesta.example"];
export const CONTACT_EMAIL = EMAILS[0];

export const WHATSAPP_NUMBER = "+91 00000 00000";

export const OFFICE_HOURS = "Mon \u2013 Sat: 9:00 AM \u2013 7:00 PM";

export const TAGLINE = "Curating Hyderabad\u2019s most distinguished residential and commercial addresses.";

export const DESCRIPTION = "Established in 2014, a trusted luxury real estate partner curating Hyderabad\u2019s most distinguished estates, villas, and prime commercial developments.";

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://facebook.com", icon: "Facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "Instagram" },
  { name: "YouTube", href: "https://youtube.com", icon: "Youtube" }
];

export interface NavLinkItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Properties", href: "/buy" },
  { label: "FAQ\u2019s", href: "/faqs" },
  { label: "Contact", href: "mailto:vip@vesta.example" }
];

export const SERVICE_LINKS: NavLinkItem[] = [
  { label: "Apartments", href: "/buy?type=Apartment" },
  { label: "Villas", href: "/buy?type=Villa" },
  { label: "Commercial", href: "/buy?type=Commercial" },
  { label: "Projects", href: "/buy" },
  { label: "Requirements", href: "/rent/share-requirement" }
];

export const LEGAL_LINKS: NavLinkItem[] = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" }
];

