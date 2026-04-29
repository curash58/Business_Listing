import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export const CATEGORY_OPTIONS = ['Retail', 'Food & Drink', 'Services'] as const;

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export const CATEGORY_STYLES: Record<CategoryOption, { bg: string; text: string }> = {
  Retail: { bg: '#e0f2fe', text: '#075985' },
  'Food & Drink': { bg: '#dcfce7', text: '#166534' },
  Services: { bg: '#f3e8ff', text: '#6b21a8' },
};

export type Listing = {
  id: string;
  name: string;
  category: CategoryOption;
  shortDesc: string;
};

type ListingsContextType = {
  listings: Listing[];
  isHydrated: boolean;
  addListing: (listing: Omit<Listing, 'id'>) => void;
};

const STORAGE_KEY = 'listings';

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

async function readPersistedListings() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function writePersistedListings(listings: Listing[]) {
  const payload = JSON.stringify(listings);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Non-fatal: keep app usable even if persistence is unavailable.
  }
}

export function ListingsProvider({ children }: PropsWithChildren) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const raw = await readPersistedListings();
        if (raw) {
          setListings(JSON.parse(raw) as Listing[]);
        }
      } finally {
        setIsHydrated(true);
      }
    };

    void loadListings();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void writePersistedListings(listings);
  }, [isHydrated, listings]);

  const value = useMemo<ListingsContextType>(
    () => ({
      listings,
      isHydrated,
      addListing: (listingInput) => {
        const listing: Listing = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          ...listingInput,
        };
        setListings((prev) => [listing, ...prev]);
      },
    }),
    [isHydrated, listings]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used inside ListingsProvider');
  }
  return context;
}
