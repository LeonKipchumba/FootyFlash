const apiKey = "2fae46818c507dd8001111a78a3f282c";
const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

async function fetchMatches() {
    try {
        document.getElementById("scores").innerHTML = "<p>Loading matches...</p>";

        const response = await fetch(apiUrl, {
            headers: { 'x-apisports-key': apiKey } 
        });

        const data = await response.json();
        console.log("API Response:", data); 

        if (!data.response || data.response.length === 0) { 
            document.getElementById("scores").innerHTML = "<p>No live matches available.</p>";
            return;
        }

        console.log("Matches Data:", data.response); 
        displayMatches(data.response); 
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
                <img src="${match.teams.home.logo || ''}" alt="${match.teams.home.name}" class="team-logo">
                <span class="team">${match.teams.home.name}</span>
                <strong>${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</strong>
                <span class="team">${match.teams.away.name}</span>
                <img src="${match.teams.away.logo || ''}" alt="${match.teams.away.name}" class="team-logo">
            </div>
            <p>Competition: ${match.league.name}</p>
            <p>Status: ${match.fixture.status.short}</p>
        `;

        scoresContainer.appendChild(matchElement);
    });

   
    applySearchFilter();
}


function applySearchFilter() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".match").forEach(match => {
        match.style.display = match.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
    });
}

document.getElementById("searchInput").addEventListener("input", applySearchFilter);


fetchMatches();
setInterval(fetchMatches, 30000);

