// Cina Games Store JavaScript
class CinaStore {
  constructor() {
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initSearch();
    this.initFilters();
    this.initAnimations();
  }

  initMobileMenu() {
    const menuBtn = document.querySelector('.store-mobile-menu-btn');
    const navLinks = document.querySelector('.store-nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  }

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

  initFilters() {
    const filterInputs = document.querySelectorAll('.store-filter-option input');
    filterInputs.forEach(input => {
      input.addEventListener('change', () => this.applyFilters());
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

  sortGames(criteria) {
    const grid = document.querySelector('.store-games-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.store-game-card'));
    cards.sort((a, b) => {
      switch(criteria) {
        case 'rating':
          return (parseFloat(b.dataset.rating) || 0) - (parseFloat(a.dataset.rating) || 0);
        case 'downloads':
          return (parseInt(b.dataset.downloads) || 0) - (parseInt(a.dataset.downloads) || 0);
        case 'size':
          return this.parseSize(a.dataset.size) - this.parseSize(b.dataset.size);
        case 'newest':
        default:
          return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.cinaStore = new CinaStore();
});
