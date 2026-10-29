# BURGER

Project website for **BURGER: Benchmarking and Understanding Robotic Generalization via Embodied dRawing**.

Xiangyu Xu*, Bangshuai Peng*, Ziyi Liu*, Mengjie Zhao, Chenhao Lu, Zhengyang Fan, Huazhe Xu†, and Kaizhe Hu† — Tsinghua University.

*Equal contribution. †Corresponding authors.

## Local preview

No build step or package installation is required. From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>.

## Files

- `index.html`: project page, results, and demonstration galleries.
- `css/site.css`: responsive layout and scroll-focus styles.
- `js/site.js`: navigation, media controls, and scroll focus.
- `js/pipeline.js`: bundled stroke geometry and pipeline animation.
- `js/dataset-relations.js`: spatial-relation gallery controls.
- `assets/`: media used by the page and the downloadable dataset-demonstration source index.

## Publishing

The site can be served from this branch's root directory by GitHub Pages or another static host. `.nojekyll` disables Jekyll processing on GitHub Pages.

Paper, arXiv, dataset, code, and announcement links remain marked as coming soon. Replace their disabled buttons in `index.html` when the corresponding resources are public.
