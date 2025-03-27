const apiKey = "4d073a038450477e8ac9f4ed34c69016";
const apiBaseUrl = "https://api.football-data.org/v4"; // Adjust if needed

document.getElementById("liveScoresBtn").addEventListener("click", fetchLiveScores);
document.getElementById("standingsBtn").addEventListener("click", fetchStandings);
document.getElementById("fixturesBtn").addEventListener("click", fetchFixtures);

async function fetchLiveScores() {
    const url = `${apiBaseUrl}/matches?status=LIVE`;
    const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "<h2>Live Scores</h2>";

    if (data.matches.length === 0) {
        content.innerHTML += "<p>No live matches currently.</p>";
        return;
    }

    data.matches.forEach(match => {
        content.innerHTML += `
            <div class="match">
                <h3>${match.competition.name}</h3>
                <p>${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name}</p>
            </div>
        `;
    });
}

async function fetchStandings() {
    const leagueId = 2021; // Example: Premier League
    const url = `${apiBaseUrl}/competitions/${leagueId}/standings`;
    const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "<h2>League Standings</h2>";

    data.standings[0].table.forEach(team => {
        content.innerHTML += `
            <div class="team">
                <p><strong>${team.position}. ${team.team.name}</strong> - ${team.points} pts</p>
            </div>
        `;
    });
}

async function fetchFixtures() {
    const url = `${apiBaseUrl}/matches?status=SCHEDULED`;
    const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "<h2>Upcoming Fixtures</h2>";

    data.matches.forEach(match => {
        content.innerHTML += `
            <div class="fixture">
                <h3>${match.competition.name}</h3>
                <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
                <p><small>${new Date(match.utcDate).toLocaleString()}</small></p>
            </div>
        `;
    });
}
