const productsData = [
  { id: 1, name: "Butterfly Bookmark", price: 3700 },
  { id: 2, name: "Wooden Page Holder", price: 4850 },
  { id: 3, name: "Heart Bookmark", price: 3800 },
  { id: 4, name: "Kindle Paperwhite", price: 220800 },
  { id: 5, name: "Post it random color", price: 20470 },
  { id: 6, name: "Rechargeable Reading Light", price: 15200 },
  { id: 7, name: "Book Stand", price: 28900 },
  { id: 8, name: "Magnetic Bookmark", price: 3200 },
  { id: 9, name: "Reading Journal & Planner", price: 18500 },
  { id: 10, name: "Anotation kit personalizate", price: 11200 },
  { id: 11, name: "harry potter notebook", price: 12500 },
  { id: 12, name: "Hogwarts Bookmark", price: 3800 },
  { id: 13, name: "Camp Half-Blood bookmark", price: 22000 },
  { id: 14, name: "Camp Half-Blood bag", price: 7500 },
  { id: 15, name: "Golden Mockingjay Pin", price: 6500 },
  { id: 16, name: "THG Trilogy bookmark", price: 14000 },
  { id: 17, name: "'Night Court' Scented Candle", price: 11500 },
  { id: 18, name: "'Velaris' Kindle Case", price: 21500 },
  { id: 19, name: "'Johnny & Shannon' Bookmark", price: 3800 },
  { id: 20, name: "Tommen College Mug", price: 11800 }
];

let cart = [];


const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const navCatBtns = document.querySelectorAll('.nav-cat-btn');
const categoryDesc = document.getElementById('current-category-description');

const cartModal = document.getElementById('cart-modal');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

const startCheckoutBtn = document.getElementById('start-checkout-btn');
const cartBody = document.getElementById('cart-body');
const checkoutFormContainer = document.getElementById('checkout-form-container');
const backToCartBtn = document.getElementById('back-to-cart-btn');
const fakeCheckoutForm = document.getElementById('fake-checkout-form');

menuToggleBtn.addEventListener('click', openSidebar);
sidebarCloseBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
}

// Filter HTML Cards
function filterCategory(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}


navCatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navCatBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const category = btn.getAttribute('data-category');
    categoryDesc.textContent = `Collection: ${btn.textContent}`;
    
    filterCategory(category);
    closeSidebar();
  });
});


cartToggleBtn.addEventListener('click', () => cartModal.classList.add('active'));
cartCloseBtn.addEventListener('click', () => {
  cartModal.classList.remove('active');
  resetCheckoutView();
})
function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function changeQuantity(productId, delta) {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;

  cartItemsList.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li style="text-align:center; padding: 1rem; color: #888;">Your cart is empty 📖</li>';
  } else {
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="item-info">
          <span class="item-title">${item.name}</span>
          <span class="item-price">$${item.price.toLocaleString('en-US')} each</span>
        </div>
        <div class="item-controls">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      `;
      cartItemsList.appendChild(li);
    });
  }

  cartTotal.textContent = total.toLocaleString('en-US');
}

// Checkout Form
startCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty ✨");
    return;
  }
  cartBody.classList.add('hidden');
  checkoutFormContainer.classList.remove('hidden');
});

backToCartBtn.addEventListener('click', resetCheckoutView);

function resetCheckoutView() {
  cartBody.classList.remove('hidden');
  checkoutFormContainer.classList.add('hidden');
}

fakeCheckoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('buyer-name').value;
  alert(`🎉 Thank you for your order, ${name}!\n\nYour order has been placed successfully with Chapter & Charm ✨`);
  
  cart = [];
  updateCartUI();
  resetCheckoutView();
  cartModal.classList.remove('active');
  fakeCheckoutForm.reset();
});