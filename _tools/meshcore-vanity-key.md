---
name: meshcore-vanity-key
title: MeshCore Vanity Key Generator
tagline: "Browser-based Ed25519 vanity key generator — GPU-powered, scalar-walk optimized, prefix/suffix matching"
platform: Web (GitHub Pages)
language: Python / JavaScript
category: Cryptography
featured: true
weight: 5
repo_url: https://github.com/neohiro/meshcore-vanity-key
demo_url: https://neohiro.github.io/meshcore-vanity-key/
stars: 0
forks: 0
open_issues: 0
created_at: 2026-09-29T20:48:19Z
pushed_at: 2026-09-30T09:48:42Z
icon: |
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
---

**MeshCore Vanity Key Generator** is a browser-based, GPU-accelerated Ed25519 vanity key generator designed for Meshtastic, Nostr, and cryptographic identity keys.

## Features
- **GPU-Powered (WebGPU)**: Parallel search across thousands of shader threads.
- **Zero Telemetry**: All key derivation runs 100% locally in your browser memory.
- **Scalar-Walk Optimized**: Faster prefix and suffix matching without CPU locking.
