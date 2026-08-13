# Karty rutyn UX v3: plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wdrożyć design `docs/superpowers/specs/2026-08-13-rutyny-karty-ux-design.md`: karty rutyn bez rozwijania (kroki zawsze widoczne), lightbox na planszę, kropki postępu, stan "Wykonana", siatka 2 kolumn na desktopie.

**Architecture:** Czysta zmiana warstwy widoku: `RoutineCard.tsx` (przepisany, bez stanu `open`), nowy `Lightbox.tsx`, style w `styles.css`. Zero zmian w bazie, scoringu, celebracjach, App poza testem.

**Tech Stack:** jak dotąd (React 19, vitest, vite). Katalog roboczy: `rutyny-src/`.

## Global Constraints

- Styl kodu kompaktowy jak reszta repo; teksty UI po polsku; zakaz em/en-dash.
- Dostępność: kroki pozostają natywnymi checkboxami w labelach; touch targety min 44 px; lightbox `role="dialog"` + Esc; `prefers-reduced-motion` redukuje pop animację.
- Nie zmieniać: `App.tsx` (poza niczym), `TodayView.tsx`, dane, db, celebracje.
- Po każdym tasku testy zielone; commity po polsku.

---

### Task 1: Lightbox

**Files:** Create `src/components/Lightbox.tsx`, Test `src/components/Lightbox.test.tsx`.
**Interfaces:** `Lightbox({ src, alt, onClose }: { src:string; alt:string; onClose:()=>void })`. Task 2 renderuje go warunkowo.

Testy: renderuje obraz z altem; klik w tło woła onClose; klik w przycisk "Zamknij" woła onClose; Esc woła onClose; body dostaje `overflow:hidden` na czas życia i wraca po unmount.

Implementacja: overlay `className="lightbox"` (onClick tła = onClose, klik w img nie zamyka przez stopPropagation), `<button className="lightbox-close" aria-label="Zamknij podgląd">✕</button>` z autofocus, `useEffect` z listenerem `keydown` (Escape) + `document.body.style.overflow='hidden'` i cleanup.

### Task 2: RoutineCard v3 + style

**Files:** Rewrite `src/components/RoutineCard.tsx`, Test create `src/components/RoutineCard.test.tsx`, Modify `src/styles.css` (podmiana bloku kart: `.card-heading`, `.card-summary`, `.card-details`, `.full-image`, `.chevron`, `.check-row` na nowe `.card-top`, `.thumb`, `.dots`, `.step-chip`, `.tip-line`, `.done-badge`, `.lightbox*`; siatka `.routine-list` i `main` 1200px).

**Interfaces:** props BEZ ZMIAN: `{routine, checks, onCheck}`. Struktura karty wg design doc (miniatura-przycisk z lupką, info z kropkami, 3 chipy, tip albo done-badge).

Testy: 3 checkboxy widoczne od razu (bez klikania); klik w krok 2 woła `onCheck(1, true)`; klik w miniaturę pokazuje dialog lightboxa, X zamyka; przy `checks=[true,true,true]` widoczny tekst "Rutyna wykonana", wskazówka niewidoczna.

### Task 3: App.test + pełna suita

**Files:** Modify `src/App.test.tsx` (usunąć krok `findAllByRole('button', { expanded: false })` + klik; checkboxy są od razu).
Run: pełna suita + `npx tsc -b`. Wszystko zielone.

### Task 4: Build, deploy, dokumentacja

1. `pnpm build`, commit `rutyny/` + źródła, merge do `main`, push, weryfikacja nowego hasha bundla na produkcji.
2. `RUTYNY-DESIGN.md`: dopisek w STATUS o UX v3 (data, powód: feedback Tomka).
3. Deliverables: aktualizacja tytułu wpisu RUTYNY-DESIGN.md o UX v3; rebuild board; commit OS.
4. Aktualizacja memory `project_asz_rutyny_gra_hub.md`.
