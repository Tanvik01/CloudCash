
document.addEventListener('DOMContentLoaded', () => {

  const desktopNavItems = document.querySelectorAll('.app-sidebar .nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item');
  const screenViews = document.querySelectorAll('.screen-view');

  // Desktop Headers
  const pageMainTitle = document.getElementById('page-main-title');
  const pageMainSubtitle = document.getElementById('page-main-subtitle');
  const headerActionBtn = document.getElementById('header-action-btn');

  // Mobile Headers
  const mobilePageTitle = document.getElementById('mobile-page-title');
  const mobilePageSubtitle = document.getElementById('mobile-page-subtitle');

  const screenMetadata = {
    overview: {
      title: 'Weekly sumup',
      subtitle: 'Get summary of your weekly transactions',
      showAction: false
    },
    transactions: {
      title: 'Transactions',
      subtitle: 'Review and search through your complete history',
      showAction: false
    },
    cards: {
      title: 'My Cards',
      subtitle: 'Manage your virtual and physical card setups',
      showAction: false
    },
    invoices: {
      title: 'Invoices',
      subtitle: 'Send and manage billing statements',
      showAction: true,
      actionText: '+ Create New Invoice',
      actionHandler: () => openModal('modal-new-invoice')
    },
    goals: {
      title: 'My Goals',
      subtitle: 'Save smarter and reach your personal milestones.',
      showAction: false
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize and manage your fintech experience.',
      showAction: false
    }
  };

  function switchView(viewName) {
    // 1. Sync Desktop Sidebar Nav
    desktopNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 2. Sync Mobile Bottom Nav
    mobileNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Screen Views
    screenViews.forEach(view => {
      if (view.id === `view-${viewName}`) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // 4. Update Desktop Header Metadata
    const meta = screenMetadata[viewName] || screenMetadata.overview;
    if (pageMainTitle) {
      pageMainTitle.textContent = meta.title;
      const isDark = document.body.classList.contains('dark-mode');
      const titleColor = isDark ? '#FFFFFF' : '#1F2C3F';
      if (viewName === 'overview') {
        pageMainTitle.style.fontSize = '28px';
        pageMainTitle.style.fontFamily = "'Lato', sans-serif";
        pageMainTitle.style.fontWeight = '700';
        pageMainTitle.style.lineHeight = '100%';
        pageMainTitle.style.letterSpacing = '-0.5px';
        pageMainTitle.style.color = titleColor;
      } else if (viewName === 'goals') {
        pageMainTitle.style.fontSize = '28px';
        pageMainTitle.style.fontFamily = "'Inter', sans-serif";
        pageMainTitle.style.fontWeight = '600';
        pageMainTitle.style.lineHeight = '100%';
        pageMainTitle.style.letterSpacing = '0%';
        pageMainTitle.style.color = titleColor;
      } else {
        pageMainTitle.style.fontSize = '28px';
        pageMainTitle.style.fontFamily = "'Suprema', sans-serif";
        pageMainTitle.style.color = titleColor;
      }
    }
    if (pageMainSubtitle) pageMainSubtitle.textContent = meta.subtitle;

    // 5. Update Mobile Header Metadata
    if (mobilePageTitle) mobilePageTitle.textContent = meta.title;
    if (mobilePageSubtitle) mobilePageSubtitle.textContent = meta.subtitle;

    if (headerActionBtn) {
      if (meta.showAction) {
        headerActionBtn.style.display = 'flex';
        headerActionBtn.onclick = meta.actionHandler;
      } else {
        headerActionBtn.style.display = 'none';
      }
    }

    // If switching to goals, ensure Chart.js canvas resizes and redraws crisply
    if (viewName === 'goals') {
      setTimeout(() => {
        initSavingsCharts();
      }, 60);
    }

    // Scroll to top
    const appMain = document.querySelector('.app-main');
    if (appMain) appMain.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind clicks for Desktop sidebar
  desktopNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });

  // Bind clicks for Mobile bottom bar
  mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });

  // In-page navigation links (e.g. data-nav-target="goals")
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav-target');
      if (target) switchView(target);
    });
  });

  // Logos & Avatars redirect to overview or settings
  document.getElementById('brand-logo-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('overview');
  });

  document.getElementById('mobile-brand-logo-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('overview');
  });

  document.getElementById('user-profile-btn')?.addEventListener('click', () => switchView('settings'));
  document.getElementById('mobile-user-avatar-btn')?.addEventListener('click', () => switchView('settings'));
  document.getElementById('btn-view-all-card-history')?.addEventListener('click', () => switchView('transactions'));

  // --------------------------------------------------------------------------
  // 3. Dark / Light Theme Controller
  // --------------------------------------------------------------------------
  const btnThemeLight = document.getElementById('btn-theme-light');
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const mobileToggleDarkTheme = document.getElementById('mobile-toggle-dark-theme');

  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      btnThemeDark?.classList.add('active');
      btnThemeLight?.classList.remove('active');
      if (pageMainTitle) pageMainTitle.style.color = '#FFFFFF';
      if (mobileToggleDarkTheme) mobileToggleDarkTheme.checked = true;
      localStorage.setItem('cloudcash-theme', 'dark');
      showToast('Dark Theme Activated');
    } else {
      document.body.classList.remove('dark-mode');
      btnThemeLight?.classList.add('active');
      btnThemeDark?.classList.remove('active');
      if (pageMainTitle) pageMainTitle.style.color = '#1F2C3F';
      if (mobileToggleDarkTheme) mobileToggleDarkTheme.checked = false;
      localStorage.setItem('cloudcash-theme', 'light');
      showToast('Light Theme Activated');
    }
    setTimeout(initSavingsCharts, 80);
  }

  btnThemeLight?.addEventListener('click', () => setTheme(false));
  btnThemeDark?.addEventListener('click', () => setTheme(true));
  mobileToggleDarkTheme?.addEventListener('change', (e) => setTheme(e.target.checked));

  if (localStorage.getItem('cloudcash-theme') === 'dark') {
    setTheme(true);
  }

  // --------------------------------------------------------------------------
  // 4. Drag-to-Scroll Controller (Mouse Grab & Smooth Momentum for Scroll Rows)
  // --------------------------------------------------------------------------
  function setupDragScroll(slider) {
    if (!slider) return;
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasMoved = false;

    slider.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, input, select, a, .btn-card-action, .btn-card-flip-badge')) return;
      isDown = true;
      hasMoved = false;
      slider.classList.add('is-dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) hasMoved = true;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  document.querySelectorAll('.drag-scrollable').forEach(setupDragScroll);


  const cardsData = [
    {
      id: 0,
      type: 'PREMIUM',
      badgeClass: 'card-blue',
      number: ['5749', '••••', '••••', '2847'],
      holder: 'Mike Smith',
      expire: '06/25',
      cvv: '847',
      balance: '$2,850.75',
      income: '+$1,500.50',
      outcome: '-$350.60',
      limit: '$350.60 / $4000',
      limitPct: '22%'
    },
    {
      id: 1,
      type: 'METAL',
      badgeClass: 'card-metal',
      number: ['4321', '••••', '••••', '8990'],
      holder: 'Andrew Smith',
      expire: '12/29',
      cvv: '990',
      balance: '$6,420.00',
      income: '+$3,250.00',
      outcome: '-$890.40',
      limit: '$890.40 / $10000',
      limitPct: '65%'
    }
  ];

  let currentCardIdx = 0;
  let isCardTransitioning = false;

  // Dedicated card flip function
  function toggleCardFlip(cardInner) {
    if (!cardInner) return;
    cardInner.classList.toggle('is-flipped');
    const isFlipped = cardInner.classList.contains('is-flipped');
    showToast(isFlipped ? 'Card flipped to reveal CVV code' : 'Card flipped back to front');
  }

  // Bind click listeners on all CVV / Flip badges
  document.querySelectorAll('.btn-card-flip-badge').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const inner = btn.closest('.virtual-card-inner');
      if (inner) toggleCardFlip(inner);
    });
  });

  function syncCardMetrics(idx) {
    currentCardIdx = idx;
    const card = cardsData[currentCardIdx];

    // Mobile Overview Balance & Stats
    const mobBal = document.getElementById('mobile-overview-balance-val');
    if (mobBal) mobBal.textContent = card.balance;
    const mobInc = document.getElementById('mobile-overview-income-val');
    if (mobInc) mobInc.textContent = card.income;
    const mobOut = document.getElementById('mobile-overview-outcome-val');
    if (mobOut) mobOut.textContent = card.outcome;

    // Desktop Overview Card
    const deskCard = document.getElementById('overview-virtual-card');
    if (deskCard) {
      deskCard.className = `virtual-credit-card ${card.badgeClass} draggable-card`;
      const dt = document.getElementById('overview-card-type-badge');
      if (dt) dt.textContent = `${card.type} ACCOUNT`;
      const dn = document.getElementById('overview-card-number');
      if (dn) dn.innerHTML = card.number.map(c => `<span>${c}</span>`).join('');
      const dh = document.getElementById('overview-card-holder');
      if (dh) dh.textContent = card.holder;
      const de = document.getElementById('overview-card-expire');
      if (de) de.textContent = card.expire;
    }

    const deskBal = document.getElementById('desktop-overview-balance');
    if (deskBal) deskBal.textContent = card.balance;
    const deskInc = document.getElementById('desktop-overview-income');
    if (deskInc) deskInc.textContent = card.income;
    const deskOut = document.getElementById('desktop-overview-outcome');
    if (deskOut) deskOut.textContent = card.outcome;
    const deskLimitFill = document.getElementById('desktop-limit-progress-fill');
    if (deskLimitFill) deskLimitFill.style.width = card.limitPct;
    const deskLimitText = document.getElementById('desktop-limit-text');
    if (deskLimitText) deskLimitText.textContent = card.limit;

    // Sync Indicator Dots
    document.querySelectorAll('.card-dot-pill').forEach(dot => {
      const dotId = dot.id;
      if (dotId.endsWith(`${currentCardIdx}`)) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Reset card flipped states back to front
    document.querySelectorAll('.virtual-card-inner').forEach(inner => {
      inner.classList.remove('is-flipped');
    });
  }

  // Smooth Dual-Instance Switch Animation
  function switchCardTo(targetIdx, direction = 1) {
    if (isCardTransitioning || targetIdx === currentCardIdx) return;
    isCardTransitioning = true;

    const oldIdx = currentCardIdx;
    const nextIdx = targetIdx;

    // Get stage elements for overview and cards view
    const stages = [
      {
        active: document.getElementById(`overview-card-${oldIdx}`),
        incoming: document.getElementById(`overview-card-${nextIdx}`)
      },
      {
        active: document.getElementById(`cards-card-${oldIdx}`),
        incoming: document.getElementById(`cards-card-${nextIdx}`)
      }
    ];

    // Reset flips
    document.querySelectorAll('.virtual-card-inner').forEach(inner => {
      inner.classList.remove('is-flipped');
    });

    stages.forEach(({ active, incoming }) => {
      if (active) {
        active.style.transition = 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.24s ease';
        active.style.transform = `translate3d(${direction * 300}px, -10px, 40px) scale(0.9) rotateY(${direction * 22}deg)`;
        active.style.opacity = '0.15';
      }
      if (incoming) {
        incoming.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, filter 0.3s ease';
        incoming.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
        incoming.style.opacity = '1';
        incoming.style.filter = 'brightness(1)';
        incoming.style.zIndex = '10';
      }
    });

    setTimeout(() => {
      stages.forEach(({ active, incoming }) => {
        if (active) {
          active.className = 'virtual-card-flipper-wrap card-slot-rear';
          active.style.transition = '';
          active.style.transform = '';
          active.style.opacity = '';
          active.style.filter = '';
          active.style.zIndex = '';
        }
        if (incoming) {
          incoming.className = 'virtual-card-flipper-wrap card-slot-active';
          incoming.style.transition = '';
          incoming.style.transform = '';
          incoming.style.opacity = '';
          incoming.style.filter = '';
          incoming.style.zIndex = '';
        }
      });

      syncCardMetrics(nextIdx);
      isCardTransitioning = false;
      const card = cardsData[nextIdx];
      showToast(`Switched to ${card.type} Card (•••• ${card.number[3]})`);
    }, 280);
  }

  // Setup Gesture Tracking on a Stack Stage
  function setupStageStackGesture(deckStackId, stagePrefix) {
    const stack = document.getElementById(deckStackId);
    if (!stack) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let currentX = 0;
    let isTracking = false;
    let hasMoved = false;

    function getActiveWrap() {
      return document.getElementById(`${stagePrefix}-card-${currentCardIdx}`);
    }

    function getRearWrap() {
      const rearIdx = (currentCardIdx + 1) % cardsData.length;
      return document.getElementById(`${stagePrefix}-card-${rearIdx}`);
    }

    function handleStart(clientX, clientY) {
      if (isCardTransitioning) return;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      startTime = Date.now();
      isTracking = true;
      hasMoved = false;

      const activeWrap = getActiveWrap();
      const rearWrap = getRearWrap();

      if (activeWrap) {
        activeWrap.classList.add('is-dragging');
        activeWrap.style.transition = 'none';
      }
      if (rearWrap) {
        rearWrap.style.transition = 'none';
      }
    }

    function handleMove(clientX, clientY) {
      if (!isTracking) return;
      currentX = clientX;
      const dx = currentX - startX;
      const dy = clientY - startY;

      if (Math.abs(dx) > 15) hasMoved = true;

      const activeWrap = getActiveWrap();
      const rearWrap = getRearWrap();

      if (activeWrap) {
        const dampenedX = dx * 0.65;
        const rotY = (dx * 0.12).toFixed(2);
        const rotZ = (dx * 0.03).toFixed(2);
        const scale = Math.max(0.92, 1 - Math.abs(dx) * 0.0006);
        activeWrap.style.transform = `translate3d(${dampenedX}px, 0px, 0px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      }

      if (rearWrap) {
        const progress = Math.min(1, Math.abs(dx) / 120);
        const rearScale = 0.92 + (progress * 0.08);
        const rearOpacity = 0.82 + (progress * 0.18);
        const rearFilter = 0.85 + (progress * 0.15);
        const rearOffsetX = 24 - (progress * 24 * Math.sign(dx || 1));
        const rearOffsetY = 4 - (progress * 4);
        const rearOffsetZ = -35 + (progress * 35);
        const rearRotY = -6 + (progress * 6);

        rearWrap.style.transform = `translate3d(${rearOffsetX}px, ${rearOffsetY}px, ${rearOffsetZ}px) scale(${rearScale}) rotateY(${rearRotY}deg)`;
        rearWrap.style.opacity = rearOpacity;
        rearWrap.style.filter = `brightness(${rearFilter})`;
      }
    }

    function handleEnd(e) {
      if (!isTracking) return;
      isTracking = false;

      const activeWrap = getActiveWrap();
      const rearWrap = getRearWrap();

      if (activeWrap) activeWrap.classList.remove('is-dragging');

      const dx = currentX - startX;
      const dt = Date.now() - startTime;
      const velocity = Math.abs(dx) / (dt || 1);

      if (hasMoved && (Math.abs(dx) > 35 || velocity > 0.22)) {
        const direction = dx > 0 ? 1 : -1;
        const nextIdx = (currentCardIdx + 1) % cardsData.length;
        switchCardTo(nextIdx, direction);
      } else if (hasMoved && Math.abs(dx) >= 15) {
        // Snap back if it was an intentional drag that didn't meet switch threshold
        if (activeWrap) {
          activeWrap.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          activeWrap.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
        }
        if (rearWrap) {
          rearWrap.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, filter 0.3s ease';
          rearWrap.style.transform = 'translate3d(24px, 4px, -35px) scale(0.92) rotateY(-6deg)';
          rearWrap.style.opacity = '0.82';
          rearWrap.style.filter = 'brightness(0.85)';
        }
      } else {
        // Natural tap / click on active card body
        const isClickOnBadge = e && e.target && e.target.closest('.btn-card-flip-badge');
        if (!isClickOnBadge && activeWrap) {
          const inner = activeWrap.querySelector('.virtual-card-inner');
          if (inner) toggleCardFlip(inner);
        }
      }

      startX = 0;
      currentX = 0;
      hasMoved = false;
    }

    stack.addEventListener('touchstart', (e) => {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    stack.addEventListener('touchmove', (e) => {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    stack.addEventListener('touchend', handleEnd);
    stack.addEventListener('touchcancel', handleEnd);

    stack.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, select, input, a, .btn-card-flip-badge')) return;
      handleStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isTracking) handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      if (isTracking) handleEnd(e);
    });

    // Clicking rear card directly triggers switch
    stack.addEventListener('click', (e) => {
      const rear = e.target.closest('.card-slot-rear');
      if (rear) {
        const rearIdx = parseInt(rear.getAttribute('data-card-idx') || '1', 10);
        switchCardTo(rearIdx, 1);
      }
    });
  }

  setupStageStackGesture('overview-deck-stack', 'overview');
  setupStageStackGesture('cards-deck-stack', 'cards');

  document.getElementById('btn-card-prev')?.addEventListener('click', () => {
    const nextIdx = (currentCardIdx - 1 + cardsData.length) % cardsData.length;
    switchCardTo(nextIdx, -1);
  });

  document.getElementById('btn-card-next')?.addEventListener('click', () => {
    const nextIdx = (currentCardIdx + 1) % cardsData.length;
    switchCardTo(nextIdx, 1);
  });

  document.querySelectorAll('.card-dot-pill').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = dot.id.endsWith('1') ? 1 : 0;
      if (idx !== currentCardIdx) {
        switchCardTo(idx, 1);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Fully Functional Card Controls (Freeze, Limits, PIN)
  // --------------------------------------------------------------------------
  let currentCardControlAction = null;
  let currentCardControlNum = '2847';

  // Toggle Deactivate Switch on Desktop Overview
  document.getElementById('toggle-deactivate-card')?.addEventListener('change', (e) => {
    const isDeactivated = e.target.checked;
    const overviewCard = document.getElementById('overview-virtual-card');
    if (overviewCard) {
      if (isDeactivated) {
        overviewCard.classList.add('card-frozen');
      } else {
        overviewCard.classList.remove('card-frozen');
      }
    }
    showToast(isDeactivated ? 'Card temporarily deactivated.' : 'Card reactivated.');
  });

  // Handle all Card Action Buttons (Desktop Overview, Desktop Cards View, Mobile Cards View)
  document.querySelectorAll('.btn-card-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const action = btn.getAttribute('data-action');
      const cardNum = btn.getAttribute('data-card') || (currentCardIdx === 0 ? '2847' : '8990');
      currentCardControlAction = action;
      currentCardControlNum = cardNum;

      if (action === 'freeze') {
        btn.classList.toggle('active-action');
        const isFrozen = btn.classList.contains('active-action');

        // Apply freeze style to card in view
        const parentCardDeck = btn.closest('.card-deck-item');
        if (parentCardDeck) {
          const cardEl = parentCardDeck.querySelector('.virtual-credit-card');
          cardEl?.classList.toggle('card-frozen', isFrozen);
        } else {
          // Toggle on overview card or mobile active cards
          document.getElementById('overview-virtual-card')?.classList.toggle('card-frozen', isFrozen);
          document.getElementById(`overview-card-${currentCardIdx}`)?.querySelector('.virtual-credit-card')?.classList.toggle('card-frozen', isFrozen);
          document.getElementById(`cards-card-${currentCardIdx}`)?.querySelector('.virtual-credit-card')?.classList.toggle('card-frozen', isFrozen);
        }

        showToast(isFrozen ? `Card (•••• ${cardNum}) is now frozen.` : `Card (•••• ${cardNum}) is now unfrozen.`);
      } else if (action === 'limits') {
        const title = document.getElementById('card-modal-title');
        const label = document.getElementById('card-modal-input-label');
        const num = document.getElementById('modal-card-num-label');
        const input = document.getElementById('card-modal-input-field');

        if (title) title.textContent = `Set Spending Limit (•••• ${cardNum})`;
        if (label) label.textContent = 'Weekly / Monthly Max Spending Limit ($)';
        if (num) num.textContent = cardNum;
        if (input) {
          input.type = 'number';
          input.value = '4000';
          input.placeholder = 'e.g. 5000';
        }
        openModal('modal-card-control');
      } else if (action === 'pin') {
        const title = document.getElementById('card-modal-title');
        const label = document.getElementById('card-modal-input-label');
        const num = document.getElementById('modal-card-num-label');
        const input = document.getElementById('card-modal-input-field');

        if (title) title.textContent = `Change Card PIN (•••• ${cardNum})`;
        if (label) label.textContent = 'Enter New 4-Digit Security PIN';
        if (num) num.textContent = cardNum;
        if (input) {
          input.type = 'password';
          input.value = '';
          input.maxLength = 4;
          input.placeholder = '••••';
        }
        openModal('modal-card-control');
      }
    });
  });

  // Modal Save / Confirm Button
  document.getElementById('btn-save-card-control')?.addEventListener('click', () => {
    const input = document.getElementById('card-modal-input-field');
    const val = input?.value.trim();

    if (currentCardControlAction === 'limits') {
      const limitVal = parseFloat(val || '4000');
      const limitText = document.getElementById('desktop-limit-text');
      if (limitText) {
        limitText.textContent = `$350.60 / $${limitVal.toLocaleString()}`;
      }
      showToast(`Spending limit for card ending in ${currentCardControlNum} updated to $${limitVal.toLocaleString()}.`);
    } else if (currentCardControlAction === 'pin') {
      if (!val || val.length < 4) {
        showToast('Please enter a valid 4-digit PIN.');
        input?.focus();
        return;
      }
      showToast(`Security PIN for card ending in ${currentCardControlNum} updated successfully.`);
    }

    closeModal(document.getElementById('modal-card-control'));
  });

  // --------------------------------------------------------------------------
  // 7. Transactions Table & Mobile History Engine (Pure SVG Icons, Zero Emojis)
  // --------------------------------------------------------------------------
  const iconSVGs = {
    shopping: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`,
    electronics: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    food: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    sport: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    work: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    entertainment: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="5" rx="2"></rect><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"></polygon></svg>`,
    transport: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
    groceries: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 4 4v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7a4 4 0 0 1 4-4h1V7a5 5 0 0 1 5-5z"></path></svg>`
  };

  const transactionsData = [
    { id: 1, merchant: 'Tesco Market', iconKey: 'shopping', iconClass: 'text-orange bg-orange-light', category: 'Shopping', date: '13 Dec 2024', status: 'Completed', tag: 'Success', amount: -75.67 },
    { id: 2, merchant: 'ElectroMen Market', iconKey: 'electronics', iconClass: 'text-blue bg-blue-light', category: 'Shopping', date: '14 Dec 2024', status: 'Completed', tag: 'Success', amount: -250.00 },
    { id: 3, merchant: 'Fiorgio Restaurant', iconKey: 'food', iconClass: 'text-amber bg-amber-light', category: 'Food & Drinks', date: '07 Dec 2024', status: 'Completed', tag: 'Success', amount: -19.50 },
    { id: 4, merchant: 'John Mathew', iconKey: 'sport', iconClass: 'text-green bg-green-light', category: 'Sport', date: '06 Dec 2024', status: 'Completed', tag: 'Success', amount: -350.00 },
    { id: 5, merchant: 'Ann Marlin', iconKey: 'shopping', iconClass: 'text-purple bg-purple-light', category: 'Shopping', date: '31 Nov 2024', status: 'Completed', tag: 'Success', amount: -430.00 },
    { id: 6, merchant: 'Sabry Agency', iconKey: 'work', iconClass: 'text-blue bg-blue-light', category: 'Work', date: '01 Dec 2024', status: 'Completed', tag: 'Success', amount: 2250.00 },
    { id: 7, merchant: 'Amazon Store', iconKey: 'shopping', iconClass: 'text-orange bg-orange-light', category: 'Shopping', date: '24 Dec 2024', status: 'Completed', tag: 'Success', amount: -185.00 },
    { id: 8, merchant: 'Starbucks Coffee', iconKey: 'food', iconClass: 'text-green bg-green-light', category: 'Food & Drinks', date: '23 Dec 2024', status: 'Completed', tag: 'Success', amount: -12.40 },
    { id: 9, merchant: 'Netflix Subscription', iconKey: 'entertainment', iconClass: 'text-red bg-red-light', category: 'Entertainment', date: '22 Dec 2024', status: 'Pending', tag: 'Pending', amount: -15.99 },
    { id: 10, merchant: 'Uber Rides', iconKey: 'transport', iconClass: 'text-blue bg-blue-light', category: 'Transport', date: '21 Dec 2024', status: 'Completed', tag: 'Success', amount: -24.50 },
    { id: 11, merchant: 'Whole Foods Market', iconKey: 'groceries', iconClass: 'text-amber bg-amber-light', category: 'Groceries', date: '20 Dec 2024', status: 'Completed', tag: 'Success', amount: -94.20 },
    { id: 12, merchant: 'Apple Store Online', iconKey: 'electronics', iconClass: 'text-blue bg-blue-light', category: 'Electronics', date: '18 Dec 2024', status: 'Failed', tag: 'Failed', amount: -1299.00 }
  ];

  // Desktop Elements
  const txTbody = document.getElementById('transactions-tbody');
  const txSearchInput = document.getElementById('tx-search-input');
  const txCategoryFilter = document.getElementById('tx-category-filter');
  const txStatusFilter = document.getElementById('tx-status-filter');
  const txPaginationInfo = document.getElementById('tx-pagination-info');

  // Mobile Elements
  const mobileHistoryList = document.getElementById('mobile-history-list');
  const mobileTxSearchInput = document.getElementById('mobile-tx-search-input');
  const mobileTxCatFilter = document.getElementById('mobile-tx-cat-filter');

  function renderTransactions() {
    const query = (txSearchInput?.value || mobileTxSearchInput?.value || '').toLowerCase().trim();
    const cat = txCategoryFilter?.value || mobileTxCatFilter?.value || 'All';
    const status = txStatusFilter?.value || 'All';

    const filtered = transactionsData.filter(tx => {
      const matchQuery = tx.merchant.toLowerCase().includes(query) || tx.category.toLowerCase().includes(query);
      const matchCat = cat === 'All' || tx.category === cat;
      const matchStatus = status === 'All' || tx.status === status;
      return matchQuery && matchCat && matchStatus;
    });

    if (txTbody) {
      txTbody.innerHTML = '';
      if (filtered.length === 0) {
        txTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No transactions match your search filter.</td></tr>`;
      } else {
        filtered.forEach(tx => {
          const isPositive = tx.amount > 0;
          const tr = document.createElement('tr');
          tr.className = 'tactile-btn';
          tr.innerHTML = `
            <td>
              <div class="merchant-cell">
                <div class="merchant-avatar ${tx.iconClass}">
                  ${iconSVGs[tx.iconKey] || iconSVGs.shopping}
                </div>
                <span>${tx.merchant}</span>
              </div>
            </td>
            <td><span class="table-cat-text">${tx.category}</span></td>
            <td><span class="table-date-text">${tx.date}</span></td>
            <td>
              <span class="badge-status status-${tx.status.toLowerCase()}">${tx.status}</span>
            </td>
            <td class="text-right">
              <span class="${isPositive ? 'text-green' : 'text-primary'}" style="font-weight: 700;">
                ${isPositive ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}
              </span>
            </td>
          `;
          txTbody.appendChild(tr);
        });
      }
    }

    if (txPaginationInfo) {
      txPaginationInfo.textContent = `Showing 1-${filtered.length} of ${transactionsData.length} transactions`;
    }

    if (mobileHistoryList) {
      mobileHistoryList.innerHTML = '';
      if (filtered.length === 0) {
        mobileHistoryList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 18px;">No transactions match filter.</div>`;
      } else {
        filtered.forEach(tx => {
          const isPositive = tx.amount > 0;
          const div = document.createElement('div');
          div.className = 'mobile-history-item tactile-btn';
          div.innerHTML = `
            <div class="mobile-tx-icon-box ${tx.iconClass}">
              ${iconSVGs[tx.iconKey] || iconSVGs.shopping}
            </div>
            <div class="hist-left">
              <span class="hist-name">${tx.merchant}</span>
              <span class="hist-meta">${tx.category} • ${tx.date}</span>
            </div>
            <div class="hist-right">
              <span class="hist-amount ${isPositive ? 'text-green' : 'text-primary'}">
                ${isPositive ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}
              </span>
              <span class="badge-status status-${tx.status.toLowerCase()}">${tx.status}</span>
            </div>
          `;
          mobileHistoryList.appendChild(div);
        });
      }
    }
  }

  txSearchInput?.addEventListener('input', renderTransactions);
  txCategoryFilter?.addEventListener('change', renderTransactions);
  txStatusFilter?.addEventListener('change', renderTransactions);
  mobileTxSearchInput?.addEventListener('input', renderTransactions);
  mobileTxCatFilter?.addEventListener('change', renderTransactions);

  renderTransactions();

  // --------------------------------------------------------------------------
  // 8. Invoices Engine & Interactive Drawer
  // --------------------------------------------------------------------------
  const invoicesData = [
    { id: 'INV-2024-001', client: 'Acme Corp', email: 'billing@acmecorp.io', amount: 1200.00, issueDate: '12 Dec 2024', dueDate: '26 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-002', client: 'Globex Inc', email: 'accounts@globex.org', amount: 450.00, issueDate: '11 Dec 2024', dueDate: '25 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-003', client: 'Initech LLC', email: 'billing@intech.co', amount: 3100.00, issueDate: '10 Dec 2024', dueDate: '24 Dec 2024', status: 'Pending' },
    { id: 'INV-2024-004', client: 'Umbrella Corp', email: 'finance@umbrellacorp.com', amount: 850.00, issueDate: '08 Dec 2024', dueDate: '22 Dec 2024', status: 'Overdue' },
    { id: 'INV-2024-005', client: 'Wayne Ent.', email: 'accounts@wayne-ent.com', amount: 1500.00, issueDate: '05 Dec 2024', dueDate: '19 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-006', client: 'Stark Ind.', email: 'billing@starkind.com', amount: 4200.00, issueDate: '01 Dec 2024', dueDate: '15 Dec 2024', status: 'Pending' },
    { id: 'INV-2024-007', client: 'Cyberdyne Systems', email: 'finance@cyberdyne.io', amount: 2750.00, issueDate: '28 Nov 2024', dueDate: '12 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-008', client: 'Wonka Industries', email: 'accounts@wonka.com', amount: 920.00, issueDate: '27 Nov 2024', dueDate: '11 Dec 2024', status: 'Pending' },
    { id: 'INV-2024-009', client: 'Soylent Corp', email: 'billing@soylent.org', amount: 1100.00, issueDate: '25 Nov 2024', dueDate: '09 Dec 2024', status: 'Overdue' },
    { id: 'INV-2024-010', client: 'Hooli', email: 'invoices@hooli.xyz', amount: 3600.00, issueDate: '24 Nov 2024', dueDate: '08 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-011', client: 'Vehement Capital Partners', email: 'finance@vehement.com', amount: 2300.00, issueDate: '23 Nov 2024', dueDate: '07 Dec 2024', status: 'Pending' },
    { id: 'INV-2024-012', client: 'Massive Dynamic', email: 'billing@massivedynamic.com', amount: 5000.00, issueDate: '22 Nov 2024', dueDate: '06 Dec 2024', status: 'Paid' },
    { id: 'INV-2024-013', client: 'Prestige Worldwide', email: 'accounts@prestige.com', amount: 780.00, issueDate: '20 Nov 2024', dueDate: '04 Dec 2024', status: 'Overdue' },
    { id: 'INV-2024-014', client: 'Bluth Company', email: 'finance@bluthco.com', amount: 1950.00, issueDate: '18 Nov 2024', dueDate: '02 Dec 2024', status: 'Paid' }
  ];

  let selectedInvoiceId = 'INV-2024-003';

  function updateInvoiceDrawer(inv) {
    if (!inv) return;
    const dStatus = document.getElementById('drawer-invoice-status');
    const dClient = document.getElementById('drawer-client-name');
    const dEmail = document.getElementById('drawer-client-email');
    const dNum = document.getElementById('drawer-invoice-num');
    const dIssue = document.getElementById('drawer-issue-date');
    const dDue = document.getElementById('drawer-due-date');
    const dTotal = document.getElementById('drawer-total-amount');

    if (dStatus) {
      dStatus.textContent = inv.status;
      dStatus.className = `badge-status status-${inv.status.toLowerCase()}`;
    }
    if (dClient) dClient.textContent = inv.client;
    if (dEmail) dEmail.textContent = inv.email;
    if (dNum) dNum.textContent = inv.id;
    if (dIssue) dIssue.textContent = inv.issueDate;
    if (dDue) dDue.textContent = inv.dueDate;
    if (dTotal) dTotal.textContent = `$${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    const mStatus = document.getElementById('mobile-drawer-invoice-status');
    const mClient = document.getElementById('mobile-drawer-client-name');
    const mEmail = document.getElementById('mobile-drawer-client-email');
    const mDue = document.getElementById('mobile-drawer-due-date');
    const mTotal = document.getElementById('mobile-drawer-total-amount');

    if (mStatus) {
      mStatus.textContent = inv.status;
      mStatus.className = `badge-status status-${inv.status.toLowerCase()}`;
    }
    if (mClient) mClient.textContent = inv.client;
    if (mEmail) mEmail.textContent = inv.email;
    if (mDue) mDue.textContent = inv.dueDate;
    if (mTotal) mTotal.textContent = `$${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }

  function renderInvoices() {
    const tbody = document.getElementById('invoices-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      invoicesData.forEach(inv => {
        const isSelected = inv.id === selectedInvoiceId;
        const row = document.createElement('div');
        row.className = `invoice-table-row tactile-btn ${isSelected ? 'selected-row' : ''}`;
        row.style.cursor = 'pointer';
        row.innerHTML = `
          <div class="cell-inv-id">
            <svg class="inv-doc-icon" width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="#197BBD" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span class="inv-id-text">${inv.id}</span>
          </div>
          <div class="cell-client">${inv.client}</div>
          <div class="cell-amount">$${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div class="cell-date cell-issue">${inv.issueDate}</div>
          <div class="cell-date cell-due">${inv.dueDate}</div>
          <div class="cell-status"><span class="badge-status status-${inv.status.toLowerCase()}">${inv.status}</span></div>
        `;
        row.addEventListener('click', () => {
          selectedInvoiceId = inv.id;
          renderInvoices();
          updateInvoiceDrawer(inv);
        });
        tbody.appendChild(row);
      });
    }

    const mobileInvList = document.getElementById('mobile-invoices-list');
    if (mobileInvList) {
      mobileInvList.innerHTML = '';
      invoicesData.slice(0, 4).forEach(inv => {
        const isSelected = inv.id === selectedInvoiceId;
        const div = document.createElement('div');
        div.className = `mobile-invoice-item tactile-btn ${isSelected ? 'selected-invoice-item' : ''}`;
        div.innerHTML = `
          <div class="mobile-inv-left">
            <span class="mobile-inv-client">${inv.client}</span>
            <span class="mobile-inv-num">${inv.id}</span>
          </div>
          <div class="mobile-inv-right">
            <span class="mobile-inv-amount">$${inv.amount.toFixed(2)}</span>
            <span class="badge-status status-${inv.status.toLowerCase()}">${inv.status}</span>
          </div>
        `;
        div.addEventListener('click', () => {
          selectedInvoiceId = inv.id;
          renderInvoices();
          updateInvoiceDrawer(inv);
        });
        mobileInvList.appendChild(div);
      });
    }
  }

  renderInvoices();
  const initInv = invoicesData.find(i => i.id === selectedInvoiceId);
  if (initInv) updateInvoiceDrawer(initInv);

  function triggerReminder() {
    const inv = invoicesData.find(i => i.id === selectedInvoiceId);
    showToast(`Payment reminder dispatched to ${inv?.email || 'client'}.`);
  }

  function triggerPDF() {
    showToast(`Generating statement PDF for ${selectedInvoiceId}... Complete.`);
  }

  document.getElementById('btn-send-invoice-reminder')?.addEventListener('click', triggerReminder);
  document.getElementById('mobile-btn-send-invoice-reminder')?.addEventListener('click', triggerReminder);
  document.getElementById('btn-download-invoice-pdf')?.addEventListener('click', triggerPDF);
  document.getElementById('mobile-btn-download-invoice-pdf')?.addEventListener('click', triggerPDF);
  document.getElementById('btn-mobile-new-invoice')?.addEventListener('click', () => openModal('modal-new-invoice'));

  // --------------------------------------------------------------------------
  // 9. Settings Profile Editing & Form Management
  // --------------------------------------------------------------------------
  let currentEditingField = null;
  const profileDisplayEmail = document.getElementById('profile-display-email');
  const profileDisplayPhone = document.getElementById('profile-display-phone');
  const profileDisplayAddress = document.getElementById('profile-display-address');
  const mobileProfilePhone = document.getElementById('mobile-profile-phone');
  const mobileProfileAddress = document.getElementById('mobile-profile-address');

  const inputEditProfileVal = document.getElementById('input-edit-profile-val');
  const editProfileTitle = document.getElementById('edit-profile-title');
  const editProfileInputLabel = document.getElementById('edit-profile-input-label');

  document.querySelectorAll('[data-edit-field]').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.getAttribute('data-edit-field');
      currentEditingField = field;

      if (field === 'email') {
        if (editProfileTitle) editProfileTitle.textContent = 'Edit Email Address';
        if (editProfileInputLabel) editProfileInputLabel.textContent = 'Email Address';
        if (inputEditProfileVal) inputEditProfileVal.value = profileDisplayEmail?.textContent || '';
      } else if (field === 'phone') {
        if (editProfileTitle) editProfileTitle.textContent = 'Edit Phone Number';
        if (editProfileInputLabel) editProfileInputLabel.textContent = 'Phone Number';
        if (inputEditProfileVal) inputEditProfileVal.value = profileDisplayPhone?.textContent || mobileProfilePhone?.textContent || '';
      } else if (field === 'address') {
        if (editProfileTitle) editProfileTitle.textContent = 'Edit Billing Address';
        if (editProfileInputLabel) editProfileInputLabel.textContent = 'Billing Address';
        if (inputEditProfileVal) inputEditProfileVal.value = profileDisplayAddress?.textContent || mobileProfileAddress?.textContent || '';
      }

      openModal('modal-edit-profile');
    });
  });

  document.getElementById('form-edit-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newVal = inputEditProfileVal?.value.trim();
    if (!newVal) return;

    if (currentEditingField === 'email') {
      if (profileDisplayEmail) profileDisplayEmail.textContent = newVal;
      showToast('Profile email updated successfully.');
    } else if (currentEditingField === 'phone') {
      if (profileDisplayPhone) profileDisplayPhone.textContent = newVal;
      if (mobileProfilePhone) mobileProfilePhone.textContent = newVal;
      showToast('Phone number updated successfully.');
    } else if (currentEditingField === 'address') {
      if (profileDisplayAddress) profileDisplayAddress.textContent = newVal;
      if (mobileProfileAddress) mobileProfileAddress.textContent = newVal;
      showToast('Billing address updated successfully.');
    }

    closeModal(document.getElementById('modal-edit-profile'));
  });

  document.getElementById('btn-change-password')?.addEventListener('click', () => {
    openModal('modal-change-password');
  });

  document.getElementById('form-change-password')?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal(document.getElementById('modal-change-password'));
    showToast('Account password updated securely.');
    e.target.reset();
  });

  document.getElementById('btn-session-history')?.addEventListener('click', () => {
    showToast('2 active sessions (Chrome on macOS, CloudCash Mobile App on iOS)');
  });

  // Settings Toggles Feedback
  document.getElementById('toggle-email-alerts')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Email transaction alerts enabled.' : 'Email transaction alerts disabled.');
  });

  document.getElementById('mobile-toggle-email-alerts')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Email transaction alerts enabled.' : 'Email transaction alerts disabled.');
  });

  document.getElementById('mobile-toggle-push')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Instant mobile push alerts active.' : 'Mobile push alerts disabled.');
  });

  document.getElementById('toggle-weekly-reports')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Weekly sumup digest enabled.' : 'Weekly sumup digest disabled.');
  });

  document.getElementById('toggle-milestone-notifs')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Goal milestone notifications enabled.' : 'Goal milestone notifications disabled.');
  });

  document.getElementById('toggle-2fa')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Two-Factor Authentication active.' : 'Warning: 2FA disabled.');
  });

  document.getElementById('toggle-autopay')?.addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Auto-pay enabled for verified merchants.' : 'Auto-pay disabled.');
  });

  // --------------------------------------------------------------------------
  // 10. Quick Transfer Widget
  // --------------------------------------------------------------------------
  let selectedContact = 'Ann';
  document.querySelectorAll('.contact-avatar-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const contact = pill.getAttribute('data-contact');
      if (!contact) return;
      document.querySelectorAll('.contact-avatar-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedContact = contact;
    });
  });

  document.getElementById('btn-send-transfer')?.addEventListener('click', () => {
    const amountInput = document.getElementById('quick-transfer-amount');
    const amount = parseFloat(amountInput?.value || 0);

    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid transfer amount.');
      amountInput?.focus();
      return;
    }

    showToast(`Successfully transferred $${amount.toFixed(2)} to ${selectedContact}.`);
    if (amountInput) amountInput.value = '0';
  });

  document.getElementById('btn-loan-promo')?.addEventListener('click', () => {
    showToast('CloudCash Pre-Approved Loan: $25,000 at 3.4% APR ready for disbursement.');
  });

  document.getElementById('mobile-btn-add-contact')?.addEventListener('click', () => {
    showToast('Contact picker opened. Select from your phonebook.');
  });

  document.getElementById('btn-add-recipient')?.addEventListener('click', () => {
    showToast('Contact picker opened. Select from your phonebook.');
  });

  // --------------------------------------------------------------------------
  // 11. Modals & Toast Utilities
  // --------------------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.getElementById('btn-quick-add-goal')?.addEventListener('click', () => openModal('modal-new-goal'));
  document.getElementById('btn-add-new-goal-card')?.addEventListener('click', () => openModal('modal-new-goal'));
  document.getElementById('mobile-btn-add-goal')?.addEventListener('click', () => openModal('modal-new-goal'));

  document.getElementById('form-new-invoice')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const client = document.getElementById('input-client-name')?.value;
    const email = document.getElementById('input-client-email')?.value;
    const amount = parseFloat(document.getElementById('input-invoice-amount')?.value || 0);
    const dueDate = document.getElementById('input-invoice-due')?.value || '30 Dec 2024';

    const newInv = {
      id: `INV-2024-00${invoicesData.length + 1}`,
      client,
      email,
      amount,
      issueDate: 'Today',
      dueDate,
      status: 'Pending'
    };

    invoicesData.unshift(newInv);
    selectedInvoiceId = newInv.id;
    renderInvoices();
    updateInvoiceDrawer(newInv);
    closeModal(document.getElementById('modal-new-invoice'));
    showToast(`Invoice ${newInv.id} created for ${client}.`);
    e.target.reset();
  });

  document.getElementById('form-new-goal')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-goal-name')?.value;
    const target = parseFloat(document.getElementById('input-goal-target')?.value || 1000);

    closeModal(document.getElementById('modal-new-goal'));
    showToast(`Milestone goal "${name}" created with target $${target.toLocaleString()}.`);
    e.target.reset();
  });

  document.getElementById('notif-bell-btn')?.addEventListener('click', () => {
    showToast('No new unread alerts.');
  });

  document.getElementById('notif-mail-btn')?.addEventListener('click', () => {
    showToast('All messages synchronized.');
  });

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 12. Real Chart.js Engine for 6-Month Savings Progress & Interactive Analytics
  // --------------------------------------------------------------------------
  let desktopSavingsChartInstance = null;
  let mobileSavingsChartInstance = null;

  function createSavingsChartConfig(ctx) {
    const isDark = document.body.classList.contains('dark-mode');

    let gradient = null;
    try {
      gradient = ctx.createLinearGradient(0, 0, 0, 160);
      gradient.addColorStop(0, isDark ? 'rgba(31, 120, 209, 0.35)' : 'rgba(31, 120, 209, 0.22)');
      gradient.addColorStop(1, 'rgba(31, 120, 209, 0.0)');
    } catch (e) {
      gradient = 'rgba(31, 120, 209, 0.1)';
    }

    return {
      type: 'line',
      data: {
        labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Monthly Savings ($)',
          data: [1850, 2100, 1950, 2850, 2600, 3200],
          borderColor: '#1F78D1',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#1F78D1',
          pointBorderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 7.5,
          pointHoverBorderWidth: 3.5,
          pointHoverBackgroundColor: '#1F78D1',
          pointHoverBorderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? '#1E293B' : '#1F2C3F',
            titleColor: '#FFFFFF',
            titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '700' },
            bodyColor: '#389DE0',
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: '600' },
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4,
            displayColors: false,
            callbacks: {
              label: (item) => `Monthly Savings: $${item.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              color: isDark ? '#94A3B8' : '#8292A1',
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11,
                weight: '600'
              },
              padding: 4
            }
          },
          y: {
            suggestedMin: 1000,
            suggestedMax: 3600,
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
              drawBorder: false,
              borderDash: [4, 4]
            },
            ticks: {
              color: isDark ? '#94A3B8' : '#8292A1',
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 10.5
              },
              padding: 8,
              callback: (val) => '$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val)
            }
          }
        }
      }
    };
  }

  function initSavingsCharts() {
    if (typeof Chart === 'undefined') {
      setTimeout(initSavingsCharts, 150);
      return;
    }

    // 1. Desktop Canvas
    const deskCanvas = document.getElementById('desktop-savings-chart-canvas');
    if (deskCanvas) {
      if (desktopSavingsChartInstance) {
        desktopSavingsChartInstance.destroy();
      }
      const ctx = deskCanvas.getContext('2d');
      desktopSavingsChartInstance = new Chart(ctx, createSavingsChartConfig(ctx));
    }

    // 2. Mobile Canvas
    const mobCanvas = document.getElementById('mobile-savings-chart-canvas');
    if (mobCanvas) {
      if (mobileSavingsChartInstance) {
        mobileSavingsChartInstance.destroy();
      }
      const ctx = mobCanvas.getContext('2d');
      mobileSavingsChartInstance = new Chart(ctx, createSavingsChartConfig(ctx));
    }
  }

  // Initialize charts on load
  initSavingsCharts();
});
