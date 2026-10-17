/* ==========================================================================
   البيت اللامع لخدمات النظافة والصيانة المنزلية العامة - ملف التفاعلات (Main JavaScript)
   ========================================================================== */

(function () {
  'use strict';

  // 1. Idempotent initialization guard to prevent duplicate event listener bindings
  if (window.__APP_SCRIPT_INITIALIZED__) {
    return;
  }
  window.__APP_SCRIPT_INITIALIZED__ = true;

  // Automatically sync active state for navigation links across all pages
  function syncActiveNavLinks() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentFile = rawPath.split('#')[0] || 'index.html';

    // Desktop nav items
    document.querySelectorAll('.desktop-nav > .nav-item').forEach((item) => {
      const href = item.getAttribute('href');
      if (href) {
        const itemFile = href.split('/').pop().split('#')[0];
        item.classList.toggle('active', itemFile === currentFile);
      }
    });

    // Special category highlights for Appliance Maintenance vs Cleaning & Pest Control
    const megaWrapper = document.getElementById('megaMenuWrapper');
    const cleaningWrapper = document.getElementById('cleaningNavWrapper');

    if (
      currentFile === 'service-marble-polishing.html' ||
      currentFile === 'service-cleaning.html' ||
      currentFile === 'service-tanks.html' ||
      currentFile === 'service-upholstery.html' ||
      currentFile === 'service-pest-control.html'
    ) {
      cleaningWrapper?.classList.add('active');
      megaWrapper?.classList.remove('active');
    } else if (
      currentFile === 'services.html' ||
      currentFile.startsWith('service-') ||
      currentFile.startsWith('brand-') ||
      currentFile === 'cooling.html' ||
      currentFile === 'cooking.html' ||
      currentFile === 'dishwashers.html' ||
      currentFile === 'dryers.html' ||
      currentFile === 'heaters.html'
    ) {
      megaWrapper?.classList.add('active');
      cleaningWrapper?.classList.remove('active');
    }

    // Mobile drawer links
    document.querySelectorAll('.drawer-content .drawer-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        const linkFile = href.split('/').pop().split('#')[0];
        link.classList.toggle('active', linkFile === currentFile);
      }
    });
  }

  function initApp() {
    if (window.__APP_INIT_DONE__) return;
    window.__APP_INIT_DONE__ = true;

    // Apply active navigation state
    syncActiveNavLinks();

    // -------------------------------------------------------------
    // Mobile Drawer Navigation
    // -------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');

    function isDrawerOpen() {
      return !!(mobileDrawer && mobileDrawer.classList.contains('open'));
    }

    function openDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.add('open');
      drawerBackdrop?.classList.add('active');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }

    function closeDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.remove('open');
      drawerBackdrop?.classList.remove('active');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    function toggleDrawer(e) {
      if (e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }
      if (isDrawerOpen()) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    let lastToggleTime = 0;
    function safeToggleDrawer(e) {
      const now = Date.now();
      if (now - lastToggleTime < 300) {
        if (e && e.cancelable) e.preventDefault();
        return;
      }
      lastToggleTime = now;
      toggleDrawer(e);
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', safeToggleDrawer);
      hamburgerBtn.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') {
          safeToggleDrawer(e);
        }
      });
    }

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      });
      drawerBackdrop.addEventListener('touchstart', () => {
        closeDrawer();
      }, { passive: true });
    }

    // Global document-level event delegation
    document.addEventListener('click', (e) => {
      const targetHamburger = e.target.closest('#hamburgerBtn, .hamburger-btn');
      if (targetHamburger) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        safeToggleDrawer(e);
        return;
      }

      const targetClose = e.target.closest('#closeDrawerBtn, .close-drawer-btn');
      if (targetClose) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        closeDrawer();
        return;
      }

      const targetBackdrop = e.target.closest('#drawerBackdrop, .drawer-backdrop');
      if (targetBackdrop) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        closeDrawer();
        return;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDrawerOpen()) {
        closeDrawer();
      }
    });

    // Mobile drawer link clicks
    document.querySelectorAll('.mobile-drawer a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (
          href.startsWith('tel:') ||
          href.startsWith('mailto:') ||
          href.startsWith('http') ||
          link.getAttribute('target') === '_blank'
        ) {
          closeDrawer();
          return;
        }

        if (href.startsWith('#')) {
          e.preventDefault();
          closeDrawer();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const [linkPage, linkHash] = href.split('#');

        if (linkHash && (linkPage === '' || linkPage === currentPath)) {
          e.preventDefault();
          closeDrawer();
          const target = document.getElementById(linkHash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        closeDrawer();
      });
    });

    // -------------------------------------------------------------
    // Dropdown Hover Intent / Grace Delay (Fixes Hover Drop Bug)
    // -------------------------------------------------------------
    function setupDropdownHoverGrace(wrapperSelector, panelSelector) {
      const wrapper = document.querySelector(wrapperSelector);
      const panel = document.querySelector(panelSelector);
      if (!wrapper || !panel) return;

      let closeTimer = null;

      function openMenu() {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        wrapper.classList.add('hover-active');
        panel.classList.add('open');
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
        panel.style.transform = 'translateY(0)';
      }

      function scheduleClose() {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          wrapper.classList.remove('hover-active');
          panel.classList.remove('open');
          panel.style.opacity = '';
          panel.style.visibility = '';
          panel.style.pointerEvents = '';
          panel.style.transform = '';
          closeTimer = null;
        }, 320); // 320ms generous buffer for smooth downward cursor travel
      }

      wrapper.addEventListener('mouseenter', openMenu);
      wrapper.addEventListener('mouseleave', scheduleClose);
      panel.addEventListener('mouseenter', openMenu);
      panel.addEventListener('mouseleave', scheduleClose);
    }

    setupDropdownHoverGrace('#megaMenuWrapper', '#desktopMegaMenu');
    setupDropdownHoverGrace('#cleaningNavWrapper', '#cleaningDropdownPanel');

    // -------------------------------------------------------------
    // Desktop Mega Menu Tabs (Appliance vs Brand vs Cleaning)
    // -------------------------------------------------------------
    const tabApplianceTrigger = document.getElementById('tabApplianceTrigger');
    const tabBrandTrigger = document.getElementById('tabBrandTrigger');
    const tabCleaningTrigger = document.getElementById('tabCleaningTrigger');
    const panelByAppliance = document.getElementById('panelByAppliance');
    const panelByBrand = document.getElementById('panelByBrand');
    const panelByCleaning = document.getElementById('panelByCleaning');

    function switchDesktopMode(activeBtn, targetPanel) {
      [tabApplianceTrigger, tabBrandTrigger, tabCleaningTrigger].forEach((btn) => {
        if (!btn) return;
        btn.classList.toggle('active', btn === activeBtn);
        btn.setAttribute('aria-selected', String(btn === activeBtn));
      });
      [panelByAppliance, panelByBrand, panelByCleaning].forEach((panel) => {
        if (!panel) return;
        panel.classList.toggle('active', panel === targetPanel);
      });
    }

    tabApplianceTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      switchDesktopMode(tabApplianceTrigger, panelByAppliance);
    });

    tabBrandTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      switchDesktopMode(tabBrandTrigger, panelByBrand);
    });

    tabCleaningTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      switchDesktopMode(tabCleaningTrigger, panelByCleaning);
    });

    // Master-Detail Category Switcher (Hover & Click)
    const applianceNavButtons = document.querySelectorAll('.appliance-nav-btn');
    const subpanels = document.querySelectorAll('.mega-subpanel');

    function activateSubpanel(targetId, activeBtn) {
      applianceNavButtons.forEach((btn) => btn.classList.toggle('active', btn === activeBtn));
      subpanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    }

    applianceNavButtons.forEach((btn) => {
      const targetId = btn.getAttribute('data-target');
      const href = btn.getAttribute('data-href');
      btn.addEventListener('mouseenter', () => activateSubpanel(targetId, btn));
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.category-direct-link')) {
          return;
        }
        if (btn.classList.contains('active') && href) {
          window.location.href = href;
          return;
        }
        e.preventDefault();
        activateSubpanel(targetId, btn);
      });
    });

    // -------------------------------------------------------------
    // Mobile Segmented Tab Controller (Appliances | Cleaning | Brands)
    // -------------------------------------------------------------
    const mobTabApplianceBtn = document.getElementById('mobTabApplianceBtn');
    const mobTabCleaningBtn = document.getElementById('mobTabCleaningBtn');
    const mobTabBrandBtn = document.getElementById('mobTabBrandBtn');
    const mobPanelAppliance = document.getElementById('mobPanelAppliance');
    const mobPanelCleaning = document.getElementById('mobPanelCleaning');
    const mobPanelBrand = document.getElementById('mobPanelBrand');

    function switchMobileSegment(activeBtn, targetPanel) {
      [mobTabApplianceBtn, mobTabCleaningBtn, mobTabBrandBtn].forEach((btn) => {
        btn?.classList.toggle('active', btn === activeBtn);
      });
      [mobPanelAppliance, mobPanelCleaning, mobPanelBrand].forEach((panel) => {
        panel?.classList.toggle('active', panel === targetPanel);
      });
    }

    mobTabApplianceBtn?.addEventListener('click', () => {
      switchMobileSegment(mobTabApplianceBtn, mobPanelAppliance);
    });

    mobTabCleaningBtn?.addEventListener('click', () => {
      switchMobileSegment(mobTabCleaningBtn, mobPanelCleaning);
    });

    mobTabBrandBtn?.addEventListener('click', () => {
      switchMobileSegment(mobTabBrandBtn, mobPanelBrand);
    });

    // Mobile Sub-Accordion Toggle
    document.querySelectorAll('.mob-accordion-header').forEach((header) => {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        const body = header.nextElementSibling;
        const isOpen = body?.classList.toggle('open');
        header.setAttribute('aria-expanded', String(isOpen));

        const chevron = header.querySelector('.chevron');
        if (chevron) {
          chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    });

    // -------------------------------------------------------------
    // FAQ Accordion
    // -------------------------------------------------------------
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');

        const parent = item.parentElement;
        parent?.querySelectorAll('.faq-item.open').forEach((other) => {
          if (other !== item) other.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });
    });

    // -------------------------------------------------------------
    // Booking & Contact Forms Handling
    // -------------------------------------------------------------
    const bookingForms = document.querySelectorAll('form[id*="booking"], form[id*="contact"], form[id*="Form"]');
    bookingForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('input[name="name"], input[id*="name"], input[id*="Name"]');
        const phoneInput = form.querySelector('input[name="phone"], input[id*="phone"], input[id*="Phone"]');

        if (nameInput && !nameInput.value.trim()) {
          alert('يرجى إدخال الاسم الكريم.');
          nameInput.focus();
          return;
        }

        if (phoneInput && !phoneInput.value.trim()) {
          alert('يرجى إدخال رقم الهاتف للتواصل.');
          phoneInput.focus();
          return;
        }

        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'form-feedback success';
          form.appendChild(feedback);
        }

        feedback.innerHTML = `
          <strong>تم استلام بيانات طلبك بنجاح!</strong><br>
          سيتواصل معك ممثل خدمة العملاء في أقرب وقت لتأكيد الموعد ونوع الخدمة.<br>
          للحصول على خدمة فورية الآن، يمكنك الاتصال مباشرة على: 
          <a href="tel:0570406738" style="color:#059669;font-weight:bold;">0570406738</a> أو مراسلتنا عبر 
          <a href="https://wa.me/966570406738" target="_blank" rel="noopener" style="color:#25d366;font-weight:bold;">واتساب</a>.
        `;
        feedback.style.display = 'block';
        form.reset();
      });
    });
  }

  function checkDynamicNavbar(callback) {
    const placeholder = document.querySelector('site-navbar, #navbar-placeholder, [data-navbar-placeholder]');
    if (placeholder && placeholder.innerHTML.trim() === '') {
      fetch('navbar.html')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((html) => {
          placeholder.innerHTML = html;
          callback();
        })
        .catch((err) => {
          console.warn('Dynamic navbar fetch skipped:', err);
          callback();
        });
    } else {
      callback();
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('site-navbar')) {
    customElements.define('site-navbar', class extends HTMLElement {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => checkDynamicNavbar(initApp));
  } else {
    checkDynamicNavbar(initApp);
  }
})();
