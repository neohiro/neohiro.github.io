---
layout: default
title: All Repositories
description: "Complete index of neohiro public repositories — security tools, privacy utilities, games, and developer tools"
permalink: /repositories/
---

<div class="repos-page" id="repositories">
  <div class="container">
    <nav class="repos-breadcrumb" aria-label="Breadcrumb">
      <a href="{{ '/' | relative_url }}">neohiro</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">All Repositories</span>
    </nav>

    <header class="repos-header">
      <h1>All Repositories</h1>
      <p class="repos-subtitle">{{ site.tools | size }} public projects — security, privacy, games, and developer tools</p>
    </header>

    <div class="repos-filters" role="group" aria-label="Filter repositories">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="security">Security & Privacy</button>
      <button class="filter-btn" data-filter="developer">Developer Tools</button>
      <button class="filter-btn" data-filter="games">Games</button>
      <button class="filter-btn" data-filter="utilities">Utilities</button>
      <button class="filter-btn" data-filter="guides">Guides</button>
    </div>

    <div class="repos-stats" aria-live="polite">
      <span class="stat"><strong id="count-all">{{ site.tools | size }}</strong> repositories</span>
      <span class="stat"><strong id="count-featured">{{ site.tools | where: "featured", true | size }}</strong> featured</span>
      <span class="stat"><strong id="count-stars">—</strong> total stars</span>
    </div>

    <div class="repos-grid" id="repos-grid">
      {% assign sorted_tools = site.tools | sort: "weight" %}
      {% for tool in sorted_tools %}
        {% assign categories = tool.category | split: ", " %}
        <article class="repo-card" 
                 data-category="{{ categories | join: ' ' }}"
                 data-name="{{ tool.title | downcase }}"
                 data-language="{{ tool.language | downcase }}"
                 itemscope itemtype="https://schema.org/SoftwareApplication">
          <div class="repo-card-icon" aria-hidden="true">
            {% if tool.icon %}
              {{ tool.icon }}
            {% else %}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
            {% endif %}
          </div>
          <h3 class="repo-card-name" itemprop="name">
            <a href="{{ tool.repo_url }}" target="_blank" rel="noopener">{{ tool.title }}</a>
            {% if tool.featured %}
              <span class="featured-badge" title="Featured">★</span>
            {% endif %}
          </h3>
          <p class="repo-card-desc" itemprop="description">{{ tool.tagline }}</p>
          <div class="repo-card-meta">
            <span class="repo-platform" itemprop="operatingSystem">{{ tool.platform }}</span>
            {% if tool.language %}
              <span class="repo-lang">{{ tool.language }}</span>
            {% endif %}
            {% if tool.category %}
              <span class="repo-category">{{ tool.category }}</span>
            {% endif %}
          </div>
          <div class="repo-card-links">
            <a href="{{ tool.permalink | relative_url }}" class="repo-link" itemprop="url">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Details
            </a>
            <a href="{{ tool.repo_url }}" class="repo-link repo-link-external" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </article>
      {% endfor %}
    </div>

    <footer class="repos-footer">
      <p>Part of <a href="https://github.com/neohiro" target="_blank" rel="noopener">neohiro</a> — {{ site.description }}</p>
      <p><a href="{{ '/' | relative_url }}">← Back to Home</a></p>
    </footer>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('repos-grid');
  const cards = grid.querySelectorAll('.repo-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const countAll = document.getElementById('count-all');
  const countFeatured = document.getElementById('count-featured');
  
  // Update counts
  if (countAll) countAll.textContent = cards.length;
  if (countFeatured) {
    const featured = document.querySelectorAll('.repo-card .featured-badge').length;
    countFeatured.textContent = featured;
  }

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter cards
      cards.forEach(card => {
        const categories = card.dataset.category || '';
        const name = card.dataset.name || '';
        const lang = card.dataset.language || '';
        
        let show = false;
        if (filter === 'all') {
          show = true;
        } else if (filter === 'security') {
          show = categories.includes('security') || categories.includes('privacy') || 
                 categories.includes('network') || name.includes('hardening') ||
                 name.includes('protection') || name.includes('netstrip') ||
                 name.includes('exploit') || name.includes('honeyscan') ||
                 name.includes('firewall') || name.includes('dns');
        } else if (filter === 'developer') {
          show = categories.includes('developer') || name.includes('auto-resume') ||
                 name.includes('mobile-sync') || name.includes('opencode');
        } else if (filter === 'games') {
          show = categories.includes('games') || name.includes('zombie') ||
                 name.includes('tristar') || name.includes('tetris') ||
                 name.includes('ghost') || name.includes('maze') ||
                 name.includes('space') || name.includes('shooter');
        } else if (filter === 'utilities') {
          show = categories.includes('utilities') || categories.includes('system') ||
                 name.includes('monitor') || name.includes('news') ||
                 name.includes('aggregator') || name.includes('calculator') ||
                 name.includes('clock') || name.includes('file') ||
                 name.includes('music') || name.includes('dns') ||
                 name.includes('lookup') || name.includes('godmode') ||
                 name.includes('shadowsocks') || name.includes('lan');
        } else if (filter === 'guides') {
          show = categories.includes('guides') || name.includes('linux') ||
                 name.includes('ubuntu') || name.includes('windows');
        }
        
        card.style.display = show ? 'flex' : 'none';
      });
      
      // Update visible count
      const visible = document.querySelectorAll('.repo-card[style*="flex"], .repo-card:not([style*="none"])').length;
      if (countAll) countAll.textContent = visible;
    });
  });

  // Search functionality (bonus)
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search repositories...';
  searchInput.className = 'repo-search';
  searchInput.setAttribute('aria-label', 'Search repositories');
  document.querySelector('.repos-filters').appendChild(searchInput);

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    cards.forEach(card => {
      const name = card.dataset.name || '';
      const desc = card.querySelector('.repo-card-desc')?.textContent.toLowerCase() || '';
      const lang = card.dataset.language || '';
      const category = card.dataset.category || '';
      
      const match = !query || 
        name.includes(query) || 
        desc.includes(query) || 
        lang.includes(query) || 
        category.includes(query);
      
      const currentlyHidden = card.style.display === 'none';
      if (match && !currentlyHidden) {
        card.style.display = 'flex';
      } else if (!match) {
        card.style.display = 'none';
      }
    });
  });
});
</script>

<style>
.repos-page { padding: 40px 0 80px; }
.repos-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--fg-subtle); margin-bottom: 40px; }
.repos-breadcrumb a { color: var(--fg-subtle); }
.repos-breadcrumb a:hover { color: var(--accent); }
.repos-breadcrumb span[aria-current] { color: var(--fg); font-weight: 500; }

.repos-header { text-align: center; margin-bottom: 32px; }
.repos-header h1 { margin-bottom: 12px; }
.repos-subtitle { font-size: 1.125rem; color: var(--fg-muted); max-width: 600px; margin: 0 auto; }

.repos-filters { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
.filter-btn { padding: 8px 18px; font-size: 0.8125rem; font-weight: 500; color: var(--fg-muted); background: var(--bg-card); border: 1px solid var(--border); border-radius: 999px; cursor: pointer; transition: all var(--transition); }
.filter-btn:hover { color: var(--fg); border-color: var(--border-hover); }
.filter-btn.active { color: white; background: var(--accent); border-color: var(--accent); }

.repos-stats { display: flex; justify-content: center; gap: 32px; margin-bottom: 32px; font-size: 0.875rem; color: var(--fg-subtle); flex-wrap: wrap; }
.repos-stats .stat { display: flex; align-items: center; gap: 6px; }
.repos-stats strong { color: var(--fg); font-family: var(--font-mono); }

.repos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.repo-card { display: flex; flex-direction: column; padding: 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); position: relative; }
.repo-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent), var(--accent-strong)); border-radius: var(--radius) var(--radius) 0 0; opacity: 0; transition: opacity var(--transition); }
.repo-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow); }
.repo-card:hover::before { opacity: 1; }

.repo-card-icon { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--accent-dim); color: var(--accent); margin-bottom: 16px; }
.repo-card-icon svg { width: 24px; height: 24px; }

.repo-card-name { margin-bottom: 10px; font-size: 1.0625rem; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.repo-card-name a { color: var(--fg); text-decoration: none; transition: color var(--transition); }
.repo-card-name a:hover { color: var(--accent); }
.featured-badge { font-size: 0.75rem; color: var(--orange); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }

.repo-card-desc { font-size: 0.875rem; line-height: 1.5; color: var(--fg-muted); margin-bottom: 16px; flex: 1; }

.repo-card-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; font-size: 0.75rem; font-family: var(--font-mono); }
.repo-platform, .repo-lang, .repo-category { padding: 3px 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; color: var(--fg-subtle); }

.repo-card-links { display: flex; gap: 10px; margin-top: auto; }
.repo-link { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 0.75rem; font-weight: 600; border-radius: var(--radius-sm); background: var(--accent-dim); color: var(--accent); border: 1px solid transparent; transition: all var(--transition); text-decoration: none; }
.repo-link:hover { background: var(--accent); color: white; }
.repo-link-external { background: transparent; color: var(--fg-muted); border-color: var(--border); }
.repo-link-external:hover { background: var(--bg); color: var(--fg); border-color: var(--border-hover); }

.repos-footer { text-align: center; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); color: var(--fg-subtle); font-size: 0.875rem; }
.repos-footer a { color: var(--fg-subtle); }
.repos-footer a:hover { color: var(--accent); }

.repo-search { margin-left: auto; padding: 8px 16px; font-size: 0.8125rem; color: var(--fg); background: var(--bg-card); border: 1px solid var(--border); border-radius: 999px; min-width: 200px; }
.repo-search:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.repo-search::placeholder { color: var(--fg-subtle); }

@media (max-width: 768px) {
  .repos-grid { grid-template-columns: 1fr; }
  .repos-filters { gap: 8px; }
  .filter-btn { padding: 6px 14px; font-size: 0.75rem; }
  .repo-search { margin-left: 0; margin-top: 12px; width: 100%; min-width: 0; }
  .repos-stats { gap: 16px; font-size: 0.8125rem; }
}
</style>