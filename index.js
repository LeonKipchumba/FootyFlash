const apiKey = "2fae46818c507dd8001111a78a3f282c";
const apiUrlLive = "https://v3.football.api-sports.io/fixtures?live=all";
const apiUrlStandings = "https://v3.football.api-sports.io/standings?league=39&season=2024"; 
const apiUrlUpcoming = "https://v3.football.api-sports.io/fixtures?league=39&season=2024&next=10";

async function fetchMatches() {
    try {
        document.getElementById("scores").innerHTML = "<p>Loading live matches...</p>";

        const response = await fetch(apiUrlLive, {
            headers: { 'x-apisports-key': apiKey }
        });

        const data = await response.json();
        console.log("Live Matches:", data);

        if (!data.response || data.response.length === 0) {
            document.getElementById("scores").innerHTML = "<p>No live matches available.</p>";
            return;
        }

        displayMatches(data.response);
    } catch (error) {
        console.error("Error fetching matches:", error);
        document.getElementById("scores").innerHTML = "<p>Error loading matches.</p>";
    }
}

async function fetchStandings() {
    try {
        const response = await fetch(apiUrlStandings, {
            headers: { 'x-apisports-key': apiKey }
        });

        const data = await response.json();
        console.log("League Standings:", data);

        if (!data.response || data.response.length === 0) {
            document.getElementById("standings").innerHTML = "<p>Standings not available.</p>";
            return;
        }

        displayStandings(data.response[0].league.standings[0]);
    } catch (error) {
        console.error("Error fetching standings:", error);
    }
}

async function fetchUpcomingFixtures() {
    try {
        const response = await fetch(apiUrlUpcoming, {
            headers: { 'x-apisports-key': apiKey }
        });

        const data = await response.json();
        console.log("Upcoming Fixtures:", data);

        if (!data.response || data.response.length === 0) {
            document.getElementById("upcoming").innerHTML = "<p>No upcoming fixtures.</p>";
            return;
        }

        displayUpcomingFixtures(data.response);
    } catch (error) {
        console.error("Error fetching fixtures:", error);
    }
}

function displayMatches(matches) {
    const scoresContainer = document.getElementById("scores");
    scoresContainer.innerHTML = "";

    matches.forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("match", "fade-in");

        matchElement.innerHTML = `
            <div class="teams">
                <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                <span class="team">${match.teams.home.name}</span>
                <strong>${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</strong>
                <span class="team">${match.teams.away.name}</span>
                <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
            </div>
            <p>Competition: ${match.league.name}</p>
            <p>Status: ${match.fixture.status.short}</p>
            <p>Scorers & Cards: ${match.events ? displayEvents(match.events) : "No data yet"}</p>
        `;

        scoresContainer.appendChild(matchElement);
    });

    applySearchFilter();
}

function displayStandings(standings) {
    const standingsContainer = document.getElementById("standings");
    standingsContainer.innerHTML = "<h2>League Standings</h2>";

    standings.forEach(team => {
        const teamElement = document.createElement("div");
        teamElement.classList.add("team-standing");

        teamElement.innerHTML = `
            <span>#${team.rank}</span>
            <img src="${team.team.logo}" alt="${team.team.name}" class="team-logo">
            <span>${team.team.name}</span>
            <span>${team.points} pts</span>
        `;

        standingsContainer.appendChild(teamElement);
    });
}

function displayUpcomingFixtures(fixtures) {
    const upcomingContainer = document.getElementById("upcoming");
    upcomingContainer.innerHTML = "<h2>Upcoming Fixtures</h2>";

    fixtures.forEach(match => {
        const fixtureElement = document.createElement("div");
        fixtureElement.classList.add("fixture");

        fixtureElement.innerHTML = `
            <div class="teams">
                <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                <span class="team">${match.teams.home.name}</span>
                <strong>vs</strong>
                <span class="team">${match.teams.away.name}</span>
                <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
            </div>
            <p>Match Date: ${new Date(match.fixture.date).toLocaleString()}</p>
        `;

        upcomingContainer.appendChild(fixtureElement);
    });
}

function displayEvents(events) {
    return events.map(event => {
        if (event.type === "Goal") {
            return `⚽ ${event.player.name} (${event.time.elapsed}')`;
        } else if (event.type === "Card") {
            return `🟨 ${event.player.name} (${event.detail})`;
        }
        return "";
    }).join(" | ");
}

function applySearchFilter() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".match").forEach(match => {
        match.style.display = match.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
    });
}

document.getElementById("searchInput").addEventListener("input", applySearchFilter);

fetchMatches();
fetchStandings();
fetchUpcomingFixtures();
setInterval(fetchMatches, 30000);
setInterval(fetchUpcomingFixtures, 60000);
