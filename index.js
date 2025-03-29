const apiKey = "4d073a038450477e8ac9f4ed34c69016";
const apiBaseUrl = "https://api.football-data.org/v4";

document.getElementById("liveScoresBtn").addEventListener("click", fetchLiveScores);
document.getElementById("standingsBtn").addEventListener("click", () => fetchStandings(2021)); 
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

async function fetchData(url) {
    try {
        const response = await fetch(url, { headers: { "X-Auth-Token": apiKey } });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

async function fetchLiveScores() {
    updateContent("Live Scores", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/matches?status=LIVE`);
    
    if (!data || !data.matches.length) {
        updateContent("Live Scores", "No live matches currently.");
        return;
    }

    let groupedMatches = groupMatchesByLeague(data.matches);
    displayGroupedContent("Live Scores", groupedMatches);
}

async function fetchStandings(leagueId) {
    updateContent("League Standings", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/competitions/${leagueId}/standings`);
    
    if (!data || !data.standings.length) {
        updateContent("League Standings", "Standings data not available.");
        return;
    }

    let tableContent = `<table><tr><th>Position</th><th>Team</th><th>Points</th></tr>`;
    data.standings[0].table.forEach(team => {
        tableContent += `<tr><td>${team.position}</td><td>${team.team.name}</td><td>${team.points}</td></tr>`;
    });
    tableContent += `</table>`;

    updateContent("League Standings", tableContent);
}

async function fetchFixtures() {
    updateContent("Upcoming Fixtures", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/matches?status=SCHEDULED`);
    
    if (!data || !data.matches.length) {
        updateContent("Upcoming Fixtures", "No upcoming fixtures available.");
        return;
    }

    let groupedFixtures = groupMatchesByLeague(data.matches, true);
    displayGroupedContent("Upcoming Fixtures", groupedFixtures);
}

function groupMatchesByLeague(matches, showTime = false) {
    let grouped = {};
    matches.forEach(match => {
        let leagueName = leagueCodes[match.competition.code] || match.competition.name;
        if (!grouped[leagueName]) grouped[leagueName] = [];
        
        let matchDetail = `<p>${match.homeTeam.name} vs ${match.awayTeam.name}`;
        if (!showTime) {
            matchDetail += ` ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}`;
        }
        matchDetail += `</p>`;
        if (showTime) {
            matchDetail += `<p><small>${new Date(match.utcDate).toLocaleString()}</small></p>`;
        }
        grouped[leagueName].push(matchDetail);
    });
    return grouped;
}

function displayGroupedContent(title, groupedData) {
    let contentHtml = `<h2>${title}</h2>`;
    for (let league in groupedData) {
        contentHtml += `<h3>${league}</h3>${groupedData[league].join('')}`;
    }
    document.getElementById("content").innerHTML = contentHtml;
}

function updateContent(title, message) {
    document.getElementById("content").innerHTML = `<h2>${title}</h2><p>${message}</p>`;
}
