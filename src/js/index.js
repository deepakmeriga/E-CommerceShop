// Cart functionality
let cart = [];
let cartTotal = 0;

// Initialize cart from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCounter();
    }
});

// Open cart sidebar
function openCart() {
    document.getElementById('cartSidebar').classList.remove('translate-x-full');
    document.getElementById('cartOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
    document.getElementById('cartSidebar').classList.add('translate-x-full');
    document.getElementById('cartOverlay').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Add item to cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCounter();
    saveCartToStorage();
    
    // Show success message
    showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCounter();
    saveCartToStorage();
}

// Update item quantity
function updateQuantity(index, change) {
    const item = cart[index];
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
        updateCartCounter();
        saveCartToStorage();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div id="emptyCart" class="text-center py-8">
                <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Your cart is empty</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }
    
    // Remove empty cart message
    if (emptyCart) {
        emptyCart.remove();
    }
    
    let cartHTML = '';
    cartTotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        cartHTML += `
            <div class="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-sky-600 font-bold">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQuantity(${index}, -1)" class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-800">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 mt-1">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    document.getElementById('cartTotal').textContent = `$${cartTotal.toFixed(2)}`;
}

// Update cart counter
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cartCounter');
    counter.textContent = totalItems;
    
    if (totalItems > 0) {
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Here you would typically redirect to a checkout page
    // For now, we'll just show a success message
    showNotification('Proceeding to checkout...', 'success');
    
    // Clear cart after checkout
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
        updateCartCounter();
        saveCartToStorage();
        closeCart();
    }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(-${index * 100}%)`;
    });

    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.remove('opacity-50');
            indicator.classList.add('opacity-100');
        } else {
            indicator.classList.add('opacity-50');
            indicator.classList.remove('opacity-100');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.remove('hidden');
    } else {
        scrollBtn.classList.add('hidden');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    
    // Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                    behavior: 'smooth'
            });
        }
    });
});
});
