const API_KEY = "d21ed8429c68ec0de649a1e39d1e788c"; 
const API_URL = `https://api.football-data.org/v4/matches?status=LIVE`;

const matchContainer = document.getElementById("match-container");
const searchInput = document.getElementById("searchInput");

async function fetchMatches() {
    try {
        const response = await fetch(API_URL, {
            headers: { "X-Auth-Token": API_KEY } 
        });
        const data = await response.json();
        displayMatches(data.matches);
    } catch (error) {
        console.error("Error fetching match data:", error);
    }
}

function displayMatches(matches) {
    matchContainer.innerHTML = ""; 

    if (matches.length === 0) {
        matchContainer.innerHTML = "<p>No live matches at the moment.</p>";
        return;
    }

    matches.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");

        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;

        matchCard.innerHTML = `
            <div class="teams">
                <img src="${homeTeam.crest}" class="team-logo" alt="${homeTeam.name}">
                <span class="team-name">${homeTeam.name}</span>
                <span class="score">${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}</span>
                <span class="team-name">${awayTeam.name}</span>
                <img src="${awayTeam.crest}" class="team-logo" alt="${awayTeam.name}">
            </div>
            <div class="stats">
                <p>Competition: ${match.competition.name}</p>
                <p>Stage: ${match.stage}</p>
                <p>Status: ${match.status}</p>
            </div>
        `;

        matchContainer.appendChild(matchCard);
    });
}


searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const matchCards = document.querySelectorAll(".match-card");

    matchCards.forEach(card => {
        const teamNames = card.querySelectorAll(".team-name");
        const matchFound = [...teamNames].some(team => 
            team.textContent.toLowerCase().includes(searchTerm)
        );

        card.style.display = matchFound ? "block" : "none";
    });
});

fetchMatches();
setInterval(fetchMatches, 30000);
