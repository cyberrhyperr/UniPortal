// Scroll animation trigger
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if(elementPosition < screenPosition) {
        element.classList.add('animated');
      }
    });
  }
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
  
  document.addEventListener('DOMContentLoaded', function() {
    // ============== SIDEBAR & NAVIGATION ==============
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuToggle = document.createElement('div');
    
    // Create mobile menu toggle button
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    document.body.appendChild(mobileMenuToggle);
    
    // Mobile menu toggle functionality
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Navigation item interactions
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 800);
      });
    });
  
    // ============== NOTIFICATION SYSTEM ==============
    const notificationBell = document.querySelector('.notification-bell');
    const notificationPanel = document.createElement('div');
    notificationPanel.classList.add('notification-panel');
    
    // Sample notifications data
    const notifications = [
      {
        id: 1,
        title: "New Assignment Posted",
        course: "Advanced Algorithms",
        time: "10 min ago",
        read: false
      },
      {
        id: 2,
        title: "Grade Updated",
        course: "Linear Algebra",
        time: "2 hours ago",
        read: true
      },
      {
        id: 3,
        title: "Class Cancelled",
        course: "Quantum Mechanics",
        time: "1 day ago",
        read: false
      }
    ];
    
    // Build notification panel
    notificationPanel.innerHTML = `
      <div class="notification-header">
        <h3>Notifications</h3>
        <span class="mark-all-read">Mark all as read</span>
      </div>
      <div class="notification-list"></div>
    `;
    
    document.body.appendChild(notificationPanel);
    
    // Render notifications
    function renderNotifications() {
      const unreadCount = notifications.filter(n => !n.read).length;
      const notificationList = notificationPanel.querySelector('.notification-list');
      
      // Update badge
      if (unreadCount > 0) {
        notificationBell.setAttribute('data-count', unreadCount);
      } else {
        notificationBell.removeAttribute('data-count');
      }
      
      // Clear and rebuild list
      notificationList.innerHTML = '';
      
      notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        if (!notification.read) notificationItem.classList.add('unread');
        
        notificationItem.innerHTML = `
          <div class="notification-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="notification-content">
            <h4>${notification.title}</h4>
            <p>${notification.course}</p>
            <span class="notification-time">${notification.time}</span>
          </div>
          <div class="notification-actions">
            <i class="fas fa-times delete-notification" data-id="${notification.id}"></i>
          </div>
        `;
        
        notificationItem.addEventListener('click', function() {
          markNotificationAsRead(notification.id);
        });
        
        notificationList.appendChild(notificationItem);
      });
      
      // Add "no notifications" message if empty
      if (notifications.length === 0) {
        notificationList.innerHTML = `
          <div class="no-notifications">
            <i class="far fa-bell-slash"></i>
            <p>No notifications yet</p>
          </div>
        `;
      }
    }
    
    // Mark notification as read
    function markNotificationAsRead(id) {
      const notification = notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
        renderNotifications();
      }
    }
    
    // Mark all as read
    notificationPanel.querySelector('.mark-all-read').addEventListener('click', function(e) {
      e.stopPropagation();
      notifications.forEach(n => n.read = true);
      renderNotifications();
    });
    
    // Delete notification
    notificationPanel.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-notification')) {
        e.stopPropagation();
        const id = parseInt(e.target.getAttribute('data-id'));
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          notifications.splice(index, 1);
          renderNotifications();
        }
      }
    });
    
    // Toggle notification panel
    notificationBell.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationPanel.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!notificationPanel.contains(e.target) && e.target !== notificationBell) {
        notificationPanel.classList.remove('active');
      }
    });
    
    // Initial render
    renderNotifications();
  
    // ============== COURSE INTERACTIONS ==============
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
      // Add progress animation on hover
      const progressBar = card.querySelector('.progress');
      const originalWidth = progressBar.style.width;
      
      card.addEventListener('mouseenter', function() {
        progressBar.style.transition = 'width 1.5s ease';
        progressBar.style.width = '100%';
      });
      
      card.addEventListener('mouseleave', function() {
        progressBar.style.width = originalWidth;
      });
      
      // Click actions
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.course-actions')) {
          const courseTitle = this.querySelector('.course-title').textContent;
          showModal(`Opening ${courseTitle} dashboard`, `This would navigate to the full course page for ${courseTitle} in a real application.`);
        }
      });
      
      // Action buttons
      const detailsBtn = card.querySelector('.btn-outline');
      const continueBtn = card.querySelector('.btn-primary');
      
      detailsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const courseTitle = card.querySelector('.course-title').textContent;
        showModal(`Course Details: ${courseTitle}`, `Detailed information about ${courseTitle} would appear here.`);
      });
      
      continueBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const courseTitle = card.querySelector('.course-title').textContent;
        showModal(`Continuing: ${courseTitle}`, `You would now continue with your ${courseTitle} coursework.`);
      });
    });
  
    // ============== MODAL SYSTEM ==============
    function showModal(title, content) {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>${title}</h3>
            <span class="modal-close">&times;</span>
          </div>
          <div class="modal-body">
            <p>${content}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary modal-confirm">OK</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.classList.add('modal-open');
      
      // Animation
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Close handlers
      modal.querySelector('.modal-close').addEventListener('click', closeModal);
      modal.querySelector('.modal-confirm').addEventListener('click', closeModal);
      
      function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.remove();
          document.body.classList.remove('modal-open');
        }, 300);
      }
      
      // Close when clicking outside
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
  
    // ============== REAL-TIME UPDATES ==============
    // Simulate real-time updates
    setInterval(() => {
      // Randomly add new notifications (10% chance)
      if (Math.random() < 0.1) {
        const courses = ["Advanced Algorithms", "Linear Algebra", "Quantum Mechanics", "Data Structures", "Calculus"];
        const actions = ["New assignment", "Grade updated", "Announcement", "Lecture note added", "Quiz scheduled"];
        
        const newNotification = {
          id: Date.now(),
          title: `${actions[Math.floor(Math.random() * actions.length)]}`,
          course: `${courses[Math.floor(Math.random() * courses.length)]}`,
          time: "Just now",
          read: false
        };
        
        notifications.unshift(newNotification);
        renderNotifications();
        
        // Show toast notification
        showToast(newNotification.title, newNotification.course);
      }
    }, 30000); // Check every 30 seconds
  
    // Toast notification
    function showToast(title, message) {
      const toast = document.createElement('div');
      toast.classList.add('toast-notification');
      toast.innerHTML = `
        <div class="toast-icon">
          <i class="fas fa-bell"></i>
        </div>
        <div class="toast-content">
          <h4>${title}</h4>
          <p>${message}</p>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Show toast
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      // Hide after 5 seconds
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 5000);
      
      // Click to view
      toast.addEventListener('click', function() {
        notificationPanel.classList.add('active');
        this.classList.remove('show');
        setTimeout(() => {
          this.remove();
        }, 300);
      });
    }
  
    // ============== SEARCH FUNCTIONALITY ==============
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      if (searchTerm.length > 2) {
        // In a real app, this would be an API call
        console.log(`Searching for: ${searchTerm}`);
        // Simulate search results
        showSearchResults(searchTerm);
      } else {
        hideSearchResults();
      }
    });
    
    function showSearchResults(term) {
      hideSearchResults();
      
      const results = [
        { type: 'course', title: 'Advanced Algorithms', match: 'algo' },
        { type: 'assignment', title: 'Algorithm Project', match: 'algo' },
        { type: 'professor', title: 'Dr. Algorithm', match: 'algo' }
      ].filter(item => item.match.includes(term.toLowerCase()));
      
      const searchResults = document.createElement('div');
      searchResults.classList.add('search-results');
      
      if (results.length > 0) {
        results.forEach(result => {
          const resultItem = document.createElement('div');
          resultItem.classList.add('search-result-item', result.type);
          resultItem.innerHTML = `
            <i class="fas fa-${result.type === 'course' ? 'book' : 
                             result.type === 'assignment' ? 'file-alt' : 'user'}"></i>
            <span>${result.title}</span>
          `;
          searchResults.appendChild(resultItem);
        });
      } else {
        searchResults.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search"></i>
            <p>No results found</p>
          </div>
        `;
      }
      
      document.querySelector('.search-bar').appendChild(searchResults);
    }
    
    function hideSearchResults() {
      const existingResults = document.querySelector('.search-results');
      if (existingResults) existingResults.remove();
    }
  
    // ============== USER PROFILE MENU ==============
    const userProfile = document.querySelector('.user-profile');
    const profileMenu = document.createElement('div');
    profileMenu.classList.add('profile-menu');
    profileMenu.innerHTML = `
      <div class="profile-header">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User">
        <div>
          <h4>Sarah Johnson</h4>
          <p>Computer Science Major</p>
        </div>
      </div>
      <div class="profile-links">
        <a href="#"><i class="fas fa-user"></i> My Profile</a>
        <a href="#"><i class="fas fa-cog"></i> Settings</a>
        <a href="#"><i class="fas fa-question-circle"></i> Help</a>
        <a href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>
      </div>
    `;
    
    document.body.appendChild(profileMenu);
    
    userProfile.addEventListener('click', function(e) {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
      notificationPanel.classList.remove('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileMenu.contains(e.target) {
        profileMenu.classList.remove('active');
      }
    });
  
    // ============== ANIMATION HELPERS ==============
    // Scroll animations
    function animateOnScroll() {
      const elements = document.querySelectorAll('[data-animate]');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.classList.add('animated');
        }
      });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Ripple effect
    document.addEventListener('click', function(e) {
      if (e.target.closest('.btn')) {
        const btn = e.target.closest('.btn');
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - (btn.getBoundingClientRect().left + radius)}px`;
        ripple.style.top = `${e.clientY - (btn.getBoundingClientRect().top + radius)}px`;
        
        btn.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 800);
      }
    });
  
    // ============== THEME TOGGLER ==============
    const themeToggler = document.createElement('div');
    themeToggler.classList.add('theme-toggler');
    themeToggler.innerHTML = '<i class="fas fa-moon"></i>';
    sidebar.appendChild(themeToggler);
    
    themeToggler.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      this.innerHTML = document.body.classList.contains('dark-theme') ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  });