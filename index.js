const API_KEY = 'your_api_key_here'; 
const scoresContainer = document.getElementById('scoresContainer');
const matchStatsContainer = document.getElementById('matchStatsContainer');
const standingsContainer = document.getElementById('standingsContainer');
const fixturesContainer = document.getElementById('fixturesContainer');
const teamSearch = document.getElementById('teamSearch');


async function fetchLiveScores() {
    try {
        const response = await fetch('https://api.football-data.org/v2/matches', {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        displayLiveScores(data.matches);
    } catch (error) {
        console.error('Error fetching live scores:', error);
    }
}

function displayLiveScores(matches) {
    scoresContainer.innerHTML = '';
    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('match');
        matchElement.innerHTML = `
            <p><strong>${match.homeTeam.name}</strong> vs <strong>${match.awayTeam.name}</strong></p>
            <p>Score: ${match.score.fullTime.homeTeam || 0} - ${match.score.fullTime.awayTeam || 0}</p>
        `;
        scoresContainer.appendChild(matchElement);
    });
}

async function fetchLeagueStandings() {
    try {
        const response = await fetch('https://api.football-data.org/v2/competitions/PL/standings', {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        displayLeagueStandings(data.standings[0].table);
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
}

function displayLeagueStandings(teams) {
    standingsContainer.innerHTML = '';
    teams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
        teamElement.innerHTML = `
            <p><strong>${team.position}. ${team.team.name}</strong></p>
            <img src="${team.team.crestUrl}" alt="${team.team.name} logo" width="50">
            <p>Points: ${team.points}</p>
        `;
        standingsContainer.appendChild(teamElement);
    });
}

teamSearch.addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 2) {
        try {
            const response = await fetch(`https://api.football-data.org/v2/teams?name=${query}`, {
                headers: { 'X-Auth-Token': API_KEY }
            });
            const data = await response.json();
            displaySearchResults(data.teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }
});

function displaySearchResults(teams) {
    standingsContainer.innerHTML = '';
    teams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
        teamElement.innerHTML = `
            <p><strong>${team.name}</strong></p>
            <img src="${team.crestUrl}" alt="${team.name} logo" width="50">
        `;
        standingsContainer.appendChild(teamElement);
    });
}



fetchLiveScores();
fetchLeagueStandings();
setInterval(fetchLiveScores, 60000);
