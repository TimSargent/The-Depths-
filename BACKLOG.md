# The Depths — Prioritized Development Backlog

**Current playable build:** Prototype 010, `index.html`. Keep the same published URL / entry point for every playtest. This list contains *planned* work, not completed features.

## NOW — Prototype 010: hard-locked movement/camera during transitions

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

## Prototype 010 technical notes

The animation state now explicitly reports IDLE/MOVING/TRANSITION/AUTO TRAVEL/DUMP and displays world X, pose, and camera lock. A lowering transition queues the boundary step until animation ends; rising enters the tall tile then locks there before further travel. While transitioning, X and camera are frozen. A simulated keyboard/timing test of both directions passed 108 locked frames apiece with no X changes or camera drift. Visual mobile playtest still required.

## Decision log

- 2026-11-16: On tunnel-height changes, pause horizontal travel to finish raising/lowering posture; close-up animation inspection is a priority.
- 2026-11-16: Focus on **horizontal-only** excavation for now. No digging downward. Only left/right mobile hold controls; use Explore/Excavate mode buckets.
- 2026-11-16: Desired slow cuts **around 4 seconds or more per small section**, with visible intermediate strikes.
- 2026-11-16: Bag automatically collects spoil; when full miner returns to shaft ledge, dumps into the abyss, and resumes. Supports required for standing-height tunnels.
- 2026-11-16: Test **2D stick-figure articulated animations** before final sprite art. Low crawl uses **human bent knees, shins trailing backward**.
- Open: reconcile exact strip orientation and dimensions before major terrain code rewrite; measure actual fun rather than treating prototype balance as final.
