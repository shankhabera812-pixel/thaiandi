/**
 * Menu rendering from menu.json + tab system
 * Renders items dynamically and handles tab switching and category-oval linking
 */
(function () {
  'use strict';

  const TOAST_URL    = 'https://www.toasttab.com/brown-rice-2-184-west-boylston-street/v3';
  const GRUBHUB_URL  = 'https://brownricethaicuisine.dine.online/';
  const DOORDASH_URL = 'https://order.online/business/brown-rice-2-thai-cuisine--11626800';

  function formatPrice(val) {
    return '$' + val.toFixed(2);
  }

  function buildMenuRow(item, priceFrom) {
    const priceStr = priceFrom
      ? 'from ' + formatPrice(priceFrom)
      : item.priceFrom
      ? 'from ' + formatPrice(item.priceFrom)
      : item.price
      ? formatPrice(item.price)
      : '';

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

  function buildItemsGrid(items, priceFrom) {
    return `<div class="menu-items-grid">${items.map(i => buildMenuRow(i, priceFrom)).join('')}</div>`;
  }

  function buildSubsectionPeriodLabel(period) {
    const labels = { lunch: 'Lunch', dinner: 'Dinner' };
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

    if (tab.id === 'desserts') {
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
