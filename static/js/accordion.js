function initializeSubfieldAccordion() {
    const subfieldHeaders =
        document.querySelectorAll(".subfield-header");

    subfieldHeaders.forEach(header => {
        header.addEventListener("click", function () {
            const content =
                this.nextElementSibling;

            const icon =
                this.querySelector("i");

            const isOpen =
                content.style.display === "block";

            document
                .querySelectorAll(".subfield-content")
                .forEach(item => {
                    item.style.display = "none";
                    item.classList.remove("active");
                });

            document
                .querySelectorAll(".subfield-header i")
                .forEach(item => {
                    item.style.transform = "rotate(0deg)";
                });

            if (!isOpen) {
                content.style.display = "block";
                content.classList.add("active");

                if (icon) {
                    icon.style.transform =
                        "rotate(180deg)";
                }
            }
        });
    });
}

function initializeCategoryAccordion() {
    const categoryHeaders =
        document.querySelectorAll(".category-header");

    categoryHeaders.forEach(header => {
        header.addEventListener("click", function () {
            const content =
                this.nextElementSibling;

            const icon =
                this.querySelector("i");

            const isOpen =
                content.style.display === "block";

            const parent =
                this.closest(".subfield-content");

            parent
                .querySelectorAll(".category-content")
                .forEach(item => {
                    item.style.display = "none";
                    item.classList.remove("active");
                });

            parent
                .querySelectorAll(".category-header i")
                .forEach(item => {
                    item.style.transform = "rotate(0deg)";
                });

            if (!isOpen) {
                content.style.display = "block";
                content.classList.add("active");

                if (icon) {
                    icon.style.transform =
                        "rotate(180deg)";
                }
            }
        });
    });
}