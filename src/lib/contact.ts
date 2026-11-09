// Author: UKARAKAS | Date: 09.11.2026 | Phone and WhatsApp link helpers

/** "+90 544 211 82 86" or "0544 211 82 86" -> "905442118286" */
export const phoneDigits = (phone: string): string => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "90" + d.slice(1);
  if (d.length === 10 && d.startsWith("5")) d = "90" + d; // mobile number without country code
  return d;
};

export const telLink = (phone: string): string => `tel:+${phoneDigits(phone)}`;

export const whatsappLink = (phone: string, text?: string): string =>
  `https://wa.me/${phoneDigits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
