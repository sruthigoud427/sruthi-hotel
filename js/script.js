/**
 * SRUTHI HOTEL - MASTER JAVASCRIPT
 * Handles Navigation, Lightbox, Dynamic Filters, Calculations, Animations & Form Validations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navigation & Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Drawer Navigation ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  function openMobileNav() {
    mobileDrawer?.classList.add('active');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileDrawer?.classList.remove('active');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openMobileNav);
  drawerClose?.addEventListener('click', closeMobileNav);
  drawerBackdrop?.addEventListener('click', closeMobileNav);

  // --- 3. Active Link Highlighting ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- 4. Animated Counters (Intersection Observer) ---
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length > 0) {
    const observerOptions = { threshold: 0.5 };
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseFloat(target.getAttribute('data-count'));
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const isDecimal = countTo % 1 !== 0;
          let current = 0;
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = countTo / totalSteps;

          const counterInterval = setInterval(() => {
            current += increment;
            if (current >= countTo) {
              target.textContent = prefix + (isDecimal ? countTo.toFixed(1) : Math.floor(countTo)) + suffix;
              clearInterval(counterInterval);
            } else {
              target.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            }
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, observerOptions);

    statNumbers.forEach(num => statsObserver.observe(num));
  }

  // --- 5. Room Filter Tabs (rooms.html) ---
  const roomFilterBtns = document.querySelectorAll('.room-filter-btn');
  const roomCards = document.querySelectorAll('.room-card-item');

  roomFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roomFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // --- 6. Gallery Filter Tabs & Lightbox (gallery.html) ---
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxCategory = document.querySelector('.lightbox-category');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryIndex = 0;
  let visibleGalleryItems = Array.from(galleryItems);

  function updateVisibleGalleryItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
      updateVisibleGalleryItems();
    });
  });

  function showLightbox(index) {
    if (!visibleGalleryItems.length) return;
    if (index < 0) index = visibleGalleryItems.length - 1;
    if (index >= visibleGalleryItems.length) index = 0;
    currentGalleryIndex = index;

    const currentItem = visibleGalleryItems[currentGalleryIndex];
    const imgEl = currentItem.querySelector('img');
    const title = currentItem.getAttribute('data-title') || 'Sruthi Hotel Luxury Experience';
    const category = currentItem.getAttribute('data-category') || 'Luxury';

    if (lightboxImg) lightboxImg.src = imgEl.src;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category.toUpperCase();

    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleGalleryItems();
      const idx = visibleGalleryItems.indexOf(item);
      if (idx !== -1) showLightbox(idx);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showLightbox(currentGalleryIndex - 1));
  lightboxNext?.addEventListener('click', () => showLightbox(currentGalleryIndex + 1));

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentGalleryIndex + 1);
  });

  // --- 7. Booking Calculator & Reservation Form (booking-contact.html) ---
  const bookingForm = document.getElementById('hotelBookingForm');
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  const roomSelect = document.getElementById('roomTypeSelect');
  const guestsSelect = document.getElementById('guestsSelect');
  const calcNightsEl = document.getElementById('calcNights');
  const calcRateEl = document.getElementById('calcRate');
  const calcRoomSubtotalEl = document.getElementById('calcRoomSubtotal');
  const calcAddonsEl = document.getElementById('calcAddons');
  const calcTaxesEl = document.getElementById('calcTaxes');
  const calcTotalEl = document.getElementById('calcTotal');
  const addonCheckboxes = document.querySelectorAll('.booking-addon-check');

  // Room pricing table (per night in USD)
  const roomPrices = {
    'presidential-suite': 650,
    'imperial-penthouse': 550,
    'executive-ocean': 380,
    'deluxe-garden': 260,
    'grand-twin': 220,
    'honeymoon-suite': 420,
    'family-residence': 490,
    'junior-club': 310,
    'classic-deluxe': 190,
    'skyline-studio': 340
  };

  // Pre-fill from URL query params (e.g. ?room=presidential-suite&checkin=2026-09-01)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRoom = urlParams.get('room');
  const paramCheckin = urlParams.get('checkin');
  const paramCheckout = urlParams.get('checkout');
  const paramGuests = urlParams.get('guests');

  // Set default dates if empty
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);

  const formatDateYMD = (date) => date.toISOString().split('T')[0];

  if (checkinInput) {
    checkinInput.min = formatDateYMD(today);
    checkinInput.value = paramCheckin || formatDateYMD(today);
  }
  if (checkoutInput) {
    const minCheckout = new Date(today);
    minCheckout.setDate(minCheckout.getDate() + 1);
    checkoutInput.min = formatDateYMD(minCheckout);
    checkoutInput.value = paramCheckout || formatDateYMD(tomorrow);
  }

  if (roomSelect && paramRoom) {
    if (roomPrices[paramRoom]) {
      roomSelect.value = paramRoom;
    }
  }

  if (guestsSelect && paramGuests) {
    guestsSelect.value = paramGuests;
  }

  // Update dynamic booking cost calculation
  function calculateBookingCost() {
    if (!checkinInput || !checkoutInput || !roomSelect) return;

    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);

    // Validate checkout > checkin
    let diffDays = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays < 1) {
      diffDays = 1;
    }

    const selectedRoom = roomSelect.value;
    const ratePerNight = roomPrices[selectedRoom] || 260;
    const roomSubtotal = ratePerNight * diffDays;

    // Calculate add-ons
    let addonsTotal = 0;
    addonCheckboxes.forEach(chk => {
      if (chk.checked) {
        const price = parseFloat(chk.getAttribute('data-price')) || 0;
        const isPerNight = chk.getAttribute('data-per-night') === 'true';
        addonsTotal += isPerNight ? price * diffDays : price;
      }
    });

    const taxesAndFees = Math.round((roomSubtotal + addonsTotal) * 0.12);
    const grandTotal = roomSubtotal + addonsTotal + taxesAndFees;

    if (calcNightsEl) calcNightsEl.textContent = `${diffDays} night${diffDays > 1 ? 's' : ''}`;
    if (calcRateEl) calcRateEl.textContent = `$${ratePerNight} / night`;
    if (calcRoomSubtotalEl) calcRoomSubtotalEl.textContent = `$${roomSubtotal.toLocaleString()}`;
    if (calcAddonsEl) calcAddonsEl.textContent = `$${addonsTotal.toLocaleString()}`;
    if (calcTaxesEl) calcTaxesEl.textContent = `$${taxesAndFees.toLocaleString()}`;
    if (calcTotalEl) calcTotalEl.textContent = `$${grandTotal.toLocaleString()}`;
  }

  // Listeners for live calculation
  checkinInput?.addEventListener('change', () => {
    if (checkinInput.value && checkoutInput) {
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = formatDateYMD(nextDay);
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = formatDateYMD(nextDay);
      }
    }
    calculateBookingCost();
  });

  checkoutInput?.addEventListener('change', calculateBookingCost);
  roomSelect?.addEventListener('change', calculateBookingCost);
  addonCheckboxes.forEach(chk => chk.addEventListener('change', calculateBookingCost));

  // Initialize calculation on page load
  calculateBookingCost();

  // Booking Form Submission
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('bookingName')?.value || 'Valued Guest';
    const roomText = roomSelect?.options[roomSelect.selectedIndex]?.text || 'Suite';
    showToast('Reservation Requested!', `Thank you ${guestName}, your reservation for ${roomText} has been received. Our concierge will contact you shortly.`);
    bookingForm.reset();
    calculateBookingCost();
  });

  // Contact Form Submission (booking-contact.html)
  const contactForm = document.getElementById('hotelContactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const senderName = document.getElementById('contactName')?.value || 'Guest';
    showToast('Message Dispatched', `Thank you ${senderName}, our hospitality desk has received your inquiry.`);
    contactForm.reset();
  });

  // Newsletter Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('VIP Club Subscribed', 'Welcome to the Sruthi Hotel VIP Privilege Circle.');
      f.reset();
    });
  });

  // Toast Notification Function
  function showToast(title, message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.innerHTML = `
        <i class="fa-solid fa-crown toast-icon"></i>
        <div>
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('.toast-title').textContent = title;
      toast.querySelector('.toast-message').textContent = message;
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
