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
    let cleanUrl = typeof url === 'string' ? url.trim() : String(url).trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
    
    const base = URL_SITE.endsWith('/') ? URL_SITE.slice(0, -1) : URL_SITE;
    
    let folder = subfolder ? subfolder.trim() : '';
    if (folder && !folder.startsWith('/')) folder = '/' + folder;
    if (folder && folder.endsWith('/')) folder = folder.slice(0, -1);
    
    let path = cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;

    if (folder && path) {
        const folderParts = folder.split('/').filter(Boolean);
        const pathParts = path.split('/').filter(Boolean);
        if (folderParts.length > 0 && pathParts.length > 0) {
            if (folderParts[folderParts.length - 1] === pathParts[0]) {
                folderParts.pop();
                folder = folderParts.length > 0 ? '/' + folderParts.join('/') : '';
            }
        }
    }
    
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
