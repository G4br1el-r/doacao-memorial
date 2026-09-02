export const SITE = {
  url: "https://memorialredentorista.com.br",
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Memorial Redentorista",
  title:
    process.env.NEXT_PUBLIC_SITE_TITLE ?? "Doação - Memorial Redentorista.",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "Sua doação mantém viva esta missão de fé, evangelização e caridade.",
  shareTitle: process.env.NEXT_PUBLIC_SHARE_TITLE ?? "De algo maior",
} as const;
