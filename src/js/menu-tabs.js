/**
 * Menu rendering from menu.json + tab system
 * Renders items dynamically, handles tab switching, and URL-param deep-linking.
 */
(function () {
  'use strict';

  function formatPrice(val) {
    return '$' + val.toFixed(2);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  /* ── Central tab activation ─────────────────────────────────────────
     opts.animate (default true)  — play panel entry animation
     opts.scrollTab (default true) — scroll active tab into view in the bar
  ─────────────────────────────────────────────────────────────────── */
  function activateTab(tabId, opts) {
    const doAnimate   = !opts || opts.animate   !== false;
    const doScrollTab = !opts || opts.scrollTab !== false;

    var tabs   = Array.from(document.querySelectorAll('.menu-tab'));
    var panels = Array.from(document.querySelectorAll('.menu-panel'));

    // Nothing to activate — bail cleanly
    if (!tabs.length) return;

    tabs.forEach(function (t) {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(function (p) {
      p.classList.remove('is-active', 'panel-enter');
    });

    var btn   = tabs.find(function (t) { return t.dataset.tab === tabId; });
    var panel = document.getElementById('panel-' + tabId);

    // Unknown tab ID — fall back gracefully to first tab
    if (!btn || !panel) {
      btn   = tabs[0];
      panel = panels[0];
    }

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    panel.classList.add('is-active');

    if (doAnimate) {
      // Force reflow so the animation always restarts from the 'from' keyframe
      void panel.offsetWidth;
      panel.classList.add('panel-enter');
    }

    if (doScrollTab) {
      btn.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }
  }

  function renderMenu(data) {
    var tabsEl   = document.querySelector('.menu-tabs');
    var panelsEl = document.querySelector('.menu-panels');
    if (!tabsEl || !panelsEl) return;

    tabsEl.innerHTML   = '';
    panelsEl.innerHTML = '';

    data.tabs.forEach(function (tab, i) {
      var btn = document.createElement('button');
      btn.className  = 'menu-tab' + (i === 0 ? ' is-active' : '');
      btn.type       = 'button';
      btn.textContent = tab.label;
      btn.dataset.tab = tab.id;
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('role', 'tab');
      tabsEl.appendChild(btn);

      var panel = document.createElement('div');
      panel.className = 'menu-panel' + (i === 0 ? ' is-active' : '');
      panel.id        = 'panel-' + tab.id;
      panel.setAttribute('role', 'tabpanel');
      panel.innerHTML = buildPanel(tab);
      panelsEl.appendChild(panel);
    });

    if (data.footnote) {
      var footer = document.querySelector('.menu-footer .menu-pricing-note');
      if (footer) footer.textContent = data.footnote;
    }

    // Bind click listeners
    document.querySelectorAll('.menu-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn.dataset.tab, { animate: true, scrollTab: true });
      });
    });

    // ── URL param deep-link ──────────────────────────────────────────
    // e.g. menu.html?tab=curries
    // Uses a 60ms setTimeout (vs rAF) so the browser has completed
    // its initial layout pass — more reliable across browsers.
    // Then scrolls the entire page to the menu section so the correct
    // panel is visible immediately without requiring manual scrolling.
    var tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam) {
      setTimeout(function () {
        // Activate the correct tab (no panel animation — it's a page load)
        activateTab(tabParam, { animate: false, scrollTab: true });

        // Scroll the page so the tab bar + panel are visible
        var menuSection = document.getElementById('menu');
        if (menuSection) {
          var headerOffset = 80; // match sticky header height
          var top = menuSection.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 60);
    }
  }

  function init() {
    fetch('src/data/menu.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { renderMenu(data); })
      .catch(function (err) { console.warn('Menu data failed to load:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BRMenu = { activateTab: activateTab };
})();
