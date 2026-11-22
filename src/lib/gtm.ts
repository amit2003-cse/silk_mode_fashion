export const GTM_ID = "GTM-TLCQD4T7";

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

export interface TrackWhatsAppParams {
  button_location: string;
  product_name?: string;
  product_id?: string;
  category?: string;
  price?: number;
}

export function trackWhatsAppClick({
  button_location,
  product_name,
  product_id,
  category,
  price,
}: TrackWhatsAppParams) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "whatsapp_click",
      button_location,
      page_url: window.location.href,
      ...(product_name && { product_name }),
      ...(product_id && { product_id }),
      ...(category && { category }),
      ...(price !== undefined && { price }),
    });
  }
}
