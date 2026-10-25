# Kushagra Sharan portfolio

This is a static site. Open `index.html` from a web server or publish the repository with GitHub Pages; no build step is required.

The motion layer uses [Lenis](https://github.com/darkroomengineering/lenis) for scrolling, [GSAP](https://github.com/greensock/gsap) for entrance and scroll animation, and [Vanta](https://github.com/tengbao/vanta) for the hero's data field. The project card pointer glow adapts the [React Bits Spotlight Card](https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/SpotlightCard) interaction to plain JavaScript so the site stays static. Library scripts are version pinned in `index.html` and loaded from CDNs.

The content remains readable if an animation script fails. WebGL is limited to desktop screens while the hero is visible; motion is disabled for reduced motion and data saver preferences.
