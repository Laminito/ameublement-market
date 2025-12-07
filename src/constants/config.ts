export const KREDIKA_CONFIG = {
  baseURL: 'http://localhost:7575/api/v1',
  clientId: 'pk_6c5c0cba8e854dac',
  clientSecret: 'kred_K1z5gceu7zdLAAnyaZF4fwROppp',
};

export const INTEREST_RATES: Record<number, number> = {
  1: 0.01,   // 1% pour 1 mois
  2: 0.02,   // 2% pour 2 mois
  3: 0.05,   // 5% pour 3 mois
  4: 0.06,   // 6% pour 4 mois
  5: 0.07,   // 7% pour 5 mois
  6: 0.08,   // 8% pour 6 mois
};

export const DELIVERY_FEE = 5000; // 5000 FCFA
export const ASSEMBLY_FEE = 10000; // 10000 FCFA
export const TAX_RATE = 0.18; // 18% TVA
