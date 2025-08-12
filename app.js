// Helpers
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Progress bar + navbar sombra
const progressBar = $('#progressBar');
document.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progressBar.style.width = ${(scrolled * 100).toFixed(1)}%;
  $('#navbar')?.classList.toggle('scrolled', h.scrollTop > 10);
});

// Smooth scroll
window.scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Specific scroll functions
window.scrollToRoadmap = () => scrollToSection('roadmap');

// Mobile menu toggle (mostra/esconde .nav-links em telas pequenas)
$('#mobileToggle')?.addEventListener('click', () => {
  const nav = $('#navLinks');
  const open = getComputedStyle(nav).display !== 'none';
  nav.style.display = open ? 'none' : 'flex';
});

// Quiz simples (apenas seleção visual + botão continuar)
let selectedEl = null;
window.selectOption = (el) => {
  selectedEl?.classList.remove('selected');
  el.classList.add('selected');
  selectedEl = el;
};

window.nextQuestion = () => {
  if (!selectedEl) return;
  // aqui você poderia trocar a pergunta; por enquanto, só confirma
  const qc = $('#quizContainer');
  qc.innerHTML = `
    <h3>Perfil sugerido</h3>
    <p>Com base na sua escolha, recomendamos começar com DCA e disciplina de aportes.</p>
    <button class="btn btn-secondary" onclick="scrollToSection('calculator')">Ir para Calculadora</button>
  `;
};

// Demo: atualizar preços (mock leve só pra não ficar estático)
(function mockPrices(){
  const toBRL = (n)=> n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  let btc = 245890, eth = 12450;
  const tick = () => {
    btc *= (1 + (Math.random()-0.5)*0.01);
    eth *= (1 + (Math.random()-0.5)*0.01);
    $('#btc-price') && ($('#btc-price').textContent = toBRL(btc));
    $('#btcPriceMain') && ($('#btcPriceMain').textContent = toBRL(btc));
    $('#btcLivePrice') && ($('#btcLivePrice').textContent = toBRL(btc));
    $('#eth-price') && ($('#eth-price').textContent = toBRL(eth));
  };
  tick();
  setInterval(tick, 3000);
})();

// Botões de "Começar Jornada / Simular"
window.startDemo = () => scrollToSection('features');

// ===== ENHANCED FEATURES =====

// Dark/Light Theme Toggle
(function themeManager(){
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (toggle) toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  
  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
})();

// Enhanced Dashboard with Real-time Data
(function dashboardManager(){
  let btcPrice = 245890;
  let hashRate = 489;
  let difficulty = 62.5;
  let marketCap = 4.8;
  
  function updateDashboard() {
    // Simulate price changes (±2%)
    btcPrice *= (1 + (Math.random() - 0.5) * 0.04);
    
    // Update main price displays
    const formatBRL = (n) => n.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    document.getElementById('dashBtcPrice').textContent = formatBRL(btcPrice);
    
    // Calculate and display 24h change
    const change = (Math.random() - 0.5) * 10; // ±5%
    const changeEl = document.getElementById('dashBtcChange');
    changeEl.textContent = `${change > 0 ? '+' : ''}${change.toFixed(1)}% (24h)`;
    changeEl.className = `metric-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`;
    
    // Update other metrics occasionally
    if (Math.random() > 0.8) {
      hashRate *= (1 + (Math.random() - 0.5) * 0.02);
      document.getElementById('dashHashRate').textContent = `${hashRate.toFixed(0)} EH/s`;
      
      difficulty *= (1 + (Math.random() - 0.5) * 0.01);
      document.getElementById('dashDifficulty').textContent = `${difficulty.toFixed(1)}T`;
      
      marketCap *= (1 + (Math.random() - 0.5) * 0.03);
      document.getElementById('dashMarketCap').textContent = `R$ ${marketCap.toFixed(1)}T`;
    }
  }
  
  // Update every 3 seconds
  setInterval(updateDashboard, 3000);
  updateDashboard();
})();

// Simple Price Chart (using canvas)
(function priceChart(){
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let currentPeriod = '7d';
  
  // Generate mock price data
  function generatePriceData(period) {
    const points = period === '7d' ? 168 : period === '30d' ? 720 : 8760; // hours
    const data = [];
    let price = 245890;
    
    for (let i = 0; i < points; i++) {
      price *= (1 + (Math.random() - 0.5) * 0.02);
      data.push(price);
    }
    return data;
  }
  
  function drawChart(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw price line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((price, i) => {
      const x = padding + (width / (data.length - 1)) * i;
      const y = padding + height - ((price - min) / range) * height;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
  }
  
  // Initialize chart
  let chartData = generatePriceData(currentPeriod);
  drawChart(chartData);
  
  // Handle timeframe buttons
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      chartData = generatePriceData(currentPeriod);
      drawChart(chartData);
    });
  });
  
  // Update chart every 30 seconds
  setInterval(() => {
    chartData = generatePriceData(currentPeriod);
    drawChart(chartData);
  }, 30000);
})();

// Enhanced Whale Alerts
(function realtimeWhaleAlerts(){
  const container = document.getElementById('realtimeWhaleAlerts');
  if (!container) return;
  
  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'Gemini'];
  const actions = ['Compra', 'Venda', 'Transferência'];
  
  function addWhaleAlert() {
    const amount = (Math.random() * 500 + 50).toFixed(2);
    const action = actions[Math.floor(Math.random() * actions.length)];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    
    const alert = document.createElement('div');
    alert.className = 'whale-alert-item';
    alert.textContent = `🐋 ${action} de ${amount} BTC detectada em ${exchange}`;
    
    container.insertBefore(alert, container.firstChild);
    
    // Keep only last 8 alerts
    while (container.children.length > 8) {
      container.removeChild(container.lastChild);
    }
  }
  
  // Add initial alerts
  for (let i = 0; i < 5; i++) {
    setTimeout(addWhaleAlert, i * 1000);
  }
  
  // Continue adding alerts
  setInterval(addWhaleAlert, 5000);
})();

// Blog Search and Filter
(function blogManager(){
  const searchInput = document.getElementById('blogSearch');
  const tagButtons = document.querySelectorAll('.tag-btn');
  const articles = document.querySelectorAll('.article-card');
  
  function filterArticles(searchTerm = '', activeTag = 'all') {
    articles.forEach(article => {
      const title = article.querySelector('h3').textContent.toLowerCase();
      const content = article.querySelector('p').textContent.toLowerCase();
      const tags = article.dataset.tags || '';
      
      const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      
      article.style.display = matchesSearch && matchesTag ? 'block' : 'none';
    });
  }
  
  searchInput?.addEventListener('input', (e) => {
    const activeTag = document.querySelector('.tag-btn.active')?.dataset.tag || 'all';
    filterArticles(e.target.value.toLowerCase(), activeTag);
  });
  
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const searchTerm = searchInput?.value.toLowerCase() || '';
      filterArticles(searchTerm, btn.dataset.tag);
    });
  });
})();

// Glossary Search
(function glossaryManager(){
  const searchInput = document.getElementById('glossarySearch');
  const glossaryItems = document.querySelectorAll('.glossary-item');
  
  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    glossaryItems.forEach(item => {
      const title = item.querySelector('h4').textContent.toLowerCase();
      const content = item.querySelector('p').textContent.toLowerCase();
      
      const matches = title.includes(term) || content.includes(term);
      item.style.display = matches ? 'block' : 'none';
    });
  });
})();

// Enhanced DCA Calculator
document.getElementById('calc-btn')?.addEventListener('click', () => {
  const price = parseFloat(document.getElementById('calc-btc')?.value) || 245890;
  const monthlyAmount = parseFloat(document.getElementById('calc-aporte')?.value) || 0;
  const years = parseInt(document.getElementById('calc-anos')?.value) || 1;
  const annualReturn = parseFloat(document.getElementById('calc-ret')?.value) || 30;
  
  if (!monthlyAmount) {
    document.getElementById('calc-out').innerHTML = '⚠️ Insira o valor do aporte mensal.';
    return;
  }
  
  const months = years * 12;
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1/12) - 1;
  
  let totalInvested = 0;
  let btcAccumulated = 0;
  let futureValue = 0;
  
  // Simulate monthly investments with price variation
  for (let month = 1; month <= months; month++) {
    totalInvested += monthlyAmount;
    
    // Simulate price changes (historical volatility)
    const priceVariation = 1 + (Math.random() - 0.5) * 0.4; // ±20% monthly variation
    const currentPrice = price * priceVariation;
    
    btcAccumulated += monthlyAmount / currentPrice;
    futureValue = (futureValue + monthlyAmount) * (1 + monthlyReturn);
  }
  
  const formatBRL = (n) => n.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  const roi = ((futureValue - totalInvested) / totalInvested * 100).toFixed(1);
  
  document.getElementById('calc-out').innerHTML = `
    <div class="calc-results">
      <h4>📊 Resultado da Simulação</h4>
      <div class="result-grid">
        <div class="result-item">
          <span class="result-label">Total Investido:</span>
          <span class="result-value">${formatBRL(totalInvested)}</span>
        </div>
        <div class="result-item">
          <span class="result-label">BTC Acumulado:</span>
          <span class="result-value">${btcAccumulated.toFixed(6)} ₿</span>
        </div>
        <div class="result-item">
          <span class="result-label">Valor Futuro:</span>
          <span class="result-value">${formatBRL(futureValue)}</span>
        </div>
        <div class="result-item highlight">
          <span class="result-label">ROI Estimado:</span>
          <span class="result-value ${roi > 0 ? 'positive' : 'negative'}">${roi}%</span>
        </div>
      </div>
      <p class="disclaimer">* Simulação baseada em dados históricos. Resultados passados não garantem performance futura.</p>
    </div>
  `;
});

// Newsletter Subscription
window.subscribeNewsletter = function() {
  const email = document.getElementById('newsletter-email').value;
  const msgEl = document.getElementById('newsletter-msg');
  
  if (!email || !email.includes('@')) {
    msgEl.innerHTML = '<div style="color:#ef4444;">❌ Por favor, insira um email válido.</div>';
    return;
  }
  
  // Simulate subscription
  msgEl.innerHTML = '<div style="color:#10b981;">✅ Inscrição realizada! Verifique seu email.</div>';
  document.getElementById('newsletter-email').value = '';
  
  // Hide message after 5 seconds
  setTimeout(() => {
    msgEl.innerHTML = '';
  }, 5000);
};

// Article Modal System
window.openArticle = function(articleId) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'article-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Artigo Completo</h2>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <p>Esta é uma demonstração. Em produção, aqui seria carregado o artigo completo "${articleId}".</p>
        <p>O sistema suportaria:</p>
        <ul>
          <li>Conteúdo completo do artigo</li>
          <li>Imagens e gráficos</li>
          <li>Sistema de comentários</li>
          <li>Artigos relacionados</li>
          <li>Tempo de leitura tracking</li>
        </ul>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  window.closeModal = function() {
    document.body.removeChild(modal);
    document.body.style.overflow = 'auto';
  };
};

// Footer Functions (Placeholder)
window.openGlossary = () => scrollToSection('blog');
window.openGuides = () => alert('Seção de Guias em desenvolvimento');
window.openAPI = () => alert('Documentação da API em breve');
window.openAbout = () => alert('Página Sobre em desenvolvimento');
window.openCareer = () => alert('Página de Carreiras em desenvolvimento');
window.openPress = () => alert('Kit de Imprensa em desenvolvimento');
window.openContact = () => alert('Página de Contato em desenvolvimento');
window.openPrivacy = () => alert('Política de Privacidade em desenvolvimento');
window.openTerms = () => alert('Termos de Uso em desenvolvimento');
window.openDisclaimer = () => alert('Disclaimer em desenvolvimento');
window.openSecurity = () => alert('Página de Segurança em desenvolvimento');

// Language Toggle
document.getElementById('langToggle')?.addEventListener('click', () => {
  const current = document.documentElement.lang || 'pt-BR';
  const newLang = current === 'pt-BR' ? 'en' : 'pt-BR';
  document.documentElement.lang = newLang;
  
  // In production, this would load different language content
  alert(`Idioma alterado para: ${newLang === 'pt-BR' ? 'Português' : 'English'}`);
});

// Enhanced Mobile Menu
document.getElementById('mobileToggle')?.addEventListener('click', () => {
  const navLinks = document.getElementById('navLinks');
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  
  if (!isOpen) {
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#fff';
    navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    navLinks.style.padding = '1rem';
    navLinks.style.gap = '1rem';
  }
});

// Lazy Loading Simulation
(function lazyLoading() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
})();

// Performance Monitoring
(function performanceMonitoring() {
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
      
      // In production, this data would be sent to analytics
    }
  });
})();
// ===== Chat (FAB) =====
const chat = {
  widget: document.getElementById('chatWidget'),
  fab: document.getElementById('fabBtn'),
  close: document.getElementById('chatClose'),
  body: document.getElementById('chatBody'),
  input: document.getElementById('chatInput'),
  send: document.getElementById('chatSend'),
};
chat?.fab?.addEventListener('click', () => chat.widget.classList.add('active'));
chat?.close?.addEventListener('click', () => chat.widget.classList.remove('active'));
chat?.send?.addEventListener('click', () => {
  const text = chat.input.value.trim();
  if (!text) return;
  const u = document.createElement('div'); u.className = 'chat-message user'; u.textContent = text;
  chat.body.appendChild(u); chat.input.value = '';
  const b = document.createElement('div'); b.className = 'chat-message bot'; b.textContent = 'Anotado. Vamos calcular um DCA?';
  setTimeout(() => chat.body.appendChild(b), 400);
});

// ===== Cookie banner =====
const banner = document.getElementById('cookieBanner');
const consentKey = 'financeai-consent';
if (!localStorage.getItem(consentKey)) banner.classList.add('show');
document.getElementById('cookieAccept')?.addEventListener('click', () => { localStorage.setItem(consentKey, 'yes'); banner.classList.remove('show'); });
document.getElementById('cookieDecline')?.addEventListener('click', () => { localStorage.setItem(consentKey, 'no'); banner.classList.remove('show'); });

// ===== Calculadora DCA =====
document.getElementById('calc-btn')?.addEventListener('click', () => {
  const brl = n => Number(n || 0);
  const price = brl(document.getElementById('calc-btc')?.value);
  const aporte = brl(document.getElementById('calc-aporte')?.value);
  const anos = brl(document.getElementById('calc-anos')?.value);
  const ret = brl(document.getElementById('calc-ret')?.value) / 100;

  if (!price || !aporte || !anos) { document.getElementById('calc-out').textContent = 'Preencha os campos.'; return; }

  let totalAportado = 0, btcAcumulado = 0, valor = 0;
  for (let m = 0; m < anos * 12; m++) {
    totalAportado += aporte;
    btcAcumulado += aporte / price;
    valor = totalAportado * Math.pow(1 + ret / 12, m + 1);
  }
  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('calc-out').innerHTML =
    Aportado: <b>${fmt(totalAportado)}</b><br>BTC estimado: <b>${btcAcumulado.toFixed(6)} BTC</b><br>Valor futuro estimado: <b>${fmt(valor)}</b>;
});

// ===== Whale alert (demo) =====
(function whaleDemo(){
  const el = document.getElementById('whaleStream'); if (!el) return;
  const max = 6;
  setInterval(() => {
    const side = Math.random() > .5 ? 'Compra' : 'Venda';
    const amt = (Math.random()*500 + 50).toFixed(2);
    const row = document.createElement('div');
    row.className = 'whale-alert';
    row.textContent = ${side} de ${amt} BTC detectada em exchange;
    el.insertBefore(row, el.firstChild);
    while (el.childElementCount > max) el.removeChild(el.lastChild);
  }, 2500);
})();
