# Website results TODO

Release checklist for [the alternative website](index-alternative.html).
Updated October 28, 2026. See [result provenance](RESULTS_PROVENANCE.md) for the
completed source audit and evidence limits.

## Dataset gallery and generation throughput

- [x] **Spatial-relation dataset animations.** The
  [dataset gallery](index-alternative.html#dataset-relations) now contains actual
  generated robot-drawing recordings for left / right, above / below and
  inside / contains: six tasks per category, three episodes per task, 54 clips.
  Category and demonstration-set controls, playback, enlarged video, final-frame
  posters, source records and responsive layouts are included. The source-image
  gallery has been retired to the internal work archive.
- [x] **Separate learned-policy rollouts.** The two existing high-quality
  horizontal π0 clips now occupy their own
  [policy-results section](index-alternative.html#composition), with seen / held-out
  training-pair labels. Broader composition results and limitations remain expandable.
- [ ] **Generation throughput** — fill the measurement in
  [the pipeline section](index-alternative.html#generate). Report completed
  demonstrations per hour, completed/attempted counts, measured wall time, hardware,
  parallelism, image resolution, and representative task complexity. State whether
  timing includes sketch generation, simulation, and dataset export, and whether
  initialization is included. Keep the placeholder until measurements are available.
  **Blocked after a fresh attempt (Oct 22):** an isolated 8-demonstration pilot
  was planned (four apple SVGs, then four bicycle SVGs), using two LIBERO workers,
  320 × 240 images, an H200 on a shared host, and canonical + LIBERO export.
  After resolving an import-path preflight failure, the apple stage exited with
  a native worker abort (exit code −6 / SIGABRT) after 459.01 seconds; no complete
  batch was exported and the bicycle stage was not launched. No throughput is
  reported. Repair the simulator runtime before repeating the measurement.
  Historical generation logs are retained, but do not identify the hardware used
  for their original run; current Pod hardware is not a substitute.

## Strengthen the real-robot ending

- [x] **Open with a real hamburger rollout.** Use selected run `20261027-223541`
  as the first video. Its deployment checkpoint and training setup remain unconfirmed;
  do not attribute it to the 1.2-epoch mixed-data experiment or claim a base comparison.
- [x] **Add intermediate mixed-data transfer results.** The new
  [transfer section](index-alternative.html#real-transfer) includes ten task clips
  from the author-reported approximately 1.2-epoch checkpoint (two epochs planned).
  The audited training mixture contains 14,751 simulated demonstrations / 132 tasks
  and 100 real demonstrations / 10 tasks. Eight shown tasks have simulation data
  but no real task demonstrations. **Both bicycle and alarm clock have real data**;
  the alarm-clock label was corrected after checking the training task list.
  Four examples are featured; six additional tasks remain expandable.
- [ ] **Recover deployment metadata for the new recordings.** Exact checkpoint
  step, runtime prompt, configured seed, robot wall time and intervention logs are
  absent from the uploaded folders. The epoch and experiment association are
  author-reported; training counts and task coverage are independently audited.
  New clips are labeled 3× encoded recording time, not measured robot wall time.
- [x] **Show more existing results.** The [closing real-robot section](index-alternative.html#real)
  retains ten earlier policy rollouts: four objects, cup completion, a human edit,
  two bicycle stroke orders, and two camera viewpoints. Training configurations
  and playback speeds are included.
- [ ] **Add repeated-trial measurements, if available.** For the shown tasks,
  report the number of attempts and successes using a stated criterion.
  Include representative failures alongside selected successes. Report the cup,
  bicycle, and camera experiments separately because their training settings differ.
  **Audited:** 54 prior real-run configurations and 22 additional recording folders are indexed in
  [the recording inventory](assets/data/real-recording-inventory.json). They are
  not a complete attempt log and have no consistent success annotations; do not
  convert file counts into a success rate. The added files include one-frame and tool-drop recordings; their counts are not success-rate denominators. Camera-view clips also use different
  configured seeds (42 and 500).
- [ ] **Find or record a real-robot relation comparison.** Keep the object pair
  and policy fixed while changing the spatial instruction. Confirm training
  coverage before describing any combination as held out. Add this near the
  other real-robot comparisons once results exist.

Optional follow-up experiments; these are not current placeholder requirements:

- [ ] **Controlled learned-policy relation comparison.** If revisited, obtain
  left / above / below results for a fixed object pair, checkpoint and initial scene,
  and document policy sampling. This was replaced as a website requirement by the
  dataset gallery; it is not completed by showing generated data.

- [ ] **Real-robot circle repetitions.** Check whether contact failures,
  directional bias, or overdrawing seen in simulation also appear on hardware.
  Supply all trial counts and trajectories, not only a selected video.
- [ ] **Visual-feedback ablation.** Compare live canvas observations with
  frozen observations during completion or human-edit trials, using the same
  checkpoint and intervention protocol. This would test the role of feedback
  beyond the existing qualitative demonstrations.

## Material to supply with each new result

- [x] **Audit and document the dataset-gallery sources.** Record exact dataset
  instructions, dataset video paths, episode IDs, frame counts, crops, playback speeds
  and source/export hashes
  in [dataset-relations.json](assets/data/dataset-relations.json). Keep the previous
  unscored apple/book rollouts in the internal work archive, outside the website.
- [x] **Attach metadata to the ten earlier real-robot clips.** Add run IDs,
  checkpoints, configured seeds, training settings, prompt reconstruction details,
  intervention descriptions, measured playback speeds and last camera frames.
  Keep these qualitative results separate from any future repeated-trial measurements.
- [x] **Record sources and coverage for the eleven new web clips.** See
  [real-transfer-results.json](assets/data/real-transfer-results.json) for source hashes,
  training evidence, known limitations and export processing.

- [ ] Provide the full rollout and final canvas, exact instruction,
  checkpoint, training data, simulation/real-robot setting, episode ID/seed,
  playback speed, and any intervention. For aggregate claims, include all trial
  counts and the scoring rule.
- [ ] Create the website clip and poster with matching filenames; verify the
  caption against the source episode. Replace the relevant placeholder only
  after its result and caption are checked.

## Release links

- [ ] Add the arXiv link and update the citation after submission.
- [ ] Add the released generator repository and dataset links.
- [ ] Remove fulfilled placeholder and “forthcoming” labels.

The circle measurements, BURGER–LIBERO mode comparison, three scaling plots,
human-agreement table, and learned-diversity figure are already present.
