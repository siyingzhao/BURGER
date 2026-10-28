# Result provenance

Checked October 28, 2026. This accompanies `index-alternative.html`.

## Spatial relations: dataset animations

The October 23 revision replaces the source-image gallery with **54 actual
robot drawing recordings: 18 tasks × three episodes**, grouped into:

- **Left / right:** leaf/moon and leaf/snowman in both left-to-right orders,
  mug left of pizza, and purse left of star.
- **Above / below:** camera above baseball, umbrella above butterfly, guitar
  above owl, bicycle below book, bucket below cloud, ice cream below flower.
- **Inside / contains:** book inside backpack, cat inside tent, rabbit inside
  house, house containing bed, purse containing key, train containing suitcase.

Every clip comes from the LeRobot dataset's `observation.image` video, using
**episodes 0, 5 and 9 for each task**. These are generated demonstrations, not
learned-policy evaluations. No input sketch is animated or substituted for a
recorded robot execution. The selection is an illustrative subset rather than
exhaustive task coverage. Source task strings are preserved in the expanded
player and downloadable index; readable captions use “above,” “below” and “left of.”
Containment examples use the actual `inside` and `contains` tasks, not an
unrecorded `outside` instruction.

Horizontal sources are under `/root/lerobot_new_combination`, vertical sources
under `/root/lerobot_up_down`, and containment sources under
`/root/in_out_data/lerobot`. Exact dataset roots, instruction strings, episode IDs,
frame counts, durations and SHA-256 hashes are in
[`dataset-relations.json`](assets/data/dataset-relations.json).

The original camera videos are 320 × 240 at 20 fps. Each task uses one fixed
4:3 crop enclosing the final ink bounds of all three selected episodes, with
padding. The complete temporal sequence is sped up 6× and exported as 480 × 360
H.264 at 24 fps, followed by a 0.8-second final-frame hold. Upsampling does not
add source detail. Pixels are not mirrored or recolored, and no strokes or
motion are synthesized. Posters are final camera frames from the matching
recordings, used only before playback. The index records source and export
hashes, crop coordinates, file sizes and processing details.

The unified animation gallery now lives in the **dataset** section. The two
existing high-quality horizontal π0 rollouts have a separate **learned-policy
rollouts** section: leaf left of moon (seen pair) and apple left of blueberry
(held-out pair). Their original assets and training-coverage labels are retained.
The paper's broader composition results and limitations remain expandable below.
The dataset gallery does not establish policy generalization, success rates,
or a fixed-pair relation ablation.

The superseded 156 web images and their source metadata are retained in the
internal October 23 work archive. The earlier unscored apple/book policy clips
and canvases remain in the October 22 work archive, outside the website.

## New real-robot recordings: opening and mixed-data transfer

The opening video now uses real hamburger run `20261027-223541`. The author
requested the best-looking hamburger rollout and has not confirmed its training
setup. Although its archive folder is named `burger_from_libero100k_629`, the page
does not treat that name as a verified deployment configuration, attribute the
clip to the mixed-data experiment, or claim a comparison against base weights.

For the ten new general-object task clips, the author identified the experiment
as the latest mixture of a small real dataset with a larger simulated version
of the real drawing setup, evaluated at approximately **1.2 epochs**, before the
planned two-epoch endpoint. This links the recordings to the mixed-data run;
there is no per-recording resolved config independently establishing the exact
checkpoint step. The matching 1.2-epoch milestone is step 328629, but it is not
presented as a verified deployment step.

The audited run-local manifest and training config under
`/root/painter_mixed_recovery_20261025` establish:

- `pi05_painter_libero132_real10_v6`, experiment `libero132_real10_20261025_bs64`.
- **14,751 simulation episodes across 132 tasks**, after one corrupt baseball
  episode was excluded; **100 real episodes across 10 tasks**.
- Natural frame-proportional mixing without oversampling; two planned epochs.
- Real task labels include backpack, bicycle, birthday cake, butterfly, guitar,
  horse, police car, train, **alarm clock**, and elephant.

The eight shown tasks without matching real demonstrations are moon, banana,
star, tree, cup, apple, owl and cat. All eight occur in the simulation sources.
Bicycle and alarm clock are shown separately as reference tasks with real
training data. This is task transfer from simulation to hardware, not evidence
that the objects are absent from all training or foundation-model pretraining.
The tentative author recollection that only bicycle was seen in real training
was corrected using the actual task list.

Four examples are featured, with the remaining six task clips expandable.
Source run IDs, filename-derived tasks/seeds, hashes, training-list evidence,
and unverified fields are recorded in
[`real-transfer-results.json`](assets/data/real-transfer-results.json).
The source `_obs_input.mp4` files are 320 × 240 at an encoded 30 fps. Each web
clip retains the complete recorded sequence, uses a fixed crop [24,36,272,204],
rescales to 576 × 432, plays at 3× encoded-video speed, and adds a 1.2-second final
hold. Robot wall-time speed is unknown without timestamp logs. The crop removes
the step counter and brings the canvas closer; no strokes are altered. Posters
use the matching final frame, and uncropped final frames remain linked.

No valid success-rate denominator is inferred: new files include a one-frame
recording and tool-drop episodes, and there is no complete scored attempt log.
No new fixed-pair spatial relation, circle protocol, or documented frozen-input
ablation was found. The earlier real-robot experiments below retain their own
training settings and metadata.

## Earlier real-robot clips

All ten existing clips now have expandable run details and the last available
policy-camera frame. The source is the actual `_obs_input.mp4` camera stream;
large simulated-twin recordings in the same archive were not used as real footage.

| Experiment | Checkpoint | Training data |
| --- | --- | --- |
| Four objects, bicycle stroke order, human-added wheel | 7294 | 100 real demonstrations / 10 tasks |
| Cup completion | 23284 | 100 simulated demonstrations / 10 tasks + 30 real demonstrations / 3 tasks |
| Camera viewpoints | 5889 | 30 real demonstrations / 3 tasks |

The resolved configuration supplies each task label, checkpoint and configured seed.
Prompt strings are reconstructed using the retained deployment builder (`Draw ` +
task label); they are marked as reconstructed in the metadata. Intervention descriptions
come from the retained media audit and video inspection, not a complete event log.
Real-robot playback speeds use the timestamp span in the run's joint-position log
divided by web-clip duration. The final image is the last available camera frame,
not a separate unobstructed photograph of the finished canvas.

The camera comparison uses seeds **42 and 500**, so it does not isolate viewpoint
as the only changed variable. Cup, bicycle and camera measurements must remain separate.

[`real-results.json`](assets/data/real-results.json) records the ten clips and their
source hashes. [`real-recording-inventory.json`](assets/data/real-recording-inventory.json)
indexes the 54 prior run configurations plus 22 additional video folders (19
from October 27 and three from September 22). The additional folders contain
camera MP4s without resolved deployment configurations or joint logs.
This archive is **not an exhaustive attempt log**: resets, missing recordings,
interventions and early stops are not uniformly annotated. It cannot supply valid
success-rate denominators, and no success rate is inferred from the number of files.

No fixed-pair real-robot relation trial, circle repetition protocol, or frozen-camera
ablation was found in this archive. Data-collection videos and simulated twins do
not substitute for learned-policy evaluations on hardware.

## Generation throughput: measurement not yet available

An isolated small-batch timing attempt on October 22 planned four apple SVGs
followed by four bicycle SVGs, two LIBERO workers, a single NVIDIA H200 on a shared
host, 320 × 240 observations, and canonical plus LIBERO-format export. The generator
revision was `0dad422b752501d6cbe07b3de98b8998e7038dc5`.

An initial import-path problem was corrected using the existing LIBERO installation.
The timed apple stage then failed after **459.01 seconds** with a native worker
abort (exit code −6 / SIGABRT). No complete exported batch was produced; the bicycle
stage was not started. This is a failed measurement attempt, not a throughput result.
The page retains its measurement placeholder. Full command settings, hardware snapshot
and logs are retained outside the website in the internal work artifacts.

Older batch logs contain elapsed times and exported counts, but do not establish
the original run's hardware. They are not promoted into a hardware-qualified benchmark.

## Outstanding release material

No confirmed public paper, generator or dataset release URL was available in the
inspected materials. The existing forthcoming labels and citation remain unchanged.
Local generator release branches are not evidence of a public code release.
