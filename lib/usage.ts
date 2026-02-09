const STORAGE_KEY = 'cvsnap_usage';

const TIER_LIMITS: Record<Tier, number> = {
  free: 2,
  starter: 10,
  pro: 50,
};

export type Tier = 'free' | 'starter' | 'pro';

interface UsageData {
  uses: number;
  tier: Tier;
}

// NIS payments (Hebrew users + English users in Israel)
export const GROW_LINKS = {
  starter: 'GROW_LINK_STARTER_NIS',
  pro: 'GROW_LINK_PRO_NIS',
};

// USD payments (English users outside Israel)
export const TRANZILA_LINKS = {
  starter: 'TRANZILA_LINK_STARTER_USD',
  pro: 'TRANZILA_LINK_PRO_USD',
};

export const PRICES = {
  nis: { starter: '₪35', pro: '₪69' },
  usd: { starter: '$9', pro: '$19' },
};

export function isIsraeliLocale(): boolean {
  if (typeof window === 'undefined') return false;
  const lang = navigator.language || '';
  return lang.startsWith('he') || lang.includes('IL');
}

function getUsageData(): UsageData {
  if (typeof window === 'undefined') {
    return { uses: 0, tier: 'free' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { uses: 0, tier: 'free' };
    return JSON.parse(raw);
  } catch {
    return { uses: 0, tier: 'free' };
  }
}

function saveUsageData(data: UsageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRemainingUses(): number {
  const data = getUsageData();
  const limit = TIER_LIMITS[data.tier];
  return Math.max(0, limit - data.uses);
}

export function getTier(): Tier {
  return getUsageData().tier;
}

export function getTierLimit(): number {
  const data = getUsageData();
  return TIER_LIMITS[data.tier];
}

export function canProcess(): boolean {
  return getRemainingUses() > 0;
}

export function incrementUsage(): void {
  const data = getUsageData();
  data.uses += 1;
  saveUsageData(data);
}

export function applyPurchase(tier: 'starter' | 'pro'): void {
  const data = getUsageData();
  data.tier = tier;
  data.uses = 0;
  saveUsageData(data);
}
