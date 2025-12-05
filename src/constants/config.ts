export const KREDIKA_CONFIG = {
  baseURL: 'http://localhost:7575/api/v1',
  clientId: 'pk_6c5c0cba8e854dac',
  clientSecret: 'kred_K1z5gceu7zdLAAnyaZF4fwROppp',
};

export const INTEREST_RATES: Record<number, number> = {
  3: 0.05,   // 5% pour 3 mois
  6: 0.08,   // 8% pour 6 mois
  9: 0.12,   // 12% pour 9 mois
  12: 0.15,  // 15% pour 12 mois
  18: 0.2,   // 20% pour 18 mois
  24: 0.25,  // 25% pour 24 mois
};

export const DELIVERY_FEE = 5000; // 5000 FCFA
export const ASSEMBLY_FEE = 10000; // 10000 FCFA
export const TAX_RATE = 0.18; // 18% TVA
