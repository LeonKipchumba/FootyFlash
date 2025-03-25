const apiKey = "d21ed8429c68ec0de649a1e39d1e788c";
const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

async function fetchMatches() {
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "x-apisports-key": apiKey }
        });
        const data = await response.json();

        if (data.response.length === 0) {
            document.getElementById("scores").innerHTML = "<p>No live matches currently.</p>";
            return;
        }

        displayMatches(data.response);
    } catch (error) {
        console.error("Error fetching matches:", error);
    }
}

function displayMatches(matches) {
    const scoresContainer = document.getElementById("scores");
    scoresContainer.innerHTML = ""; // Clear previous data

    matches.forEach(match => {
        const home = match.teams.home;
        const away = match.teams.away;
        const league = match.league;
        const score = match.score.fulltime || { home: "-", away: "-" };

        const matchElement = document.createElement("div");
        matchElement.classList.add("match", "fade-in");

        matchElement.innerHTML = `
            <div class="match-card">
                <p class="league">${league.name}</p>
                <div class="teams">
                    <div class="team">
                        <img src="${home.logo}" alt="${home.name}" class="team-logo">
                        <span>${home.name}</span>
                    </div>
                    <strong class="score">${score.home} - ${score.away}</strong>
                    <div class="team">
                        <img src="${away.logo}" alt="${away.name}" class="team-logo">
                        <span>${away.name}</span>
                    </div>
                </div>
                <p class="status">${match.fixture.status.long}</p>
            </div>
        `;
        scoresContainer.appendChild(matchElement);
    });
}

// Search Functionality
document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll(".match").forEach(match => {
        match.style.display = match.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
    });
});

// Auto-refresh every 30 seconds
fetchMatches();
setInterval(fetchMatches, 30000);
