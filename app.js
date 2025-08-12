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
