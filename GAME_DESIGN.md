# The Depths — Living Game Design

**Status:** pre-alpha browser playtest. **Current build:** Prototype 023 (`index.html`). **Last design update:** 2026-11-16.

This is the concise, source-of-truth design for the *game we intend to make*. It is not a claim that all features already exist. When in doubt, preserve the current playable prototype and record open questions in BACKLOG.md.

## Vision and pillars

A tiny miner becomes trapped when the shaft above collapses. With a headlamp, pickaxe, and small duffle bag, he carves a way through a vast dark subterranean world. Starts by hand, eventually builds a mining operation with water processing, power, fabrication, and robots. Exploration and satisfying excavation are the core experience; story is optional environmental mystery.

1. **Mining is the fun.** Slow, tactile, audible, visible progress; every tunnel is earned.
2. **Darkness and light are gameplay.** Small independent headlamp beam, permanent but fuel-dependent local lighting, memorable blackouts. Unlit space should not be permanently revealed.
3. **Infrastructure is visible progress.** Excavation, spoil handling, transport and reinforcement change how the player uses existing tunnels.
4. **Discovery drives technology.** Natural discoveries (ore, water, caverns, artifacts) unlock meaningful new capabilities, not arbitrary XP.
5. **Automation expands agency.** Bots eventually handle repetition so the miner can explore more; never remove the joy of manual mining.
6. **No hunger/thirst/stamina chores.** Easy to control, rewarding to master.

## Current short-term scope — horizontal tunneling

- **Side-view**; close camera on small readable silhouette. The final look is dark, gritty, mostly monochrome with limited warm headlamp light.
- **For now, horizontal movement and horizontal excavation only.** No diagonal, down, or up shaft carving in the near-term prototype. Raising the roof of an existing horizontal tunnel is permitted.
- **One directional control vocabulary:** large **hold LEFT** and **hold RIGHT** buttons on mobile. No drag joystick while testing in ChatGPT; standalone mobile web page is the primary testing surface.
- **Explore mode:** tool put away; quickly traverse existing tunnels. Automatic standing/crouching/prone transitions according to clearance, small step-up/step-over behavior where physically supported.
- **Excavate mode:** tool equipped; holding left/right digs into blocked rock and advances when its desired clearance is opened. Target height is selected separately. Don't dig down through the floor.
- **Clearances:** one tile space = prone crawl; two tile spaces = crouching; three tile spaces = standing. Standing height equals 12 **vertical strip units** of clearance. In conversations we also explored laying thin rectangles **horizontally along the excavation direction**. Preserve a distinction between vertical clearance unit and horizontal cut segment: this geometry requires explicit reconciliation before changing collision or grid math.
- **Slow excavation:** target around **4 seconds or longer per small horizontal cut segment**, with repeated pickaxe strikes, cracks, rock chips, dust and sound during progress, not a single delayed disappearance. Mineral-specific impact feedback (coal dry crack, metal clang/sparks, crystal bright ring/sparkles). Posture-based speed penalties are an **idea to test**, not locked in; the immediately agreed test starts at 4 seconds per segment regardless of posture.
- **Tunnel planning:** narrow prospecting tunnels are cheap to create because less volume is excavated, despite awkward/slower posture. Crouch tunnels are working access. Full-height passages take more excavation/spoil and **require supports**. Support spacing/radius and cave-in rules will be balanced later. Do not allow unsupported standing expansion.
- **Spoil loop:** mined sections generate loose waste, automatically collected in the miner's duffle. Bag has finite capacity. When full, miner returns through the tunnel to the shaft ledge, dumps loose material into the abyss, and returns to the excavation face. Upgrades/haul systems will make this easier later. Early prototype uses simplified material accounting; full physics and manual rubble pickup are not implemented.
- **Gravity:** cannot walk on empty air. The user specifically rejected the earliest grid prototype's floating movement. As we later add inclines/shafts, preserve floor support and fall behavior. Current horizontal-only test has intentionally fixed ground.
- **Headlamp:** independent head orientation is planned; light follows gaze rather than body. Character reacts to cave-ins, impacts, ore, and dark openings.

## Character / animation rig

Use a **simple stick-figure/2D puppet first**, with final miner clothing/props later. Proportions must be testable at actual game scale; standing height three tile spaces. Segments: root/pelvis, torso, neck/head, shoulders, upper/lower arms, hands, thighs/shins/feet, helmet+lamp, pickaxe and duffle bag. Preserve independent head/lamp aim.

Core animation set: idle, walking, crouch transition/walk, **human military-style low crawl**, stand/crouch/prone mining, full-bag carrying, dumping bag. In crawl the shin angles **backward behind the knee**, feet trail; no reversed animal-like legs. Repeated pickaxe strikes in a ~4-second excavation are synchronized to terrain damage and particles. Smooth pose transitions; no instantaneous sprite swaps if we can avoid them. **Approved stand-to-prone sequence:** (1) walk upright; (2) bend slightly forward at the waist; (3) bend knees slightly; (4) lower knees to the ground; (5) lower torso while stretching hands toward the ground beneath the shoulders; (6) arrive on all fours, transferring weight to hands and knees; (7) lower chest and hips into prone with legs trailing backward, then elbow-crawl. Preserve grounded feet, knees, and hands during each phase; no reversed animal-like shins. Blend smoothly across seven key poses. Reverse the sequence for rising, with physically plausible hand/knee contact. **Movement locking:** When entering lower clearance, remain stationary while lowering before advancing; when exiting into taller clearance, enter the higher-clearance space in the low posture, stop and finish standing up, then travel onward. Never continue moving horizontally during posture animation. During the transition, freeze the *camera as well as the character's world X* to prevent apparent sliding. Initial full transition timing target: 1.5–2.0 seconds, tune in playtest. Test animation with a 2D joint rig before investing in sprite sheets or final art.

## Opening and long-term arc (not in Prototype 007)

Opening: cave-in above miner while suspended on line, no surface access or resupply. Activate helmet, make foothold, begin excavating. No food survival mechanics. Begin with rock pillars/stone construction and limited emergency tools/anchors; later ore smelting yields metal reinforcement. A permanent mine grows into an industrial system.

Progression targets:
1. **Primitive:** coal lamps, manual pickaxe, backpack/duffle, natural support, simple furnace/tools.
2. **Industrial:** ore smelting, improved tools, metal supports, carts, rail/hoist logistics.
3. **Water discovery:** underground stream/aquifer, trommel/wash plant for fines and old spoil, reuse aggregates, concrete; flowing water can drive wheels and hydro turbines when flow/head are sufficient.
4. **Electric:** copper/gold/quartz and other minerals, generators, batteries, wiring, welders, motors and fabrication.
5. **Robotics:** manufacture components and robots for hauling, mining, scouting, repair and construction.

Persistent underground world with organic rock silhouettes over hidden destructible logic; small lit infrastructure becomes a network. Cave-ins are consequence-driven with visible warnings (dust, cracks, creaking), not unfair surprises. Ancient civilization/environmental-story clues are discovered organically and optional. Final technical platform is likely Unity 2D URP; HTML canvas is a fast *mechanics* prototype, not the full game.

## Prototype status — what is actually implemented

`index.html` (Prototype 023) is a **standalone browser game** with left/right hold controls, Explore/Excavate, crawl/crouch/standing target selectors, rough supports, a 4-second excavation progress cycle, duffle capacity of **8 mined sections**, automatic return/dump/resume, camera zoom toggle and 2D joint miner with refined weight-transfer poses (feet → knees → palms → prone). Prototype 013 builds on the comparison with **eight normalized user-video-derived animation sets**: walk, stand-to-crouch, crouch-walk, crouch-to-prone, prone-crawl, and standing/crouch/prone mining. The first pass uses 12-frame warm-monochrome transparent silhouettes stored as compressed text assets and decoded in-browser; the earlier rig remains toggleable fallback. The animation controller locks body/camera position during transitions and adjusts posture before excavation. An independent Animation Studio previews clips. The full-detail original video pencil texture is **not yet reproduced**, and the implementation requires real-device visual testing. The animation state gate locks world X and the camera for the full transition, queues the step into lower clearance until the lowering animation completes, and pauses travel after entering higher clearance until standing completes. A debug readout shows state, position, and pose. Simulated movement tests passed; mobile visual playtesting is still needed. These are provisional balancing values. It has placeholder graphics and simplified terrain; a production-grade rig, detailed physics, ore materials, particle/audio fidelity, and long-term progression are **not built**. Review the actual code before asserting that a specific mechanic is complete.

### Prototype 014 implementation note

The browser prototype now includes nine video-derived animation states, including upright/crouch/prone locomotion, stand-to-crouch, stand-to-prone, crouch-to-prone, and three pickaxe motions. The original user-supplied green-screen recordings were extracted into 256×208-pixel aligned, compressed sprite frames with four alpha levels; these are **not** the full original PNG color/texture data, but improve on the coarse 013 bitmask silhouettes. In-game and Animation Studio playback use a shared decoder; the procedural rig remains a fallback and comparison tool. Movement/camera locks, supports, slow mining and spoil bag flow remain unchanged. iPhone visual verification is outstanding.

## Decision discipline

- **Locked for current testing:** horizontal-only, large left/right hold controls, mode-based automatic actions, clearance tiers, full-height support requirement, slow multi-impact cuts, spoil bag to ledge and return, simple low-crawl anatomy.
- **Experiments:** excavation speed differences by posture; segment geometry orientation and exact dimensions; support spacing; bag capacity/dumping trip time; animation blending/timing.
- **Deferred:** slope/shaft digging, water, machines, crafting economy, robots, lore scenes, production art, publishing storefronts.
- Record changes in BACKLOG.md. Preserve a playable version at each iteration.