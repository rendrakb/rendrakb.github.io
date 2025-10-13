document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadNavBar();
  loadFooter();
  const currentPage = window.location.pathname;
  const projectPages = [
    "/projects.html",
    "/arch.html",
    "/design.html",
    "/misc.html",
  ];

  if (projectPages.includes(currentPage)) {
    loadProjectBar();
  }
});

function loadHeader() {
  loadTemplate("assets/templates/header.html", "header-bar");
}

function loadNavBar() {
  loadTemplate("assets/templates/nav-bar.html", "nav-bar", highlightActiveLink);
}

function loadProjectBar() {
  loadTemplate(
    "assets/templates/project-bar.html",
    "project-bar",
    highlightActiveLink
  );
}

function loadFooter() {
  loadTemplate("assets/templates/footer.html", "footer-bar");
}

function loadTemplate(url, targetId, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }
      return response.text();
    })
    .then((html) => {
      const target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
        if (typeof callback === "function") {
          callback();
        }
      } else {
        console.warn(`Element with ID "${targetId}" not found.`);
      }
    })
    .catch((error) => {
      console.error(`Error loading ${url}:`, error);
    });
}

function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".link-url");

  const projectPages = [
    "/projects.html",
    "/arch.html",
    "/design.html",
    "/misc.html",
  ];

  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (
      linkPath === currentPath ||
      (linkPath === "/" && currentPath === "/index.html")
    ) {
      link.classList.remove("link-url");
      link.classList.add("link-url-active");
    } else if (
      linkPath === "/projects.html" &&
      projectPages.includes(currentPath)
    ) {
      link.classList.remove("link-url");
      link.classList.add("link-url-active");
    }
  });
}
