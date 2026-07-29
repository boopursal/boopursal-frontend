export function getTranslatedField(item, field, currentLang) {
    if (!item) return '';
    // If language is French, return the original field since French is default
    if (currentLang === 'fr') return item[field] || '';
    
    // Otherwise look for field_lang (e.g. name_ar, titre_en)
    const translatedField = `${field}_${currentLang}`;
    
    // Return the translated field if it exists and is not null/empty, otherwise fallback to the default field
    return item[translatedField] || item[field] || '';
}
