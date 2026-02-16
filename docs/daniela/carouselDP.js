// Carousel functionality for About page (indexDP.html)
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const totalCards = cards.length;
  let currentIndex = 1; // Start at Symantec (index 1)
  let isAnimating = false;

  function changeCard(newIndex, direction) {
    if (isAnimating) return;
    if (newIndex === currentIndex) return;
    
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const newCard = cards[newIndex];

    // Add exiting class to current card
    if (direction === 'next') {
      currentCard.classList.add('exiting-left');
    } else {
      currentCard.classList.add('exiting-right');
    }

    // Prepare new card for entrance
    if (direction === 'next') {
      newCard.classList.add('entering-right');
    } else {
      newCard.classList.add('entering-left');
    }

    // Start transition
    setTimeout(() => {
      // Remove active from current
      currentCard.classList.remove('active');
      
      // Add active to new
      newCard.classList.add('active');
      
      // Remove entering classes to trigger transition
      newCard.classList.remove('entering-left', 'entering-right');

      // Update index
      currentIndex = newIndex;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Clean up after transition
      setTimeout(() => {
        currentCard.classList.remove('exiting-left', 'exiting-right');
        isAnimating = false;
      }, 500);
    }, 50);
  }

  function nextCard() {
    const newIndex = (currentIndex + 1) % totalCards; // Loop: 0->1->2->0
    changeCard(newIndex, 'next');
  }

  function prevCard() {
    const newIndex = (currentIndex - 1 + totalCards) % totalCards; // Loop: 2->1->0->2
    changeCard(newIndex, 'prev');
  }

  // Arrow button clicks
  if (prevBtn) prevBtn.addEventListener('click', prevCard);
  if (nextBtn) nextBtn.addEventListener('click', nextCard);

  // Dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index === currentIndex || isAnimating) return;
      const direction = index > currentIndex ? 'next' : 'prev';
      changeCard(index, direction);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    if (e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'ArrowRight') {
      nextCard();
    }
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  cards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    card.addEventListener('touchend', (e) => {
      if (!isDragging || isAnimating) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextCard();
        } else {
          prevCard();
        }
      }
    });
  });

  // Initialize - show Symantec (index 1)
  cards[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active');
});
