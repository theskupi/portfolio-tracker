export interface BrandInfo {
  name: string;
  domain?: string;
  description?: string;
  longDescription?: string;
  logos?: Array<{
    type: string;
    theme: string;
    formats: Array<{
      src: string;
      format: string;
      size?: number;
    }>;
  }>;
  colors?: Array<{
    hex: string;
    type: string;
    brightness: number;
  }>;
  fonts?: Array<{
    name: string;
    type: string;
    origin: string;
  }>;
  images?: Array<{
    type: string;
    formats: Array<{
      src: string;
      format: string;
    }>;
  }>;
}

const BRANDFETCH_CACHE_KEY = "brandfetch-cache";
const CACHE_EXPIRY_DAYS = 30;

interface CachedBrandData {
  data: BrandInfo;
  timestamp: number;
}

interface BrandCache {
  [symbol: string]: CachedBrandData;
}

/**
 * Get brand info from localStorage cache
 */
function getBrandFromCache(symbol: string): BrandInfo | null {
  try {
    const cache = localStorage.getItem(BRANDFETCH_CACHE_KEY);
    if (!cache) return null;

    const brandCache: BrandCache = JSON.parse(cache);
    const cachedData = brandCache[symbol];

    if (!cachedData) return null;

    // Check if cache is expired (30 days)
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (now - cachedData.timestamp > expiryTime) {
      // Cache expired, remove it
      delete brandCache[symbol];
      localStorage.setItem(BRANDFETCH_CACHE_KEY, JSON.stringify(brandCache));
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error("Error reading from Brandfetch cache:", error);
    return null;
  }
}

/**
 * Save brand info to localStorage cache
 */
function saveBrandToCache(symbol: string, data: BrandInfo): void {
  try {
    const cache = localStorage.getItem(BRANDFETCH_CACHE_KEY);
    const brandCache: BrandCache = cache ? JSON.parse(cache) : {};

    brandCache[symbol] = {
      data,
      timestamp: Date.now(),
    };

    localStorage.setItem(BRANDFETCH_CACHE_KEY, JSON.stringify(brandCache));
  } catch (error) {
    console.error("Error saving to Brandfetch cache:", error);
  }
}

/**
 * Fetch brand information from Brandfetch API
 * Uses localStorage cache to avoid hitting the 100 requests/month quota
 */
export async function fetchBrandInfo(symbol: string): Promise<BrandInfo | null> {
  // Check cache first
  const cachedData = getBrandFromCache(symbol);
  if (cachedData) {
    console.log(`Using cached brand data for ${symbol}`);
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const response = await fetch(`/api/brandfetch/${symbol}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Brand not found for ${symbol}`);
        return null;
      }
      throw new Error(`Brandfetch API error: ${response.status}`);
    }

    const data: BrandInfo = await response.json();
    
    // Save to cache
    saveBrandToCache(symbol, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching brand info for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch brand information for multiple symbols
 * Returns a Map of symbol -> BrandInfo
 */
export async function fetchMultipleBrandInfo(
  symbols: string[]
): Promise<Map<string, BrandInfo>> {
  const brandMap = new Map<string, BrandInfo>();
  
  // Process symbols sequentially to avoid overwhelming the API
  for (const symbol of symbols) {
    const brandInfo = await fetchBrandInfo(symbol);
    if (brandInfo) {
      brandMap.set(symbol, brandInfo);
    }
    
    // Add a small delay between requests to be respectful to the API
    // Only delay if we actually made an API call (not from cache)
    const cachedData = getBrandFromCache(symbol);
    if (!cachedData && symbols.indexOf(symbol) < symbols.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return brandMap;
}

/**
 * Clear the entire Brandfetch cache
 */
export function clearBrandfetchCache(): void {
  try {
    localStorage.removeItem(BRANDFETCH_CACHE_KEY);
    console.log("Brandfetch cache cleared");
  } catch (error) {
    console.error("Error clearing Brandfetch cache:", error);
  }
}

/**
 * Get cache statistics
 */
export function getBrandfetchCacheStats(): {
  totalCached: number;
  symbols: string[];
} {
  try {
    const cache = localStorage.getItem(BRANDFETCH_CACHE_KEY);
    if (!cache) return { totalCached: 0, symbols: [] };

    const brandCache: BrandCache = JSON.parse(cache);
    const symbols = Object.keys(brandCache);

    return {
      totalCached: symbols.length,
      symbols,
    };
  } catch (error) {
    console.error("Error reading cache stats:", error);
    return { totalCached: 0, symbols: [] };
  }
}
