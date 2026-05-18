function updateStats() {
  const hash = window.location.hash;
  
  // Jitpack URLs are like #user/repository/version
  if (!hash || !hash.startsWith('#')) {
    hideStats();
    return;
  }

  const parts = hash.substring(1).split('/');
  
  // Need at least user and repository
  if (parts.length >= 2) {
    const user = parts[0];
    const repository = parts[1];
    
    // Ignore if it's not a real repo path (e.g. #gradle, #maven)
    if (['gradle', 'maven', 'sbt', 'lein', 'gradleKts'].includes(user)) {
      hideStats();
      return;
    }
    
    showStats(user, repository);
  } else {
    hideStats();
  }
}

function createStatsWidget() {
  let widget = document.getElementById('jitpack-stats-widget');
  if (!widget) {
    widget = document.createElement('div');
    widget.id = 'jitpack-stats-widget';
    widget.className = 'jitpack-stats-widget';
    
    // --- Overall Stats ---
    const overallContainer = document.createElement('div');
    overallContainer.className = 'stats-section';
    
    const overallTitle = document.createElement('div');
    overallTitle.className = 'jitpack-stats-title';
    overallTitle.id = 'jitpack-stats-title-text';
    
    const monthBadge = document.createElement('img');
    monthBadge.id = 'jitpack-stats-month';
    monthBadge.alt = 'Overall Monthly Downloads';
    monthBadge.title = 'Overall downloads in the last month';
    
    const weekBadge = document.createElement('img');
    weekBadge.id = 'jitpack-stats-week';
    weekBadge.alt = 'Overall Weekly Downloads';
    weekBadge.title = 'Overall downloads in the last week';
    
    overallContainer.appendChild(overallTitle);
    overallContainer.appendChild(monthBadge);
    overallContainer.appendChild(weekBadge);
    
    // Handle Image Load/Error
    const handleImageError = function() {
      this.style.display = 'none';
    };
    const handleImageLoad = function() {
      this.style.display = 'block';
    };
    
    [monthBadge, weekBadge].forEach(img => {
      img.onerror = handleImageError;
      img.onload = handleImageLoad;
    });
    
    widget.appendChild(overallContainer);
    
    document.body.appendChild(widget);
  }
  return widget;
}

function showStats(user, repository) {
  const widget = createStatsWidget();
  
  // Update Title
  const titleText = document.getElementById('jitpack-stats-title-text');
  if (titleText) {
    const fullPath = `${user}/${repository}`;
    titleText.textContent = fullPath;
    titleText.title = fullPath;
  }

  // Update Badges
  const monthBadge = document.getElementById('jitpack-stats-month');
  const weekBadge = document.getElementById('jitpack-stats-week');
  
  const newMonthSrc = `https://jitpack.io/v/${user}/${repository}/month.svg`;
  const newWeekSrc = `https://jitpack.io/v/${user}/${repository}/week.svg`;
  
  if (monthBadge.src !== newMonthSrc) {
    monthBadge.style.display = 'none';
    monthBadge.src = newMonthSrc;
  }
  
  if (weekBadge.src !== newWeekSrc) {
    weekBadge.style.display = 'none';
    weekBadge.src = newWeekSrc;
  }
  
  widget.style.display = 'flex';
}

function hideStats() {
  const widget = document.getElementById('jitpack-stats-widget');
  if (widget) {
    widget.style.display = 'none';
  }
}

// Initial check when script loads
updateStats();

// Listen for hash changes
window.addEventListener('hashchange', updateStats);
