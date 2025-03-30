const BASE_URL = "http://localhost:5000/api"; // Node.js backend URL

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Load live matches
async function loadLiveMatches() {
    const data = await fetchData("matches");
    const container = document.getElementById("matches-container");
    container.innerHTML = "";

    if (data && data.matches) {
        data.matches.forEach(match => {
            const matchElement = document.createElement("div");
            matchElement.classList.add("match");
            matchElement.innerHTML = `
                <p><strong>${match.homeTeam.name}</strong> vs <strong>${match.awayTeam.name}</strong></p>
                <p>Score: ${match.score.fullTime.homeTeam || 0} - ${match.score.fullTime.awayTeam || 0}</p>
            `;
            container.appendChild(matchElement);
        });
    } else {
        container.innerHTML = "<p>No live matches available.</p>";
    }
}

// Load league standings
async function loadStandings() {
    const data = await fetchData("competitions/PL/standings");
    const container = document.getElementById("standings-container");
    container.innerHTML = "";

    if (data && data.standings) {
        data.standings[0].table.forEach(team => {
            const teamElement = document.createElement("p");
            teamElement.classList.add("team");
            teamElement.innerText = `${team.position}. ${team.team.name} - ${team.points} pts`;
            container.appendChild(teamElement);
        });
    } else {
        container.innerHTML = "<p>Standings unavailable.</p>";
    }
}

// Load upcoming fixtures
async function loadFixtures() {
    const data = await fetchData("competitions/PL/matches?status=SCHEDULED");
    const container = document.getElementById("fixtures-container");
    container.innerHTML = "";

    if (data && data.matches) {
        data.matches.forEach(match => {
            const matchElement = document.createElement("p");
            matchElement.classList.add("match");
            matchElement.innerText = `${match.homeTeam.name} vs ${match.awayTeam.name} - ${new Date(match.utcDate).toLocaleDateString()}`;
            container.appendChild(matchElement);
        });
    } else {
        container.innerHTML = "<p>No upcoming fixtures found.</p>";
    }
}

// Load match details (Example: Replace ID with actual match ID dynamically)
async function loadMatchDetails(matchId) {
    const data = await fetchData(`matches/${matchId}`);
    const container = document.getElementById("details-container");
    container.innerHTML = "";

    if (data && data.match) {
        const match = data.match;
        container.innerHTML = `
            <h3>${match.homeTeam.name} vs ${match.awayTeam.name}</h3>
            <p>Score: ${match.score.fullTime.homeTeam || 0} - ${match.score.fullTime.awayTeam || 0}</p>
            <p>Referee: ${match.referees.map(ref => ref.name).join(", ") || "N/A"}</p>
        `;
    } else {
        container.innerHTML = "<p>Match details not available.</p>";
    }
}

// Auto-refresh live matches every 60 seconds
document.addEventListener("DOMContentLoaded", () => {
    loadLiveMatches();
    loadStandings();
    loadFixtures();
    setInterval(loadLiveMatches, 60000);
});
