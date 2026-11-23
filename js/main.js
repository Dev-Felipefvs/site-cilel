(() => {
  const WA = '5582998340075';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  // Links de WhatsApp com mensagem pronta
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Menu do celular
  const btn = document.querySelector('.menu');
  const nav = document.getElementById('nav');
  const fecha = () => { nav.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menu'); };
  btn.addEventListener('click', () => {
    const aberto = nav.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', String(aberto));
    btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) fecha(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fecha(); btn.focus(); } });

  // Montagem: o desenho acompanha a etapa em foco
  const galpao = document.querySelector('.galpao');
  const etapas = [...document.querySelectorAll('.etapa')];
  const ativa = (n) => {
    galpao.dataset.etapa = n;
    etapas.forEach((el) => el.classList.toggle('ativa', el.dataset.etapa === n));
  };
  ativa('1');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) ativa(en.target.dataset.etapa); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    etapas.forEach((el) => io.observe(el));
  } else {
    ativa('4');
  }

  // Botão flutuante: aparece depois do topo e some no contato
  const flutua = document.querySelector('.flutua');
  const hero = document.querySelector('.hero');
  const contato = document.getElementById('contato');
  let foraHero = false, noContato = false;
  const atualiza = () => flutua.classList.toggle('visivel', foraHero && !noContato);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { foraHero = !en.isIntersecting; atualiza(); }).observe(hero);
    new IntersectionObserver(([en]) => { noContato = en.isIntersecting; atualiza(); }, { threshold: 0.15 }).observe(contato);
  }

  // Formulário → WhatsApp
  const form = document.getElementById('form');
  const nota = form.querySelector('.form__nota');
  const campos = ['nome', 'cidade'].map((id) => ({ el: form.elements[id], erro: document.getElementById(`e-${id}`) }));
  campos.forEach(({ el, erro }) => {
    el.setAttribute('aria-describedby', erro.id);
    el.addEventListener('input', () => { if (el.value.trim()) { erro.hidden = true; el.removeAttribute('aria-invalid'); } });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let primeiro = null;
    campos.forEach(({ el, erro }) => {
      const ok = el.value.trim().length > 1;
      erro.hidden = ok;
      if (ok) el.removeAttribute('aria-invalid'); else { el.setAttribute('aria-invalid', 'true'); primeiro = primeiro || el; }
    });
    if (primeiro) { primeiro.focus(); nota.textContent = 'Confira os campos marcados.'; return; }
    const f = form.elements;
    const linhas = [
      'Olá, Cilel! Quero um orçamento.',
      `Nome: ${f.nome.value.trim()}`,
      `Cidade da obra: ${f.cidade.value.trim()}`,
      `Preciso de: ${f.tipo.value}`,
    ];
    if (f.medidas.value.trim()) linhas.push(`Medidas/quantidade: ${f.medidas.value.trim()}`);
    nota.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
    window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
  });
})();
