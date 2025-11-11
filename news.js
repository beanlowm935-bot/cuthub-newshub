document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("news-list");

  try {
    const res = await fetch("http://localhost:3000/api/news");
    const newsItems = await res.json();

    if (!newsItems.length) {
      container.innerHTML = "<p>No news available at the moment.</p>";
      return;
    }

    newsItems.forEach((item, i) => {
      const card = document.createElement("div");
      card.classList.add("news-card");
      card.style.animationDelay = `${i * 0.2}s`;
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="news-content">
          <h3>${item.title}</h3>
          <p>${item.content}</p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load news. Please try again later.</p>";
  }
});
