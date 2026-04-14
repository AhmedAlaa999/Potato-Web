// SPUDZ store js - yea its kinda messy but it works

// products data - should prob be in a db but whatever
const products = [
    {
        id: 1,
        name: "premium russet potato",
        price: 3,
        category: "russet",
        emoji: "🥔",
        sizes: ["small", "medium", "thicc"],
        tag: "popular"
    },
    {
        id: 2,
        name: "golden potato (limited)",
        price: 8,
        category: "gold",
        emoji: "✨🥔",
        sizes: ["medium", "thicc", "CHONK"],
        tag: "limited"
    },
    {
        id: 3,
        name: "organic potato (garry approved)",
        price: 5,
        category: "russet",
        emoji: "🥔🌱",
        sizes: ["small", "medium", "large"],
        tag: "new"
    },
    {
        id: 4,
        name: "fingerling potato (fancy)",
        price: 7,
        category: "fancy",
        emoji: "🥔",
        sizes: ["bunch", "bigger bunch"],
        tag: "fancy"
    },
    {
        id: 5,
        name: "the MEGA potato",
        price: 15,
        category: "fancy",
        emoji: "🥔🥔🥔",
        sizes: ["MEGA", "ULTRA MEGA"],
        tag: "rare"
    },
    {
        id: 6,
        name: "potato in a can (spam style)",
        price: 4,
        category: "acc",
        emoji: "🥫",
        sizes: ["one can"],
        tag: null
    },
    {
        id: 7,
        name: "purple potato (wtf)",
        price: 9,
        category: "fancy",
        emoji: "💜🥔",
        sizes: ["medium", "large"],
        tag: "exotic"
    },
    {
        id: 8,
        name: "yukon gold potato",
        price: 4,
        category: "gold",
        emoji: "🥔",
        sizes: ["small", "medium", "large", "thicc"],
        tag: null
    },
    {
        id: 9,
        name: "sweet potato (its still a potato)",
        price: 5,
        category: "fancy",
        emoji: "🍠",
        sizes: ["medium", "large"],
        tag: "controversial"
    },
    {
        id: 10,
        name: "potato tote bag",
        price: 12,
        category: "acc",
        emoji: "🛍️",
        sizes: ["one size"],
        tag: "merch"
    },
    {
        id: 11,
        name: "red potato (spicy not rly)",
        price: 6,
        category: "fancy",
        emoji: "🔴🥔",
        sizes: ["small", "medium"],
        tag: null
    },
    {
        id: 12,
        name: "potato mystery box",
        price: 20,
        category: "acc",
        emoji: "📦",
        sizes: ["mystery"],
        tag: "mystery"
    }
];

// cart stuff - stored in localstorage so it persists
let cart = JSON.parse(localStorage.getItem('spudz-cart')) || [];

// dom ready
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});

// render products to grid
function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // not on product page

    // filter products
    let filtered = products;
    if (filter !== 'all') {
        if (filter === 'acc') {
            filtered = products.filter(p => p.category === 'acc');
        } else {
            filtered = products.filter(p => p.category === filter);
        }
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img">
                <span class="placeholder">${product.emoji}</span>
                ${product.tag ? `<span class="tag">${product.tag}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <div class="product-sizes">
                    ${product.sizes.map(size => `
                        <button class="size-btn" data-size="${size}">${size}</button>
                    `).join('')}
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">add to cart</button>
            </div>
        </div>
    `).join('');

    // add click handlers for size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // remove selected from siblings
            const parent = e.target.parentElement;
            parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
}

// filter products
function filterProducts(category) {
    // update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent === 'all')) {
            btn.classList.add('active');
        }
    });

    renderProducts(category);
}

// add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // get selected size
    const card = document.querySelector(`[data-id="${productId}"]`);
    const selectedSize = card.querySelector('.size-btn.selected');

    if (!selectedSize) {
        showNotification('pick a size first lol (even potatos have sizes now)');
        return;
    }

    const size = selectedSize.dataset.size;

    // check if already in cart with same size
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            size: size,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    // random funny message
    const randomMsg = potatoMessages[Math.floor(Math.random() * potatoMessages.length)];
    showNotification(randomMsg);
}

// save cart to localstorage
function saveCart() {
    localStorage.setItem('spudz-cart', JSON.stringify(cart));
}

// update cart count in header
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = totalItems;
    }
}

// show notification
function showNotification(message) {
    // remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// human messages for adding potatos
const potatoMessages = [
    "nice choice! potato acquired",
    "added to ur potato stash",
    "potato secured 🥔",
    "garry approves this potato",
    "mash potential: 100%",
    "that potato is now urs"
];

// scroll to shop section
function scrollToShop() {
    const shop = document.getElementById('shop');
    if (shop) {
        shop.scrollIntoView({ behavior: 'smooth' });
    }
}

// subscribe to newsletter
function subscribe(e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value;

    if (!email || !email.includes('@')) {
        showNotification('enter a valid email pls (garry needs it for the potato newsletter)');
        return;
    }

    // would normally send to backend but whatever
    showNotification('ur subscribed! garry will send u potato updates');
    document.getElementById('email-input').value = '';
}

// ============================================
// CART PAGE FUNCTIONS
// ============================================

// render cart page
function renderCart() {
    const container = document.querySelector('.cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><p>ur cart is empty :/<br>go buy some potatos u potato</p></div>';
        updateCartTotal();
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-img">${item.emoji}</div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>size: ${item.size} • qty: ${item.quantity}</p>
            </div>
            <span class="cart-item-price">$${item.price * item.quantity}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">remove</button>
        </div>
    `).join('');

    updateCartTotal();
}

// remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

// update cart total
function updateCartTotal() {
    const totalEl = document.querySelector('.cart-total span');
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalEl.textContent = `$${total}`;
    }
}

// checkout (placeholder)
function checkout() {
    if (cart.length === 0) {
        showNotification('add some potatos first my guy');
        return;
    }

    showNotification('checkout coming soon... just email garry@potato.spud');
}

// init cart page if we're on it
if (document.querySelector('.cart-container')) {
    renderCart();
}