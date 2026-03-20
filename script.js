// Make functions global by attaching to window
window.currentChapter = 1;

// Function to show a specific chapter
window.showChapter = function(num) {
    // Hide all chapters
    for (let i = 1; i <= 10; i++) {
        let chapter = document.getElementById('chapter' + i);
        if (chapter) chapter.style.display = 'none';
    }
    
    // Show selected chapter
    let selectedChapter = document.getElementById('chapter' + num);
    if (selectedChapter) selectedChapter.style.display = 'block';
    
    // Update active class in TOC - WORKS WITH YOUR BUTTON ORDER
    document.querySelectorAll('.chapter-link').forEach((btn) => {
        // Extract chapter number from the onclick attribute
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`showChapter(${num})`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update chapter number and buttons
    window.currentChapter = num;
    let indicator = document.getElementById('chapterIndicator');
    if (indicator) indicator.textContent = num + ' / 10';
    
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = (num === 1);
    if (nextBtn) nextBtn.disabled = (num === 10);
    
    // Save to browser
    localStorage.setItem('currentChapter', num);
};

// Function to change chapter by direction
window.changeChapter = function(direction) {
    let newChapter = window.currentChapter + direction;
    if (newChapter >= 1 && newChapter <= 10) {
        window.showChapter(newChapter);
    }
};

// Function to update dark/light mode
function updateDarkMode(isDark) {
    if (isDark) {
        // Dark mode - set on html element
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        
        // Set background on html (this tints the browser bars)
        document.documentElement.style.backgroundColor = '#0a0e1a';
        document.documentElement.style.backgroundImage = "url('assets/darkmodeland.jpg')";
        
        // Body stays transparent
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'transparent';
        
        // Update theme-color meta tag for Safari
        updateThemeColor('#0a0e1a');
    } else {
        // Light mode - set on html element
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        
        // Set background on html (this tints the browser bars)
        document.documentElement.style.backgroundColor = '#e0e6f0';
        document.documentElement.style.backgroundImage = "url('assets/lightmodetree.jpg')";
        
        // Body stays transparent
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'transparent';
        
        // Update theme-color meta tag for Safari
        updateThemeColor('#e0e6f0');
    }
    
    // Ensure background properties are set on html
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.backgroundPosition = 'center';
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    
    // Handle attachment based on browser
    const isEdge = /edge\//i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isEdge || isIOS) {
        document.documentElement.style.backgroundAttachment = 'scroll';
    } else {
        document.documentElement.style.backgroundAttachment = window.innerWidth > 600 ? 'fixed' : 'scroll';
    }
}

// Function to update theme color
function updateThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name=theme-color]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = color;
}

// iOS Safari bottom bar fix - PROVEN WORKING
function fixSafariBottomBar() {
    // Check if Safari on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Get the actual visible viewport height
        const visibleHeight = window.innerHeight;
        
        // Apply to body and html
        document.body.style.minHeight = visibleHeight + 'px';
        document.documentElement.style.minHeight = visibleHeight + 'px';
        
        // Fix for jumpToTop button
        const jumpBtn = document.getElementById('jumpToTop');
        if (jumpBtn && !jumpBtn.classList.contains('hidden')) {
            // Ensure button is above bottom bar
            jumpBtn.style.bottom = `max(30px, ${window.visualViewport ? window.visualViewport.height - window.innerHeight + 30 : 30}px)`;
        }
        
        // Add extra padding to chapter-nav on iOS
        const chapterNav = document.querySelector('.chapter-nav');
        if (chapterNav) {
            const bottomBarHeight = window.visualViewport ? 
                window.visualViewport.height - window.innerHeight : 0;
            chapterNav.style.paddingBottom = `calc(2rem + ${bottomBarHeight}px)`;
        }
    }
}

// iOS viewport height fix - SIMPLIFIED AND PROVEN
function setVh() {
    // For iOS specifically, ensure body takes full height
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const height = window.innerHeight;
        document.body.style.minHeight = height + 'px';
        document.documentElement.style.height = height + 'px';
        
        // Additional fix for bottom bar
        fixSafariBottomBar();
    }
}

// Call setVh on various events
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

// Use visualViewport API if available (more accurate for Safari)
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function() {
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            fixSafariBottomBar();
        }
    });
}

// Wait for page to load before setting up
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DARK MODE DIAGNOSIS ===');
    
    // Dark mode toggle
    let darkModeBtn = document.getElementById('darkmode-toggle');
    if (darkModeBtn) {
        console.log('Dark mode button found');
        
        darkModeBtn.addEventListener('click', function() {
            console.log('=== BUTTON CLICKED ===');
            
            // Check if dark class exists on html (meaning we're in dark mode)
            const isDark = document.documentElement.classList.contains('dark');
            
            // Update mode - if dark class exists, go to light; if not, go to dark
            updateDarkMode(!isDark);
            
            console.log('After toggle - Dark class?', document.documentElement.classList.contains('dark'));
            
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            console.log('Local storage saved as:', localStorage.getItem('darkMode'));
        });
    } else {
        console.log('ERROR: Dark mode button NOT found!');
    }

    // Load dark mode preference - DEFAULT TO DARK MODE
    console.log('Loading saved preference...');
    console.log('Local storage value:', localStorage.getItem('darkMode'));

    // Check if there's a saved preference
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'light') {
        // User previously chose light mode
        updateDarkMode(false);
        console.log('Setting to light mode based on storage');
    } else {
        // Default to dark mode (includes first-time visitors and those with 'dark' saved)
        updateDarkMode(true);
        // If first time, save the default
        if (!savedMode) {
            localStorage.setItem('darkMode', 'dark');
        }
        console.log('Setting to dark mode');
    }
    
    console.log('HTML has dark class?', document.documentElement.classList.contains('dark'));
    console.log('=== END DIAGNOSIS ===\n');

    // Load last chapter
    const savedChapter = localStorage.getItem('currentChapter');
    if (savedChapter) {
        window.showChapter(parseInt(savedChapter));
    } else {
        window.showChapter(1);
    }

    // JUMP TO TOP - PROVEN IOS FIX
    const jumpBtn = document.getElementById('jumpToTop');
    const tocContainer = document.querySelector('.toc-container');
    let lastScrollY = window.scrollY;
    let ticking = false;

    if (jumpBtn) {
        function checkScroll() {
            // Use scrollingElement for better mobile compatibility
            const scrollTop = document.scrollingElement ? document.scrollingElement.scrollTop : window.scrollY;
            
            if (tocContainer) {
                const tocRect = tocContainer.getBoundingClientRect();
                
                // Use a more generous threshold for iOS
                const isPastTOC = tocRect.bottom < 100;
                const hasScrolledSignificantly = scrollTop > 150;
                
                if (isPastTOC || hasScrolledSignificantly) {
                    jumpBtn.classList.remove('hidden');
                } else {
                    jumpBtn.classList.add('hidden');
                }
            } else {
                if (scrollTop > 150) {
                    jumpBtn.classList.remove('hidden');
                } else {
                    jumpBtn.classList.add('hidden');
                }
            }
            ticking = false;
        }
        
        // Multiple event listeners for iOS
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(checkScroll);
                ticking = true;
            }
        });
        
        window.addEventListener('touchend', checkScroll);
        window.addEventListener('resize', checkScroll);
        
        // Periodic check for iOS
        setInterval(checkScroll, 200);
        
        // Initial check with delay to ensure DOM is ready
        setTimeout(checkScroll, 100);
        checkScroll();
        
        // CLICK HANDLER - Let anchor do its job
        jumpBtn.addEventListener('click', function(e) {
            // Hide button
            jumpBtn.classList.add('hidden');
            return true; // Allow default behavior
        });
        
        // TOUCH HANDLER - passive for iOS performance
        jumpBtn.addEventListener('touchstart', function(e) {
            // Hide button
            jumpBtn.classList.add('hidden');
            return true; // Allow default behavior
        }, { passive: true });
    }
    
    // Apply Safari bottom bar fix after load
    setTimeout(fixSafariBottomBar, 300);
});

// Run fix again after full page load
window.addEventListener('load', function() {
    fixSafariBottomBar();
    setVh();
});