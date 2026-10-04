---
name: meshcore-meshtastic-vanity-key
title: MeshCore Vanity Key Generator
tagline: "Browser-based Ed25519 vanity key generator — GPU-powered, scalar-walk optimized, prefix/suffix matching, with Meshtastic PSK and node-key mining"
platform: Web (GitHub Pages)
language: Python / JavaScript
category: Cryptography
featured: true
weight: 5
repo_url: https://github.com/neohiro/meshcore-meshtastic-vanity-key
demo_url: https://neohiro.github.io/meshcore-meshtastic-vanity-key/
docs_url: https://github.com/neohiro/meshcore-meshtastic-vanity-key#readme
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

**MeshCore Vanity Key Generator** is a browser-based, GPU-accelerated Ed25519
vanity key generator designed for Meshtastic, MeshCore, Nostr, and cryptographic
identity keys. It mines real keypairs — not fake strings — until the *encoded*
public key matches a pattern you chose, then hands you the matching private key.

Everything runs on your own hardware. There is no server, no account, no key ever
transmitted, and no telemetry of any kind.

<div class="vk-cta">
  <a class="vk-cta__btn vk-cta__btn--primary" href="https://neohiro.github.io/meshcore-meshtastic-vanity-key/" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    Open the miner
  </a>
  <a class="vk-cta__btn" href="https://github.com/neohiro/meshcore-meshtastic-vanity-key" target="_blank" rel="noopener">Source on GitHub</a>
  <span class="vk-cta__note">Works offline once loaded · installable PWA · nothing leaves the tab</span>
</div>

## Features

<div class="vk-grid">
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#9889;</span>
    <h3>GPU-Powered (WebGPU)</h3>
    <p>Parallel search across thousands of shader threads, with Web Workers and libsodium WASM as the fallback. Every logical core is used, capped at 32.</p>
  </div>
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#128274;</span>
    <h3>Zero Telemetry</h3>
    <p>Key derivation runs in browser memory. No network round-trip is needed to mine, so an air-gapped machine is a perfectly good miner.</p>
  </div>
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#129717;</span>
    <h3>Scalar-Walk Optimized</h3>
    <p>A seeded 256-bit counter is incremented in place and fed to libsodium, so a given seed reproduces a search exactly and no CSPRNG syscall is paid per attempt.</p>
  </div>
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#127919;</span>
    <h3>Both Ends At Once</h3>
    <p>Prefix <em>and</em> suffix in a single pass, so a half-transcribed key fails loudly instead of silently becoming a different node.</p>
  </div>
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#127760;</span>
    <h3>Five Encodings</h3>
    <p>hex, base64, base64url, base58 and bech32 — the formats MeshCore, Meshtastic and Nostr actually import.</p>
  </div>
  <div class="vk-card">
    <span class="vk-card__glyph" aria-hidden="true">&#128421;</span>
    <h3>CLI Too</h3>
    <p>The Python entry point mines from a terminal or a script, with parallel multiprocessing and an estimator that tells you the cost before you spend it.</p>
  </div>
</div>

## Vanity & Functional Keypair Mining

A node's identity is bytes out of a random number generator, and nothing about them
is designed. `a3f1&hellip;c902` is as arbitrary as a Wi-Fi MAC address, and it still
has to be read off a QR code, dictated over a handheld radio, or pasted into a phone
by someone who cannot see the screen. Mining is the one case where brute force is
genuinely the right answer: you pay for the search once, and every later contact with
that node is cheaper.

Most people ask for the wrong thing, because *vanity* and *functional* are two
different goals that happen to share a command.

<table class="vk-table">
  <thead>
    <tr><th></th><th>Vanity</th><th>Functional</th></tr>
  </thead>
  <tbody>
    <tr>
      <th>Why</th>
      <td>The identity reads well and sticks in memory.</td>
      <td>The identity is <em>checkable</em> by a human under bad conditions.</td>
    </tr>
    <tr>
      <th>Typical target</th>
      <td><code>mc1qneohiro&hellip;</code>, <code>!a1b2c3&hellip;</code></td>
      <td>A prefix <strong>and</strong> a suffix, so a half-transcribed key fails loudly.</td>
    </tr>
    <tr>
      <th>Cost</th>
      <td><code>16&#8319;</code> attempts for <code>n</code> hex characters. 4 is instant, 6 is minutes.</td>
      <td>That, <strong>squared</strong> — each constrained end multiplies rather than adds.</td>
    </tr>
    <tr>
      <th>Classic mistake</th>
      <td>Asking for 9+ characters. That is a lottery ticket, not a mnemonic.</td>
      <td>Mining a <em>reserved</em> prefix and then wondering why the client refuses the key.</td>
    </tr>
  </tbody>
</table>

Both run the same code path with the same flags. The distinction only matters when
deciding what to ask for — and in both cases the pattern is matched against the
**encoded public key**, never the private one, which never leaves your machine.

> **Reserved prefixes.** Hex `00` and `ff` belong to MeshCore framework devices. They
> are mined with a warning rather than rejected, because some people deliberately
> want one. Set `MESHCORE_VANITY_STRICT_RESERVED=1` to turn the warning back into a
> hard rejection — better to fail than hand someone a key their client refuses.

### Meshtastic prefix and suffix mining

Meshtastic has two unrelated things that people both call "the key", and they are
mined by two unrelated means. Conflating them is the usual first mistake.

#### Channel PSK — symmetric, minable directly

A Meshtastic channel is a name plus a pre-shared key written `base64:&hellip;`.
`AQ==` is the single byte `0x01` and is the well-known default on every device — it
is not a secret, and traffic on the default channel is readable by anyone in range
or on a shared MQTT server. `Ag==`–`Cg==` are the `simple1`–`simple9` shorthands. A
private channel is 16 bytes (AES-128) or 32 bytes (AES-256).

A PSK is raw key material rather than a signing key, so there is no keypair to
derive — the bytes *are* the key. That is what makes a vanity PSK a genuinely
**functional** target rather than a decoration: the pattern you require has to be
the literal key material.

```bash
# starts with "NHI…"
meshcore-vanity NHI --encoding base64

# …and ends with "…0" — two patterns, one search
meshcore-vanity NHI --encoding base64 --suffix 0

# suffix only
meshcore-vanity --encoding base64 --suffix qw
```

Memorable here means **transcribable**. A group reads a PSK out over an FM handheld
before anybody has a phone paired, and a key with recognisable ends survives that
round trip when a bare 24-character base64 blob does not.

One quirk worth knowing before you pick a suffix: 256 bits do not divide evenly into
6-bit base64 characters, so the 43rd data character carries only 4 significant bits
and its low two bits are always zero. A base64 suffix must therefore end in one of
`048AEIMQUYcgkosw`. A suffix ending in anything else can never match, and is
rejected immediately instead of spinning forever.

#### Node key and `!` user ID — a different curve, and one more derivation

A Meshtastic node's key is **Curve25519**, not Ed25519, and the `!` + hex ID the
firmware advertises is a *further* derivation from that node key. Since firmware
**2.8** that derivation runs from the public-key identity rather than from a hardware
MAC address, which is what lets a node keep its identity across a factory reset. Two
separate things therefore have to line up:

<pre class="vk-diagram"><code>   seed ─▶ Curve25519 node key ─▶ firmware derivation ─▶ !a1b2c3d4
            ▲ the keypair                              ▲ what you read out of the UI
              that matters</code></pre>

<div class="vk-notes">
  <ul>
    <li><strong>The curve is the trap.</strong> <code>--encoding hex</code> chooses how a key is <em>printed</em>; it does not choose which key it is. On the default Ed25519 derivation you get a valid MeshCore device key and <strong>not</strong> a Meshtastic node key, and the node will simply refuse the import — which reads like a firmware bug and is not one. Node-key mining is a different algorithm, not a different encoding.</li>
    <li><strong>The <code>!</code> ID is fixed width.</strong> <code>!a1b2c3d4</code> is four bytes of derivation and nothing truncates it away, so there is no short form to ask for.</li>
    <li><strong>An ID pattern is not a key pattern.</strong> Constraining <code>!a1b2c3d4</code> constrains a derivation <em>of</em> the key, so the search is no cheaper than mining the key and usually dearer.</li>
    <li><strong>Node keys are TOFU-bound.</strong> The first public key a node hears for a given node number is the one it keeps. Change a key after it has been seen and peers treat you as a stranger who replaced somebody.</li>
  </ul>
</div>

### What mining cannot do

Every device in the MeshCore and Meshtastic families generates its own key on first
boot, and **nothing here changes the identity a shipped firmware hands you**. Mining
is for a node you are deliberately provisioning: a fresh key imported over USB, a
companion client, or a factory-reset device whose identity you are re-establishing
anyway. If a node already has an identity, mine a *new* one and swap it in
deliberately. Never overwrite a key that peers already hold.

## Encodings

<table class="vk-table">
  <thead>
    <tr><th>Encoding</th><th>Example shape</th><th>Where it is used</th></tr>
  </thead>
  <tbody>
    <tr><td><code>hex</code></td><td><code>a1b2c3&hellip;</code> (64 chars)</td><td>MeshCore device import</td></tr>
    <tr><td><code>base64</code></td><td><code>q83v&hellip;</code> (44 chars)</td><td>Meshtastic channel PSKs</td></tr>
    <tr><td><code>base64url</code></td><td><code>q83v&hellip;</code> (43 chars)</td><td>URL-safe, no padding</td></tr>
    <tr><td><code>base58</code></td><td><code>2gV&hellip;</code> (44 chars)</td><td>Bitcoin alphabet</td></tr>
    <tr><td><code>bech32</code></td><td><code>mc1q&hellip;</code> (61 chars)</td><td>MeshCore node addresses</td></tr>
  </tbody>
</table>

`hex` and `bech32` match case-insensitively. `base64`, `base64url` and `base58` are
case-sensitive alphabets and are always matched exactly — returning the wrong case
would mean handing you a key that does not match the pattern you asked for.

## Cost, before you spend it

Each constrained hex character multiplies the search space by sixteen. The bundled
budget estimator projects wall-clock time from measured throughput, and the CLI asks
for confirmation before starting anything long.

| Pattern | Attempts | Roughly |
|---|---|---|
| 3 hex characters | ~4,000 | instant |
| 4 hex characters | ~65,000 | instant |
| 5 hex characters | ~1,000,000 | seconds |
| 6 hex characters | ~16,000,000 | minutes |
| 8 hex characters | ~4&times;10<sup>18</sup> | hours to days, add workers |

Two ends cost the product, not the sum. If that is more than you need, ask for a
prefix alone and put the effort into a suffix that only has to *fail* loudly — which
is a much cheaper way to buy the same safety.

## Privacy

- Key derivation never touches the network. Mining works with the network cable out.
- The browser app keeps found keys in `localStorage`, obfuscated with an XOR keystream whose key is `SHA-256(secret || origin)`, with `secret` held in a separate storage backend (IndexedDB). Lifting one store alone yields nothing, and `origin` binds the copy to this site.
- That is **obfuscation, not encryption**, with a deliberate scope: it stops data-at-rest theft from a copied storage blob, not script running on the origin. Clear the history when you are done.
- The CLI prints the private key to **stderr by default**. Pass `--no-output-private` if you are capturing stderr — a CI log, a shared terminal, a piped dashboard.

## In the same family

The miner is the identity layer for a set of mesh-device projects. Each of these
runs LoRa hardware, and each links back to this page:

<div class="vk-related">
  <a class="vk-related__item" href="https://github.com/neohiro/meshcore-meshtastic-heltec-v4" target="_blank" rel="noopener">
    <strong>lora-multiboot</strong>
    <span>Multi-slot firmware platform for single-radio LoRa boards — MeshCore and Meshtastic roles on one Heltec V4.</span>
  </a>
  <a class="vk-related__item" href="https://github.com/neohiro/meshcore-waveshare-usb-lora" target="_blank" rel="noopener">
    <strong>meshcore-waveshare-usb-lora</strong>
    <span>KISS modem firmware for the Waveshare USB-TO-LoRa SX1262 dongle, contract-tested against meshcore-go.</span>
  </a>
  <a class="vk-related__item" href="https://github.com/neohiro/lora-sniffer" target="_blank" rel="noopener">
    <strong>lora-sniffer</strong>
    <span>Receive-only Heltec V4 firmware that says what each frame is, which mesh it belongs to, and which ones nothing can explain.</span>
  </a>
</div>

## Credits

- [MeshCore](https://meshcore.io/) — decentralized mesh networking, and the bech32 `mc1&hellip;` addressing this miner targets
- [Meshtastic](https://meshtastic.org/) — the PSK and node-ID formats covered above
- [Ed25519](https://ed25519.cr.yp.to/) — fast, secure elliptic curve signatures
- [libsodium](https://libsodium.org/) — the primitives, compiled to WebAssembly
- [BIP-0173](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki) — bech32 address format
- [PyNaCl](https://pynacl.readthedocs.io/) — Python libsodium bindings for the CLI