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

// Botões de “Começar Jornada / Simular”
window.startDemo = () => scrollToSection('features');
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
