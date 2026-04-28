// ─── All 36 Official Districts of Maharashtra ─────────────────────────────────
export const ALL_DISTRICTS = [
  // Konkan Division
  { name: 'Mumbai City',     slug: 'mumbai-city',     region: 'Konkan',               division: 'Konkan',                      headquarters: 'Mumbai' },
  { name: 'Mumbai Suburban', slug: 'mumbai-suburban', region: 'Konkan',               division: 'Konkan',                      headquarters: 'Bandra' },
  { name: 'Thane',           slug: 'thane',           region: 'Konkan',               division: 'Konkan',                      headquarters: 'Thane' },
  { name: 'Palghar',         slug: 'palghar',         region: 'Konkan',               division: 'Konkan',                      headquarters: 'Palghar' },
  { name: 'Raigad',          slug: 'raigad',          region: 'Konkan',               division: 'Konkan',                      headquarters: 'Alibag' },
  { name: 'Ratnagiri',       slug: 'ratnagiri',       region: 'Konkan',               division: 'Konkan',                      headquarters: 'Ratnagiri' },
  { name: 'Sindhudurg',      slug: 'sindhudurg',      region: 'Konkan',               division: 'Konkan',                      headquarters: 'Oros' },
  // Nashik Division
  { name: 'Nashik',          slug: 'nashik',          region: 'North Maharashtra',    division: 'Nashik',                      headquarters: 'Nashik' },
  { name: 'Dhule',           slug: 'dhule',           region: 'North Maharashtra',    division: 'Nashik',                      headquarters: 'Dhule' },
  { name: 'Nandurbar',       slug: 'nandurbar',       region: 'North Maharashtra',    division: 'Nashik',                      headquarters: 'Nandurbar' },
  { name: 'Jalgaon',         slug: 'jalgaon',         region: 'North Maharashtra',    division: 'Nashik',                      headquarters: 'Jalgaon' },
  { name: 'Ahilyanagar',     slug: 'ahilyanagar',     region: 'Western Maharashtra',  division: 'Nashik',                      headquarters: 'Ahilyanagar' },
  // Pune Division
  { name: 'Pune',            slug: 'pune',            region: 'Western Maharashtra',  division: 'Pune',                        headquarters: 'Pune' },
  { name: 'Satara',          slug: 'satara',          region: 'Western Maharashtra',  division: 'Pune',                        headquarters: 'Satara' },
  { name: 'Sangli',          slug: 'sangli',          region: 'Western Maharashtra',  division: 'Pune',                        headquarters: 'Sangli' },
  { name: 'Solapur',         slug: 'solapur',         region: 'Western Maharashtra',  division: 'Pune',                        headquarters: 'Solapur' },
  { name: 'Kolhapur',        slug: 'kolhapur',        region: 'Western Maharashtra',  division: 'Pune',                        headquarters: 'Kolhapur' },
  // Chhatrapati Sambhajinagar Division (Marathwada)
  { name: 'Chhatrapati Sambhajinagar', slug: 'chhatrapati-sambhajinagar', region: 'Marathwada', division: 'Chhatrapati Sambhajinagar', headquarters: 'Chhatrapati Sambhajinagar' },
  { name: 'Jalna',           slug: 'jalna',           region: 'Marathwada',           division: 'Chhatrapati Sambhajinagar',   headquarters: 'Jalna' },
  { name: 'Beed',            slug: 'beed',            region: 'Marathwada',           division: 'Chhatrapati Sambhajinagar',   headquarters: 'Beed' },
  { name: 'Dharashiv',       slug: 'dharashiv',       region: 'Marathwada',           division: 'Chhatrapati Sambhajinagar',   headquarters: 'Dharashiv' },
  // Latur Division (Marathwada)
  { name: 'Latur',           slug: 'latur',           region: 'Marathwada',           division: 'Latur',                       headquarters: 'Latur' },
  { name: 'Nanded',          slug: 'nanded',          region: 'Marathwada',           division: 'Latur',                       headquarters: 'Nanded' },
  { name: 'Hingoli',         slug: 'hingoli',         region: 'Marathwada',           division: 'Latur',                       headquarters: 'Hingoli' },
  { name: 'Parbhani',        slug: 'parbhani',        region: 'Marathwada',           division: 'Latur',                       headquarters: 'Parbhani' },
  // Amravati Division (Vidarbha)
  { name: 'Amravati',        slug: 'amravati',        region: 'Vidarbha',             division: 'Amravati',                    headquarters: 'Amravati' },
  { name: 'Akola',           slug: 'akola',           region: 'Vidarbha',             division: 'Amravati',                    headquarters: 'Akola' },
  { name: 'Washim',          slug: 'washim',          region: 'Vidarbha',             division: 'Amravati',                    headquarters: 'Washim' },
  { name: 'Buldhana',        slug: 'buldhana',        region: 'Vidarbha',             division: 'Amravati',                    headquarters: 'Buldhana' },
  { name: 'Yavatmal',        slug: 'yavatmal',        region: 'Vidarbha',             division: 'Amravati',                    headquarters: 'Yavatmal' },
  // Nagpur Division (Vidarbha)
  { name: 'Nagpur',          slug: 'nagpur',          region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Nagpur' },
  { name: 'Wardha',          slug: 'wardha',          region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Wardha' },
  { name: 'Chandrapur',      slug: 'chandrapur',      region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Chandrapur' },
  { name: 'Gadchiroli',      slug: 'gadchiroli',      region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Gadchiroli' },
  { name: 'Gondia',          slug: 'gondia',          region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Gondia' },
  { name: 'Bhandara',        slug: 'bhandara',        region: 'Vidarbha',             division: 'Nagpur',                      headquarters: 'Bhandara' },
] as const;

// Just the names — used in dropdowns
export const DISTRICT_NAMES = ALL_DISTRICTS.map(d => d.name);

// Legacy DISTRICTS array kept for backward compatibility
export const DISTRICTS = ALL_DISTRICTS.map(d => ({
  name: d.name, slug: d.slug, region: d.region,
}));

// ─── Royal Rajput Clans ───────────────────────────────────────────────────────
export const CLANS = [
  'Rathore', 'Sisodiya', 'Chauhan', 'Bhonsle', 'Tanwar', 'Parmar', 'Solanki',
  'Kachwaha', 'Gahlot', 'Jadeja', 'Bhati', 'Tomar', 'Chandel', 'Chandravanshi',
  'Nikumbh', 'Guhilot', 'Haihaya', 'Chudasama', 'Vaghela', 'Jhala', 'Makwana',
  'Zala', 'Gohil', 'Sengar', 'Bundela', 'Bhadauria', 'Sarvaiya', 'Pundir',
  'Katoch', 'Dogra', 'Bagri', 'Rajguru', 'Rao', 'Panwar', 'Thakor', 'Deora',
  'Other',
] as const;

// ─── Article categories ───────────────────────────────────────────────────────
export const ARTICLE_CATEGORIES = [
  { value: 'history',       label: 'History' },
  { value: 'culture',       label: 'Culture' },
  { value: 'heritage',      label: 'Heritage' },
  { value: 'traditions',    label: 'Traditions' },
  { value: 'personalities', label: 'Personalities' },
  { value: 'achievements',  label: 'Achievements' },
  { value: 'news',          label: 'News' },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  GUEST:     'guest',
  USER:      'user',
  MODERATOR: 'moderator',
  ADMIN:     'admin',
} as const;

export const REQUEST_STATUS = {
  PENDING:            'pending',
  APPROVED:           'approved',
  REJECTED:           'rejected',
  REVISION_REQUESTED: 'revision_requested',
} as const;

export const ITEMS_PER_PAGE = 12;
