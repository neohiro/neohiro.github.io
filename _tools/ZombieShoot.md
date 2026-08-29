---
stars: 0
forks: 0
open_issues: 0
pushed_at: 2026-08-22T20:29:59Z
created_at: 2025-08-21T02:31:28Z
title: ZombieShoot
tagline: "Top-down zombie shooter â€” procedural levels, permadeath, moddable (Windows/Linux)"
platform: Windows / Linux
language: Python (PyGame) / C++
category: Games
repo_url: https://github.com/neohiro/ZombieShoot
featured: false
weight: 17
icon: |
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="8" r="4"/>
    <path d="M12 12v8M8 16l4-4 4 4M8 20h8"/>
    <path d="M10 7h4M10 7l1 3h2M14 7l-1 3h-2" stroke="var(--red)" stroke-width="2"/>
  </svg>
---
**ZombieShoot** is a retro-styled top-down shooter with procedural generation, permadeath, and deep modding support.

## Features

- **Procedural Levels** â€” Infinite city blocks, sewers, malls, forests
- **Permadeath** â€” One life; death = new run (legacy items unlock)
- **Weapon Crafting** â€” Combine parts: barrel + stock + receiver + mod
- **Enemy Types** â€” 20+ zombie variants with unique behaviors
- **Mod Support** â€” JSON data files for weapons, enemies, levels, items
- **Replay System** â€” Full run recording with ghost playback
- **Local Co-op** â€” 2-player split-screen (keyboard + gamepad)

## Installation

### Windows
Download `ZombieShoot-Setup.exe` from [Releases](https://github.com/neohiro/ZombieShoot/releases)

### Linux
```bash
# Flatpak
flatpak install flathub io.github.neohiro.ZombieShoot

# AppImage
wget https://github.com/neohiro/ZombieShoot/releases/latest/download/ZombieShoot.AppImage
chmod +x ZombieShoot.AppImage
./ZombieShoot.AppImage

# Arch/AUR
yay -S zombieshoot-git
```

## Controls

| Action | Keyboard | Gamepad |
|--------|----------|---------|
| Move | WASD | Left Stick |
| Aim | Mouse | Right Stick |
| Shoot | LMB / Space | RT / A |
| Reload | R | RB / X |
| Switch Weapon | 1-4 / Scroll | D-Pad |
| Interact | E | Y / Triangle |
| Map | M | View / Touchpad |

## Modding

Create `mods/my_mod/` with:

```
mods/my_mod/
â”œâ”€â”€ mod.json           # Metadata, dependencies
â”œâ”€â”€ weapons/
â”‚   â””â”€â”€ railgun.json   # New weapon definition
â”œâ”€â”€ enemies/
â”‚   â””â”€â”€ boss_tyrant.json
â”œâ”€â”€ levels/
â”‚   â””â”€â”€ military_base.json
â””â”€â”€ items/
    â””â”€â”€ stimpack.json
```

Load via Main Menu â†’ Mods â†’ Enable.

## Legacy System

Complete runs to unlock:
- **Starting weapons** â€” Pistol, SMG, Shotgun variants
- **Perks** â€” Faster reload, more health, ammo finder
- **Cosmetics** â€” Character skins, weapon skins, UI themes
- **Difficulty modifiers** â€” Hardcore, speedrun, pacifist modes

## Requirements

- Python 3.10+ (bundled in releases)
- PyGame 2.5+ / SDL2
- OpenGL 3.3+ (for shaders)
- 2 GB RAM minimum

## Related

- [TristarMania](https://github.com/neohiro/TristarMania) â€” Space shooter
- [GhostMaze](https://github.com/neohiro/GhostMaze) â€” 2D RPG