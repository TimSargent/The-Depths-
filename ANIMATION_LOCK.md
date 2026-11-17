# The Depths — Core Animation Lock List
**Status:** DRAFT / NOT LOCKED · 2026-11-17 · Original graphite skeleton art is authoritative.
**Purpose:** Make the miner beautiful and physically convincing before adding atmospheric lighting, environmental audio, caverns, or major new systems. This document defines acceptance criteria, not claimed completion.

## Universal acceptance gates (every animation)
- [ ] **Anatomy:** same skull, limbs, torso, proportions, linework and scale as the approved source art. No reconstructed rig as default, squashing, floating joints or size pulsing.
- [ ] **Ground contact:** feet, knees, palms or elbows hold believable contact with the rocky floor. No sliding while supposedly planted; no camera or world-position jumps during a pose transition.
- [ ] **Frame continuity:** loops have no visible pops, double images, strobing or abrupt pose resets. Switching between clips begins and ends from compatible poses.
- [ ] **Timing/weight:** deliberate acceleration, contact and recovery. Every physical action has an anticipation, motion and settle phase when appropriate.
- [ ] **Interaction alignment:** hands, tools and body match the collision geometry and target coordinates in both left and right directions.
- [ ] **Mobile proof:** inspect slow and normal speed recordings on iPhone with ORIGINAL artwork loaded. Playtest uninterrupted excavation and travel, not only scrubbed clips.
- [ ] **Regression:** no new lock violations; fixed four-second rock section, one heavy pickaxe swing every two seconds, eight-strip bag and automatic dump/resume work as before.

## Lock sequence

### 1 — Walk (upright)
- [ ] Seamless multi-cycle loop, no knee/frame pop, foot skating, or size changes
- [ ] Travel speed matches footsteps during start/stop, reversals and automatic travel
- [ ] Smooth transition to standing idle and standing mining
- [ ] Test both facing directions and original full-detail source

### 2 — Posture changes (standing ↔ crouch ↔ prone)
- [ ] Lower and rise continuously; realistic body weight on feet → knees → elbows/palms
- [ ] No teleporting, camera scroll or world movement during transition
- [ ] Enter low ceiling **after** lowering; rise **after** reaching sufficient space
- [ ] Works in both directions and when rapidly alternating narrow / tall passages

### 3 — Locomotion (crouch-walk and prone crawl)
- [ ] Each has a seamless cycle, believable planted contact and stable skeleton proportions
- [ ] Prone silhouette fits a single-tile-high tunnel and does not penetrate the roof / next rock face
- [ ] Normal movement and return travel maintain the same posture until clearance changes

### 4 — Mining (stand, crouch, prone)
- [ ] Clear weighty two-second wind-up → strike → recover, independent of the four-second rock-break interval
- [ ] Accurate selected rock **face and layer**: horizontal, low, diagonally up, overhead and left/right
- [ ] Tool head meets impact point at strike frame; debris and fracture effects align with that point
- [ ] **Bug:** prone skeleton/tool currently overshoots the aimed point; correct sprite alignment, facing and contact anchor without spoofing body movement
- [ ] Returns to matching idle/walk/crawl pose without popping

### 5 — Mining reposition (“scoot”)
- [x] **Functional behavior approved:** the small forward reposition after excavation makes play smoother
- [ ] Visual refinement: brace → pull → settle visibly distinct; original approved miner throughout
- [ ] Scoot never occurs during stationary ceiling/pocket widening, and never interrupts an incomplete swing
- [ ] ON/OFF distinction must be legible at actual play speed (037P comparison was too subtle)
- [ ] Prefer existing approved source frames first; dedicated clip only if original frames cannot achieve a natural handoff

### 6 — Waste bag actions
- [ ] Bag visibly rides / drags **behind** the prone miner while hauling, with natural tension and inertia
- [ ] Shaft-dump animation: lift, tip bag over edge, audible / visible pour, then recover
- [ ] Bag quantity changes at the depicted pour, not before it; auto return and resume remain intact

## Test / approval protocol
1. For each sequence: compare original source clip, current in-game playback, and any candidate improvement. Never replace approved miner art with a different skeleton.
2. Capture ~10 seconds **normal speed** and ~10 seconds **slow playback** for each relevant posture, facing both directions when applicable.
3. Mark each criterion **PASS / FAIL / NEEDS SOURCE CLIP** with a short observation; a simulation pass alone does not equal visual approval.
4. Run gameplay regressions and confirm effects remain aligned.
5. Only mark the **whole animation system LOCKED** after the player approves the look and feel of these six sections.

## Current checkpoint
- Prototype **037P** is playable and mechanically validated; **no global visual lock**.
- Open high-priority bug: prone sprite extends beyond aimed rock location.
- 037P scoot ON/OFF: player observed very little visual distinction; functional scoot stays.
- Next work: **upright walking loop** first, then posture transitions, then prone geometry and targeted mining contact. Keep animation work within 037 until approved.
- Once the miner is locked: planned feature order **038 excavation freedom → 036 precision targeting**. Atmospheric helmet lighting and soundscape remain an exciting later milestone.
