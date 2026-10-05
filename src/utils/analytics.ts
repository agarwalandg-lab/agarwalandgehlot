// Custom event tracker for Ivory County microsite and lead interactions

export type TrackingEvent =
  | 'modal_open'
  | 'modal_close'
  | 'lead_submission'
  | 'brochure_download'
  | 'price_request'
  | 'floorplan_view'
  | 'site_visit_request'
  | 'whatsapp_click'
  | 'phone_call_click'
  | 'amenity_tab_change'
  | 'gallery_view';

export const trackEvent = (event: TrackingEvent, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Log in development
    if (import.meta.env?.DEV) {
      console.log(`[Analytics Event: ${event}]`, properties);
    }

    // Google Tag Manager / Analytics dataLayer push if available
    try {
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: `ivory_${event}`,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Fail silently
    }
  }
};

export const getUtmParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const searchParams = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const val = searchParams.get(key);
    if (val) utm[key] = val;
  });

  return utm;
};
