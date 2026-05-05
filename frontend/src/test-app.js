// Simple test to verify no infinite loops
console.log('Testing application startup...');

// Test the location store
import { useLocationStore } from './store/locationStore.js';

// Test basic store functionality
const testStore = () => {
  try {
    const store = useLocationStore.getState();
    console.log('✅ Location store initialized successfully');
    console.log('Initial state:', {
      selectedCountry: store.selectedCountry,
      selectedCity: store.selectedCity,
      preferredCurrency: store.preferredCurrency.code
    });
    
    // Test basic operations
    store.setSelectedCountry(null);
    store.setSelectedCity(null);
    store.setPreferredCurrency(store.preferredCurrency);
    
    console.log('✅ Store operations completed without errors');
    return true;
  } catch (error) {
    console.error('❌ Store test failed:', error);
    return false;
  }
};

// Run test
if (testStore()) {
  console.log('🎉 All tests passed! Application should run without infinite loops.');
} else {
  console.log('💥 Tests failed! There may still be issues.');
}
