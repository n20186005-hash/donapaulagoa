/**
 * Single-source-of-truth entity facts for Dona Paula View Point.
 *
 * Every SEO-critical string (canonical domain, official full name, common short name,
 * city / state / country, postal code, geo coordinates, Google Maps share + embed URLs,
 * nearby landmarks and the official tourism portal) is defined here once and consumed by
 * the layout, the JSON-LD builders and the page copy, so the entity stays consistent.
 */

/** Canonical production domain (no protocol, no trailing slash). */
export const DOMAIN_NAME = 'donapaulagoa.com';

/** Absolute site origin used for canonical / OG / JSON-LD URLs. */
export const SITE_ORIGIN = `https://${DOMAIN_NAME}`;

/** SEO site name: attraction name + city + travel guide. */
export const SITE_NAME = 'Dona Paula View Point Panaji — Travel Guide';

/** Appends the site name to sub-page titles. */
export function withSiteName(suffix: string): string {
	return `${suffix} | ${SITE_NAME}`;
}

// --- Entity -------------------------------------------------------------

/** Official full name as listed on Google Maps. */
export const ATTRACTION_FULL_NAME = 'Dona Paula View Point';

/** Common short name / the meaning carried by the domain. */
export const ATTRACTION_SHORT_NAME = 'Dona Paula Jetty';

/** Hindi / Marathi name as listed on Google Maps. */
export const ATTRACTION_LOCAL_NAME = 'डोना पाउला व्यू पॉइंट';

export const CITY_NAME = 'Panaji';
export const STATE_PROVINCE = 'Goa';
export const COUNTRY_NAME = 'India';
export const COUNTRY_CODE_2LETTER = 'IN';
export const POSTAL_CODE = '403004';

export const STREET_ADDRESS = 'Dona Paula Jetty Road, Dona Paula';
export const PLUS_CODE = 'FR23+65 Dona Paula Jetty, Goa, India';

export const LATITUDE = 15.45512766222106;
export const LONGITUDE = 73.79666298030841;

export const CATEGORY = 'Tourist attraction';

// --- Google Maps --------------------------------------------------------

/** Google Maps share short link (used for hasMap / sameAs and the “Open map” action). */
export const MAPS_SHARE_URL = 'https://maps.app.goo.gl/V25C3ovRDJkMbFJK6';

/** Google Maps embed src used by the location iframe. */
export const MAPS_EMBED_SRC =
	'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27399.503126676595!2d73.79666298030841!3d15.45512766222106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc72e8d006fb5%3A0x830d8e7a119709e!2sDona%20Paula%20View%20Point!5e1!3m2!1sen!2sin!4v1787621315277!5m2!1sen!2sin&hl=en&region=IN';

/** Google Maps search deep link (maps URL API). */
export const MAPS_SEARCH_URL =
	'https://www.google.com/maps/search/?api=1&query=Dona%20Paula%20Jetty%2C%20Road%2C%20Dona%20Paula%2C%20Panaji%20Goa%20403004%20India';

// --- Rating snapshot ----------------------------------------------------

/** Google Maps rating snapshot, synchronised September 2026. */
export const RATING_VALUE = 4.1;
export const RATING_COUNT = 50292;
export const RATING_SYNC = 'Google Maps listing, synchronised September 2026';

// --- Visitor-facing facts (subject to change) ---------------------------

export const OPENING_HOURS = '08:00–22:00';
export const LISTED_FEE = '₹50';
export const TYPICAL_VISIT_LENGTH = '45–60 minutes';

// --- Semantic cluster ---------------------------------------------------

export const NEARBY_LANDMARK_1 = 'Miramar Beach';
export const NEARBY_LANDMARK_2 = 'Lok Bhavan (Cabo Raj Niwas)';

/** Authoritative government portal used for outbound E-E-A-T links. */
export const GOVT_TOURISM_URL = 'https://www.goa.gov.in/';
export const GOVT_TOURISM_LABEL = 'Government of Goa — Official Tourism Portal';

// --- Assets -------------------------------------------------------------

export const HERO_IMAGE = '/images/hero.jpg';
export const OG_IMAGE = '/images/og-cover.jpg';

export function absoluteUrl(path: string): string {
	return new URL(path, SITE_ORIGIN).toString();
}
