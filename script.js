const DEFAULT_SETTINGS = {
  themePreset: "deep-blue",
  glowStrength: "medium",
  cardDensity: "comfy",
  imageFit: "cover",
  reducedMotion: false
};

function getSavedSettings() {
  const raw = localStorage.getItem("airz-site-settings");
  if (!raw) return { ...DEFAULT_SETTINGS };

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem("airz-site-settings", JSON.stringify(settings));
}

function clearSettingsClasses() {
  document.body.classList.remove(
    "theme-deep-blue",
    "theme-midnight-cyan",
    "theme-terminal-dark",
    "theme-light-frost",
    "glow-low",
    "glow-medium",
    "glow-high",
    "density-comfy",
    "density-compact",
    "image-cover",
    "image-contain",
    "reduced-motion"
  );
}

function applySettings(settings) {
  clearSettingsClasses();

  document.body.classList.add(`theme-${settings.themePreset}`);
  document.body.classList.add(`glow-${settings.glowStrength}`);
  document.body.classList.add(`density-${settings.cardDensity}`);
  document.body.classList.add(`image-${settings.imageFit}`);

  if (settings.reducedMotion) {
    document.body.classList.add("reduced-motion");
  }
}

function syncSettingsUI(settings) {
  const themePreset = document.getElementById("themePreset");
  const glowStrength = document.getElementById("glowStrength");
  const cardDensity = document.getElementById("cardDensity");
  const imageFit = document.getElementById("imageFit");
  const reducedMotion = document.getElementById("reducedMotion");

  if (themePreset) themePreset.value = settings.themePreset;
  if (glowStrength) glowStrength.value = settings.glowStrength;
  if (cardDensity) cardDensity.value = settings.cardDensity;
  if (imageFit) imageFit.value = settings.imageFit;
  if (reducedMotion) reducedMotion.checked = settings.reducedMotion;
}

function setupSettingsPanel() {
  const openBtn = document.getElementById("openSettings");
  const closeBtn = document.getElementById("closeSettings");
  const overlay = document.getElementById("settingsOverlay");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      document.body.classList.add("settings-open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.body.classList.remove("settings-open");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      document.body.classList.remove("settings-open");
    });
  }
}

function setupSettingsControls() {
  const settings = getSavedSettings();

  const themePreset = document.getElementById("themePreset");
  const glowStrength = document.getElementById("glowStrength");
  const cardDensity = document.getElementById("cardDensity");
  const imageFit = document.getElementById("imageFit");
  const reducedMotion = document.getElementById("reducedMotion");

  syncSettingsUI(settings);
  applySettings(settings);

  if (themePreset) {
    themePreset.addEventListener("change", () => {
      settings.themePreset = themePreset.value;
      saveSettings(settings);
      applySettings(settings);
    });
  }

  if (glowStrength) {
    glowStrength.addEventListener("change", () => {
      settings.glowStrength = glowStrength.value;
      saveSettings(settings);
      applySettings(settings);
    });
  }

  if (cardDensity) {
    cardDensity.addEventListener("change", () => {
      settings.cardDensity = cardDensity.value;
      saveSettings(settings);
      applySettings(settings);
    });
  }

  if (imageFit) {
    imageFit.addEventListener("change", () => {
      settings.imageFit = imageFit.value;
      saveSettings(settings);
      applySettings(settings);
    });
  }

  if (reducedMotion) {
    reducedMotion.addEventListener("change", () => {
      settings.reducedMotion = reducedMotion.checked;
      saveSettings(settings);
      applySettings(settings);
    });
  }
}

function getCategoryCount(category) {
  return PROJECTS.filter(project => project.category === category).length;
}

function updateStats() {
  const total = document.getElementById("stat-total");
  const roblox = document.getElementById("stat-roblox");
  const vrchat = document.getElementById("stat-vrchat");
  const unity = document.getElementById("stat-unity");

  if (total) total.textContent = PROJECTS.length;
  if (roblox) roblox.textContent = getCategoryCount("Roblox");
  if (vrchat) vrchat.textContent = getCategoryCount("VRChat");
  if (unity) unity.textContent = getCategoryCount("Unity");
}

function createCard(project) {
  const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join("");

  return `
    <a class="project-card product-card card-link" href="project.html?id=${project.id}">
      <div class="project-thumb-wrap">
        <img class="project-thumb" src="${project.image}" alt="${project.title}">
        <div class="project-thumb-overlay"></div>
      </div>

      <div class="project-content">
        <div class="project-topline">
          <div class="project-type">${project.type}</div>
          <div class="project-price">${project.price || "Free"}</div>
        </div>

        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    </a>
  `;
}

function renderProjects(filter = "All") {
  const grid = document.getElementById("projectsGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  const filtered = filter === "All"
    ? PROJECTS
    : PROJECTS.filter(project => project.category === filter);

  grid.innerHTML = filtered.map(createCard).join("");
  if (emptyState) {
    emptyState.style.display = filtered.length ? "none" : "block";
  }
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderProjects(button.dataset.filter);
    });
  });
}

function renderProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const project = PROJECTS.find(item => item.id === id);
  const mount = document.getElementById("projectDetail");
  if (!mount) return;

  if (!project) {
    mount.innerHTML = `
      <div class="project-detail-card detail-panel">
        <h2>Project not found</h2>
        <p class="detail-description">This project entry does not exist yet.</p>
        <a class="back-link" href="index.html">← Back to archive</a>
      </div>
    `;
    return;
  }

  const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
  const gallery = (project.gallery && project.gallery.length ? project.gallery : [project.image])
    .map((img, index) => `
      <button class="gallery-thumb ${index === 0 ? "active" : ""}" type="button" data-image="${img}">
        <img src="${img}" alt="${project.title} preview ${index + 1}">
      </button>
    `).join("");

  const downloads = (project.downloads && project.downloads.length)
    ? project.downloads.map(item => `
        <a class="btn primary full-btn" href="${item.url}" target="_blank">${item.label}</a>
      `).join("")
    : `<a class="btn primary full-btn" href="${project.download}" target="_blank">Download</a>`;

  mount.innerHTML = `
    <div class="project-showcase">
      <div class="project-main-column">
        <div class="project-detail-card media-card">
          <img id="mainPreviewImage" class="detail-hero-image" src="${project.image}" alt="${project.title}">
        </div>

        <div class="gallery-row">
          ${gallery}
        </div>

        ${project.video ? `
          <div class="project-detail-card detail-panel">
            <h3 class="subsection-title">Video Preview</h3>
            <div class="video-wrap">
              <video controls>
                <source src="${project.video}">
              </video>
            </div>
          </div>
        ` : ""}

        <div class="project-detail-card detail-panel">
          <div class="tab-bar">
            <button class="tab-btn active" type="button">Description</button>
            <button class="tab-btn" type="button">Contents</button>
            <button class="tab-btn" type="button">Downloads</button>
          </div>

          <h2 class="subsection-title">Project Description</h2>
          <p class="detail-description">${project.fullDescription}</p>
          <div class="tags">${tagsHtml}</div>
        </div>
      </div>

      <aside class="project-side-column">
        <div class="project-detail-card detail-panel sticky-panel">
          <div class="project-type">${project.type}</div>
          <h1 class="detail-title">${project.title}</h1>
          <p class="detail-meta">${project.description}</p>
          <div class="project-side-price">${project.price || "Free"}</div>
          <div class="detail-actions stacked-actions">
            ${downloads}
            <a class="btn secondary full-btn" href="${project.source}" target="_blank">View Source</a>
          </div>
          <a class="back-link" href="index.html">← Back to archive</a>
        </div>
      </aside>
    </div>
  `;

  const thumbButtons = mount.querySelectorAll(".gallery-thumb");
  const mainImage = document.getElementById("mainPreviewImage");

  thumbButtons.forEach(button => {
    button.addEventListener("click", () => {
      thumbButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      mainImage.src = button.dataset.image;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSettingsPanel();
  setupSettingsControls();
  updateStats();
  setupFilters();
  renderProjects();
  renderProjectPage();
});
