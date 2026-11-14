/* Carrousel des SAÉ : défilement continu, flèches, glisser à la souris / au doigt */
(function () {
  var car = document.getElementById("carousel");
  var track = document.getElementById("carTrack");
  if (!car || !track) return;

  var SPEED = 28;  // pixels par seconde (baisse pour ralentir)
  var GAP = 22;

  var originals = Array.prototype.slice.call(track.children);
  var n = originals.length;

  // Copies pour une boucle sans coupure
  originals.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    track.appendChild(clone);
  });

  function loopWidth() { return track.children[n].offsetLeft - track.children[0].offsetLeft; }
  function stepWidth() { return track.children[0].offsetWidth + GAP; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pos = 0, remain = 0, last = null;
  var dragging = false, dragStartX = 0, dragStartPos = 0, moved = false;

  function normalize() {
    var lw = loopWidth();
    if (lw > 0) pos = ((pos % lw) + lw) % lw;
  }

  function tick(t) {
    if (last === null) last = t;
    var dt = Math.min((t - last) / 1000, 0.1);
    last = t;

    if (!dragging) {
      if (!reduce) pos += SPEED * dt;
      if (Math.abs(remain) > 0.5) {
        var move = remain * (1 - Math.exp(-dt * 9));
        pos += move;
        remain -= move;
      } else {
        remain = 0;
      }
    }
    normalize();
    track.style.transform = "translate3d(" + (-pos) + "px,0,0)";
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  document.getElementById("carNext").addEventListener("click", function () { remain += stepWidth(); });
  document.getElementById("carPrev").addEventListener("click", function () { remain -= stepWidth(); });

  car.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; moved = false;
    dragStartX = e.clientX; dragStartPos = pos; remain = 0;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 5) { moved = true; car.classList.add("dragging"); }
    pos = dragStartPos - dx;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    car.classList.remove("dragging");
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // Évite d'ouvrir une SAÉ quand on vient de glisser
  car.addEventListener("click", function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
})();
