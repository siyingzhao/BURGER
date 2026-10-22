# Website results TODO

Release checklist for [the alternative website](index-alternative.html).
Updated October 22, 2026.

## Fill the two result placeholders

- [ ] **Same objects, different relations** — replace the three panels in
  [the composition section](index-alternative.html#pending-title) with learned-policy
  rollouts for “A left of B,” “A above B,” and “A below B.” Use one object pair,
  one checkpoint, and the same initial scene; change only the relation. Start by
  finding the existing results discussed with the authors. Include exact prompts,
  episode IDs/seeds, playback speeds, and whether each pair/relation appeared in training.
- [ ] **Generation throughput** — fill the measurement in
  [the pipeline section](index-alternative.html#generate). Report completed
  demonstrations per hour, completed/attempted counts, measured wall time, hardware,
  parallelism, image resolution, and representative task complexity. State whether
  timing includes sketch generation, simulation, and dataset export, and whether
  initialization is included. Keep the placeholder until measurements are available.

## Strengthen the real-robot ending

- [ ] **Add more real-world results at the end.** Keep this as a todo for now.
  Select author-confirmed footage showing more objects, sketch completion,
  different stroke orders, and camera-view changes. Verify each clip and its
  training configuration before adding it to the
  [closing real-robot section](index-alternative.html#real). The current page
  retains the previously shown bicycle/human-edit example.
- [ ] **Add repeated-trial measurements, if available.** For the shown tasks,
  report the number of attempts and successes using a stated criterion.
  Include representative failures alongside selected successes. Report the cup,
  bicycle, and camera experiments separately because their training settings differ.
- [ ] **Find or record a real-robot relation comparison.** Keep the object pair
  and policy fixed while changing the spatial instruction. Confirm training
  coverage before describing any combination as held out. Add this near the
  other real-robot comparisons once results exist.

Optional follow-up experiments; these are not current placeholder requirements:

- [ ] **Real-robot circle repetitions.** Check whether contact failures,
  directional bias, or overdrawing seen in simulation also appear on hardware.
  Supply all trial counts and trajectories, not only a selected video.
- [ ] **Visual-feedback ablation.** Compare live canvas observations with
  frozen observations during completion or human-edit trials, using the same
  checkpoint and intervention protocol. This would test the role of feedback
  beyond the existing qualitative demonstrations.

## Material to supply with each new result

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
