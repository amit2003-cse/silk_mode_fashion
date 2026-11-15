export const CLIENT_PHONE = "7359345438";
export const WHATSAPP_COUNTRY_CODE = "91";
export const BRAND_NAME = "Silk Mode Fashion";

export interface WhatsAppProductParams {
  name: string;
  price: number;
  category?: string;
  code?: string;
  color?: string;
  productUrl?: string;
}

/**
 * Generate direct WhatsApp chat URL with pre-filled message
 */
export function getProductWhatsAppUrl(product: WhatsAppProductParams): string {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const message = `Namaste ${BRAND_NAME}! 🙏
I am interested in this saree:

*Product:* ${product.name}
*Price:* ${formattedPrice}
${product.category ? `*Category:* ${product.category}\n` : ""}${product.color ? `*Color / Shade:* ${product.color}\n` : ""}${product.code ? `*Code:* ${product.code}\n` : ""}${product.productUrl ? `*Link:* ${product.productUrl}\n` : ""}
Please share more details, fabric quality, and real photos/videos on WhatsApp. Thank you!`;

  return `https://wa.me/${WHATSAPP_COUNTRY_CODE}${CLIENT_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate general WhatsApp enquiry URL
 */
export function getGeneralWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || `Namaste ${BRAND_NAME}! 🙏\nI would like to explore your latest saree collections. Please assist me.`;
  return `https://wa.me/${WHATSAPP_COUNTRY_CODE}${CLIENT_PHONE}?text=${encodeURIComponent(message)}`;
}
