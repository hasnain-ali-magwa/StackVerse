const form = document.getElementById("contactForm");

if (form) {

    const submitBtn = form.querySelector(".submit-btn");
    const status = document.getElementById("formStatus");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const originalBtnText = submitBtn.innerHTML;

        const data = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value.trim()
        };

        // Basic Validation
        if (
            !data.name ||
            !data.email ||
            !data.subject ||
            !data.message
        ) {
            showStatus(
                "Please fill all fields properly.",
                "error"
            );
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Sending...
            `;

            showStatus(
                "Sending your message...",
                "loading"
            );

            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showStatus(
                    "Message sent successfully 🚀",
                    "success"
                );

                form.reset();
            } else {
                showStatus(
                    "Failed to send message.",
                    "error"
                );
            }

        } catch (error) {
            console.error(error);

            showStatus(
                "Server error. Please try again later.",
                "error"
            );

        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}


/* ==============================
   STATUS FUNCTION
============================== */
function showStatus(message, type) {

    const status = document.getElementById("formStatus");

    status.innerText = message;

    status.className = "";

    if (type === "success") {
        status.style.color = "#00ffd0";
    }

    else if (type === "error") {
        status.style.color = "#ff4d6d";
    }

    else {
        status.style.color = "#facc15";
    }

    setTimeout(() => {
        status.innerText = "";
    }, 5000);
}