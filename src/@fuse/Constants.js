// v2.1 - image URLs corrected
export const URL_SITE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? "http://localhost:3002/" 
    : (process.env.REACT_APP_API_URL || "https://boopursal-backend.vercel.app/");
export const FRONT_URL = "https://www.boopursal.com";

/**
 * Smart image URL builder.
 * - If `url` is already absolute (starts with http/https), return it as-is.
 * - Otherwise, prepend URL_SITE and the optional subfolder (e.g. "/images/produits/").
 *
 * Usage:
 *   getImageUrl(item.url)                      // absolute or relative
 *   getImageUrl(item.url, "/images/produits/") // force subfolder for relative paths
 */
export const getImageUrl = (url, subfolder = '') => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = URL_SITE.endsWith('/') ? URL_SITE.slice(0, -1) : URL_SITE;
    const folder = subfolder ? (subfolder.startsWith('/') ? subfolder : '/' + subfolder) : '';
    const path = url.startsWith('/') ? url : '/' + url;
    return `${base}${folder}${path}`;
};
export const LOCAL_CURRENCY = "MAD";
export const LOCAL_TVA = 0.2;
export const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
