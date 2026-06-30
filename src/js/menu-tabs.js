/**
 * Menu rendering from menu.json + tab system
 * Renders items dynamically and handles tab switching and category-oval linking
 */
(function () {
  'use strict';

  const TOAST_URL    = 'https://order.toasttab.com/online/thai-i';
  const GRUBHUB_URL  = 'https://www.grubhub.com/restaurant/thai-and-i-restaurant-274-south-st-shrewsbury/2196678';
  const DOORDASH_URL = 'https://www.doordash.com/store/thai-and-i-shrewsbury-865539/';

  function formatPrice(val) {
    return '$' + val.toFixed(2);
  }

  function buildMenuRow(item, priceFrom) {
    let priceStr = '';
    if (item.price != null && item.price !== '') {
      priceStr = formatPrice(item.price);
    } else if (item.priceFrom != null) {
      priceStr = 'From ' + formatPrice(item.priceFrom);
    } else if (priceFrom != null) {
      priceStr = 'From ' + formatPrice(priceFrom);
    }

    return `
      <div class="menu-item">
        <div class="menu-item-row">
          <span class="menu-item-name">${escapeHtml(item.name)}</span>
          <span class="menu-item-dots" aria-hidden="true"></span>
          ${priceStr ? `<span class="menu-item-price">${priceStr}</span>` : ''}
        </div>
        ${item.description ? `<p class="menu-item-desc">${escapeHtml(item.description)}</p>` : ''}
      </div>`;
  }

  function buildProteinTierBlock(proteinTiers) {
    if (!proteinTiers || !proteinTiers.length) return '';

    const rows = proteinTiers.map(tier => `
      <div class="menu-protein-tier-row">
        <span class="menu-protein-tier-label">${escapeHtml(tier.label)}</span>
        <span class="menu-protein-tier-dots" aria-hidden="true"></span>
        <span class="menu-protein-tier-price">${formatPrice(tier.price)}</span>
      </div>`).join('');

    return `
      <div class="menu-protein-tiers" aria-label="Protein options and prices">
        <span class="menu-protein-tiers-label">Protein options</span>
        ${rows}
      </div>`;
  }

  function buildItemsGrid(items, priceFrom) {
    return `<div class="menu-items-grid">${items.map(i => buildMenuRow(i, priceFrom)).join('')}</div>`;
  }

  function buildSubsectionPeriodLabel(period) {
    const labels = {
      lunch:  'Lunch <span class="menu-period-time">until 3 PM</span>',
      dinner: 'Dinner <span class="menu-period-time">after 3 PM</span>'
    };
    return `<span class="menu-period-label">${labels[period] || ''}</span>`;
  }

  function buildPanel(tab) {
    let html = '';

    if (tab.intro) {
      html += `<p class="menu-panel-intro">${escapeHtml(tab.intro)}</p>`;
    }

    if (tab.proteinItem) {
      html += `<p class="menu-protein-note">Choose your protein at checkout — prices shown are starting prices.</p>`;
    }

    if (tab.id === 'dessert') {
      html += `
        <div class="menu-dessert-accent">
          <img src="assets/images/desertheroshot.jpg"
               alt="Mango with sweet sticky rice — house dessert"
               loading="lazy"
               onerror="this.parentElement.style.display='none'">
        </div>`;
    }

    if (tab.dualPeriod) {
      tab.subsections.forEach(sub => {
        html += `<div class="menu-period-group">`;
        html += buildSubsectionPeriodLabel(sub.period);
        html += buildProteinTierBlock(sub.proteinTiers);
        html += buildItemsGrid(sub.items, sub.priceFrom || null);
        html += `</div>`;
      });
    } else {
      // Check for drink groupLabels
      tab.subsections.forEach(sub => {
        if (sub.groupLabel) {
          html += `<div class="menu-period-group">`;
          html += `<span class="menu-period-label">${escapeHtml(sub.groupLabel)}</span>`;
          html += buildItemsGrid(sub.items);
          html += `</div>`;
        } else {
          html += buildItemsGrid(sub.items);
        }
      });
    }

    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderMenu(data) {
    const tabsEl   = document.querySelector('.menu-tabs');
    const panelsEl = document.querySelector('.menu-panels');
    if (!tabsEl || !panelsEl) return;

    tabsEl.innerHTML   = '';
    panelsEl.innerHTML = '';

    data.tabs.forEach((tab, i) => {
      // Tab button
      const btn = document.createElement('button');
      btn.className   = 'menu-tab' + (i === 0 ? ' is-active' : '');
      btn.type        = 'button';
      btn.textContent = tab.label;
      btn.dataset.tab = tab.id;
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('role', 'tab');
      tabsEl.appendChild(btn);

      // Panel
      const panel = document.createElement('div');
      panel.className   = 'menu-panel' + (i === 0 ? ' is-active' : '');
      panel.id          = 'panel-' + tab.id;
      panel.setAttribute('role', 'tabpanel');
      panel.innerHTML   = buildPanel(tab);
      panelsEl.appendChild(panel);
    });

    // Footnote
    if (data.footnote) {
      const footer = document.querySelector('.menu-footer .menu-pricing-note');
      if (footer) footer.textContent = data.footnote;
    }

    bindTabClicks();

    // Activate tab from URL parameter — e.g. menu.html?tab=curries
    // Used by category strip links on index.html to deep-link into specific tabs.
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam  = urlParams.get('tab');
    if (tabParam) {
      const targetBtn = document.querySelector(`.menu-tab[data-tab="${tabParam}"]`);
      if (targetBtn) {
        // Short delay ensures DOM paint is complete before activating
        setTimeout(() => targetBtn.click(), 60);
      }
    }
  }

  function bindTabClicks() {
    const tabs   = Array.from(document.querySelectorAll('.menu-tab'));
    const panels = Array.from(document.querySelectorAll('.menu-panel'));

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const target = document.getElementById('panel-' + btn.dataset.tab);
        if (target) target.classList.add('is-active');

        // Scroll tab into view on mobile
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  }

  function activateMenuTab(tabId) {
    const menuSection = document.querySelector('#menu');
    const target = document.querySelector(`.menu-tab[data-tab="${tabId}"]`);
    if (!menuSection || !target) return;

    // Scroll to menu section
    menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Activate tab after scroll lands (short delay)
    setTimeout(() => {
      target.click();
    }, 600);
  }

  // Wire category oval cards to menu tabs
  function bindCategoryCards() {
    document.querySelectorAll('[data-menu-tab]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = card.dataset.menuTab;
        activateMenuTab(tabId);
      });
    });
  }

  // Load menu data and render
  function init() {
    fetch('src/data/menu.json')
      .then(r => r.json())
      .then(data => {
        renderMenu(data);
        bindCategoryCards();
      })
      .catch(err => {
        console.warn('Menu data failed to load:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.BRMenu = { activateMenuTab };
})();
