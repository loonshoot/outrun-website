// Pricing calculator functionality
document.addEventListener('DOMContentLoaded', function() {
  const syncSlider = document.getElementById('syncSlider');
  const syncCount = document.getElementById('syncCount');
  const pricingPlans = document.querySelectorAll('.pricing-plan');

  // Updated sync values starting from 200 (free tier)
  const syncValues = [200, 500, 1000, 2500, 5000, 10000, 25000];
  const syncLabels = ['200', '500', '1K', '2.5K', '5K', '10K', '25K+'];

  let pricingConfig = null;

  // Load pricing configuration
  async function loadPricingConfig() {
    try {
      const response = await fetch('/assets/js/pricing-config.json');
      pricingConfig = await response.json();
      updatePricing(); // Initialize pricing once config is loaded
    } catch (error) {
      console.error('Failed to load pricing config:', error);
    }
  }

  function calculatePrice(planKey, syncs, isYearly = false) {
    if (!pricingConfig) return 0;
    
    const plan = pricingConfig.plans[planKey];
    const freeTierSyncs = pricingConfig.freeTier.syncs;
    
    if (plan.customPricing && syncs > freeTierSyncs) return 'Custom';
    
    // Find the index of the current sync level
    const syncIndex = pricingConfig.syncLevels.indexOf(syncs);
    if (syncIndex === -1) return 0; // Invalid sync level
    
    // Calculate billable units: syncs - free tier
    const units = Math.max(0, syncs - freeTierSyncs);
    
    // Get the unit rate for this tier and calculate price
    const unitRate = plan.unitRates[syncIndex];
    const monthlyPrice = units * unitRate;
    
    // Apply yearly discount if needed
    return isYearly ? (monthlyPrice * 0.8) : monthlyPrice;
  }

  function formatPrice(price) {
    if (price === 'Custom') return 'Custom';
    if (price === 0) return '$0';
    if (price < 1) return '$' + price.toFixed(3);
    return '$' + price.toFixed(2);
  }

  function updatePricing() {
    if (!pricingConfig) return;
    
    const sliderValue = parseInt(syncSlider.value);
    const currentSyncs = syncValues[sliderValue];
    const isYearly = document.querySelector('input[name="billing"]:checked').value === 'yearly';
    
    // Update sync count display
    syncCount.textContent = syncLabels[sliderValue];
    
    // Remove all disabled states first
    pricingPlans.forEach(plan => {
      plan.classList.remove('plan-disabled');
    });
    
    // Update prices for each plan
    Object.keys(pricingConfig.plans).forEach(planKey => {
      const planElement = document.querySelector(`[data-plan="${planKey}"]`);
      if (!planElement) return;
      
      const price = calculatePrice(planKey, currentSyncs, isYearly);
      const monthlyPriceEl = planElement.querySelector('.monthly-price');
      const yearlyPriceEl = planElement.querySelector('.yearly-price');
      
      if (monthlyPriceEl) {
        monthlyPriceEl.textContent = formatPrice(calculatePrice(planKey, currentSyncs, false));
      }
      if (yearlyPriceEl) {
        yearlyPriceEl.textContent = formatPrice(calculatePrice(planKey, currentSyncs, true));
      }
    });
    
    // Apply disabled state based on sync count
    if (currentSyncs < pricingConfig.thresholds.pro) {
      // Only Starter plan available
      const proPlan = document.querySelector('[data-plan="pro"]');
      const teamPlan = document.querySelector('[data-plan="team"]');
      const enterprisePlan = document.querySelector('[data-plan="enterprise"]');
      
      if (proPlan) proPlan.classList.add('plan-disabled');
      if (teamPlan) teamPlan.classList.add('plan-disabled');
      if (enterprisePlan) enterprisePlan.classList.add('plan-disabled');
    } else if (currentSyncs < pricingConfig.thresholds.team) {
      // Starter + Pro available
      const teamPlan = document.querySelector('[data-plan="team"]');
      const enterprisePlan = document.querySelector('[data-plan="enterprise"]');
      
      if (teamPlan) teamPlan.classList.add('plan-disabled');
      if (enterprisePlan) enterprisePlan.classList.add('plan-disabled');
    } else if (currentSyncs < pricingConfig.thresholds.enterprise) {
      // Starter + Pro + Team available
      const enterprisePlan = document.querySelector('[data-plan="enterprise"]');
      
      if (enterprisePlan) enterprisePlan.classList.add('plan-disabled');
    }
    // If currentSyncs >= 2000, all plans are available (no disabled state)
  }

  // Handle billing toggle
  const billingToggles = document.querySelectorAll('.billing-toggle');

  function updateBilling() {
    const isYearly = document.querySelector('input[name="billing"]:checked').value === 'yearly';
    
    // Update toggle appearance
    billingToggles.forEach((toggle, index) => {
      const label = toggle.nextElementSibling;
      if (toggle.checked) {
        label.classList.add('bg-dark', 'text-light');
        label.classList.remove('text-dark');
      } else {
        label.classList.remove('bg-dark', 'text-light');
        label.classList.add('text-dark');
      }
    });
    
    // Update pricing display
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    const yearlySavings = document.querySelectorAll('.yearly-savings');
    const yearlyNotShown = document.querySelectorAll('.yearly-not-shown');
    
    if (isYearly) {
      monthlyPrices.forEach(price => price.classList.add('hidden'));
      yearlyPrices.forEach(price => price.classList.remove('hidden'));
      yearlySavings.forEach(savings => savings.classList.remove('hidden'));
      yearlyNotShown.forEach(element => element.classList.add('hidden'));
    } else {
      monthlyPrices.forEach(price => price.classList.remove('hidden'));
      yearlyPrices.forEach(price => price.classList.add('hidden'));
      yearlySavings.forEach(savings => savings.classList.add('hidden'));
      yearlyNotShown.forEach(element => element.classList.remove('hidden'));
    }
    
    // Recalculate prices with new billing period
    updatePricing();
  }

  // Event listeners
  if (syncSlider) {
    syncSlider.addEventListener('input', updatePricing);
  }
  
  billingToggles.forEach(toggle => {
    toggle.addEventListener('change', updateBilling);
  });

  // Initialize
  loadPricingConfig();
  updateBilling();
}); 