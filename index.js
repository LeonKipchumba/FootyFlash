const apiKey = "2fae46818c507dd8001111a78a3f282c"; // Replace with your API key
const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

// ✅ Function to fetch live matches
async function fetchMatches() {
    try {
        document.getElementById("scores").innerHTML = "<p>Loading matches...</p>";

        const response = await fetch(apiUrl, {
            headers: { 'x-apisports-key': apiKey } 
        });

        const data = await response.json();
        console.log("API Response:", data); // ✅ Debugging log

        if (!data.response || data.response.length === 0) { 
            document.getElementById("scores").innerHTML = "<p>No live matches available.</p>";
            return;
        }

        displayMatches(data.response); // ✅ Pass correct data
    } catch (error) {
        console.error("Error fetching matches:", error);
        document.getElementById("scores").innerHTML = "<p>Error loading matches.</p>";
    }
}

// ✅ Function to display matches
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

    applySearchFilter(); // ✅ Ensure search works on newly added matches
}

// ✅ Function to filter matches based on search input
function applySearchFilter() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();

    document.querySelectorAll(".match").forEach(match => {
        const matchText = match.textContent.toLowerCase();
        match.style.display = matchText.includes(searchTerm) ? "block" : "none";
    });
}

// ✅ Attach search event listener
document.getElementById("searchInput").addEventListener("input", applySearchFilter);

// ✅ Fetch matches initially and update every 30 seconds
fetchMatches();
setInterval(fetchMatches, 30000);
