/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors:{
            // Matcha Cream & Milk Honey palette with beautiful blending colors
            'background': '#FDFBF7', // Warm off-white
            'surface': '#F1E8C7', // Milk Honey
            'card': '#FFFFFF', // Clean white cards
            'border': '#E8DCC4', // Soft border
            'primary': '#9CA763', // Matcha Cream
            'primary-dark': '#7A8A4F', // Darker matcha
            'primary-light': '#B8C283', // Lighter matcha
            'accent': '#D4A574', // Warm honey accent
            'accent-dark': '#C19660', // Darker honey
            'accent-light': '#E2B488', // Lighter honey
            'sage': '#87A96B', // Soft sage green
            'cream': '#F5E6D3', // Warm cream
            'terracotta': '#E2725B', // Soft terracotta
            'dusty-rose': '#D4A5A5', // Dusty rose
            'moss': '#8A9A5B', // Moss green
            'text-primary': '#2C1810', // Warm dark text
            'text-secondary': '#5C4033', // Medium brown text
            'text-muted': '#8B7355', // Light brown text
            'success': '#87A96B', // Sage for success
            'warning': '#D4A574', // Honey for warnings
            'error': '#E2725B', // Terracotta for errors
         }
      },
   },
   plugins: [],
};
