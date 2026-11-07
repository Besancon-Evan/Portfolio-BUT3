(function () {
  var root = document.documentElement;
  var menuBtn = document.getElementById("menuBtn");

  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  menuBtn.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
  document.getElementById("overlay").addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  document.querySelectorAll(".menu a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  document.querySelectorAll('[data-action="theme"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save("theme", next);
    });
  });

  document.querySelectorAll('[data-action="view"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-view") === "pc" ? "phone" : "pc";
      root.setAttribute("data-view", next);
      save("view", next);
      setMenu(false);
    });
  });
})();
