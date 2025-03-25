const apiKey = "2fae46818c507dd8001111a78a3f282c";
const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

async function fetchMatches() {
    try {
        document.getElementById("scores").innerHTML = "<p>Loading matches...</p>"; 

        const response = await fetch(apiUrl, {
            headers: { 'X-Auth-Token': apiKey }
        });

        const data = await response.json();
        console.log("API Response:", data); 

        if (!data.matches || data.matches.length === 0) {
            document.getElementById("scores").innerHTML = "<p>No live matches available.</p>";
            return;
        }

        displayMatches(data.matches); 
    } catch (error) {
        console.error("Error fetching matches:", error);
        document.getElementById("scores").innerHTML = "<p>Error loading matches.</p>"; 
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
                <img src="${match.homeTeam.crest || ''}" alt="${match.homeTeam.name}" class="team-logo">
                <span class="team">${match.homeTeam.name}</span>
                <strong>${match.score.fullTime.homeTeam ?? '-'} - ${match.score.fullTime.awayTeam ?? '-'}</strong>
                <span class="team">${match.awayTeam.name}</span>
                <img src="${match.awayTeam.crest || ''}" alt="${match.awayTeam.name}" class="team-logo">
            </div>
            <p>Competition: ${match.competition.name}</p>
            <p>Status: ${match.status}</p>
        `;

        scoresContainer.appendChild(matchElement);
    });
}



document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll(".match").forEach(match => {
        match.style.display = match.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
    });
});


fetchMatches();
setInterval(fetchMatches, 30000);
