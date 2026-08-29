---
layout: llm
title: LLM Knowledge Base
description: "Curated, searchable knowledge base of LLM models — free tiers, pricing, pricing history, EOL dates, and performance benchmarks."
---

<!-- Hero -->
<div class="hero" id="home">
  <div class="container">
    <div class="hero-content">
      <div class="hero-badges">
        <span class="badge badge-fpm">FrenzyPenguin Media</span>
        <span class="badge badge-metapod">Open Source</span>
        <span class="badge badge-live">Updated daily</span>
      </div>
      <h1 class="hero-title">LLM Knowledge Base</h1>
      <p class="hero-subtitle">
        Every free model. Every paid model. Every price change since launch.
        Curated by <strong>neohiro/LLM</strong> — the Free Models Router.
      </p>
      <div class="hero-cta">
        <a href="#models" class="btn btn-primary">Browse Models</a>
        <a href="#providers" class="btn btn-secondary">By Provider</a>
        <a href="#pricing" class="btn btn-secondary">Pricing</a>
      </div>
    </div>
  </div>
</div>

<!-- Stats bar -->
<section class="stats-bar">
  <div class="container">
    <div class="stat-row">
      <div class="stat-item">
        <span class="stat-value" id="count-providers">12</span>
        <span class="stat-label">Providers</span>
      </div>
      <div class="stat-item">
        <span class="stat-value" id="count-models">45</span>
        <span class="stat-label">Models</span>
      </div>
      <div class="stat-item">
        <span class="stat-value" id="count-free">30</span>
        <span class="stat-label">Free Models</span>
      </div>
      <div class="stat-item">
        <span class="stat-value" id="count-countries">11</span>
        <span class="stat-label">Countries</span>
      </div>
      <div class="stat-item">
        <span class="stat-value" id="count-deprecated">4</span>
        <span class="stat-label">Deprecated</span>
      </div>
    </div>
  </div>
</section>

<!-- Filter bar -->
<section class="filter-bar">
  <div class="container">
    <div class="filter-row">
      <input type="search" id="model-search" placeholder="Search models, providers, tasks…" class="search-input">
      <select id="filter-tier">
        <option value="">All tiers</option>
        <option value="free">Free</option>
        <option value="unlimited">Unlimited (local)</option>
        <option value="paid">Paid</option>
        <option value="deprecated">Deprecated</option>
      </select>
      <select id="filter-provider">
        <option value="">All providers</option>
        <option value="groq">Groq</option>
        <option value="cerebras">Cerebras</option>
        <option value="github_models">GitHub Models</option>
        <option value="google_ai">Google AI</option>
        <option value="cohere">Cohere</option>
        <option value="ollama">Ollama (local)</option>
        <option value="openrouter">OpenRouter</option>
        <option value="nvidia">NVIDIA NIM</option>
        <option value="cloudflare">Cloudflare Workers AI</option>
        <option value="huggingface">HuggingFace</option>
        <option value="together">Together AI</option>
        <option value="sambanova">SambaNova</option>
      </select>
      <select id="filter-modality">
        <option value="">All modalities</option>
        <option value="text">Text only</option>
        <option value="vision">Vision</option>
        <option value="audio">Audio</option>
        <option value="code">Code specialist</option>
      </select>
      <label><input type="checkbox" id="filter-free-only"> Free only</label>
    </div>
  </div>
</section>

<!-- Models grid -->
<section class="section" id="models">
  <div class="container">
    <header class="section-header">
      <h2>All Models <span class="count-badge" id="model-count">(45)</span></h2>
      <p class="section-subtitle">Sorted newest first · Deprecated included · Click for pricing history</p>
    </header>
    <div class="models-grid" id="models-grid">
      <!-- Rendered by JS from data/models_extended.json -->
    </div>
  </div>
</section>

<!-- Pricing section -->
<section class="section section-alt" id="pricing">
  <div class="container">
    <header class="section-header">
      <h2>Pricing</h2>
      <p class="section-subtitle">Per-million-token pricing · Price history since launch · EOL indicators</p>
    </header>

    <!-- Price history SVG chart -->
    <div class="chart-frame">
      <h3>Price Through Time (select a model)</h3>
      <div class="chart-controls">
        <select id="price-model-select">
          <option value="">— choose model —</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o mini</option>
          <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="llama-3.1-70b">Llama 3.1 70B</option>
          <option value="qwen-2.5-72b">Qwen 2.5 72B</option>
        </select>
      </div>
      <div class="chart-container">
        <svg id="price-chart" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" aria-label="Price history chart">
          <text x="400" y="160" text-anchor="middle" fill="#7d8590" font-size="14">Select a model above to see its pricing history</text>
        </svg>
      </div>
    </div>

    <!-- Pricing table -->
    <div class="pricing-table-wrap">
      <table class="pricing-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Provider</th>
            <th>Input $/M</th>
            <th>Output $/M</th>
            <th>Context</th>
            <th>Free tier</th>
            <th>Status</th>
            <th>EOL / Deprecated</th>
          </tr>
        </thead>
        <tbody id="pricing-tbody">
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Providers section -->
<section class="section" id="providers">
  <div class="container">
    <header class="section-header">
      <h2>Providers</h2>
      <p class="section-subtitle">Clear hierarchy · Country of origin · Rate limits · OpenAI compat</p>
    </header>

    <div class="providers-grid" id="providers-grid">
      <!-- Rendered by JS -->
    </div>
  </div>
</section>

<!-- Deprecated models -->
<section class="section" id="deprecated">
  <div class="container">
    <header class="section-header">
      <h2>Deprecated & EOL</h2>
      <p class="section-subtitle">Models that are no longer available or have been superseded</p>
    </header>

    <div class="deprecated-list" id="deprecated-list">
    </div>
  </div>
</section>

<!-- KB Source -->
<section class="section section-alt">
  <div class="container" style="text-align:center; max-width:800px; margin:0 auto;">
    <h2 style="margin-bottom:16px;">Knowledge Base Source</h2>
    <p style="color:var(--fg-muted); margin-bottom:24px;">
      This knowledge base mirrors the private <strong>neohiro/LLM</strong> repository.
      It is updated daily from curated upstream sources including OpenRouter, HuggingFace,
      provider docs, and community contributions.
    </p>
    <div class="sponsor-links">
      <a href="https://github.com/sponsors/neohiro" class="sponsor-red" target="_blank">♥ Sponsor neohiro</a>
      <a href="https://neohiro.github.io/" target="_blank">🌐 neohiro.github.io</a>
      <a href="https://transhumanists.github.io/" target="_blank">🧬 transhumanists</a>
      <a href="https://github.com/neohiro/LLM" target="_blank">🤖 neohiro/LLM (private)</a>
    </div>
  </div>
</section>

<script src="assets/llm-kb.js" defer></script>
