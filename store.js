// Cina Games Store JavaScript
// Shared functionality for all store pages

class CinaStore {
  constructor() {
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initSearch();
    this.initFilters();
    this.initLazyLoading();
    this.initAnimations();
  }

  // Mobile menu toggle
  initMobileMenu() {
    const menuBtn = document.querySelector('.store-mobile-menu-btn');
    const navLinks = document.querySelector('.store-nav-links');
    
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }

  // Search functionality
  initSearch() {
    const searchInput = document.querySelector('.store-search input');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(query) {
    if (!query || query.length < 2) {
      document.querySelectorAll('.store-game-card').forEach(card => {
        card.style.display = '';
      });
      return;
    }

    const cards = document.querySelectorAll('.store-game-card');
    const lowerQuery = query.toLowerCase();

    cards.forEach(card => {
      const title = card.querySelector('.store-game-title')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.store-game-tag')).map(t => t.textContent.toLowerCase()).join(' ');
      
      if (title.includes(lowerQuery) || tags.includes(lowerQuery)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Filter functionality
  initFilters() {
    const filterInputs = document.querySelectorAll('.store-filter-option input');
    
    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const checkedFilters = Array.from(document.querySelectorAll('.store-filter-option input:checked'))
     .map(input => input.value);

    if (checkedFilters.length === 0) {
      document.querySelectorAll('.store-game-card').forEach(card => {
        card.style.display = '';
      });
      return;
    }

    document.querySelectorAll('.store-game-card').forEach(card => {
      const cardClasses = card.className;
      const hasMatch = checkedFilters.some(filter => cardClasses.includes(filter));
      card.style.display = hasMatch ? '' : 'none';
    });
  }

  // Lazy loading for images
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      images.forEach(img => imageObserver.observe(img));
    } else {
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Scroll animations
  initAnimations() {
    const animatedElements = document.querySelectorAll('.store-animate');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
      });
    }
  }

  // Sort games
  sortGames(criteria) {
    const grid = document.querySelector('.store-games-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.store-game-card'));
    
    cards.sort((a, b) => {
      switch(criteria) {
        case 'rating':
          const ratingA = parseFloat(a.dataset.rating) || 0;
          const ratingB = parseFloat(b.dataset.rating) || 0;
          return ratingB - ratingA;
        
        case 'downloads':
          const downloadsA = parseInt(a.dataset.downloads) || 0;
          const downloadsB = parseInt(b.dataset.downloads) || 0;
          return downloadsB - downloadsA;
        
        case 'size':
          const sizeA = this.parseSize(a.dataset.size);
          const sizeB = this.parseSize(b.dataset.size);
          return sizeA - sizeB;
        
        case 'newest':
        default:
          const dateA = new Date(a.dataset.date || 0);
          const dateB = new Date(b.dataset.date || 0);
          return dateB - dateA;
      }
    });

    cards.forEach(card => grid.appendChild(card));
  }

  parseSize(sizeStr) {
    if (!sizeStr) return 0;
    const num = parseFloat(sizeStr);
    if (sizeStr.includes('گیگ')) return num * 1024;
    if (sizeStr.includes('مگ')) return num;
    return num;
  }

  // Category filter
  filterByCategory(category) {
    document.querySelectorAll('.store-game-card').forEach(card => {
      if (category === 'all' || card.classList.contains(category)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// Initialize store on page load
document.addEventListener('DOMContentLoaded', () => {
  window.cinaStore = new CinaStore();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CinaStore;
}
