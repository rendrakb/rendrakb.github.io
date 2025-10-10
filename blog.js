let blogData = [];

fetch("/assets/blog/content.json")
  .then((response) => response.json())
  .then((data) => {
    blogData = data;
    renderTopics();
    renderArchive();
  });

function renderArchive(filteredTag = null) {
  const container = document.getElementById("blog-container");
  container.innerHTML = "";

  let filteredData = blogData;
  if (filteredTag) {
    filteredData = blogData.filter((blog) => blog.tags === filteredTag);
  }

  filteredData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((blog) => {
      const blogHTML = `
          <div class="blog-post" id="${blog.id}">
            <p>${blog.date}</p>
            <h2 class="blog-title" style="cursor:pointer;">${blog.title}</h2>
            <div class="blog-content" style="display:none;">
              <p>${blog.content}</p>
              <p>#${blog.tags}</p>
              <div id="copy-btn-container">
                <button class="copy-btn" onclick="copyLink('${blog.id}')">Copy link</button>
              </div>
            </div>
          </div>
          <hr class="divider">
        `;
      container.innerHTML += blogHTML;
    });

  addCollapseListeners();
}

function renderTopics(activeTag = null) {
  const tagContainer = document.getElementById("topic-tags");
  tagContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = activeTag === null ? "topic-btn-active" : "topic-btn";
  allBtn.id = "all-topics-btn";
  allBtn.onclick = () => {
    renderArchive();
    renderTopics();
  };
  tagContainer.appendChild(allBtn);

  const uniqueTags = [...new Set(blogData.map((blog) => blog.tags))];
  uniqueTags.forEach((tag) => {
    const tagBtn = document.createElement("button");
    tagBtn.textContent = `#${tag}`;
    tagBtn.className = tag === activeTag ? "topic-btn-active" : "topic-btn";
    tagBtn.onclick = () => {
      renderArchive(tag);
      renderTopics(tag);
    };
    tagContainer.appendChild(tagBtn);
  });
}

function addCollapseListeners() {
  document.querySelectorAll(".blog-title").forEach((title) => {
    title.addEventListener("click", () => {
      const content = title.nextElementSibling;
      content.style.display =
        content.style.display === "none" ? "block" : "none";
    });
  });
}

window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const content = target.querySelector(".blog-content");
      if (content) content.style.display = "block";
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
});

function copyLink(blogId) {
  const url = `${window.location.origin}${window.location.pathname}#${blogId}`;
  navigator.clipboard.writeText(url).then(() => {
    const alert = document.getElementById("copy-notification");
    alert.classList.add("show");

    setTimeout(() => {
      alert.classList.remove("show");
    }, 2000);
  });
}
