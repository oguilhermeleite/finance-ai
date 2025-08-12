// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Progress bar on scroll
const progressBar = $('#progressBar');
document.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progressBar.style.width = ${scrolled * 100}%;
  $('#navbar').classList.toggle('scrolled', h.scrollTop > 10);
});

// Smooth scroll
window.scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Mobile menu
const mobileToggle = $('#mobileToggle');
const navLinks = $('#navLinks');
mobileToggle.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  mobileToggle.setAttribute('aria-expanded', String(!open));
});

// Animated counters
$$('.stat-number[data-target]').forEach(el => {
  const target = +el.dataset.target;
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 80));
  const tick = () => {
    cur += step;
    if (cur >= target) { el.textContent = target; return; }
    el.textContent = cur;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

// Price: try CoinGecko, otherwise simulate
const asBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ —';

async function tryFetchPrices() {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    const btc = data.bitcoin?.brl, eth = data.ethereum?.brl, sol = data.solana?.brl;
    if (btc) { $('#btc-price').textContent = asBRL(btc); $('#btcPriceMain').textContent = asBRL(btc); $('#btcLivePrice').textContent = asBRL(btc); }
    if (eth) { $('#eth-price').textContent = asBRL(eth); }
    if (sol) { $('#sol-price').textContent = asBRL(sol); }
    return true;
  } catch { return false; }
}

function simulatePrices() {
  let btc = 400000, eth = 18000, sol = 700;
  const bump = () => (Math.random() - 0.5) * 0.01; // ±1%
  setInterval(() => {
    btc *= (1 + bump()); eth *= (1 + bump()); sol *= (1 + bump());
    $('#btc-price').textContent = asBRL(btc);
    $('#btcPriceMain').textContent = asBRL(btc);
    $('#btcLivePrice').textContent = asBRL(btc);
    $('#eth-price').textContent = asBRL(eth);
    $('#sol-price').textContent = asBRL(sol);
  }, 3000);
}

(async () => {
  const ok = await tryFetchPrices();
  if (!ok) simulatePrices();
})();

// Fake Fear & Greed (placeholder)
(function fakeFG(){
  const v = 40 + Math.floor(Math.random()*40);
  $('#fg-index').textContent = ${v} - ${v<50?'Fear':v<70?'Neutral':'Greed'};
})();

// Halving countdown (próximo alvo aproximado)
const nextHalving = new Date('2028-04-20T12:00:00Z').getTime();
setInterval(() => {
  const now = Date.now();
  const dist = Math.max(0, nextHalving - now);
  const d = Math.floor(dist / (1000*60*60*24));
  const h = Math.floor((dist / (1000*60*60)) % 24);
  const m = Math.floor((dist / (1000*60)) % 60);
  const s = Math.floor((dist / 1000) % 60);
  $('#d').textContent = d; $('#h').textContent = h; $('#m').textContent = m; $('#s').textContent = s;
}, 1000);

// Quiz
const quiz = [
  { q: '💎 Qual é seu objetivo financeiro principal?', opts: ['Reserva de emergência', 'Aposentadoria confortável', 'Multiplicar patrimônio rapidamente', 'Renda extra mensal'] },
  { q: '⏱ Horizonte de investimento?', opts: ['< 1 ano', '1-3 anos', '3-5 anos', '5+ anos'] },
  { q: '🌧 Tolerância à queda (-30%)?', opts: ['Saio do mercado', 'Reduzo posição', 'Mantenho DCA', 'Compro mais'] },
  { q: '💰 Aporte mensal?', opts: ['R$100-300', 'R$300-800', 'R$800-2.000', 'R$2.000+'] },
];
let qi = 0, answers = [];
const quizProgress = $('#quizProgress');
const quizQuestion = $('#quizQuestion');
const quizNext = $('#quizNext');

function renderProgress() {
  quizProgress.innerHTML = '';
  quiz.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'progress-dot' + (i <= qi ? ' active' : '');
    quizProgress.appendChild(dot);
  });
}
function renderQuestion() {
  const item = quiz[qi];
  quizQuestion.innerHTML = <h3>${item.q}</h3><div class="quiz-options">${item.opts.map(o=><div class="quiz-option" role="button" tabindex="0">${o}</div>).join('')}</div>;
  quizQuestion.querySelectorAll('.quiz-option').forEach((el, idx) => {
    el.addEventListener('click', ()=>selectOption(idx, el));
    el.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ selectOption(idx, el);} });
  });
  renderProgress();
}
function selectOption(idx, el){
  quizQuestion.querySelectorAll('.quiz-option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  answers[qi] = idx;
}
quizNext.addEventListener('click', ()=>{
  if (answers[qi] == null) { quizNext.blur(); return; }
  qi++;
  if (qi < quiz.length) { renderQuestion(); }
  else {
    const profile = inferProfile(answers);
    quizQuestion.innerHTML = <h3>Seu perfil sugerido: <strong>${profile.nome}</strong></h3><p>${profile.desc}</p>;
    quizNext.textContent = 'Recomeçar';
    quizNext.onclick = ()=>{ qi=0; answers=[]; quizNext.textContent='Continuar'; quizNext.onclick=null; quizNext.addEventListener('click', ()=>{}); renderQuestion(); };
  }
});
function inferProfile(ans){
  // lógica simples: pondera agressividade pelas respostas 0..3
  const score = ans.reduce((a,b)=>a+b,0) / (quiz.length*3);
  if (score < 0.33) return { nome:'Conservador 🟢', desc:'Foque em reserva + DCA pequeno e constante. Priorize segurança e liquidez.' };
  if (score < 0.66) return { nome:'Moderado 🟡', desc:'Combine DCA com rebalanceamentos periódicos e caixa tático.' };
  return { nome:'Arrojado 🔴', desc:'Aportes maiores, tolerância à volatilidade e visão de longo prazo.' };
}
renderQuestion();

// Calculator DCA
$('#calc-btn').addEventListener('click', ()=>{
  const p = +($('#calc-btc').value || $('#btcLivePrice').textContent.replace(/[^\d,.-]/g,'').replace('.','').replace(',','.')) || 0;
  const aporte = +$('#calc-aporte').value || 0;
  const anos = +$('#calc-anos').value || 1;
  const ret = (+$('#calc-ret').value || 0) / 100; // anual
  const meses = anos * 12;
  if (p<=0 || aporte<=0) { $('#calc-out').textContent = 'Preencha preço do BTC e aporte mensal.'; return; }

  // juros compostos sobre valor do BTC (simplificação): acumula BRL e projeta pelo retorno anual equivalente mensal
  const r_m = Math.pow(1+ret, 1/12) - 1;
  let totalAportado = 0, valorProjetado = 0;
  for (let i=0;i<meses;i++){
    totalAportado += aporte;
    valorProjetado = (valorProjetado + aporte) * (1 + r_m);
  }
  const btcEstimado = valorProjetado / p;

  $('#calc-out').innerHTML = `
    <strong>Resultado:</strong><br>
    Aportado: <b>${asBRL(totalAportado)}</b><br>
    Projeção futura (BRL): <b>${asBRL(valorProjetado)}</b><br>
    BTC estimado acumulado: <b>${btcEstimado.toFixed(6)} ₿</b>
  `;
});

// Whale alert (mock stream)
(function whaleMock(){
  const el = $('#whaleStream');
  const add = () => {
    const side = Math.random()>.5?'Compra':'Venda';
    const amt = (Math.random()*500 + 50).toFixed(2);
    const it = document.createElement('div');
    it.className = 'whale-item';
    it.textContent = 🐋 ${side} de ${amt} BTC detectada em exchange;
    el.prepend(it);
    const max = 6;
    while (el.children.length > max) el.removeChild(el.lastChild);
  };
  add(); add();
  setInterval(add, 5000);
})();

// FAB + Chat
const fabBtn = $('#fabBtn'), chat = $('#chatWidget'), chatClose = $('#chatClose'), fabBadge = $('#fabBadge');
fabBtn.addEventListener('click', ()=>{ chat.classList.add('active'); fabBadge.style.display='none'; $('#chatInput').focus(); });
chatClose.addEventListener('click', ()=> chat.classList.remove('active'));
$('#chatSend').addEventListener('click', sendMsg);
$('#chatInput').addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ sendMsg(); }});
function sendMsg(){
  const input = $('#chatInput'); const txt = input.value.trim(); if(!txt) return;
  appendMsg('user', txt);
  input.value='';
  setTimeout(()=> appendMsg('bot', 'Beleza! Para DCA, defina um valor mensal que caiba no bolso e mantenha a disciplina. Quer simular na Calculadora?'), 600);
}
function appendMsg(who, text){
  const div = document.createElement('div');
  div.className = chat-message ${who};
  div.textContent = text;
  $('#chatBody').appendChild(div);
  $('#chatBody').scrollTop = $('#chatBody').scrollHeight;
}

// Cookie banner
const cookieBanner = $('#cookieBanner');
const seenCookie = localStorage.getItem('fx_cookie');
if (!seenCookie) cookieBanner.classList.add('show');
$('#cookieAccept').addEventListener('click', ()=>{ localStorage.setItem('fx_cookie','1'); cookieBanner.classList.remove('show'); });
$('#cookieDecline').addEventListener('click', ()=>{ localStorage.setItem('fx_cookie','0'); cookieBanner.classList.remove('show'); });

// Waitlist
window.joinWaitlist = function(){
  const email = $('#wl-email').value.trim();
  const msg = $('#wl-msg');
  if(!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent='E-mail inválido.'; return; }
  msg.textContent = 'Pronto! Você entrou na lista (demo local).';
};

// Demo button
window.startDemo = function(){
  scrollToSection('calculator');
  appendMsg('bot','Abra a Calculadora DCA e rode uma simulação com seu aporte mensal.');
};
