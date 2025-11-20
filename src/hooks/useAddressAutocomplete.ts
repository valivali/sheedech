import { useState, useCallback, useMemo, RefObject } from 'react';

/**
 * Custom hook for address autocomplete functionality using Geoapify API.
 *
 * Features:
 * - Debounced search (500ms by default)
 * - Real-time suggestions as user types
 * - Handles focus/blur events for dropdown visibility
 * - Automatic form field updates on suggestion selection
 *
 * @param options Configuration options
 * @param options.debounceMs Debounce delay in milliseconds (default: 500)
 * @param options.minLength Minimum characters before search (default: 3)
 * @param options.limit Maximum number of suggestions (default: 5)
 * @param options.setValue Function to set the value of the form field
 * @param options.fieldName Name of the form field to update (e.g. 'address')
 * @param options.onSuggestionSelect Optional callback when suggestion is selected
 *
 * @returns Object with suggestions state and event handlers
 */
export interface AddressSuggestion {
  properties: {
    formatted: string;
    lon: number;
    lat: number;
    confidence: number;
    confidence_city_level: number;
    confidence_street_level: number;
    postcode?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface UseAddressAutocompleteOptions {
  debounceMs?: number;
  minLength?: number;
  limit?: number;
  setValue?: (field: any, value: string) => void;
  fieldName?: string;
  onSuggestionSelect?: (suggestion: AddressSuggestion) => void;
}

interface UseAddressAutocompleteReturn {
  suggestions: AddressSuggestion[];
  showSuggestions: boolean;
  isLoadingSuggestions: boolean;
  handleAddressChange: (value: string) => void;
  handleSuggestionSelect: (suggestion: AddressSuggestion) => void;
  handleAddressFocus: () => void;
  handleAddressBlur: () => void;
}

export const useAddressAutocomplete = (
  options: UseAddressAutocompleteOptions = {}
): UseAddressAutocompleteReturn => {
  const {
    debounceMs = 500,
    minLength = 3,
    limit = 5,
    setValue,
    fieldName,
    onSuggestionSelect,
  } = options;

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (text: string): Promise<AddressSuggestion[]> => {
    if (!text || text.length < minLength) {
      return [];
    }

    if (!process.env.NEXT_PUBLIC_GEOAPIFY_KEY) {
      console.warn('NEXT_PUBLIC_GEOAPIFY_KEY is not set');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text
        )}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      return data.features || data.results || [];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  }, [minLength, limit]);

  const debouncedSearch = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (text: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (text.length >= minLength) {
            setIsLoadingSuggestions(true);
            const newSuggestions = await fetchSuggestions(text);
            setSuggestions(newSuggestions);
            setIsLoadingSuggestions(false);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }, debounceMs);
      };
    },
    [fetchSuggestions, debounceMs, minLength]
  );

  const handleAddressChange = useCallback((value: string) => {
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSuggestionSelect = useCallback((suggestion: AddressSuggestion) => {
    // Update the form value using react-hook-form's setValue
    if (setValue && fieldName && suggestion.properties?.formatted) {
      setValue(fieldName, suggestion.properties.formatted);
    }
    setShowSuggestions(false);
    setSuggestions([]);

    // Call the optional callback
    onSuggestionSelect?.(suggestion);
  }, [setValue, fieldName, onSuggestionSelect]);

  const handleAddressFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleAddressBlur = useCallback(() => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  return {
    suggestions,
    showSuggestions,
    isLoadingSuggestions,
    handleAddressChange,
    handleSuggestionSelect,
    handleAddressFocus,
    handleAddressBlur,
  };
};
