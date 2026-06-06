// js/app.js

// Global State Management Engine initialization via persistent LocalStorage parsing
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];

// Runs automatically upon page mount completion checks across active paths
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Mutate global data properties securely via runtime events mapping
function addToCart(id, quantity = 1) {
    const targetProduct = products.find(p => p.id === parseInt(id));
    if (!targetProduct) return;

    const cartItem = cart.find(item => item.id === parseInt(id));
    
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ ...targetProduct, quantity: quantity });
    }

    syncCart();
    showToast(`Added ${targetProduct.name} to cart.`);
    
    // Auto slide open the drawer panel to instantly confirm actions visually
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function updateQuantity(id, delta) {
    const cartItem = cart.find(item => item.id === parseInt(id));
    if (!cartItem) return;

    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== parseInt(id));
    }

    syncCart();
}

function syncCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
    updateCartUI();
}

// Visual State Syncing Pipeline Controller
function updateCartUI() {
    const countBadge = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const subtotalLabel = document.getElementById('cart-subtotal');
    const totalLabel = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (countBadge) countBadge.innerText = totalItems;

    // Safety check: Exit execution silently if layout templates don't feature a side-drawer container element
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center py-16 text-slate-400">
                <i class="fa-solid fa-basket-shopping text-3xl mb-2 block"></i>
                Your cart is currently empty.
            </div>`;
        if (subtotalLabel) subtotalLabel.innerText = '$0.00';
        if (totalLabel) totalLabel.innerText = '$0.00';
        return;
    }

    itemsContainer.innerHTML = '';
    let cumulativePrice = 0;

    cart.forEach(item => {
        const itemCost = item.price * item.quantity;
        cumulativePrice += itemCost;

        itemsContainer.innerHTML += `
            <div class="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800">${item.name}</h4>
                        <p class="text-slate-400 mt-0.5">$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center bg-white border border-slate-200 rounded-md">
                        <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-0.5 text-slate-500 hover:bg-slate-50 font-bold">-</button>
                        <span class="px-1 text-slate-700 font-semibold select-none">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-0.5 text-slate-500 hover:bg-slate-50 font-bold">+</button>
                    </div>
                    <span class="font-extrabold text-slate-900 w-14 text-right">$${itemCost.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    if (subtotalLabel) subtotalLabel.innerText = `$${cumulativePrice.toFixed(2)}`;
    if (totalLabel) totalLabel.innerText = `$${cumulativePrice.toFixed(2)}`;
}

// General Interface Toggle Handlers
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if(drawer && overlay) {
        drawer.classList.toggle('translate-x-full');
        overlay.classList.toggle('opacity-40');
        overlay.classList.toggle('pointer-events-none');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 2500);
}
