(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.PREACT_RESULTS;
  const reasonNames = { qwen: 'Qwen3.8-27B', gpt: 'GPT-5.6 Sol' };
  let split = 'unseen';
  const format = (value, index, city = false) => value.toFixed(index === 2 && !city ? 4 : 2);
  function renderResults() {
    const city = $('benchmark').value === 'city';
    const reason = $('reasoner').value;
    const rows = city ? data.city : data.urban[reason][split];
    const ours = rows.find(row => row.ours);
    $('reasoner-control').hidden = city;
    $('split-control').hidden = city;
    $('result-context').textContent = city ? 'PreAct-Nav · CityWalker · Qwen3.8-27B' : `PreAct-Nav · UrbanNav · Test-${split} · ${reasonNames[reason]}`;
    $('table-caption').textContent = city ? 'CityWalker comparison · Qwen3.8-27B' : `UrbanNav comparison · Test-${split} · ${reasonNames[reason]}`;
    ['metric-sr', 'metric-spl', 'metric-ne'].forEach((id, index) => { $(id).textContent = ours.values[index].toFixed(2); });
    const reference = city ? rows.find(row => row.method === 'NavGPT') : rows.find(row => row.method === 'UrbanNav');
    const gain = (ours.values[0] - reference.values[0]).toFixed(2);
    const strong = document.createElement('strong');
    strong.textContent = `+${gain} percentage points`;
    $('result-takeaway').replaceChildren(strong, document.createTextNode(city ? ' in success rate over NavGPT, the strongest listed CityWalker baseline in SR.' : ' in success rate over the frozen UrbanNav policy.'));
    $('protocol-note').textContent = city ? 'All methods use the frozen CityWalker policy and Qwen3.8-27B. These 154 routes use a separate evaluation protocol from UrbanNav; values should be compared within each benchmark.' : `All methods use the frozen UrbanNav policy. Reasoning methods shown here use ${reasonNames[reason]}. Values are those reported in the manuscript.`;
    $('results-body').replaceChildren(...rows.map(row => {
      const tr = document.createElement('tr');
      if (row.ours) tr.className = 'ours';
      const name = document.createElement('th'); name.scope = 'row'; name.textContent = row.method; tr.append(name);
      row.values.forEach((value, index) => { const cell = document.createElement('td'); cell.textContent = format(value, index, city); tr.append(cell); });
      return tr;
    }));
    document.querySelectorAll('[data-split]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.split === split)));
  }
  $('benchmark').addEventListener('change', renderResults);
  $('reasoner').addEventListener('change', renderResults);
  document.querySelectorAll('[data-split]').forEach(button => button.addEventListener('click', () => { split = button.dataset.split; renderResults(); }));
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-case]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    $('case-reasoning').hidden = button.dataset.case !== 'reasoning';
    $('case-robot').hidden = button.dataset.case !== 'robot';
  }));
  $('copy-citation').addEventListener('click', async () => {
    const text = $('bibtex').textContent;
    try {
      await navigator.clipboard.writeText(text);
      $('copy-status').textContent = 'BibTeX copied.';
    } catch {
      const range = document.createRange(); range.selectNodeContents($('bibtex'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('copy-status').textContent = 'Citation selected. Press Ctrl+C or Command+C to copy.';
    }
  });
  document.querySelectorAll('[data-resource]').forEach(button => {
    const url = window.PREACT_LINKS?.[button.dataset.resource];
    if (!url) return;
    try { if (new URL(url).protocol !== 'https:') return; } catch { return; }
    const link = document.createElement('a'); link.className = 'resource'; link.href = url; link.target = '_blank'; link.rel = 'noopener';
    link.append(button.querySelector('svg'), document.createTextNode(button.dataset.resource === 'arxiv' ? 'arXiv' : 'GitHub'));
    button.replaceWith(link);
  });
  renderResults();
})();
