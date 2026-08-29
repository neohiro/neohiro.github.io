---
stars: 0
forks: 0
open_issues: 0
pushed_at: 2026-08-22T20:38:25Z
created_at: 2025-08-14T23:25:13Z
title: NewsAggregator
tagline: "Global news feed with search â€” RSS/Atom/JSON Feed aggregation, offline reading, cross-platform"
platform: Windows / Linux / macOS
language: Python (PySide6/Qt)
category: Information
repo_url: https://github.com/neohiro/NewsAggregator
featured: false
weight: 16
icon: |
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M4 11a9 9 0 019 9"/>
    <path d="M4 4a16 16 0 0116 16"/>
    <circle cx="5" cy="19" r="1" fill="currentColor"/>
  </svg>
---
**NewsAggregator** pulls news from anywhere â€” RSS, Atom, JSON Feed, Reddit, Hacker News, Twitter/X â€” into a unified, searchable reader.

## Features

- **Multi-Source** â€” RSS/Atom/JSON Feed, Reddit (subreddits/multireddits), HN, Twitter/X lists, Mastodon
- **Unified Timeline** â€” Chronological or relevance-sorted with source badges
- **Full-Text Search** â€” SQLite FTS5 index across all articles; regex support
- **Offline Reading** â€” Articles cached locally; read anywhere without internet
- **Filters & Rules** â€” "Hide paywall", "Only tech", "Exclude politics" per feed
- **Read Later** â€” Pocket/Instapaper/Readwise sync; local bookmarks
- **Export** â€” EPUB, PDF, Markdown, JSON for offline archives
- **Themes** â€” Dark/light/sepia with custom fonts and line height

## Installation

### Windows
Download `NewsAggregator-Setup.exe` from [Releases](https://github.com/neohiro/NewsAggregator/releases)

### Linux
```bash
# Flatpak
flatpak install flathub io.github.neohiro.NewsAggregator

# AppImage
wget https://github.com/neohiro/NewsAggregator/releases/latest/download/NewsAggregator.AppImage
chmod +x NewsAggregator.AppImage
./NewsAggregator.AppImage
```

### macOS
```bash
brew install --cask newsaggregator
```

## Quick Start

1. Launch â†’ "Add Source" â†’ Paste RSS/Reddit/Twitter URL
2. Name it, choose update interval (5mâ€“24h)
3. Articles appear in unified feed
4. Press `/` to search across all sources

## Supported Sources

| Type | Examples |
|------|----------|
| RSS/Atom | Any blog, news site, podcast |
| JSON Feed | Modern feeds (Micro.blog, etc.) |
| Reddit | `r/programming`, `r/rust+golang`, user multireddits |
| Hacker News | Front page, new, best, ask, show |
| Twitter/X | Lists, users, searches (via Nitter) |
| Mastodon | Hashtags, lists, local/federated timeline |
| YouTube | Channel RSS (via invidious) |

## Privacy

- **Local-only** â€” No accounts, no cloud sync unless you configure it
- **No tracking** â€” Requests go directly to sources; no proxy
- **Tor support** â€” Route via Tor for anonymous fetching
- **Encrypted cache** â€” Optional AES-256 for article database

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j`/`k` | Next/prev article |
| `o` | Open in browser |
| `s` | Save for later |
| `/` | Focus search |
| `f` | Toggle filter panel |
| `t` | Toggle theme |
| `r` | Refresh all sources |

## Configuration

`~/.config/NewsAggregator/config.yaml`:

```yaml
update_interval_minutes: 30
max_articles_per_source: 100
cache_days: 90
theme: "auto"
font_family: "Inter"
font_size: 14
line_height: 1.6
search_engine: "sqlite_fts5"
offline_mode: false
tor_proxy: "socks5://127.0.0.1:9050"
```

## Related

- [opencode](https://github.com/neohiro/opencode) â€” AI agent that can summarize feeds