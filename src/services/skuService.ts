import { getApiUrl } from './api';
import AuthService from './authService';

interface GenerateSKURequest {
  productTypeCode: string;
  categorySlug: string;
  variant?: string;
}

interface GenerateSKUResponse {
  sku: string;
  productType: string;
  category: string;
  variant?: string;
}

class SKUService {
  /**
   * Generate SKU automatically
   */
  static async generateSKU(params: GenerateSKURequest): Promise<string> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl('/generate-sku'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate SKU');
      }

      const data = await response.json();
      return data.data.sku;
    } catch (error) {
      console.error('Generate SKU error:', error);
      throw error;
    }
  }

  /**
   * Generate SKU locally (fallback if API fails)
   * Format: {TYPE_CODE}-{CATEGORY}-{VARIANT}-{TIMESTAMP}
   */
  static generateSKULocally(
    productTypeCode: string,
    categorySlug: string,
    variant?: string
  ): string {
    const timestamp = Math.floor(Math.random() * 10000);
    const parts = [
      productTypeCode.toUpperCase(),
      categorySlug.toUpperCase(),
      variant ? variant.toUpperCase().replace(/\s+/g, '-') : '',
      timestamp,
    ].filter(Boolean);

    return parts.join('-');
  }
}

export default SKUService;
export type { GenerateSKURequest, GenerateSKUResponse };
