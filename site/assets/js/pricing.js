// Pricing calculator functionality
document.addEventListener('DOMContentLoaded', function() {
  const syncSlider = document.getElementById('syncSlider');
  const syncCount = document.getElementById('syncCount');
  const pricingPlans = document.querySelectorAll('.pricing-plan');

  // Exit early if not on pricing page
  if (!syncSlider || !syncCount) {
    return;
  }

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
    if (!plan) return 0;
    
    if (plan.customPricing) return 'Custom';
    
    // Calculate base price + overage
    let totalPrice = plan.basePrice;
    
    // Calculate overage if syncs exceed included amount
    if (syncs > plan.includedSyncs) {
      const overageAmount = syncs - plan.includedSyncs;
      const overageCost = overageAmount * plan.overageRate;
      totalPrice += overageCost;
    }
    
    // Apply yearly discount if needed (20% off)
    return isYearly ? (totalPrice * 0.8) : totalPrice;
  }

  function formatPrice(price) {
    if (price === 'Custom') return 'Custom';
    if (price === 0) return '$0';
    if (price < 1) return '$' + price.toFixed(2);
    return '$' + Math.round(price);
  }

  function getSyncValueFromSlider(sliderValue) {
    const ranges = pricingConfig.syncRanges;
    if (!ranges || sliderValue >= ranges.length) return 50000;
    return ranges[sliderValue].value;
  }

  function getSyncLabelFromSlider(sliderValue) {
    const ranges = pricingConfig.syncRanges;
    if (!ranges || sliderValue >= ranges.length) return '50K+';
    return ranges[sliderValue].label;
  }

  function updatePricing() {
    if (!pricingConfig) return;
    
    const sliderValue = parseInt(syncSlider.value);
    const currentSyncs = getSyncValueFromSlider(sliderValue);
    const isYearly = document.querySelector('input[name="billing"]:checked').value === 'yearly';
    
    // Update sync count display
    syncCount.textContent = getSyncLabelFromSlider(sliderValue);
    
    // Remove all disabled states first
    pricingPlans.forEach(plan => {
      plan.classList.remove('plan-disabled');
    });
    
    // Update prices for each plan
    Object.keys(pricingConfig.plans).forEach(planKey => {
      const planElement = document.querySelector(`[data-plan="${planKey}"]`);
      if (!planElement) return;
      
      const monthlyPrice = calculatePrice(planKey, currentSyncs, false);
      const yearlyPrice = calculatePrice(planKey, currentSyncs, true);
      
      const monthlyPriceEl = planElement.querySelector('.monthly-price');
      const yearlyPriceEl = planElement.querySelector('.yearly-price');
      
      if (monthlyPriceEl) {
        monthlyPriceEl.textContent = formatPrice(monthlyPrice);
      }
      if (yearlyPriceEl) {
        yearlyPriceEl.textContent = formatPrice(yearlyPrice);
      }

      // Update overage display
      const plan = pricingConfig.plans[planKey];
      const overageEl = planElement.querySelector('.overage-rate');
      if (overageEl && plan.overageRate) {
        overageEl.textContent = `$${plan.overageRate}/sync over ${plan.includedSyncs.toLocaleString()}`;
    }
    });
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

  // Set up slider range based on sync options
  function initializeSlider() {
    if (!pricingConfig || !pricingConfig.syncRanges) return;
    
    syncSlider.min = 0;
    syncSlider.max = pricingConfig.syncRanges.length - 1;
    syncSlider.value = 0; // Start at first option
    
    // Update slider labels
    const sliderLabels = document.querySelector('.slider-labels');
    if (sliderLabels) {
      sliderLabels.innerHTML = pricingConfig.syncRanges
        .map(range => `<span>${range.label}</span>`)
        .join('');
    }
  }

  // Event listeners
  if (syncSlider) {
    syncSlider.addEventListener('input', updatePricing);
  }
  
  billingToggles.forEach(toggle => {
    toggle.addEventListener('change', updateBilling);
  });

  // Initialize
  loadPricingConfig().then(() => {
    initializeSlider();
  updateBilling();
  });
}); 