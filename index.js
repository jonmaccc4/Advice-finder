document.addEventListener("DOMContentLoaded", () => {
    const adviceInput = document.getElementById("advice");
    const getAdviceBtn = document.getElementById("get-advice");
    const adviceDisplay = document.querySelector(".adviceDisplay");
    const descDisplay = document.querySelector(".descDisplay");
    const errorDisplay = document.querySelector(".errorDisplay");
    const card = document.querySelector(".card");
    const addAdviceForm = document.querySelector(".addAdviceForm");
    const newAdviceInput = document.getElementById("new-advice");

    // Search Advice (GET request)
    document.querySelector(".adviceForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = adviceInput.value.trim().toLowerCase();

        if (!keyword) {
            errorDisplay.textContent = "Please enter a keyword.";
            return;
        }

        fetch("http://localhost:3000/advice")
            .then((res) => res.json())
            .then((data) => {
                const adviceList = data;
                const result = adviceList.find((item) =>
                    item.advice.toLowerCase().includes(keyword)
                );

                if (result) {
                    adviceDisplay.textContent = "Advice";
                    descDisplay.textContent = result.advice;
                    errorDisplay.textContent = "";
                    showDeleteButton(result.id);
                } else {
                    adviceDisplay.textContent = "";
                    descDisplay.textContent = "";
                    errorDisplay.textContent = "No advice found for that keyword.";
                }
            })
            .catch((err) => {
                errorDisplay.textContent = "Failed to fetch advice.";
                console.error(err);
            });
    });

    // === Clear Error on Input ===
    adviceInput.addEventListener("input", () => {
        errorDisplay.textContent = "";
    });

    // Changes Card Background when Clicked
    card.addEventListener("click", () => {
        card.style.backgroundColor = "#f0f0f0";
    });

    //  Add Advice to the DB (POST)
    addAdviceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newAdvice = newAdviceInput.value.trim();

        if (!newAdvice) {
            alert("Please enter advice before submitting.");
            return;
        }

        const adviceData = { advice: newAdvice };

        fetch("http://localhost:3000/advice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adviceData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to add advice");
                }
                return res.json();
            })
            .then(() => {
                alert("Advice added successfully!");
                newAdviceInput.value = "";
            })
            .catch((err) => {
                alert("Error adding advice.");
                console.error(err);
            });
    });

    // Delete Advice (DELETE) 
    function showDeleteButton(adviceId) {
        let deleteBtn = document.getElementById("delete-advice");
        if (!deleteBtn) {
            deleteBtn = document.createElement("button");
            deleteBtn.id = "delete-advice";
            deleteBtn.textContent = "Delete Advice";
            card.appendChild(deleteBtn);
        }

        deleteBtn.onclick = () => {
            fetch(`http://localhost:3000/advice/${adviceId}`, {
                method: "DELETE",
            })
                .then(() => {
                    alert("Advice deleted.");
                    adviceDisplay.textContent = "";
                    descDisplay.textContent = "";
                    deleteBtn.remove();
                })
                .catch((err) => {
                    alert("Error deleting advice.");
                    console.error(err);
                });
        };
    }
});
