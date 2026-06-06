// js/features.js

// 1. Frontend Coupon Database (Bypasses backend validation)
const COUPONS = {
    "WELCOME10": 0.10, // 10% Off
    "NEXUS20": 0.20,   // 20% Off
    "JEEMAIN": 0.50    // 50% Off (Special discount)
};

// 2. Global Dark Mode Toggle Logic
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Apply theme instantly on page load before elements render to prevent flashing
if (localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
