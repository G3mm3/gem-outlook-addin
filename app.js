/* ==============================================
   Plain Sailing — Operational Intelligence
   app.js — Data, Charts & Interactivity
   ============================================== */

'use strict';

// ──────────────────────────────────────────────
// CLOCK & DATE
// ──────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('dateDisplay').textContent = d;
}

setInterval(updateClock, 1000);
updateClock();

// ──────────────────────────────────────────────
// WEATHER DATA
// ──────────────────────────────────────────────

const WEATHER_FORECAST = [
  { day: 'Tue', icon: '☀️', high: 24, low: 18, rain: '0%',  impact: 88, color: 'high' },
  { day: 'Wed', icon: '⛅',  high: 22, low: 17, rain: '10%', impact: 75, color: 'high' },
  { day: 'Thu', icon: '🌧️', high: 19, low: 15, rain: '80%', impact: 45, color: 'low'  },
  { day: 'Fri', icon: '🌦️', high: 20, low: 16, rain: '40%', impact: 60, color: 'mid'  },
  { day: 'Sat', icon: '☀️', high: 26, low: 19, rain: '0%',  impact: 95, color: 'high' },
  { day: 'Sun', icon: '☀️', high: 27, low: 20, rain: '0%',  impact: 92, color: 'high' },
];

function renderWeather() {
  const forecastEl = document.getElementById('weatherForecast');
  forecastEl.innerHTML = WEATHER_FORECAST.map(d => `
    <div class="weather-day">
      <div class="weather-day-name">${d.day}</div>
      <div class="weather-day-icon">${d.icon}</div>
      <div class="weather-day-temp">${d.high}°</div>
      <div class="weather-day-rain">${d.rain}</div>
    </div>
  `).join('');

  const trafficEl = document.getElementById('trafficBars');
  trafficEl.innerHTML = WEATHER_FORECAST.map(d => `
    <div class="impact-item">
      <span style="font-size:0.65rem;color:var(--text-muted);width:28px;">${d.day}</span>
      <div class="impact-bar">
        <div class="impact-fill ${d.color}" style="width:0%" data-width="${d.impact}%"></div>
      </div>
      <span class="impact-label">${d.impact}%</span>
    </div>
  `).join('');

  // Animate bars after render
  setTimeout(() => {
    document.querySelectorAll('.impact-fill').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 100);
}

renderWeather();

// ──────────────────────────────────────────────
// MENU DATA
// ──────────────────────────────────────────────

const MENU_ITEMS = [
  { rank: 1, name: 'Crispy Skin Barramundi',  cat: 'Mains',     rev: 1284, qty: 38, margin: 72, pct: 100 },
  { rank: 2, name: 'Truffle Parmesan Fries',  cat: 'Sides',     rev:  960, qty: 64, margin: 81, pct: 75  },
  { rank: 3, name: 'Wagyu Burger 200g',       cat: 'Mains',     rev:  840, qty: 24, margin: 58, pct: 65  },
  { rank: 4, name: 'Aperol Spritz',           cat: 'Cocktails', rev:  720, qty: 60, margin: 78, pct: 56  },
  { rank: 5, name: 'Cauliflower Shawarma',    cat: 'Mains',     rev:  615, qty: 18, margin: 74, pct: 48  },
  { rank: 6, name: 'Smashed Avo Toast',       cat: 'Brunch',    rev:  560, qty: 35, margin: 69, pct: 44  },
  { rank: 7, name: 'Oat Flat White',          cat: 'Coffee',    rev:  495, qty: 99, margin: 82, pct: 39  },
  { rank: 8, name: 'House-made Tiramisu',     cat: 'Dessert',   rev:  432, qty: 27, margin: 76, pct: 34  },
];

function buildMenuRow(item, valueKey, maxVal, label) {
  const isTop = item.rank <= 3;
  const pct = Math.round((item[valueKey] / maxVal) * 100);
  const displayVal = valueKey === 'rev'    ? `$${item.rev}`
                   : valueKey === 'qty'    ? `${item.qty} sold`
                   : `${item.margin}%`;
  const subVal   = valueKey === 'rev'    ? `${item.qty} sold`
                 : valueKey === 'qty'    ? `$${item.rev}`
                 : `$${item.rev}`;

  return `
    <div class="menu-item-row">
      <div class="menu-rank ${isTop ? 'top' : ''}">${item.rank}</div>
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-cat">${item.cat}</div>
      </div>
      <div class="menu-bar-wrap">
        <div class="menu-bar-fill ${isTop ? 'gold' : ''}" style="width:0%" data-width="${pct}%"></div>
      </div>
      <div class="menu-item-rev">${displayVal}</div>
      <div class="menu-item-sold">${subVal}</div>
    </div>
  `;
}

function renderMenuList(containerId, valueKey) {
  const maxVal = Math.max(...MENU_ITEMS.map(i => i[valueKey]));
  document.getElementById(containerId).innerHTML =
    MENU_ITEMS.map(item => buildMenuRow(item, valueKey, maxVal)).join('');

  setTimeout(() => {
    document.querySelectorAll(`#${containerId} .menu-bar-fill`).forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 80);
}

renderMenuList('menuListRevenue', 'rev');
renderMenuList('menuListQty',     'qty');
renderMenuList('menuListMargin',  'margin');

// Menu tab switching
function switchMenuTab(key, tabEl) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  tabEl.classList.add('active');
  const panel = document.getElementById(`menu-tab-${key}`);
  if (panel) panel.classList.add('active');

  // Trigger bar animations
  const containerId = `menuList${key.charAt(0).toUpperCase() + key.slice(1)}`;
  setTimeout(() => {
    document.querySelectorAll(`#${containerId} .menu-bar-fill`).forEach(el => {
      el.style.width = '0%';
    });
    setTimeout(() => {
      document.querySelectorAll(`#${containerId} .menu-bar-fill`).forEach(el => {
        el.style.width = el.dataset.width;
      });
    }, 50);
  }, 10);
}

// Menu hourly chart
function initMenuChart() {
  const ctx = document.getElementById('menuChart').getContext('2d');
  const labels = ['10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','Now'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Food ($)',
          data: [180, 240, 820, 960, 540, 310, 280, 620, 980, 1100, 890, 320],
          backgroundColor: 'rgba(45,212,191,0.6)',
          borderRadius: 4,
          stack: 'revenue',
        },
        {
          label: 'Beverage ($)',
          data: [80, 110, 360, 420, 210, 180, 220, 380, 490, 560, 430, 170],
          backgroundColor: 'rgba(245,158,11,0.6)',
          borderRadius: 4,
          stack: 'revenue',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94A3B8',
            font: { size: 11 },
            boxWidth: 12,
            padding: 10,
          }
        },
        tooltip: {
          backgroundColor: '#1A2D42',
          titleColor: '#F0F4F8',
          bodyColor: '#94A3B8',
          borderColor: '#243B55',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` $${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#546E8A', font: { size: 10 } },
          grid: { color: 'rgba(36,59,85,0.5)' }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#546E8A',
            font: { size: 10 },
            callback: v => `$${v}`
          },
          grid: { color: 'rgba(36,59,85,0.5)' }
        }
      }
    }
  });
}

initMenuChart();

// ──────────────────────────────────────────────
// STAFFING / ROSTER DATA
// ──────────────────────────────────────────────

const ROSTER = [
  { name: 'Maya Chen',      role: 'Head Chef',        hours: '7am–3pm',  wage: '$312', color: '#2DD4BF', status: 'on',    initials: 'MC' },
  { name: 'Jake Okafor',    role: 'Sous Chef',         hours: '9am–5pm',  wage: '$248', color: '#10B981', status: 'on',    initials: 'JO' },
  { name: 'Priya Sharma',   role: 'Floor Manager',     hours: '11am–9pm', wage: '$280', color: '#F59E0B', status: 'on',    initials: 'PS' },
  { name: 'Tom Wilder',     role: 'Bartender',         hours: '2pm–10pm', wage: '$230', color: '#6366F1', status: 'on',    initials: 'TW' },
  { name: 'Chloe Adams',    role: 'Wait Staff',        hours: '11am–7pm', wage: '$196', color: '#EC4899', status: 'break', initials: 'CA' },
  { name: 'Liam Torres',    role: 'Wait Staff',        hours: '5pm–11pm', wage: '$160', color: '#14B8A6', status: 'soon',  initials: 'LT' },
  { name: 'Sarah Kim',      role: 'Barista / Runner',  hours: '7am–3pm',  wage: '$175', color: '#F97316', status: 'on',    initials: 'SK' },
  { name: 'Dev Patel',      role: 'Dishwasher / Prep', hours: '10am–6pm', wage: '$178', color: '#84CC16', status: 'on',    initials: 'DP' },
  { name: 'Nico Bellini',   role: 'Sommelier',         hours: '5pm–11pm', wage: '$200', color: '#A78BFA', status: 'soon',  initials: 'NB' },
];

function statusLabel(s) {
  if (s === 'on')    return 'On shift';
  if (s === 'break') return 'On break';
  if (s === 'soon')  return 'Starting 5pm';
  return '';
}

function renderRoster() {
  document.getElementById('rosterList').innerHTML = ROSTER.map(s => `
    <div class="roster-item">
      <div class="roster-avatar" style="background:${s.color}22;color:${s.color};">
        ${s.initials}
      </div>
      <div class="roster-info">
        <div class="roster-name">${s.name}</div>
        <div class="roster-role">${s.role} · ${statusLabel(s.status)}</div>
      </div>
      <div class="roster-hours">${s.hours}</div>
      <div class="roster-cost">${s.wage}</div>
      <div class="roster-status status-${s.status}"></div>
    </div>
  `).join('');
}

renderRoster();

function initLaborChart() {
  const ctx = document.getElementById('laborChart').getContext('2d');
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Labour %',
          data: [28, 26, 31, 29, 25, 24, 27],
          borderColor: '#2DD4BF',
          backgroundColor: 'rgba(45,212,191,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2DD4BF',
          pointRadius: 3,
        },
        {
          label: 'Target %',
          data: [28, 28, 28, 28, 28, 28, 28],
          borderColor: 'rgba(245,158,11,0.5)',
          borderDash: [4, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94A3B8', font: { size: 10 }, boxWidth: 10, padding: 8 }
        },
        tooltip: {
          backgroundColor: '#1A2D42',
          titleColor: '#F0F4F8',
          bodyColor: '#94A3B8',
          borderColor: '#243B55',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#546E8A', font: { size: 10 } },
          grid: { color: 'rgba(36,59,85,0.5)' }
        },
        y: {
          min: 20, max: 35,
          ticks: {
            color: '#546E8A',
            font: { size: 10 },
            callback: v => `${v}%`
          },
          grid: { color: 'rgba(36,59,85,0.5)' }
        }
      }
    }
  });
}

initLaborChart();

// ──────────────────────────────────────────────
// TRENDING ITEMS
// ──────────────────────────────────────────────

const TRENDING = [
  { name: 'Smash Burgers',       source: 'TikTok · Reddit',         pct: 94, type: 'fire', arrow: '🔥', tag: 'HOT' },
  { name: 'Birria Tacos',        source: 'Instagram · Local search', pct: 87, type: 'fire', arrow: '🔥', tag: 'HOT' },
  { name: 'Non-alcoholic Negroni', source: 'r/cocktails · Eater',   pct: 80, type: 'up',   arrow: '↑',  tag: 'RISING' },
  { name: 'Yuzu Desserts',       source: 'r/sydney · Broadsheet',   pct: 73, type: 'new',  arrow: '★',  tag: 'NEW'  },
  { name: 'Wagyu Everything',    source: 'r/food · Time Out SYD',   pct: 78, type: 'up',   arrow: '↑',  tag: 'RISING' },
  { name: 'Zero-waste Cocktails',source: 'Instagram · Drinks+',     pct: 65, type: 'new',  arrow: '★',  tag: 'EMERGING' },
];

function renderTrending() {
  document.getElementById('trendGrid').innerHTML = TRENDING.map(t => `
    <div class="trend-item">
      <div class="trend-header">
        <div class="trend-name">${t.name}</div>
        <div class="trend-arrow ${t.type}">${t.arrow}</div>
      </div>
      <div class="trend-source">${t.source}</div>
      <div class="trend-bar-wrap">
        <div class="trend-bar-fill ${t.type}" style="width:0%" data-width="${t.pct}%"></div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.trend-bar-fill').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 150);
}

renderTrending();

// ──────────────────────────────────────────────
// REDDIT / SOCIAL MENTIONS
// ──────────────────────────────────────────────

const MENTIONS = [
  {
    subreddit: 'r/sydney',
    user: 'u/beachhopperNSW',
    time: '41 min ago',
    text: 'Went to <strong>The Anchor Bar</strong> last night — the <strong>Crispy Skin Barramundi</strong> was genuinely one of the best things I\'ve eaten this year. Service was spot-on too.',
    upvotes: '↑ 248',
    sentiment: 'positive',
  },
  {
    subreddit: 'r/AusFood',
    user: 'u/urbanfork_mel',
    time: '1h 20min ago',
    text: 'Has anyone been to <strong>The Anchor</strong> recently? Looking for a relaxed spot in Surry Hills for a work dinner this week.',
    upvotes: '↑ 34',
    sentiment: 'neutral',
  },
  {
    subreddit: 'r/sydney',
    user: 'u/grillmaster_jt',
    time: '2h 5min ago',
    text: 'The <strong>Truffle Parmesan Fries</strong> at The Anchor are dangerous. Ordered them as a side and ended up ordering a second round. No regrets. 🧀',
    upvotes: '↑ 176',
    sentiment: 'positive',
  },
  {
    subreddit: 'r/cocktails',
    user: 'u/pouroverphil',
    time: '3h ago',
    text: 'Their <strong>Aperol Spritz</strong> menu is solid but I wish they had more low-ABV options. The bartender knew his stuff at least.',
    upvotes: '↑ 58',
    sentiment: 'neutral',
  },
  {
    subreddit: 'r/sydneyfood',
    user: 'u/veganvoyage99',
    time: '4h 15min ago',
    text: 'Went with a group — limited vegan mains. The <strong>Cauliflower Shawarma</strong> was okay but felt like an afterthought on the menu. Would appreciate more options.',
    upvotes: '↑ 22',
    sentiment: 'negative',
  },
];

function renderMentions() {
  document.getElementById('mentionFeed').innerHTML = MENTIONS.map(m => `
    <div class="mention-item ${m.sentiment}">
      <div class="mention-meta">
        <span class="mention-subreddit">${m.subreddit}</span>
        <span class="mention-user">${m.user}</span>
        <span class="mention-time">${m.time}</span>
      </div>
      <div class="mention-text">${m.text}</div>
      <div class="mention-score">
        <span class="mention-upvotes">${m.upvotes}</span>
        <span class="sentiment-pill sentiment-${m.sentiment}">${m.sentiment}</span>
      </div>
    </div>
  `).join('');
}

renderMentions();

// ──────────────────────────────────────────────
// SUPPLIER DEALS
// ──────────────────────────────────────────────

let DEALS = [
  {
    id: 1,
    supplier: 'Sydney Wine Co.',
    title: '20% off all Barossa Shiraz — March special',
    desc: 'Reduce excess stock before end-of-month inventory. Min. 12-bottle order. Includes free delivery to inner Sydney.',
    saving: 'Save 20% · ~$380 on a case',
    expiry: 'Expires 31 Mar',
    isNew: true,
  },
  {
    id: 2,
    supplier: 'Pacific Seafood Direct',
    title: 'Wild-caught Barramundi — $12.50/kg this week',
    desc: 'Premium Port Macquarie Barramundi, down from $17/kg. Pre-order by Wed for Thu delivery. Grade A, whole fish or fillets.',
    saving: 'Save $4.50/kg',
    expiry: 'Expires 26 Mar',
    isNew: true,
  },
  {
    id: 3,
    supplier: 'Coastal Produce Co.',
    title: 'Heirloom tomato surplus — buy 5 trays get 1 free',
    desc: 'Excess harvest from the Hunter Valley. Perfect for bruschetta, salads, sauces. Mixed heirloom varieties. Call ahead to confirm availability.',
    saving: 'Save 1 tray (~$28)',
    expiry: 'Expires 25 Mar',
    isNew: true,
  },
  {
    id: 4,
    supplier: 'Lion Nathan',
    title: 'XXXX Gold tap deal — fixed pricing Q2',
    desc: 'Lock in pricing on XXXX Gold kegs for April–June. $185/keg (currently $210). Volume commitment of 4 kegs/month.',
    saving: 'Save $25/keg',
    expiry: 'Sign by 1 Apr',
    isNew: false,
  },
  {
    id: 5,
    supplier: 'Organic Roots Farms',
    title: 'Winter root veg box — weekly subscription',
    desc: 'Weekly delivery of seasonal root vegetables. Celeriac, parsnip, heirloom carrots, fennel. Includes recipe suggestions.',
    saving: '15% off first 4 deliveries',
    expiry: 'Ongoing offer',
    isNew: false,
  },
];

function renderDeals() {
  const feed = document.getElementById('dealsFeed');
  feed.innerHTML = DEALS.map(d => `
    <div class="deal-item ${d.isNew ? 'new-deal' : ''}" id="deal-${d.id}">
      <div class="deal-header">
        <div class="deal-supplier">${d.supplier}</div>
        ${d.isNew ? '<span class="deal-new-badge">New</span>' : ''}
      </div>
      <div class="deal-title">${d.title}</div>
      <div class="deal-desc">${d.desc}</div>
      <div class="deal-footer">
        <div class="deal-saving text-green">${d.saving}</div>
        <div class="deal-expiry">${d.expiry}</div>
      </div>
      <div class="deal-actions" style="margin-top:10px;">
        <button class="btn btn-primary" onclick="expressDealInterest(${d.id})">I'm interested →</button>
        <button class="btn btn-ghost" onclick="archiveDeal(${d.id})">Dismiss</button>
      </div>
    </div>
  `).join('');

  // Update badge count
  const newCount = DEALS.filter(d => d.isNew).length;
  document.getElementById('newDealsCount').textContent = `${newCount} new`;
}

renderDeals();

function expressDealInterest(id) {
  const deal = DEALS.find(d => d.id === id);
  if (!deal) return;
  // In production this would log to a backend or send an email
  alert(`Interest registered for:\n"${deal.title}"\n\nThe supplier has been notified. Their contact details will be shared with the manager on duty.`);
  // Mark as seen
  deal.isNew = false;
  renderDeals();
}

function archiveDeal(id) {
  DEALS = DEALS.filter(d => d.id !== id);
  renderDeals();
}

// ──────────────────────────────────────────────
// SUPPLIER DEAL MODAL
// ──────────────────────────────────────────────

function openDealModal() {
  document.getElementById('dealModal').classList.add('open');
  // Set default expiry to 2 weeks from now
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  document.getElementById('dealExpiry').value = twoWeeks.toISOString().split('T')[0];
}

function closeDealModal() {
  document.getElementById('dealModal').classList.remove('open');
  document.getElementById('dealForm').reset();
}

function submitDeal(e) {
  e.preventDefault();
  const company  = document.getElementById('dealCompany').value.trim();
  const rep      = document.getElementById('dealRep').value.trim();
  const title    = document.getElementById('dealTitle').value.trim();
  const desc     = document.getElementById('dealDesc').value.trim();
  const category = document.getElementById('dealCategory').value;
  const saving   = document.getElementById('dealSaving').value.trim();
  const expiry   = document.getElementById('dealExpiry').value;
  const contact  = document.getElementById('dealContact').value.trim();

  const expiryLabel = expiry
    ? `Expires ${new Date(expiry).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}`
    : 'Limited time';

  const newDeal = {
    id: Date.now(),
    supplier: company + (rep ? ` — ${rep}` : ''),
    title: `[${category}] ${title}`,
    desc: desc || 'Contact supplier for full details.',
    saving: saving || 'Discount available',
    expiry: expiryLabel,
    isNew: true,
  };

  DEALS.unshift(newDeal);
  renderDeals();
  closeDealModal();

  // Flash confirmation
  const newEl = document.getElementById(`deal-${newDeal.id}`);
  if (newEl) {
    newEl.style.animation = 'none';
    newEl.style.background = 'rgba(245,158,11,0.08)';
    setTimeout(() => { newEl.style.background = ''; }, 2000);
  }
}

// Close modal on overlay click
document.getElementById('dealModal').addEventListener('click', function(e) {
  if (e.target === this) closeDealModal();
});

// ──────────────────────────────────────────────
// SIMULATE LIVE UPDATES (demo)
// ──────────────────────────────────────────────

// Simulate a new mention appearing every ~90 seconds
const LIVE_MENTIONS = [
  {
    subreddit: 'r/sydneybars',
    user: 'u/cocktailcrawler88',
    time: 'Just now',
    text: 'Just walked past <strong>The Anchor</strong> — packed for a Tuesday! The chalkboard special looked incredible. Going back Friday.',
    upvotes: '↑ 3',
    sentiment: 'positive',
  },
  {
    subreddit: 'r/sydney',
    user: 'u/dinnerplanner_nsw',
    time: 'Just now',
    text: 'Best <strong>Aperol Spritz</strong> in Surry Hills, change my mind. The Anchor has nailed it.',
    upvotes: '↑ 12',
    sentiment: 'positive',
  },
];

let liveIdx = 0;
setTimeout(() => {
  setInterval(() => {
    if (liveIdx < LIVE_MENTIONS.length) {
      MENTIONS.unshift(LIVE_MENTIONS[liveIdx]);
      liveIdx++;
      renderMentions();
      document.getElementById('mentionCount').textContent = `${MENTIONS.length} mentions`;
    }
  }, 90000);
}, 30000);

// Simulate KPI tick-up every 3 minutes
setInterval(() => {
  const kpiRevEl = document.querySelector('.kpi-value');
  if (kpiRevEl) {
    const current = parseInt(kpiRevEl.textContent.replace(/[$,]/g, '')) || 6842;
    const bump = Math.floor(Math.random() * 80) + 20;
    const newVal = current + bump;
    kpiRevEl.textContent = `$${newVal.toLocaleString()}`;
  }
}, 180000);
