const apiKey = "4b99d3035561a740aa4397dc6adfbb5b";
const apiBt = "https://api.football-data.org/v4";

document.getElementById("liveScoresBtn").addEventListener("click", fetchLiveMatches);
document.getElementById("standingsBtn").addEventListener("click", () => fetchStandings(39)); 
document.getElementById("fixturesBtn").addEventListener("click", fetchUpcomingFixtures);

async function fetchData(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Auth-Token": apiKey,
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        updateContent("Error", `<p>Error: ${error.message}</p>`);
        return null;
    }
}


async function fetchLiveMatches() {
    updateContent("Live Matches", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/matches?status=LIVE`);

    if (!data || !data.matches || data.matches.length === 0) {
        updateContent("Live Matches", "No live matches currently.");
        return;
    }

    let groupedMatches = groupMatchesByLeague(data.matches);
    displayGroupedContent("Live Matches", groupedMatches);
}

async function fetchStandings(leagueId) {
    updateContent("League Standings", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/competitions/${leagueId}/standings`);

    if (!data || !data.standings || data.standings.length === 0) {
        updateContent("League Standings", "Standings data not available.");
        return;
    }

    let tableContent = `<table>
        <thead>
            <tr>
                <th>Position</th><th>Team</th><th>Played</th><th>Won</th><th>Draw</th><th>Lost</th><th>Points</th>
            </tr>
        </thead>
        <tbody>`;

    data.standings[0].table.forEach(team => {
        tableContent += `<tr>
            <td>${team.position}</td>
            <td>${team.team.name}</td>
            <td>${team.playedGames}</td>
            <td>${team.won}</td>
            <td>${team.draw}</td>
            <td>${team.lost}</td>
            <td>${team.points}</td>
        </tr>`;
    });

    tableContent += `</tbody></table>`;
    updateContent("League Standings", tableContent);
}


async function fetchUpcomingFixtures() {
    updateContent("Upcoming Fixtures", "Loading...");
    const data = await fetchData(`${apiBaseUrl}/matches?status=SCHEDULED`);

    if (!data || !data.matches || data.matches.length === 0) {
        updateContent("Upcoming Fixtures", "No upcoming fixtures available.");
        return;
    }

    let groupedFixtures = groupMatchesByLeague(data.matches, true);
    displayGroupedContent("Upcoming Fixtures", groupedFixtures);
}


function groupMatchesByLeague(matches, showTime = false) {
    let grouped = {};
    matches.forEach(match => {
        let leagueName = match.competition.name;
        if (!grouped[leagueName]) grouped[leagueName] = [];

        let matchDetail = `<p><strong>${match.homeTeam.name}</strong> vs <strong>${match.awayTeam.name}</strong>`;
        if (!showTime) {
            matchDetail += ` <br> Score: ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}`;
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
        contentHtml += `<h3>${league}</h3>${groupedData[league].join("")}`;
    }
    updateContent(title, contentHtml);
}


function updateContent(title, message) {
    document.getElementById("content").innerHTML = `<h2>${title}</h2>${message}`;
}
