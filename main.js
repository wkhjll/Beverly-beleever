/**
 * BEVERLee BELEEVER - Standalone Modern JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('open');
      }
    });

    // Close on navigation link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('open');
      });
    });
  }

  // 2. Hero Slider System
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentIndex = 0;
    let slideInterval;
    const autoPlayDelay = 5000;

    // Create dot indicators if container exists
    if (dotsContainer && slides.length > 0) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Слайд ${idx + 1}`);
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const showSlide = (index) => {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
      });
      currentIndex = index;
      updateDots();
    };

    const nextSlide = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    const goToSlide = (index) => {
      showSlide(index);
      resetAutoPlay();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    const startAutoPlay = () => {
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    };

    const stopAutoPlay = () => {
      clearInterval(slideInterval);
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) {
        nextSlide();
      } else if (endX - startX > 50) {
        prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // 4. Certificate Lightbox Modal
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalCaption = document.getElementById('certModalCaption');
  const certModalClose = document.getElementById('certModalClose');

  if (certModal && certModalImg) {
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const fullImgSrc = card.getAttribute('data-full-img') || card.querySelector('img').src;
        const caption = card.getAttribute('data-caption') || card.querySelector('.cert-title')?.textContent || '';
        
        certModalImg.src = fullImgSrc;
        if (certModalCaption) certModalCaption.textContent = caption;
        certModal.classList.add('open');
      });
    });

    const closeCertModal = () => {
      certModal.classList.remove('open');
    };

    if (certModalClose) {
      certModalClose.addEventListener('click', closeCertModal);
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        closeCertModal();
      }
    });
  }

  // 5. Catalog Category Tabs (on catalog / product pages)
  const tabButtons = document.querySelectorAll('.catalog-tab');
  const productCards = document.querySelectorAll('.product-card');

  if (tabButtons.length > 0 && productCards.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category || cardCat?.includes(category)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

/**
 * Helper to open WhatsApp with custom text
 * @param {string} productName 
 */
function orderInWhatsApp(productName = '') {
  const phone = '+77074747989'; // Official contact phone
  let message = 'Здравствуйте! Хочу сделать заказ в интернет-магазине BEVERLEE BELEEVER.';
  if (productName) {
    message = `Здравствуйте! Меня интересует комплекс "${productName}". Подскажите, пожалуйста, наличие, стоимость и как оформить доставку?`;
  }
  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
}

