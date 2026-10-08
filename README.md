# PreAct-Nav project page

Project website for **PreAct-Nav: Agentic Reasoning Before Action for Urban Navigation**.

- Website: https://jjingxie.github.io/preact-nav-website/
- Paper: https://arxiv.org/abs/2610.04916
- Authors: Jing Xie, Shouwei Ruan, Yubin Wang, Yuxiang Zhang, Junwei Yang, Songchang Jin, and Dianxi Shi.

This repository contains the project website and paper figures. The research code link will be added when the implementation is released.

## Update the website

Edit `index.html` for page content and the citation, `config.js` for publication links, and `styles.css` for styling. Benchmark data is in `results-data.js`; keep the initial HTML results consistent when updating values. `script.js` handles result selection, navigation examples, and citation copying.

The website is static and has no build dependencies. GitHub Pages deploys the root folder of the `main` branch. `.nojekyll` keeps the supplied HTML, CSS, JavaScript, and media unchanged.
