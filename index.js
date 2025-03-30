const apiKey = "4d073a038450477e8ac9f4ed34c69016"; 
const apiBaseUrl = "https://api.football-data.org/v4/matches?status=LIVE";

document.getElementById("liveScoresBtn").addEventListener("click", fetchLiveMatches);

async function fetchLiveMatches() {
    updateContent("Live Matches", "Loading...");

    try {
        const response = await fetch(apiBaseUrl, {
            headers: { "X-Auth-Token": apiKey }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.matches || data.matches.length === 0) {
            updateContent("Live Matches", "No live matches currently.");
            return;
        }

        let matchList = data.matches.map(match =>
            `<p><strong>${match.homeTeam.name}</strong> vs <strong>${match.awayTeam.name}</strong>
            <br>Score: ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}</p>`
        ).join("");

        updateContent("Live Matches", matchList);
    } catch (error) {
        console.error("Fetch Error:", error);
        updateContent("Live Matches", `<p>Error: ${error.message}</p>`);
    }
}


function updateContent(title, message) {
    document.getElementById("content").innerHTML = `<h2>${title}</h2>${message}`;
}
