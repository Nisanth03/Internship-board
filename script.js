const internshipList = document.getElementById("internshipList");
const resultCount = document.getElementById("resultCount");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("search");
const domainFilter = document.getElementById("domain");
const modeFilter = document.getElementById("mode");

function loadFilters() {
    const domains = [...new Set(internships.map(function(internship) {
        return internship.domain;
    }))];

    const modes = [...new Set(internships.map(function(internship) {
        return internship.mode;
    }))];

    domains.forEach(function(domain) {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = domain;
        domainFilter.appendChild(option);
    });

    modes.forEach(function(mode) {
        const option = document.createElement("option");
        option.value = mode;
        option.textContent = mode;
        modeFilter.appendChild(option);
    });
}

function renderInternships(list) {
    internshipList.innerHTML = "";
    statusMessage.hidden = true;

    resultCount.textContent = `${list.length} internship${list.length === 1 ? "" : "s"} available`;

    if (list.length === 0) {
        statusMessage.textContent = "No internships found. Try changing your search or filters.";
        statusMessage.hidden = false;
        return;
    }

    list.forEach(function(internship) {
        const card = document.createElement("article");

        card.className = "internship-card";

        card.innerHTML = `
            <div class="card-top">
                <span class="domain">${internship.domain}</span>
                <span class="mode">${internship.mode}</span>
            </div>

            <h3>${internship.title}</h3>

            <p class="location">${internship.location}</p>

            <div class="skills">
                ${internship.skills.map(function(skill) {
                    return `<span>${skill}</span>`;
                }).join("")}
            </div>

            <div class="card-bottom">
                <span>${internship.openings} opening${internship.openings === 1 ? "" : "s"}</span>
                <button type="button" class="details-button" data-id="${internship.id}">
                    View Details
                </button>
            </div>
        `;

        internshipList.appendChild(card);
    });
}

function filterInternships() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedDomain = domainFilter.value;
    const selectedMode = modeFilter.value;

    const filteredInternships = internships.filter(function(internship) {
        const searchableText = [
            internship.title,
            internship.domain,
            internship.mode,
            internship.location,
            ...internship.skills
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchValue);
        const matchesDomain = selectedDomain === "all" || internship.domain === selectedDomain;
        const matchesMode = selectedMode === "all" || internship.mode === selectedMode;

        return matchesSearch && matchesDomain && matchesMode;
    });

    renderInternships(filteredInternships);
}

searchInput.addEventListener("input", filterInternships);
domainFilter.addEventListener("change", filterInternships);
modeFilter.addEventListener("change", filterInternships);

function loadInternships() {
    internshipList.innerHTML = "";
    statusMessage.hidden = false;
    statusMessage.textContent = "Loading internships...";
    resultCount.textContent = "Loading...";

    setTimeout(function() {
        try {
            if (!internships || internships.length === 0) {
                throw new Error("No internship data available.");
            }

            statusMessage.hidden = true;
            renderInternships(internships);
        }
        catch (error) {
            resultCount.textContent = "Unable to load internships";
            statusMessage.innerHTML = `
                <p>Something went wrong while loading internships.</p>
                <button type="button" id="retryButton">Retry</button>
            `;
            statusMessage.hidden = false;

            document.getElementById("retryButton").addEventListener("click", loadInternships);
        }
    }, 700);
}

loadFilters();
loadInternships();
const detailsDialog = document.getElementById("detailsDialog");
const dialogContent = document.getElementById("dialogContent");
const closeDialog = document.getElementById("closeDialog");

internshipList.addEventListener("click", function(event) {
    if (!event.target.classList.contains("details-button")) {
        return;
    }

    const internshipId = event.target.dataset.id;

    const internship = internships.find(function(item) {
        return item.id === internshipId;
    });

    if (!internship) {
        return;
    }

    dialogContent.innerHTML = `
        <p class="eyebrow">${internship.domain}</p>
        <h2>${internship.title}</h2>
        <p><strong>Location:</strong> ${internship.location}</p>
        <p><strong>Work mode:</strong> ${internship.mode}</p>
        <p><strong>Openings:</strong> ${internship.openings}</p>

        <h3>Skills</h3>

        <div class="skills">
            ${internship.skills.map(function(skill) {
                return `<span>${skill}</span>`;
            }).join("")}
        </div>
        <form id="applicationForm" class="application-form">
    <h3>Apply for this internship</h3>

    <label for="applicantName">Name</label>
    <input type="text" id="applicantName" name="applicantName" required>

    <label for="applicantEmail">Email</label>
    <input type="email" id="applicantEmail" name="applicantEmail" required>

    <label for="portfolio">Portfolio URL</label>
    <input type="url" id="portfolio" name="portfolio" placeholder="https://example.com" required>

    <button type="submit" class="apply-button">Submit Application</button>

    <p id="applicationMessage" class="application-message" aria-live="polite"></p>
</form>
    `;

    detailsDialog.showModal();
    const applicationForm = document.getElementById("applicationForm");
const applicationMessage = document.getElementById("applicationMessage");

applicationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!applicationForm.checkValidity()) {
        applicationForm.reportValidity();
        return;
    }

    applicationMessage.textContent = "Application submitted successfully!";
    applicationForm.reset();
});
});

closeDialog.addEventListener("click", function() {
    detailsDialog.close();
});