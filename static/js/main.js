document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initializeFieldDropdown();
});

function initializeMobileMenu() {
    const menuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const closeBtn =
        document.getElementById("mobileMenuClose");

    const overlay =
        document.getElementById(
            "mobileMenuOverlay"
        );

    if (
        !menuBtn ||
        !mobileMenu ||
        !closeBtn ||
        !overlay
    ) return;


    function openMobileMenu() {
        mobileMenu.classList.add("active");
        overlay.classList.add("active");

        document.body.style.overflow =
            "hidden";
    }


    function closeMobileMenu() {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");

        document.body.style.overflow =
            "";
    }

    menuBtn.addEventListener(
        "click",
        (e) => {
            e.stopPropagation();
            openMobileMenu();
        }
    );

    closeBtn.addEventListener(
        "click",
        closeMobileMenu
    );

    overlay.addEventListener(
        "click",
        closeMobileMenu
    );

    document.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Escape") {
                closeMobileMenu();
            }
        }
    );

    mobileMenu
        .querySelectorAll("a")
        .forEach((link) => {
            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });
}

function initializeFieldDropdown() {
    const searchInput =
        document.getElementById("fieldSearch");

    const dropdownSelected =
        document.getElementById(
            "dropdownSelected"
        );

    const dropdownOptions =
        document.getElementById(
            "dropdownOptions"
        );

    const hiddenInput =
        document.getElementById(
            "fieldSelect"
        );

    if (
        !searchInput ||
        !dropdownSelected ||
        !dropdownOptions ||
        !hiddenInput
    ) {
        return;
    }

    dropdownSelected.addEventListener(
        "click",
        (e) => {
            e.stopPropagation();

            dropdownOptions.classList.toggle(
                "active"
            );

            dropdownSelected.classList.toggle(
                "active"
            );
        }
    );

    dropdownOptions.addEventListener(
        "click",
        (e) => {
            const option =
                e.target.closest(
                    ".dropdown-option"
                );

            if (!option) return;

            dropdownSelected.innerHTML = `
                <span>${option.textContent}</span>
                <i class="fa-solid fa-chevron-down"></i>
            `;

            hiddenInput.value =
                option.dataset.value;

            dropdownOptions.classList.remove(
                "active"
            );

            dropdownSelected.classList.remove(
                "active"
            );

            searchInput.value = "";

            resetDropdownOptions();

            hiddenInput.dispatchEvent(
                new Event("change")
            );
        }
    );

    searchInput.addEventListener(
        "input",
        () => {
            const value =
                searchInput.value
                .toLowerCase()
                .trim();

            const options =
                document.querySelectorAll(
                    ".dropdown-option"
                );

            let visibleCount = 0;

            options.forEach((option) => {
                const text =
                    option.textContent
                    .toLowerCase();

                const match =
                    text.includes(value);

                option.style.display =
                    match ? "block" : "none";

                if (match) visibleCount++;
            });


            dropdownOptions.classList.add(
                "active"
            );

            dropdownSelected.classList.add(
                "active"
            );

            handleNoResults(
                visibleCount
            );
        }
    );

    document.addEventListener(
        "click",
        (e) => {
            if (
                !dropdownSelected.contains(
                    e.target
                ) &&
                !dropdownOptions.contains(
                    e.target
                ) &&
                !searchInput.contains(
                    e.target
                )
            ) {
                closeDropdown();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Escape") {
                closeDropdown();
            }
        }
    );


    function closeDropdown() {
        dropdownOptions.classList.remove(
            "active"
        );

        dropdownSelected.classList.remove(
            "active"
        );
    }
}

function resetDropdownOptions() {
    const options =
        document.querySelectorAll(
            ".dropdown-option"
        );

    options.forEach((option) => {
        option.style.display = "block";
    });

    removeNoResultMessage();
}

function handleNoResults(count) {
    removeNoResultMessage();

    if (count > 0) return;

    const dropdownOptions =
        document.getElementById(
            "dropdownOptions"
        );

    const noResult =
        document.createElement("div");

    noResult.className =
        "dropdown-no-result";

    noResult.innerHTML =
        "No matching field found";

    noResult.style.padding =
        "16px";

    noResult.style.color =
        "#94a3b8";

    noResult.style.textAlign =
        "center";

    dropdownOptions.appendChild(
        noResult
    );
}

function removeNoResultMessage() {
    const existing =
        document.querySelector(
            ".dropdown-no-result"
        );

    if (existing) {
        existing.remove();
    }
}