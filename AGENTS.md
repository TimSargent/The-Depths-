# Instructions for coding agents working on The Depths

Read **GAME_DESIGN.md** for product decisions and **BACKLOG.md** for current work before editing code. The running prototype lives in **index.html**. This repository is a mobile-first browser playtesting project; the later Unity game is separate.

## Work economically and safely

1. **Smallest effective change.** Keep the current game playable; do not rewrite/refactor whole systems merely to implement one behavior. Prefer narrow, reviewable diffs.
2. **One scoped task at a time.** Bundle directly related edits, but don't quietly add large new systems, assets, subscriptions, packages, or dependencies.
3. **Preserve established rules:** left/right press-and-hold, Explore/Excavate modes, horizontal-only excavation for now, no downward digging, 1/2/3-tile clearance, standing requires supports, duffle bag fills then returns to ledge to dump and resume. No hunger/thirst/stamina.
4. **Never invent scope decisions.** If design is unclear, choose a minimal reversible implementation and explicitly label the assumption. Do not silently reconcile horizontal-versus-vertical strip geometry.
5. **Prototype fidelity:** control ergonomics and responsiveness on iPhone Safari matter more than decorative visuals. Buttons must prevent swipe interference, support pointer cancel/release, and not get stuck when focus changes. Keep canvas responsive. No unusable touch-only or desktop-only controls.
6. **Preserve saves?** Current prototype has no durable save; don't claim there is one. Restart must return to a working initial state.
7. **Performance and stability:** avoid large dependencies, high-frequency DOM writes, runaway intervals/listeners and huge asset payloads. Clean up hold states; use frame time for motion. Don't let UI status updates inadvertently consume game progress.
8. **Animation workflow:** start with a small, reusable joint rig (human knees and backward-trailing shins in crawl) before generating hundreds of sprites. Confirm actual on-screen scale.
9. **Security/publishing:** do not add secrets, credentials, personal data, analytics, ads, payment links or network requests without explicit instruction. Public GitHub repo means contents are public.
10. **No destructive changes** to unrelated files, branch history, or working game without explicit authorization. Use descriptive commits; prefer a branch/PR for riskier work.

## Efficient workflow for each task

- Read only the relevant design section and code area; avoid re-reading every file or verbose background.
- Briefly state intended files and acceptance criteria.
- Make a focused implementation.
- Run the **relevant checks available** (syntax checks, smoke tests or headless/browser interaction if available). If tools to run the browser aren't available, state clearly that runtime behavior wasn't verified.
- Manually reason through **Explore vs Excavate**, four-second completion, bag full/return/dump/resume, collision/support restrictions and restart whenever they may be affected.
- Report concisely: **changed, tested, untested, any open issue**.
- If a new rule is approved, update GAME_DESIGN.md and BACKLOG.md in the same task. Otherwise leave design untouched.
- Do not overclaim production readiness or count a screenshot as a playable test.

## Definition of done for prototype changes

- Works from the existing `index.html` entry point without new installation.
- Existing left/right hold buttons and mode switching still work on touch.
- No accidental downward excavation or unsupported standing tunnel.
- Bag loop doesn't deadlock and does not discard progress unexpectedly.
- Restart works.
- Clearly marked assumptions/known bugs and a short test note in the commit or response.

If there is any conflict, the user's newest explicit gameplay decision takes precedence; document it rather than silently changing unrelated systems.