document.addEventListener('DOMContentLoaded', function() {
    // Slider elements
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationContainer = document.querySelector('.slider-pagination');
    
    // Update monument descriptions with new content
    updateMonumentDescriptions();
    
    // Remove emojis from monument titles
    const monumentTitles = document.querySelectorAll('.monument-info h2');
    monumentTitles.forEach(title => {
        title.textContent = title.textContent.replace(/[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/gu, '').trim();
    });
    
    // Function to update monument descriptions
    function updateMonumentDescriptions() {
        const newDescriptions = {
            "Mosquée Hassan II": "La Mosquée Hassan II est l'une des plus grandes mosquées du monde. Son minaret mesure 210 mètres de haut. Une partie de la mosquée est construite au-dessus de la mer.",
            "La médina de Fès": "La médina de Fès est un quartier historique avec des rues étroites et animées. On y trouve des marchés (souks) et l'Université Al Quaraouiyine, l'une des plus anciennes universités qui existe toujours.",
            "Le ksar d'Aït Ben Haddou": "Le ksar d'Aït Ben Haddou est un ancien village fortifié construit en terre. Ce site est classé au patrimoine mondial de l'UNESCO. Il est célèbre pour son architecture unique et a été utilisé dans des productions cinématographiques célèbres.",
            "La Kasbah des Oudayas": "La Kasbah des Oudayas est une ancienne forteresse située au bord de la mer à Rabat. Les maisons sont peintes en blanc et bleu, et la vue sur l'océan est magnifique.",
            "Volubilis": "Volubilis est un site archéologique avec les ruines d'une ancienne ville romaine. On y trouve des colonnes, des arches et des mosaïques bien conservées.",
            "La médina de Marrakech": "La médina de Marrakech est le centre historique de la ville. La place Jemaa el-Fna est un lieu animé avec des spectacles, des marchands et des artistes. On y trouve aussi la mosquée Koutoubia et le Palais de la Bahia.",
            "La médersa Ben Youssef": "La médersa Ben Youssef était une école religieuse à Marrakech. Elle est célèbre pour sa belle architecture, avec des mosaïques et du bois sculpté.",
            "La ville bleue de Chefchaouen": "Chefchaouen est une ville située dans les montagnes. Ses maisons sont peintes en bleu, ce qui lui donne une atmosphère calme et unique."
        };
        
        const monumentCards = document.querySelectorAll('.monument-card');
        monumentCards.forEach(card => {
            const titleElement = card.querySelector('h2');
            if (titleElement) {
                const title = titleElement.textContent.replace(/🕌|🏘|🏯|🏰|🏛|🌇|📚|🏡/g, '').trim();
                const descriptionElement = card.querySelector('.monument-description p');
                
                if (descriptionElement && newDescriptions[title]) {
                    descriptionElement.textContent = newDescriptions[title];
                }
            }
        });
    }
    
    // Remove "Je fais seulement apply" button if it exists
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
        applyBtn.parentElement.removeChild(applyBtn);
    }
    
    // Remove secondary paragraphs from monument descriptions
    const monumentDescriptions = document.querySelectorAll('.monument-description');
    monumentDescriptions.forEach(description => {
        const paragraphs = description.querySelectorAll('p');
        if (paragraphs.length > 1) {
            // Keep only the first paragraph, remove the rest
            for (let i = 1; i < paragraphs.length; i++) {
                paragraphs[i].remove();
            }
        }
    });
    
    // Enhance monument cards with additional styling and animations
    const monumentCards = document.querySelectorAll('.monument-card');
    monumentCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
        
        // Add transition for smooth animation
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
    
    // Variables
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Initialize slider
    function initSlider() {
        // Set initial position
        updateSliderPosition();
        
        // Create pagination dots
        createPaginationDots();
        
        // Add event listeners
        prevBtn.addEventListener('click', goToPrevSlide);
        nextBtn.addEventListener('click', goToNextSlide);
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyNavigation);
        
        // Add touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                goToNextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                goToPrevSlide();
            }
        }
        
        // Add smooth scrolling to navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if(this.getAttribute('href').length > 1) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Create pagination dots
    function createPaginationDots() {
        paginationContainer.innerHTML = ''; // Clear existing dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', function() {
                goToSlide(i);
            });
            paginationContainer.appendChild(dot);
        }
    }
    
    // Update slider position
    function updateSliderPosition() {
        // Add smooth transition
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active pagination dot
        const dots = document.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Highlight current slide
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active-slide');
                // Animate the content of the active slide
                const card = slide.querySelector('.monument-card');
                if (card) {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }
            } else {
                slide.classList.remove('active-slide');
            }
        });
    }
    
    // Go to previous slide
    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSliderPosition();
    }
    
    // Go to next slide
    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSliderPosition();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSliderPosition();
    }
    
    // Handle keyboard navigation
    function handleKeyNavigation(e) {
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
        }
    }
    
    // Auto slide functionality
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause auto slide on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Add lazy loading for images
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Initialize the slider
    initSlider();
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Recalculate slider dimensions
        updateSliderPosition();
    });
});