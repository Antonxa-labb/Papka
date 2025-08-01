
let swiper = null;
let isMobileView = false;

function initSlider() {
  const container = document.querySelector('.swiper-container');
  const list = document.querySelector('.brands_list');
  const toggleButton = document.querySelector('.brands_toggle');

  
  if (window.innerWidth < 768 && !isMobileView) {
    
    list.classList.add('swiper-wrapper');

   
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    
    swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      observer: true,
      observeParents: true,
      watchOverflow: true
    });

    isMobileView = true;

    
    if (toggleButton) {
      toggleButton.style.display = 'none';
    }
  }
 
  else if (window.innerWidth >= 768 && isMobileView) {
    
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    
    list.classList.remove('swiper-wrapper');

   
    list.removeAttribute('style');
    list.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.removeAttribute('style');
    });

    isMobileView = false;

    
    if (toggleButton) {
      toggleButton.style.display = 'block';
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  initSlider();

 
  const toggleButton = document.querySelector('.brands_toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const brandsList = document.querySelector('.brands_list');
      if (brandsList) {
        brandsList.classList.toggle('expanded');
        toggleButton.textContent = brandsList.classList.contains('expanded')
          ? 'Скрыть'
          : 'Показать все';

        
        if (swiper) {
          swiper.update();
        }
      }
    });
  }

  
  window.addEventListener('resize', () => {
 
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(initSlider, 200);
  });
});








