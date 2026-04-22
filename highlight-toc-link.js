document.addEventListener("DOMContentLoaded", function () {
  const headings = Array.from(
    document.querySelectorAll('h2[id]:not(#table-of-contents):not(#table-of-contents-1):not(#interlude)')
  );

  const tocLinks = Array.from(
    document.querySelectorAll('.section-toc-icon a[href^="#"]')
  );

  if (!headings.length || !tocLinks.length) return;

  const linkMap = new Map();
  tocLinks.forEach(link => {
    const id = link.getAttribute("href").slice(1);
    linkMap.set(id, link);
  });

  function clearActive() {
    tocLinks.forEach(link => {
      link.classList.remove("active");
      const row = link.closest("tr");
      if (row) row.classList.remove("active");
    });
  }

  function setActive(id) {
    clearActive();
    const link = linkMap.get(id);
    if (!link) return;

    link.classList.add("active");
    const row = link.closest("tr");
    if (row) row.classList.add("active");
  }

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      root: null,
      rootMargin: "0px 0px -70% 0px",
      threshold: 0
    }
  );

  headings.forEach(heading => observer.observe(heading));
});