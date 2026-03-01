const ROUTES = {
  "/": { fragment: "pages/home.html", title: "RK", showProjectBar: false, init: null },
  "/index.html": { fragment: "pages/home.html", title: "RK", showProjectBar: false, init: null },
  "/about": { fragment: "pages/about.html", title: "RK, About", showProjectBar: false, init: null },
  "/blog": { fragment: "pages/blog.html", title: "RK, Blog", showProjectBar: false, init: "initBlog" },
  "/projects": { fragment: "pages/projects.html", title: "RK, Projects", showProjectBar: true, init: null },
  "/arch": { fragment: "pages/arch.html", title: "RK, Projects, Arch", showProjectBar: true, init: null },
  "/design": { fragment: "pages/design.html", title: "RK, Projects, Design", showProjectBar: true, init: null },
  "/misc": { fragment: "pages/misc.html", title: "RK, Projects, Misc", showProjectBar: true, init: null },
};

const PROJECT_PAGES = ["/projects", "/arch", "/design", "/misc"];

const HEADER_NAV = {
  "/": { left: "/about", right: "/projects" },
  "/index.html": { left: "/about", right: "/projects" },
  "/projects": { left: "/", right: "/blog" },
  "/blog": { left: "/projects", right: "/about" },
  "/about": { left: "/blog", right: "/" },
  "/arch": { left: "/misc", right: "/design" },
  "/design": { left: "/arch", right: "/misc" },
  "/misc": { left: "/design", right: "/arch" },
};

function getPath() {
  let path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "" || path === "/index.html") path = "/";
  return path;
}

function navigateTo(path, replace = false) {
  if (path === "/") path = "/";
  const state = { path };
  if (replace) {
    history.replaceState(state, "", path === "/" ? "/" : path);
  } else {
    history.pushState(state, "", path === "/" ? "/" : path);
  }
  loadPage(path);
}

function loadPage(path) {
  const route = ROUTES[path] || ROUTES["/"];
  const mainContent = document.getElementById("main-content");
  const projectBar = document.getElementById("project-bar");

  projectBar.style.display = route.showProjectBar ? "flex" : "none";
  document.title = route.title;

  fetch(route.fragment)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${route.fragment}`);
      return res.text();
    })
    .then((html) => {
      mainContent.innerHTML = html;
      highlightActiveLink(path);

      if (route.init && typeof window[route.init] === "function") {
        window[route.init]();
      }
    })
    .catch(() => {
      mainContent.innerHTML = "<p>Page not found</p>";
      highlightActiveLink(path);
    });
}

function highlightActiveLink(currentPath) {
  const links = document.querySelectorAll("a.link-url, a.link-url-active");
  links.forEach((link) => {
    try {
      const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
      const normalizedLink = linkPath === "" || linkPath === "/index.html" ? "/" : linkPath;
      const isActive =
        normalizedLink === currentPath ||
        (normalizedLink === "/" && (currentPath === "/" || currentPath === "/index.html")) ||
        (normalizedLink === "/projects" && PROJECT_PAGES.includes(currentPath));
      if (isActive) {
        link.classList.remove("link-url");
        link.classList.add("link-url-active");
      } else {
        link.classList.remove("link-url-active");
        link.classList.add("link-url");
      }
    } catch (_) {
      link.classList.remove("link-url-active");
      link.classList.add("link-url");
    }
  });
}

function navigateHeader(direction) {
  const path = getPath();
  const nav = HEADER_NAV[path] || HEADER_NAV["/"];
  navigateTo(nav[direction]);
}

function handleLinkClick(e) {
  const link = e.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.getAttribute("rel")?.includes("noopener")) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;
  const url = new URL(link.href, window.location.origin);
  if (url.origin !== window.location.origin) return;
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (ROUTES[path] || path === "/") {
    e.preventDefault();
    navigateTo(path);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", handleLinkClick);
  window.addEventListener("popstate", () => loadPage(getPath()));
  navigateTo(getPath(), true);
});
