// Replace this with your deployed Google Apps Script Web App URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbyQxeSkcqS9T02mfxNN1OJpOt0GVX4PGcZHW9VZdpriinqXC_uuGfes8DSifEBXJ-kZ/exec";

// Function to calculate week progress
function updateWeekProgress() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 is Monday, 6 is Sunday
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Calculate how far we are through the current day (0 to 1)
  const dayProgress = (currentHour * 60 + currentMinute) / (24 * 60);
  
  // Calculate the total week progress (0 to 1)
  const weekProgress = (dayIndex + dayProgress) / 7;
  
  // Update the progress bar
  const progressPercentage = Math.round(weekProgress * 100);
  document.getElementById('week-progress').style.width = `${progressPercentage}%`;
  
  // Update the text
  const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex];
  document.getElementById('week-text').textContent = `${weekDay} (${progressPercentage}%)`;
}

// Fetch leaderboard data
function fetchLeaderboardData() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const leaderboard = document.getElementById("leaderboard");
      leaderboard.innerHTML = ''; // Clear existing items
      
      data.forEach((player) => {
        const rankClass = player.position <= 3 ? `rank-${player.position}` : '';
        const item = `
          <li class="roommate-item">
            <div class="rank ${rankClass}">${player.position}</div>
            <div class="roommate-info">
              <div class="roommate-name">${player.name}</div>
            </div>
            <div class="points">${player.aurapoints} pts</div>
          </li>
        `;
        leaderboard.insertAdjacentHTML("beforeend", item);
      });
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
      document.getElementById("leaderboard").innerHTML =
        '<li class="roommate-item">Failed to load data.</li>';
    });
}

// Initialize the page
function initPage() {
  // Initial load of data
  updateWeekProgress();
  fetchLeaderboardData();
  
  // Update week progress every minute
  setInterval(updateWeekProgress, 60000);
  
  // Refresh data every 60 seconds
  setInterval(fetchLeaderboardData, 60000);
}

// Start everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);