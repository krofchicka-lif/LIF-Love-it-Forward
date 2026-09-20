/* Shared chrome + type helpers for the LIF pages. Loaded in <helmet>.
   Only what cannot be inline: faces, keyframes, resets. */
(function () {
  if (document.getElementById('lif-base')) return;
  var s = document.createElement('style');
  s.id = 'lif-base';
  s.textContent = [
    "@font-face{font-family:'Apercu';src:url('assets/fonts/Apercu-Regular.otf') format('opentype');font-weight:400;font-display:swap}",
    "@font-face{font-family:'Apercu';src:url('assets/fonts/Apercu-Bold.otf') format('opentype');font-weight:700;font-display:swap}",
    "@font-face{font-family:'Romana BT';src:url('assets/fonts/RomanaBT-Roman.ttf') format('truetype');font-weight:400;font-display:swap}",
    "html,body{margin:0;padding:0;background:#FDFCF8;-webkit-font-smoothing:antialiased}",
    "*{box-sizing:border-box}",
    "body{overflow-x:hidden}",
    "p,h1,h2,h3{margin:0}",
    "h1,h2{text-wrap:balance}",
    "a{color:inherit;text-decoration:none}",
    "a:hover{color:#CA0000}",
    "img{max-width:100%}",
    "[data-wrap]{max-width:1240px;margin-left:auto;margin-right:auto;width:100%}",
    "#root{width:100%;max-width:none;margin:0;padding:0}",
    // Revealed state wins over the authored inline opacity:0, which React
    // re-asserts on every re-render.
    "[data-r][data-r-done],[data-seq-done] [data-step]{opacity:1!important;transform:none!important;filter:none!important}",
    "@keyframes lifA{0%,100%{transform:translate3d(0,0,0) rotate(var(--rot,-6deg))}50%{transform:translate3d(5px,-13px,0) rotate(calc(var(--rot,-6deg) + 3deg))}}",
    "@keyframes lifB{0%,100%{transform:translate3d(0,0,0) rotate(var(--rot,4deg))}50%{transform:translate3d(-7px,-10px,0) rotate(calc(var(--rot,4deg) - 3deg))}}",
    // Narrow screens: the 12-column editorial grids stack in source order.
    // Inline styles can't hold a media query, so the desktop composition stays
    // inline and this is the one place that overrides it.
    "@media (max-width:900px){",
    "[data-g12]{grid-template-columns:minmax(0,1fr)!important;grid-auto-flow:row!important}",
    "[data-g12]>*{grid-column:1/-1!important;grid-row:auto!important;justify-self:stretch!important;text-align:left!important;margin-left:0!important;margin-right:0!important;max-width:100%!important}",
    "[data-g12]>* p{margin-left:0!important;margin-right:0!important}",
    "[data-g12] [style*='justify-self:end']{justify-self:stretch!important}",
    // Sections whose desktop composition puts the photograph first: on a phone
    // the heading and copy read first, the image follows.
    "[data-g12][data-copy-first]{display:flex!important;flex-direction:column!important}",
    "[data-g12][data-copy-first]>[data-media]{order:2}",
    "}"
  ].join('\n');
  document.head.appendChild(s);
})();
