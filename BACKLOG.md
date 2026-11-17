# The Depths — Prioritized Development Backlog

**Current playable build:** Prototype 022, `index.html`. Keep the same published URL / entry point for every playtest. This list contains *planned* work, not completed features.

## NOW — Prototype 021: grounded walking and seamless travel

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

## Prototype 015 visual QA

- [x] Replace fixed 320×240 sprite drawing with per-frame visible-body cropping, height tiers (standing ~176, crouch ~112, prone ~46 screen-world px) and feet-on-floor anchoring.
- [x] Reverse default walking cycle order and add a **Walk cycle: reversed/original** comparison button to help diagnose the observed moonwalk.
- [ ] Verify on iPhone which gait order actually reads as forward motion; adjust frame ordering/cadence against real player travel if neither does.
- [ ] Visually compare stand → crouch → prone size, ground contact, pickaxe reach and headlamp placement. These are provisional physical scale values.
- [ ] Ensure transitions remain stationary and automated bag trips still work during gameplay.

## Prototype 016 fix and QA

- [x] Fixed animation-frame scaling: **one reference height and X-center per sequence**, rather than resizing every frame based on that frame's changing silhouette bounds.
- [x] Keeps the miner's feet aligned with the tunnel floor, while allowing the posture itself to naturally lower the head and torso.
- [x] Maintains the corrected walking frame order and selectable comparison mode from Prototype 015.
- [ ] Visually confirm on iPhone that prone crawling and transitions no longer pulse in size.
- [ ] Check residual source-video frame inconsistencies (which cannot be eliminated by renderer scaling alone).
- [ ] Verify movement locks, bag return/dump, pickaxe and headlamp placement after the geometry change.

## Prototype 017 keying bug and verification

- [x] Diagnosed source assets: the 8-frame crouch-walk sequence contains **three nearly empty frames** (frame indices 1, 5, 7), with only 13, 15, and 69 strong pixels against typical intact frames of 1,400–1,550 pixels.
- [x] Motion decoder now detects near-empty frames and substitutes the nearest intact frame from the same animation. This avoids sudden tiny/vanishing sprites without changing gameplay timing.
- [x] Verified the replacement indices in source-data analysis: crouch-walk now renders [0,0,2,3,4,4,6,0]; prone crawl and both major posture transitions remain untouched.
- [ ] Test the fix on an actual iPhone recording. Duplicate frames may be visually choppy; later we can regenerate or reconstruct *only* the damaged images, without new video credits.

## Prototype 018 visual calibration

- [x] Compare the upright and prone source-frame dimensions; prone mining was generated at a smaller apparent physical scale.
- [x] Increase prone crawl and prone-mining display scale slightly (50 and 53 calibrated world pixels, respectively) without reintroducing per-frame scaling.
- [ ] Confirm the miner's prone length now matches standing proportions on iPhone, and that no tool swing clips the one-tile roof.

## Prototype 019 proportion handoff

- [x] Compared video-derived geometry: last crouch-to-prone pose spans ~191 world units; prior prone mining ~178 and prone crawl ~175.
- [x] Calibrated sequence-wide prone mining to 57 and crawl to 55 reference height units, bringing their horizontal length close to the transition end pose without per-frame scaling.
- [ ] Verify visually on iPhone that prone entry no longer looks smaller, with no excess clipping or headlamp displacement.

## Prototype 020 — complete sprite calibration audit

Audited all nine decoded video-derived animations using the actual silhouette bounds in each 256×208 atlas frame. Shared physical targets: **standing height 176**, **crouched height 119**, **prone body length 203**, **prone body height 65** (world pixels).

- [x] Upright walk and standing pickaxe swing normalized to standing height.
- [x] Stand-to-crouch first/end poses aligned with standing/crouch endpoints.
- [x] Crouch walk and crouched pickaxe swing normalized to crouch height.
- [x] Crouch-to-prone first/end poses aligned with crouch/prone endpoints.
- [x] Prone crawl and prone pick strike normalized by **both** horizontal body length and vertical body height.
- [x] Stand-to-prone transition smoothly reconciled to matching prone endpoint despite source video's unusually tall ending pose.
- [x] Damaged crouch-walk frames remain substituted from neighboring valid frames; no frame-dependent scaling reintroduced.
- [ ] Visual iPhone QA needed for silhouette distortion, pickaxe length, contact points, headlamp tracking, and transition continuity.
- [ ] Source AI-video anatomy may vary frame to frame; deterministic scaling cannot repair morphing within a source frame.

## Prototype 021 — walking cycle and tile locomotion

- [x] Separate integer gameplay grid X from smoothly interpolated visual X.
- [x] Match visible movement speed to tile cadence (five cells/second; 0.20-second steps in Explore and auto return).
- [x] Drive walking animation phase by **distance actually traveled**, rather than elapsed time or a held key. Stops frame cycling when standing still or blocked.
- [x] Rebuild active walking loop from seven better-matching source poses (discard the discontinuous last pose).
- [x] Add a short crossfade from the final pose to the first at the loop seam.
- [x] Await the last rendered step before triggering the auto-dump and before completing a return.
- [x] Delay standing-up until the visual miner reaches the taller cell, preserving prior movement locks.
- [ ] Check the visual loop cadence, seam blur and foot sliding on iPhone; tune stride-distance ratio if required.
- [ ] Check rapid start/stop tapping and automatic bag journeys after movement changes.
- [ ] Fix residual animation quality only if the video source still lacks a clean cycle.

## Prototype 022 — animation state blending

- [x] 145 ms eased visual crossfade when switching between walking/idle, crawling/mining and posture animation sets; no blend restarts on ordinary frame changes.
- [x] Preserve calibrated per-animation body scale and headlamp tracking from Prototype 020.
- [x] Preserve distance-synchronized walking and smooth grid travel from Prototype 021.
- [x] Avoid mid-step position jumps when auto-return, resuming excavation and preparation for mining initiate a posture transition.
- [x] Simulation regression: complete eight-strip bag filling, return, dump and resume; continuous visual travel (max 0.0833 cells per simulated 60 Hz frame) and zero posture lock violations.
- [ ] Verify actual sprite blending, no objectionable double-image ghosting or headlamp jumps on iPhone; adjust duration if necessary.
- [ ] Verify fast tapping and transitions between all three tunnel heights in a live playtest.

## Decision log

- 2026-11-16: On tunnel-height changes, pause horizontal travel to finish raising/lowering posture; close-up animation inspection is a priority.
- 2026-11-16: Focus on **horizontal-only** excavation for now. No digging downward. Only left/right mobile hold controls; use Explore/Excavate mode buckets.
- 2026-11-16: Desired slow cuts **around 4 seconds or more per small section**, with visible intermediate strikes.
- 2026-11-16: Bag automatically collects spoil; when full miner returns to shaft ledge, dumps into the abyss, and resumes. Supports required for standing-height tunnels.
- 2026-11-16: Test **2D stick-figure articulated animations** before final sprite art. Low crawl uses **human bent knees, shins trailing backward**.
- Open: reconcile exact strip orientation and dimensions before major terrain code rewrite; measure actual fun rather than treating prototype balance as final.
