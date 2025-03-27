const API_KEY = "2fae46818c507dd8001111a78a3f282c";
const BASE_URL = "https://api.football-data.org/v2";
const PL_ID = 2021; // Premier League ID

// Fetch Live Scores
async function fetchLiveScores() {
    const liveScoresContainer = document.getElementById("liveScores");
    try {
        const response = await fetch(`${BASE_URL}/competitions/${PL_ID}/matches?status=LIVE`, {
            headers: { "X-Auth-Token": API_KEY },
        });
        const data = await response.json();

        if (!data.matches || data.matches.length === 0) {
            liveScoresContainer.innerHTML = "<p>⚠ No live matches currently.</p>";
            return;
        }

        liveScoresContainer.innerHTML = data.matches.map(match => `
            <p>⚽ ${match.homeTeam.name} ${match.score.fullTime.homeTeam || 0} - 
               ${match.score.fullTime.awayTeam || 0} ${match.awayTeam.name}</p>
        `).join("");
    } catch (error) {
        console.error("Error fetching live scores:", error);
        liveScoresContainer.innerHTML = "<p>❌ Error loading live scores.</p>";
    }
}

// Fetch League Standings
async function fetchStandings() {
    const standingsContainer = document.getElementById("leagueStandings");
    try {
        const response = await fetch(`${BASE_URL}/competitions/${PL_ID}/standings`, {
            headers: { "X-Auth-Token": API_KEY },
        });
        const data = await response.json();

        standingsContainer.innerHTML = data.standings[0].table.map(team => `
            <p>${team.position}. ${team.team.name} - ${team.points} pts</p>
        `).join("");
    } catch (error) {
        console.error("Error fetching standings:", error);
        standingsContainer.innerHTML = "<p>❌ Error loading standings.</p>";
    }
}

// Fetch Upcoming Fixtures
async function fetchFixtures() {
    const fixturesContainer = document.getElementById("fixtures");
    try {
        const response = await fetch(`${BASE_URL}/competitions/${PL_ID}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": API_KEY },
        });
        const data = await response.json();

        fixturesContainer.innerHTML = data.matches.slice(0, 10).map(match => `
            <p>📅 ${match.homeTeam.name} vs ${match.awayTeam.name} - 
               ${new Date(match.utcDate).toLocaleDateString()}</p>
        `).join("");
    } catch (error) {
        console.error("Error fetching fixtures:", error);
        fixturesContainer.innerHTML = "<p>❌ Error loading fixtures.</p>";
    }
}

// Search Teams
async function searchTeam() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");

    if (query.trim() === "") {
        resultsContainer.innerHTML = "<p>⚠ Please enter a team name.</p>";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/teams`, {
            headers: { "X-Auth-Token": API_KEY },
        });
        const data = await response.json();
        const teams = data.teams || [];

        const filteredTeams = teams.filter(team => team.name.toLowerCase().includes(query));

        if (filteredTeams.length === 0) {
            resultsContainer.innerHTML = "<p>❌ No teams found.</p>";
        } else {
            resultsContainer.innerHTML = filteredTeams.map(team => `
                <div class="team">
                    <img src="${team.crestUrl}" alt="${team.name}" width="50"/>
                    <p>${team.name}</p>
                </div>
            `).join("");
        }
    } catch (error) {
        console.error("Error fetching teams:", error);
        resultsContainer.innerHTML = "<p>❌ Error loading teams.</p>";
    }
}

// Auto-refresh live scores every 30 seconds
setInterval(fetchLiveScores, 30000);

// Event Listeners
document.getElementById("refreshScores").addEventListener("click", fetchLiveScores);
document.getElementById("updateStandings").addEventListener("click", fetchStandings);
document.getElementById("checkFixtures").addEventListener("click", fetchFixtures);
document.getElementById("searchButton").addEventListener("click", searchTeam);

// Initial Load
fetchLiveScores();
fetchFixtures();
fetchStandings();
