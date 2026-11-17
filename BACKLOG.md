# The Depths — Prioritized Development Backlog

**Current playable build:** Prototype 014, `index.html`. Keep the same published URL / entry point for every playtest. This list contains *planned* work, not completed features.

## NOW — Prototype 014: nine-state anti-aliased video animation library

- [ ] **Define and integrate an articulated stick-figure rig.** Head, torso, shoulders, elbows, hands, pelvis, knees, ankles, pickaxe and bag. Rig is separate from gameplay state. Test at close actual-game camera zoom.
- [ ] **Fix low-crawl anatomy**: knees human, shins angle back behind knees, feet trail; no animal-like forward-bent lower legs.
- [x] **Initial code pass: movement-locked pose changes (visual playtest pending).** Transitions stop horizontal movement when lowering/standing up; rising begins only after entering taller clearance. Close-up camera toggle added in 009.
- [ ] **Smooth pose changes** among stand (3 tiles), crouch (2), prone crawl (1); no snapping. Animate locomotion appropriate to each. **Approved seven-pose descent:** upright walk → slight forward bend → knees slightly bent → kneel → lower torso/arms reach beneath shoulders → hands-and-knees/all fours → chest/hips lower to prone with feet trailing behind. Reverse on exiting low clearance; maintain believable ground contacts. Initially try 1.5–2 seconds for the entire descent, then tune.
- [ ] **Animate excavating a horizontal section over ~4 seconds** with repeated windup → hit → recoil → recover. Progressive visible chips/cracks/dust, not a single pop at the end. Stop/resume behavior should be defined/tested.
- [ ] **Animate and attach duffle**: heavier movement when full, miner returns to shaft, dumps debris into abyss, returns to face. Preserve the automatic bag loop.
- [ ] Keep left/right press-and-hold and Explore/Excavate controls reliable on iPhone Safari.

**Acceptance test:** Player can hold right to cut a passage; figure crouches/crawls like a human; multiple readable impacts occur across the 4-second strip; bag fills and visibly gets dumped; no control freeze; restart works.

## NEXT — Mechanics/feel balancing

- [ ] Decide and verify **excavation unit geometry**: four horizontal cut segments per forward-length unit versus four vertical clearance strips; represent clearance (1/2/3 tiles) consistently. Clarify before reworking terrain.
- [ ] Test whether **posture mining penalties** add useful strategy without making prospecting tedious (initial baseline 4 seconds per segment irrespective of posture).
- [ ] Compare narrow prospecting vs widened working tunnels by **time, waste volume, and movement speed**. Players should rationally choose narrow routes to scout.
- [ ] Improve support logic: support span, visible preview, when placed, how to avoid blocking tunnel, and ensure full-height mining requires reinforcement.
- [ ] Tune **bag capacity** (currently eight mined segments), dump distance and trip speed. Check automatic return/resume behavior if player was mining left rather than right.
- [ ] Verify collision/step-up/small gap behavior on future height changes; avoid movement into solid rock or through unsupported ground.
- [ ] Add deterministic smoke-test/checklist for both modes, all tunnel heights, unsupported roof, auto-dump, and restart.

## LATER — After horizontal mining feels right

- [ ] Material-specific impact audio, sparks, glitter, dust reacting to independent headlamp beam.
- [ ] Organic terrain edges, rock fracture visualization, improved lighting/vignette and performance.
- [ ] Coal lamps, light fuel/blackout recovery, ore variety and useful deposits.
- [ ] Persistent resource logistics, support construction cost, ore processing/crafting.
- [ ] Vertical/diagonal excavation only after horizontal testing and engineering rules are satisfying.
- [ ] Water discovery, trommel/wash plant, concrete, waterpower, electricity, bots, optional mystery.

## Prototype 009 QA checklist

- [x] Simulated: hold right into one-tile passage; X and camera remain locked while lowering, then miner advances prone.
- [x] Simulated: return to taller passage; X and camera remain locked during stand-up, then miner advances.
- [ ] Test 2-tile crouch transitions in both directions.
- [ ] Automatic return/dump/resume completes when crossing clearance boundaries.
- [ ] Verify wide and close-up camera toggle on iPhone Safari.
- [ ] Reset, mining speed, supports, left/right button releases remain functional.

## Prototype 013 — Video animation integration

- [x] **Extract and normalize 8 selected green-screen animations** (12 transparent frames each): upright walk, standing → crouch, crouch walk, crouch → prone, low crawl, and standing/crouch/prone pickaxe strikes.
- [x] Add `assets/motion-engine.js` to decompress and draw small monochrome sprite frames from the verified `assets/motion-data-a.js` and `assets/motion-data-b.js` compressed bundles on compatible browsers. Keep the previous joint rig as fallback.
- [x] Connect sprites to existing pose, movement, and mining logic. Reverse the two transitions for rising, and lower into the selected mining posture before starting the 4-second cut.
- [x] Add **Animation Studio** below the game with clip selection, pause, reverse, and speed controls. Preview does not affect gameplay.
- [x] Run simulated movement tests: 108 fixed-position frames on lowering and rising, 0 lock violations; a subsequent post-integration simulated traversal confirmed 108 movement-locked frames in each direction and all four traversal/transition animation states; full excavation/return and three mining selectors still need a live post-integration test.
- [ ] **Real iPhone Safari playtest:** verify all 8 compressed bundles decode and report loaded, textures are visible, audio/visual impacts align, and posture changes do not clip the roof.
- [ ] Review loop seams, baseline alignment, scale, hand/foot sliding, pencil-line detail, headlamp attachment, pickaxe contact, and bag prop overlap.
- [ ] Replace temporary monochrome silhouettes with higher-quality textured frames after playtesting, without re-generating video if possible. Original selected videos remain the source references.
- [ ] Test legacy rig fallback if network asset loading fails or the browser lacks `DecompressionStream`.

## Prototype 012 technical notes

- Extracted 12 frames from the uploaded green-screen walk sheet into a **simplified vectorized SVG** (4 columns x 3 rows), in `assets/miner-walk-vector.svg`. The source PNG remains a local experimental asset; SVG preserves silhouettes but **not full pen-line detail**.
- `index.html` renders that sheet at 12 fps when upright and moving in clear space. All other motions continue to use the articulated rig.
- Added Sprite walk ON / Rig walk ON comparison button and renderer state debug readout. Sprite gracefully falls back to rig if loading fails.
- JavaScript syntax and mocked movement regression checks passed; 108 locked frames in both downward/upward transitions, no X-lock violations. **Actual SVG decoding and iPhone Safari visual quality need playtesting.**
- [ ] Evaluate looping cadence, foot-sliding, frame alignment, camera scaling and lamp/bag overlay; choose whether to keep original PNG art or refine video frames for the next build.

## Prototype 011 technical notes

Seven rig keyframes were refined to model a human lowering into prone: feet planted during initial lean/bend, knees supporting kneel, palms touching floor in reach/all-fours, then chest/hips lowered with shins trailing behind. Subtle debug ground-contact markers appear during transitions. The previous movement and camera locks were preserved. Simulated lower and rise passed 108 locked frames each at constant X and camera. Visual playtesting and final anatomical polishing remain outstanding.

## Prototype 010 technical notes

The animation state now explicitly reports IDLE/MOVING/TRANSITION/AUTO TRAVEL/DUMP and displays world X, pose, and camera lock. A lowering transition queues the boundary step until animation ends; rising enters the tall tile then locks there before further travel. While transitioning, X and camera are frozen. A simulated keyboard/timing test of both directions passed 108 locked frames apiece with no X changes or camera drift. Visual mobile playtest still required.

## Decision log

- 2026-11-16: On tunnel-height changes, pause horizontal travel to finish raising/lowering posture; close-up animation inspection is a priority.
- 2026-11-16: Focus on **horizontal-only** excavation for now. No digging downward. Only left/right mobile hold controls; use Explore/Excavate mode buckets.
- 2026-11-16: Desired slow cuts **around 4 seconds or more per small section**, with visible intermediate strikes.
- 2026-11-16: Bag automatically collects spoil; when full miner returns to shaft ledge, dumps into the abyss, and resumes. Supports required for standing-height tunnels.
- 2026-11-16: Test **2D stick-figure articulated animations** before final sprite art. Low crawl uses **human bent knees, shins trailing backward**.
- Open: reconcile exact strip orientation and dimensions before major terrain code rewrite; measure actual fun rather than treating prototype balance as final.
