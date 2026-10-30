# BURGER

Project website for **BURGER: Benchmarking and Understanding Robotic Generalization via Embodied dRawing**.

Xiangyu Xu<sup>1,*</sup>, Bangshuai Peng<sup>1,*</sup>, Ziyi Liu<sup>1,*</sup>, Mengjie Zhao<sup>1</sup>, Chenhao Lu<sup>1,2</sup>, Zhengyang Fan<sup>1</sup>, Huazhe Xu<sup>1,2,†</sup>, and Kaizhe Hu<sup>1,2,†</sup>.

<sup>1</sup> Tsinghua University · <sup>2</sup> Shanghai Qizhi Institute.

*Equal contribution. †Corresponding authors.

## Local preview

No build step or package installation is required. From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>.

## Files

- `index.html`: project page, results, and demonstration galleries.
- `assets/paper/BURGER.pdf`: compiled paper, available through the Paper button.
- `css/site.css`: responsive layout and scroll-focus styles.
- `js/site.js`: navigation, media controls, and scroll focus.
- `js/pipeline.js`: bundled stroke geometry and pipeline animation.
- `js/dataset-relations.js`: spatial-relation gallery controls.
- `assets/`: media used by the page and the downloadable dataset-demonstration source index.

## Publishing

The site can be served from this branch's root directory by GitHub Pages or another static host. `.nojekyll` disables Jekyll processing on GitHub Pages.

The Paper button opens `assets/paper/BURGER.pdf`. Replace this file when the manuscript is updated.

The arXiv button links to https://arxiv.org/abs/2610.40532, and the Data button links to https://huggingface.co/datasets/Zhaosying66/BURGER. The code and announcement links remain marked as coming soon; replace their disabled buttons in `index.html` when those resources are public.
