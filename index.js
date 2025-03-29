const apiKey = "4d073a038450477e8ac9f4ed34c69016";
const apiBaseUrl = "https://api.football-data.org/v4"; 

document.getElementById("liveScoresBtn").addEventListener("click", fetchLiveScores);
document.getElementById("standingsBtn").addEventListener("click", fetchStandings);
document.getElementById("fixturesBtn").addEventListener("click", fetchFixtures);


const leagueCodes = {
    WC: "FIFA World Cup",
    CL: "UEFA Champions League",
    BL1: "Bundesliga",
    DED: "Eredivisie",
    BSA: "Campeonato Brasileiro Série A",
    PD: "Primera Division",
    FL1: "Ligue 1",
    ELC: "Championship",
    PPL: "Primeira Liga",
    EC: "European Championship",
    SA: "Serie A",
    PL: "Premier League"
};


async function fetchLiveScores() {
    const url = `${apiBaseUrl}/matches?status=LIVE`;
    const content = document.getElementById("content");
    content.innerHTML = "<h2>Live Scores</h2><p>Loading...</p>";

    try {
        const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        content.innerHTML = "<h2>Live Scores</h2>";

        if (!data.matches || data.matches.length === 0) {
            content.innerHTML += "<p>No live matches currently.</p>";
            return;
        }

        let groupedMatches = {};
        data.matches.forEach(match => {
            let leagueName = leagueCodes[match.competition.code] || match.competition.name;
            if (!groupedMatches[leagueName]) groupedMatches[leagueName] = [];
            groupedMatches[leagueName].push(`
                <p>${match.homeTeam.name} ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0} ${match.awayTeam.name}</p>
            `);
        });

        for (let league in groupedMatches) {
            content.innerHTML += `<h3>${league}</h3>${groupedMatches[league].join("")}`;
        }
    } catch (error) {
        console.error("Live Scores Error:", error);
        content.innerHTML = "<p>Error loading live scores. Please try again later.</p>";
    }
}


async function fetchStandings() {
    const leagueId = 2021; 
    const url = `${apiBaseUrl}/competitions/${leagueId}/standings`;
    const content = document.getElementById("content");
    content.innerHTML = "<h2>League Standings</h2><p>Loading...</p>";

    try {
        const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        content.innerHTML = "<h2>League Standings</h2>";

        if (!data.standings || data.standings.length === 0) {
            content.innerHTML += "<p>Standings data not available.</p>";
            return;
        }

        data.standings[0].table.forEach(team => {
            content.innerHTML += `
                <div class="team">
                    <p><strong>${team.position}. ${team.team.name}</strong> - ${team.points} pts</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Standings Error:", error);
        content.innerHTML = "<p>Error loading standings. Please try again later.</p>";
    }
}


async function fetchFixtures() {
    const url = `${apiBaseUrl}/matches?status=SCHEDULED`;
    const content = document.getElementById("content");
    content.innerHTML = "<h2>Upcoming Fixtures</h2><p>Loading...</p>";

    try {
        const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        content.innerHTML = "<h2>Upcoming Fixtures</h2>";

        if (!data.matches || data.matches.length === 0) {
            content.innerHTML += "<p>No upcoming fixtures available.</p>";
            return;
        }

        let groupedFixtures = {};
        data.matches.forEach(match => {
            let leagueName = leagueCodes[match.competition.code] || match.competition.name;
            if (!groupedFixtures[leagueName]) groupedFixtures[leagueName] = [];
            groupedFixtures[leagueName].push(`
                <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
                <p><small>${new Date(match.utcDate).toLocaleString()}</small></p>
            `);
        });

        for (let league in groupedFixtures) {
            content.innerHTML += `<h3>${league}</h3>${groupedFixtures[league].join("")}`;
        }
    } catch (error) {
        console.error("Fixtures Error:", error);
        content.innerHTML = "<p>Error loading fixtures. Please try again later.</p>";
    }
}
