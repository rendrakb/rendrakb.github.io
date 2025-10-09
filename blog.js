  fetch('/assets/blog/content.json')
    .then(response => response.json())
    .then(blogData => {
      const container = document.getElementById('blog-container');
      blogData.forEach(blog => {
        const blogHTML = `
          <div class="blog-post" id="${blog.id}">
            <h3>${blog.title}</h3>
            <p>${blog.date}</p>
            <p>${blog.content}</p>
            <p>#${blog.tags}</p>
          </div>
          <hr class="divider">
        `;
        container.innerHTML += blogHTML;
      });
    });