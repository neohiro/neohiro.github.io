/**
 * neohiro/llm — public KB renderer
 * Loads data/models_extended.json, renders cards, table, providers, price chart.
 */

(async function init() {
    'use strict';

    let data = null;
    try {
        const r = await fetch('assets/models_extended.json', { cache: 'no-store' });
        if (r.ok) data = await r.json();
    } catch (e) {
        console.error('Failed to load models data', e);
    }
    if (!data) return;

    const allModels = data.models;
    const providers = data.providers;
    const providerMap = Object.fromEntries(providers.map(p => [p.id, p]));

    // ── Stats ───────────────────────────────────────────────────────────
    document.getElementById('count-providers').textContent = providers.length;
    document.getElementById('count-models').textContent = allModels.length;
    document.getElementById('count-free').textContent = allModels.filter(m => m.tier === 'free' || m.tier === 'unlimited').length;
    const countries = new Set(allModels.map(m => m.country));
    document.getElementById('count-countries').textContent = countries.size;
    document.getElementById('count-deprecated').textContent = allModels.filter(m => m.deprecated).length;

    // ── Models (newest first) ───────────────────────────────────────────
    const sorted = [...allModels].sort((a, b) => b.added_on.localeCompare(a.added_on));

    function renderModels(models) {
        const grid = document.getElementById('models-grid');
        document.getElementById('model-count').textContent = `(${models.length})`;
        grid.innerHTML = models.map(m => {
            const prov = providerMap[m.provider] || { name: m.provider };
            const tags = [];
            tags.push(`<span class="model-tag ${m.tier === 'free' || m.tier === 'unlimited' ? 'free' : ''}">${m.tier}</span>`);
            if (m.modalities.includes('image')) tags.push('<span class="model-tag vision">vision</span>');
            if (m.modalities.includes('audio')) tags.push('<span class="model-tag audio">audio</span>');
            if (m.suitable_for && m.suitable_for.includes('code')) tags.push('<span class="model-tag code">code</span>');
            if (m.deprecated) tags.push('<span class="model-tag deprecated">deprecated</span>');

            const priceText = m.input_price === 0 && m.output_price === 0
                ? `<span class="model-pricing-free">FREE</span>${m.free_tier ? ` <span class="muted">· ${m.free_tier}</span>` : ''}`
                : `$${m.input_price.toFixed(2)} in / $${m.output_price.toFixed(2)} out <span class="muted">per 1M tokens</span>`;

            return `
            <article class="model-card ${m.deprecated ? 'deprecated' : ''}" data-id="${m.id}">
                <div class="model-card-header">
                    <div class="model-name">${m.name}</div>
                    <span class="model-provider-badge">${prov.name}</span>
                </div>
                <div class="model-meta">${tags.join('')}</div>
                <div class="model-stats">
                    <div class="model-stat">
                        <span class="model-stat-label">Context</span>
                        <span class="model-stat-value">${(m.context_window / 1024).toFixed(0)}K</span>
                    </div>
                    <div class="model-stat">
                        <span class="model-stat-label">Country</span>
                        <span class="model-stat-value">${m.country}</span>
                    </div>
                    <div class="model-stat">
                        <span class="model-stat-label">MMLU</span>
                        <span class="model-stat-value">${m.benchmarks?.mmlu || '—'}</span>
                    </div>
                    <div class="model-stat">
                        <span class="model-stat-label">HumanEval</span>
                        <span class="model-stat-value">${m.benchmarks?.humaneval || '—'}</span>
                    </div>
                </div>
                <div class="model-pricing">
                    <div class="model-pricing-label">Pricing</div>
                    <div class="model-pricing-value">${priceText}</div>
                </div>
            </article>
            `;
        }).join('');
    }

    renderModels(sorted);

    // ── Filters ──────────────────────────────────────────────────────────
    const search = document.getElementById('model-search');
    const filterTier = document.getElementById('filter-tier');
    const filterProv = document.getElementById('filter-provider');
    const filterMod = document.getElementById('filter-modality');
    const filterFree = document.getElementById('filter-free-only');

    function applyFilters() {
        const q = (search.value || '').toLowerCase().trim();
        const tier = filterTier.value;
        const prov = filterProv.value;
        const mod = filterMod.value;
        const freeOnly = filterFree.checked;

        const filtered = sorted.filter(m => {
            if (q && !(m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || (providerMap[m.provider]?.name || '').toLowerCase().includes(q))) return false;
            if (tier === 'deprecated' && !m.deprecated) return false;
            if (tier && tier !== 'deprecated' && m.tier !== tier) return false;
            if (prov && m.provider !== prov) return false;
            if (mod === 'vision' && !m.modalities.includes('image')) return false;
            if (mod === 'audio' && !m.modalities.includes('audio')) return false;
            if (mod === 'text' && m.modalities.some(x => ['image', 'audio'].includes(x))) return false;
            if (mod === 'code' && !(m.suitable_for || []).includes('code') && !(m.suitable_for || []).includes('completion')) return false;
            if (freeOnly && m.tier !== 'free' && m.tier !== 'unlimited') return false;
            return true;
        });

        renderModels(filtered);
    }

    search.addEventListener('input', applyFilters);
    filterTier.addEventListener('change', applyFilters);
    filterProv.addEventListener('change', applyFilters);
    filterMod.addEventListener('change', applyFilters);
    filterFree.addEventListener('change', applyFilters);

    // ── Pricing table ───────────────────────────────────────────────────
    const tbody = document.getElementById('pricing-tbody');
    tbody.innerHTML = sorted.map(m => {
        const prov = providerMap[m.provider] || { name: m.provider };
        const inP = m.input_price === 0 ? '—' : `$${m.input_price.toFixed(2)}`;
        const outP = m.output_price === 0 ? '—' : `$${m.output_price.toFixed(2)}`;
        const free = m.tier === 'free' || m.tier === 'unlimited' ? '<span class="pricing-free">YES</span>' : '<span class="pricing-paid">NO</span>';
        const status = m.deprecated ? '<span class="status-deprecated">deprecated</span>' : '<span class="status-active">active</span>';
        const eol = m.deprecated ? `<span class="status-deprecated">${m.eol_date || '—'}</span><br><span class="muted">→ ${m.replacement || '—'}</span>` : '<span class="muted">—</span>';

        return `<tr class="${m.deprecated ? 'deprecated-row' : ''}">
            <td class="model-name-td">${m.name}</td>
            <td class="provider-td">${prov.name}</td>
            <td>${inP}</td>
            <td>${outP}</td>
            <td>${(m.context_window / 1024).toFixed(0)}K</td>
            <td>${free}</td>
            <td>${status}</td>
            <td>${eol}</td>
        </tr>`;
    }).join('');

    // ── Providers grid ──────────────────────────────────────────────────
    const pgrid = document.getElementById('providers-grid');
    pgrid.innerHTML = providers.map(p => `
        <article class="provider-card">
            <div class="provider-header">
                <div class="provider-name">${p.name}</div>
                <span class="provider-country">${p.country}</span>
            </div>
            <div class="provider-stats">
                <span><strong>Tier:</strong> ${p.tier}</span>
                <span><strong>Free models:</strong> <span class="provider-country">${p.models_free}</span></span>
                <span><strong>Total models:</strong> ${p.models_total}</span>
                <span><strong>Rate limit:</strong> ${p.rate_limit}</span>
            </div>
        </article>
    `).join('');

    // ── Deprecated list ─────────────────────────────────────────────────
    const deprecated = allModels.filter(m => m.deprecated);
    const depList = document.getElementById('deprecated-list');
    depList.innerHTML = deprecated.length === 0
        ? '<p class="muted" style="text-align:center;">No deprecated models in the current KB.</p>'
        : deprecated.map(m => {
            const prov = providerMap[m.provider] || { name: m.provider };
            return `<div class="deprecated-item">
                <div class="deprecated-icon">⛔</div>
                <div class="deprecated-info">
                    <div class="deprecated-name">${m.name} <span class="muted">@ ${prov.name}</span></div>
                    <div class="deprecated-meta">${m.context_window.toLocaleString()} tokens · was $${m.input_price.toFixed(2)} in / $${m.output_price.toFixed(2)} out</div>
                    <div class="deprecated-eol">EOL: ${m.eol_date || '—'} · Replacement: ${m.replacement || '—'}</div>
                </div>
            </div>`;
        }).join('');

    // ── Price history chart ─────────────────────────────────────────────
    const priceModelSelect = document.getElementById('price-model-select');
    const priceChart = document.getElementById('price-chart');

    // All distinct models with price history
    const allIds = [...new Set(allModels.flatMap(m => (m.price_history || []).map(p => p.date)))].sort();
    const chartable = allModels.filter(m => m.price_history && m.price_history.length > 0);
    priceModelSelect.innerHTML = '<option value="">— choose model —</option>' +
        chartable.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    priceModelSelect.addEventListener('change', () => {
        const id = priceModelSelect.value;
        if (!id) {
            priceChart.innerHTML = '<text x="400" y="160" text-anchor="middle" fill="#7d8590" font-size="14">Select a model above to see its pricing history</text>';
            return;
        }
        const model = allModels.find(m => m.id === id);
        renderPriceChart(priceChart, model);
    });

    function renderPriceChart(svg, model) {
        const W = 800, H = 320;
        const PAD = 50;
        const data = model.price_history || [];
        if (data.length === 0) {
            svg.innerHTML = `<text x="400" y="160" text-anchor="middle" fill="#7d8590" font-size="14">No price history for ${model.name}</text>`;
            return;
        }

        const allValues = data.flatMap(d => [d.input, d.output]);
        const max = Math.max(...allValues, 1);
        const min = 0;

        const x0 = data[0].date;
        const x1 = data[data.length - 1].date;
        const xRange = (x0 === x1) ? 1 : new Date(x1).getTime() - new Date(x0).getTime();

        const yToPx = v => H - PAD - ((v - min) / (max - min || 1)) * (H - 2 * PAD);
        const xToPx = date => {
            const t = new Date(date).getTime();
            if (xRange === 1) return (W - 2 * PAD) / 2 + PAD;
            return PAD + ((t - new Date(x0).getTime()) / xRange) * (W - 2 * PAD);
        };

        let html = '';

        // Grid
        html += '<g stroke="#21262d" stroke-width="0.5">';
        for (let v = 0; v <= max; v += Math.max(1, max / 4)) {
            const y = yToPx(v);
            html += `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}"/>`;
            html += `<text x="${PAD - 6}" y="${y + 4}" text-anchor="end" fill="#7d8590" font-size="10">$${v.toFixed(1)}</text>`;
        }
        html += '</g>';

        // Axes
        html += `<line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="#30363d"/>`;
        html += `<line x1="${PAD}" y1="${PAD}" x2="${PAD}" y2="${H - PAD}" stroke="#30363d"/>`;

        // Input line
        const inputPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xToPx(d.date)} ${yToPx(d.input)}`).join(' ');
        const outputPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xToPx(d.date)} ${yToPx(d.output)}`).join(' ');

        html += `<path d="${inputPath}" stroke="#2f81f7" stroke-width="2" fill="none"/>`;
        html += `<path d="${outputPath}" stroke="#3fb950" stroke-width="2" fill="none"/>`;

        // Points
        data.forEach(d => {
            const x = xToPx(d.date);
            html += `<circle cx="${x}" cy="${yToPx(d.input)}" r="4" fill="#2f81f7"/>`;
            html += `<circle cx="${x}" cy="${yToPx(d.output)}" r="4" fill="#3fb950"/>`;
            if (d.note) {
                html += `<text x="${x}" y="${H - PAD + 14}" text-anchor="middle" fill="#7d8590" font-size="9">${d.date.slice(0, 7)}</text>`;
            }
        });

        // Legend
        html += `<g transform="translate(${W - PAD - 130}, ${PAD + 8})">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#2f81f7" stroke-width="2"/>
            <text x="24" y="3" fill="#e6edf3" font-size="11">Input $/M</text>
            <line x1="0" y1="14" x2="20" y2="14" stroke="#3fb950" stroke-width="2"/>
            <text x="24" y="17" fill="#e6edf3" font-size="11">Output $/M</text>
        </g>`;

        // Title
        html += `<text x="${W/2}" y="${PAD - 20}" text-anchor="middle" fill="#e6edf3" font-size="13" font-weight="700">${model.name} — Price history</text>`;
        if (data[data.length - 1].note) {
            html += `<text x="${W/2}" y="${H - 6}" text-anchor="middle" fill="#7d8590" font-size="10">Latest: ${data[data.length - 1].note}</text>`;
        }

        svg.innerHTML = html;
    }

    // Default chart: GPT-4o
    if (chartable.find(m => m.id === 'gpt-4o')) {
        priceModelSelect.value = 'gpt-4o';
        renderPriceChart(priceChart, allModels.find(m => m.id === 'gpt-4o'));
    }
})();
