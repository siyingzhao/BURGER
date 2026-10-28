# BURGER

Project page for **BURGER: Benchmarking and Understanding Robotic Generalization via Embodied dRawing**.

By Xiangyu Xu*, Bangshuai Peng*, Ziyi Liu*, Mengjie Zhao, Chenhao Lu, Zhengyang Fan, Huazhe Xu†, and Kaizhe Hu† — Tsinghua University.

*Equal contribution. †Corresponding authors.

The website includes interactive trajectory comparisons, simulation demonstrations, and real-robot rollouts.

For a local preview, run `python3 -m http.server 8000 --bind 127.0.0.1` from this directory and open `http://127.0.0.1:8000`.

The arXiv link will be added when the paper is available.

The comparison draft is [index-alternative.html](index-alternative.html).
See [WEBSITE_TODO.md](WEBSITE_TODO.md) for remaining release work and
[RESULTS_PROVENANCE.md](RESULTS_PROVENANCE.md) for source records and evidence limits.

The alternative page includes 54 recorded dataset drawing animations across
left / right, above / below and inside / contains (18 tasks × three episodes),
with category controls, demonstration switching and an enlarged player. The two
selected horizontal learned-policy rollouts appear in a separate results section.

The opening now features a real hamburger rollout. A separate mixed-data transfer
section shows ten tasks from an approximately 1.2-epoch checkpoint: eight tasks
without real demonstrations, plus bicycle and alarm clock with real training data.
Training coverage and recording evidence are in
[real-transfer-results.json](assets/data/real-transfer-results.json).
