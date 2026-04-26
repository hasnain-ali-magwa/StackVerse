// ========================================
// GLOBAL CACHE
// ========================================
const fieldCache = new Map();


// ========================================
// DOM READY
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    initializeFieldSelection();
    initializeToolSearch();
});


// ========================================
// FIELD SELECTION
// ========================================
function initializeFieldSelection() {
    const fieldSelect =
        document.getElementById("fieldSelect");

    if (!fieldSelect) return;

    fieldSelect.addEventListener(
        "change",
        async function () {
            const fieldId = this.value;

            if (!fieldId) {
                resetResults();
                return;
            }

            await loadFieldData(fieldId);
        }
    );
}


// ========================================
// LOAD FIELD DATA
// ========================================
async function loadFieldData(fieldId) {
    const resultsContainer =
        document.getElementById("resultsContainer");

    if (!resultsContainer) return;

    // Cache check
    if (fieldCache.has(fieldId)) {
        renderFieldData(
            fieldCache.get(fieldId)
        );
        scrollToResults();
        return;
    }

    showLoader();

    try {
        const response = await fetch(
            `/api/field/${fieldId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed API response"
            );
        }

        const data =
            await response.json();

        if (
            data.success &&
            data.data?.length
        ) {
            fieldCache.set(
                fieldId,
                data.data
            );

            renderFieldData(data.data);

            triggerAnimations();

            scrollToResults();

        } else {
            showEmptyState(
                "No tools found for this field."
            );
        }

    } catch (error) {
        console.error(
            "Field Error:",
            error
        );

        showError(
            "Failed to load tools."
        );
    }
}


// ========================================
// TOOL SEARCH INSIDE RESULTS
// ========================================
function initializeToolSearch() {
    const searchInput =
        document.getElementById(
            "fieldSearch"
        );

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {
            const query =
                this.value
                .toLowerCase()
                .trim();

            const toolCards =
                document.querySelectorAll(
                    ".tool-card"
                );

            toolCards.forEach(card => {
                const name =
                    card
                    .querySelector("h5")
                    ?.textContent
                    .toLowerCase() || "";

                const desc =
                    card
                    .querySelector(
                        ".tool-description"
                    )
                    ?.textContent
                    .toLowerCase() || "";

                const match =
                    name.includes(query) ||
                    desc.includes(query);

                card.style.display =
                    match ? "flex" : "none";
            });
        }
    );
}


// ========================================
// RENDER FIELD DATA
// ========================================
function renderFieldData(subfields) {
    const container =
        document.getElementById(
            "resultsContainer"
        );

    if (!container) return;

    if (!subfields.length) {
        showEmptyState(
            "No data available."
        );
        return;
    }

    let html = "";

    subfields.forEach(subfield => {
        html += `
            <div class="subfield-card">

                <div class="subfield-header">
                    <h3>${sanitize(subfield.name)}</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>

                <div class="subfield-content">
                    ${renderCategories(
                        subfield.categories || []
                    )}
                </div>

            </div>
        `;
    });

    container.innerHTML = html;

    initializeSubfieldAccordion();
    initializeCategoryAccordion();
}


// ========================================
// RENDER CATEGORIES
// ========================================
function renderCategories(categories) {
    if (!categories.length) {
        return `
            <p>No categories found</p>
        `;
    }

    let html = "";

    categories.forEach(category => {
        html += `
            <div class="category-card">

                <div class="category-header">
                    <h4>${sanitize(category.name)}</h4>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>

                <div class="category-content">
                    <div class="tools-grid">
                        ${renderTools(
                            category.tools || []
                        )}
                    </div>
                </div>

            </div>
        `;
    });

    return html;
}


// ========================================
// RENDER TOOLS
// ========================================
function renderTools(tools) {
    if (!tools.length) {
        return `
            <p>No tools available</p>
        `;
    }

    let html = "";

    tools.forEach(tool => {
        const name =
            sanitize(
                tool.name || "Unknown Tool"
            );

        const description =
            sanitize(
                tool.description ||
                "No description available"
            );

        const level =
            sanitize(
                tool.level ||
                "General"
            );

        const pricing =
            sanitize(
                tool.pricing ||
                "Not Specified"
            );

        const url =
            tool.url || "#";

        html += `
            <div class="tool-card">

                <div class="tool-top">

                    <div class="tool-icon">
                        <i class="${getToolIcon(name)}"></i>
                    </div>

                    <div class="tool-info">
                        <h5>${name}</h5>
                        <span>${level}</span>
                    </div>

                </div>

                <p class="tool-description">
                    ${description}
                </p>

                <div class="tool-tags">
                    <span class="tool-tag">
                        ${pricing}
                    </span>
                </div>

                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tool-btn"
                >
                    Visit Website
                </a>

            </div>
        `;
    });

    return html;
}


// ========================================
// ICON SYSTEM
// ========================================
function getToolIcon(name) {
    const icons = {
        "React": "fa-brands fa-react",
        "Python": "fa-brands fa-python",
        "Java": "fa-brands fa-java",
        "AWS": "fa-brands fa-aws",
        "Docker": "fa-brands fa-docker",
        "GitHub": "fa-brands fa-github",
        "Git": "fa-brands fa-git-alt",
        "Figma": "fa-brands fa-figma",
        "Android Studio": "fa-brands fa-android",
        "Swift": "fa-brands fa-apple",
        "Kali Linux": "fa-brands fa-linux",
        "Nmap": "fa-solid fa-network-wired",
        "Wireshark": "fa-solid fa-globe",
        "Metasploit": "fa-solid fa-bug",
        "Burp Suite": "fa-solid fa-shield-halved",
        "MySQL": "fa-solid fa-database",
        "MongoDB": "fa-solid fa-database",
        "PostgreSQL": "fa-solid fa-database"
    };

    return (
        icons[name] ||
        "fa-solid fa-toolbox"
    );
}


// ========================================
// LOADER
// ========================================
function showLoader() {
    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading Tools...</h3>
            <p>Please wait...</p>
        </div>
    `;
}


// ========================================
// EMPTY STATE
// ========================================
function showEmptyState(message) {
    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-box-open"></i>
            <h3>No Results</h3>
            <p>${message}</p>
        </div>
    `;
}


// ========================================
// ERROR
// ========================================
function showError(message) {
    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}


// ========================================
// RESET
// ========================================
function resetResults() {
    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-layer-group"></i>
            <h3>Select a field</h3>
            <p>
                Tools will appear here.
            </p>
        </div>
    `;
}


// ========================================
// SCROLL
// ========================================
function scrollToResults() {
    const section =
        document.querySelector(
            ".results-section"
        );

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ========================================
// SECURITY SANITIZER
// ========================================
function sanitize(text) {
    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// ANIMATION TRIGGER
// ========================================
function triggerAnimations() {
    if (
        typeof refreshAnimations ===
        "function"
    ) {
        refreshAnimations();
    }

    if (
        typeof staggerToolCards ===
        "function"
    ) {
        staggerToolCards();
    }
}