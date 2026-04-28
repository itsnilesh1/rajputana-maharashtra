// Strip MongoDB operators (prevents NoSQL injection)
function stripMongoOperators(value: string): string {
  return value.replace(/[${}]/g, '');
}

// Strip HTML tags (prevents XSS stored in DB)
function stripHTML(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return stripHTML(stripMongoOperators(value.trim())).slice(0, maxLength);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      result[key] = stripHTML(stripMongoOperators(value.trim()));
    } else if (Array.isArray(value)) {
      result[key] = value.map(v =>
        typeof v === 'string' ? stripHTML(stripMongoOperators(v.trim())) : v
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}
