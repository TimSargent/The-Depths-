# The Depths — Prioritized Development Backlog

**Current playable build:** Prototype 033, `index.html`. Keep the same published URL / entry point for every playtest. This list contains *planned* work, not completed features.

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

## Prototype 023 — selected mining posture must finish before swings

- [x] Gate rock-face mining animations, swing progression and actual excavation using the same explicit `miningReady()` predicate.
- [x] Require completed posture change and completed smooth movement to the current tile center before swinging.
- [x] A selected 1-tile clearance cannot trigger a standing pickaxe swing while lowering; the character plays the lowering transition first.
- [x] Simulated 3,500 frames at 60 Hz: zero inappropriate standing swing frames, zero mining frames before posture readiness, first prone strike only after reaching pose 6, complete 8-strip dump/return, zero movement-lock violations.
- [ ] Verify actual iPhone animation boundary and headlamp positioning on screen.

## Prototype 024 — mining impact polish

- [x] Progressive dark rock fractures grow inside the next unbroken horizontal rock strip over the original four-second excavation interval.
- [x] Emit pickaxe contact particles on the downstroke (sprite frame 5 of 8) only while `miningReady()` holds; no premature strikes.
- [x] Separate small impact chips and amber glint from larger break-off debris when the four-second section completes.
- [x] Keep impact camera shake subtle, more pronounced only at final fracture; no new animation assets or video credits.
- [x] Simulated 3,500 frames at 60 Hz: impact and break events both occurred; eight sections excavated, bag dumped and miner resumed; zero posture-lock violations and maximum smooth travel step ~0.08333 cells.
- [ ] Confirm impact timing, rock-fracture visibility, chip scale, and camera feedback on iPhone. Tune to taste.

## Prototype 025 — heavy deliberate mining swing

- [x] Replace rapid 1.15-cycle/s mining with **one full swing every 2 seconds**, across standing, crouched and prone mining.
- [x] Curate frames within each existing sprite animation into **one** wind-up, downstroke, and recovery rather than multiple fast actions.
- [x] Trigger rock-contact chips once per swing, aligned with animation's impact pose.
- [x] Maintain the **4-second rock cutting interval**, delivering two meaningful pickaxe hits per completed section.
- [x] Simulation regression: 16 strikes across 8 strips, full bag/dump/return, no premature upright swings, no posture lock violations.
- [ ] Evaluate heavy-swing feeling in iPhone playtest; adjust pause on wind-up and recoil if needed.
- [ ] Consider coupling final collapse more tightly to the second impact; current rock section dislodges ~0.75 sec after last strike.

## Prototype 026 — 60 FPS mining animation interpolation

- [x] Preserve **2.0-second** deliberate pickaxe cycle and four-second rock strip break.
- [x] Use a non-linear swing timing curve: slow wind-up, accelerating downstroke, longer recovery.
- [x] Blend adjacent curated mining frames on every rendered frame rather than making hard visual pose jumps at 8 FPS.
- [x] Add Smooth swing ON/OFF toggle for on-device visual comparison.
- [x] Emit contact chips at 67.5% of the cycle; simulation confirms 16 impacts across 8 rock strips, full bag return/dump, and no posture lock violations.
- [ ] Visually inspect whether frame blending creates ghosted hands/pickaxe. This is an interim solution, not true skeletal tweening, optical flow, or 200 unique authored frames.
- [ ] If ghosting is visible, create a joint-anchored 2D rig or use optical-flow in-between frames from the video source instead of adding more crossfade.

## Prototype 027 — continuous joint motion for mining and posture transitions

- [x] Diagnosed flashing from crossfading full images of inconsistent arm/pickaxe poses rather than interpolating joint positions.
- [x] Implemented continuous procedural wrist, elbow and pickaxe positions at render FPS for standing, crouched and prone mining; preserves the heavy 2-second swing and 4-second excavation interval.
- [x] Reuses the existing seven key-pose articulated rig for smooth standing/crouching/prone transitions and eases over ~150 ms between video locomotion and the rig.
- [x] **Joint motion ON / Video frames ON** toggle to compare rigged movement with the old clip-based method without generating more videos.
- [x] Simulated both tunnel directions (enter and exit): transition locked at x=9, zero position-lock violations, max travel 0.0833 cells/frame.
- [x] Simulated full 8-strip bag/dump/resume cycle with smooth locomotion and no premature standing mining.
- [ ] Watch iPhone playback for visual character-style discrepancies between rig and sprite; this is an interim mechanical rig rather than fully traced skeleton art.
- [ ] Tune arm reach, rock-contact point, pickaxe length, and transition blending to maintain consistent proportions across styles.

## Prototype 028 — standing graphite-skin rig

- [x] Attached custom hand-drawn-style graphite skull, neck, six etched rib pairs and sternum, pelvis, tapered limbs, joints, angular hands and boots to the existing joint rig.
- [x] Applied the illustrated rig to **standing mining first** only; the video-derived walking cycle and crouched/prone art systems remain unchanged for comparison.
- [x] The pickaxe stays attached to the animated wrist, with a heavy 2-second wind-up/strike/recovery loop.
- [x] Retained the same figure through the brief fade into and out of standing mining rather than briefly showing the primitive rig.
- [x] Standing mining test: character rendered in standing mining for 1,100+ simulated frames, four excavations, no lock violations and smooth grid motion.
- [x] Regression: existing crawl route, 8-strip bag fill, return, dump and resume completed with zero transition-lock violations.
- [ ] iPhone visual QA: verify graphite texture, anatomy, hand-to-tool attachment, smooth skin blend and readability against dark rock.
- [ ] After approval, extend same illustrated rig to crouched/prone mining and posture transitions; avoid changing the working walking motion until needed.

## Prototype 029 — original graphite character restored on rig

- [x] Lock original source video-derived character design as visual source of truth; no newly invented skull, ribcage, pelvis, or boots.
- [x] New `assets/original-skeleton-rig.js` isolates head, torso/ribcage, pelvis, upper/lower arms, upper/lower legs and foot details from the **original stand-to-crouch frame 0 already decoded by DepthMotions**.
- [x] Attach source-art pieces to the existing game joints with continuous translation and rotation at the render FPS. The standing source art is reused across mining/pose changes; walking sprite remains untouched.
- [x] Keep the original 2-second heavy pickaxe cycle, four-second excavation, and automatic bag return/dump.
- [x] Preserve a comparison switch: Original rig ON vs Original video frames, with the original skeletal frames available.
- [x] Simulation regression: 8 rock strips, bag dump and resume, zero movement-lock violations, smooth travel.
- [ ] iPhone visual QA critical: source artwork fragments are cropped from one original pose and may overlap/separate at extreme crouch/prone angles; adjust joint masks and anchors from screenshots before claiming production-ready skinning.
- [ ] Replace source-frame raster segments with meticulously isolated PNG layers / rig assets if quality demands it. Never redesign the character without user approval.

## Prototype 030 — restore approved animation artwork

- [x] Set **original complete video-derived sprites as the default** for all poses and actions. Experimental sliced rig explicitly opt-in only.
- [x] Preserve Prototype 021's smooth grid movement, distance-driven 7-frame walking loop and seam blending; force the experimental rig opacity to zero during walking.
- [x] Restore mining sprites in their **original recorded frame order**, instead of scrambling poses or crossfading ghosted arms/pickaxe. Retain the two-second swing cadence and four-second rock break.
- [x] Keep the original standing/crouch/prone animation transitions and mining posture gating.
- [x] Regression: simulated 3,600 frames (~60 seconds) through 8 mined strips, full bag/dump/return, no pre-prone strikes, zero movement-lock violations; max visual step 0.08334 cells/frame.
- [ ] On-device QA: compare walking and source-character fidelity to Prototype 021/025. Original sequential mining may still look stepped at low frame count.
- [ ] Do not replace approved character with procedural reconstruction again. For production rig, obtain accurate original source layers with true bone weights / landmark tracking. This restoration is a corrective rollback, not a claim of final skeletal skinning.

## Prototype 031 — locomotion independent of automated mode

- [x] **Movement is always allowed through an already-open tile**, regardless of selected tunnel height or Explore/Excavate mode.
- [x] In Excavate mode, an actual unbroken rock face starts excavation; the current active face can continue widening from 1 to 2 or 3 tiles without abandoning the cut mid-progress.
- [x] Turning around clears the active-face override, allowing immediate retreat through narrow passages without switching to Explore.
- [x] Explore mode still stops at solid rock without mining; existing posture/movement locks remain active.
- [x] Simulated retreat in two-tile Excavate mode through six one-tile cells: moved from x=15 to shaft edge x=2, **zero extra excavation**, no violations.
- [x] Simulated forward passage in the same mode: traversed existing one-tile cells, then began mining only at the solid face.
- [x] Simulated new two-tile-height excavation from solid rock: completed **two strips in the same cell**, then advanced.
- [x] Full eight-strip bag/dump/return regression passed, zero position-lock violations; visual travel max 0.08334 cells per 60Hz frame.
- [ ] Consider separate explicit widening interaction for previously excavated cells, rather than restricting free movement in order to auto-widen existing openings.

## Prototype 032 — bidirectional widening pockets inside existing tunnels

- [x] Added explicit **Widen pocket** action: select 2-tile or 3-tile clearance, arm widening, hold LEFT or RIGHT toward an already-open lower tunnel section.
- [x] Both directions mine exactly the adjacent opening to the selected height; the miner remains in place after completion, and widening automatically disarms.
- [x] Walking through existing open passages remains completely independent of mode and selected target height while widening is not armed.
- [x] Existing solid-face excavation and the uninterrupted continuation of a partial cut still behave as before.
- [x] Simulation: widening a 1-tile-high passage to 2 tiles worked to the LEFT (x14 from x15) and RIGHT (x10 from x9), with no character movement during the widening action.
- [x] Simulation: 1-tile retreat in 2-tile Excavate mode from x15 toward shaft without extra excavation.
- [x] Simulation: standard forward excavation and full eight-strip bag-return/dump/resume preserved; no posture lock violations or abrupt frame-size jumps.
- [ ] iPhone QA: tap **Widen pocket: OFF** to arm; try widening left while prone, then test normal walking once the pocket is complete.
- [ ] Future: add an option to widen directly overhead while stationary, for a pocket at the exact cell the miner occupies.

## Prototype 033 — anywhere-on-screen touch-drag targeting

- [x] Game canvas supports one-finger hold-and-drag from **any starting point** on the playable area, with native touch scrolling disabled.
- [x] Horizontal drag moves freely left/right in either Explore or Excavate mode, retaining the smooth distance-based locomotion and old button fallback.
- [x] Excavate mode: **up-left / up-right** aims at the next solid overhead layer of the adjacent tunnel cell; **straight up** aims directly overhead. A light-beam arrow and highlighted individual tile show the selected target.
- [x] Hold the upward aim for the original four-second excavation; character stays in the same physical cell and mines only **one individual 28×72 rock layer** before requiring another drag.
- [x] Red target indicates an invalid target (above chosen cut height, at maximum ceiling height, or unsupported standing height).
- [x] Upward aimed excavation shares rock cracking, contact particles, bag capacity and impact timing with normal mining. Old Widen pocket button and LEFT/RIGHT fallback retained.
- [x] Simulated standing pocket at x12 with crawl tunnels at x11/x13: aiming up-left upgraded x11 from 1→2 without moving, up-right upgraded x13 from 1→2 without moving, direct overhead raised x12 from 1→2 while stationary.
- [x] Simulated canvas horizontal drag in Explore mode (no mining), horizontal drag into solid rock in Excavate mode, and full old-button 8-strip return/dump/resume—all passed with zero movement lock violations.
- [ ] iPhone playtest: beam visibility, gesture threshold, target alignment, palm ergonomics, and ability to release/re-aim reliably.
- [ ] This prototype targets **current or immediately adjacent column only**. Longer-distance world-coordinate targeting and vertical/diagonal miner traversal are future improvements.

## Decision log

- 2026-11-16: On tunnel-height changes, pause horizontal travel to finish raising/lowering posture; close-up animation inspection is a priority.
- 2026-11-16: Focus on **horizontal-only** excavation for now. No digging downward. Only left/right mobile hold controls; use Explore/Excavate mode buckets.
- 2026-11-16: Desired slow cuts **around 4 seconds or more per small section**, with visible intermediate strikes.
- 2026-11-16: Bag automatically collects spoil; when full miner returns to shaft ledge, dumps into the abyss, and resumes. Supports required for standing-height tunnels.
- 2026-11-16: Test **2D stick-figure articulated animations** before final sprite art. Low crawl uses **human bent knees, shins trailing backward**.
- Open: reconcile exact strip orientation and dimensions before major terrain code rewrite; measure actual fun rather than treating prototype balance as final.
