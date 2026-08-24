/* =========================================================
   CHILLSPOT - JAVASCRIPT
   Menu + product UI + cart + checkout + local storage
   ========================================================= */

const products = [
  // PIZZA
  { id:"classic-cheese", name:"Classic Cheese Pizza", category:"pizza", price:249, emoji:"🍕", description:"Classic tomato sauce with lots of melted mozzarella cheese." },
  { id:"pepperoni", name:"Pepperoni Pizza", category:"pizza", price:299, emoji:"🍕", description:"Loaded with pepperoni, mozzarella cheese, and our signature sauce." },
  { id:"hawaiian", name:"Hawaiian Pizza", category:"pizza", price:299, emoji:"🍕", description:"Sweet pineapple and savory ham on a cheesy pizza." },
  { id:"bacon-cheese", name:"Bacon Cheese Pizza", category:"pizza", price:329, emoji:"🍕", description:"Crispy bacon, mozzarella cheese, and a rich tomato sauce." },
  { id:"meat-lovers", name:"Meat Lovers", category:"pizza", price:359, emoji:"🍕", description:"Pepperoni, ham, bacon, and sausage on a loaded pizza." },
  { id:"veggie", name:"Veggie Pizza", category:"pizza", price:279, emoji:"🍕", description:"Fresh vegetables, mushrooms, cheese, and tomato sauce." },

  // BURGERS
  { id:"chill-burger", name:"Chill Burger", category:"burgers", price:179, emoji:"🍔", description:"Juicy beef patty, cheese, lettuce, tomato, and ChillSpot sauce." },
  { id:"cheese-burger", name:"Classic Cheeseburger", category:"burgers", price:199, emoji:"🍔", description:"Beef patty topped with melted cheese and fresh vegetables." },
  { id:"crispy-chicken", name:"Crispy Chicken Burger", category:"burgers", price:189, emoji:"🍔", description:"Crispy chicken fillet with fresh lettuce and creamy sauce." },

  // ICE CREAM
  { id:"vanilla", name:"Vanilla Dream", category:"ice-cream", price:79, emoji:"🍦", description:"Smooth and creamy classic vanilla ice cream." },
  { id:"chocolate", name:"Chocolate Blast", category:"ice-cream", price:89, emoji:"🍨", description:"Rich chocolate ice cream for chocolate lovers." },
  { id:"strawberry", name:"Strawberry Swirl", category:"ice-cream", price:89, emoji:"🍓", description:"Creamy strawberry ice cream with a sweet strawberry swirl." },
  { id:"cookies-cream", name:"Cookies & Cream", category:"ice-cream", price:99, emoji:"🍪", description:"Creamy ice cream mixed with crunchy cookie pieces." },
  { id:"mango", name:"Mango Chill", category:"ice-cream", price:99, emoji:"🥭", description:"Sweet tropical mango ice cream with a refreshing flavor." },
  { id:"ube", name:"Ube Cream", category:"ice-cream", price:99, emoji:"🍦", description:"Creamy ube ice cream with a Filipino-inspired flavor." },

  // SIDES
  { id:"fries", name:"Chill Fries", category:"sides", price:99, emoji:"🍟", description:"Golden crispy fries seasoned to perfection." },
  { id:"cheese-fries", name:"Cheese Fries", category:"sides", price:129, emoji:"🍟", description:"Crispy fries covered with creamy melted cheese." },
  { id:"mozzarella-sticks", name:"Mozzarella Sticks", category:"sides", price:149, emoji:"🧀", description:"Crunchy outside with warm, cheesy mozzarella inside." },

  // DRINKS
  { id:"iced-tea", name:"Classic Iced Tea", category:"drinks", price:69, emoji:"🥤", description:"Refreshing sweet iced tea served cold." },
  { id:"lemonade", name:"Fresh Lemonade", category:"drinks", price:79, emoji:"🍋", description:"Fresh and refreshing lemonade." },
  { id:"cola", name:"Cold Cola", category:"drinks", price:59, emoji:"🥤", description:"Ice-cold cola served fresh." },
  { id:"milkshake", name:"Chocolate Milkshake", category:"drinks", price:129, emoji:"🥤", description:"Thick and creamy chocolate milkshake." },
  { id:"strawberry-shake", name:"Strawberry Milkshake", category:"drinks", price:129, emoji:"🍓", description:"Creamy strawberry milkshake with a sweet finish." },

  // COMBOS
  { id:"pizza-ice-cream", name:"Pizza + Ice Cream Combo", category:"combo", price:349, emoji:"🍕🍦", description:"Pizza plus a scoop of ice cream at a special price." },
  { id:"burger-fries", name:"Burger + Fries Combo", category:"combo", price:249, emoji:"🍔🍟", description:"A delicious Chill Burger served with crispy fries." },
  { id:"chill-family", name:"Chill Family Combo", category:"combo", price:599, emoji:"🍕🍔🍟", description:"Pizza, burgers, fries, and drinks for sharing." }
];

let cart = loadCart();
let currentCategory = "all";
let selectedProduct = null;
let selectedQuantity = 1;
let orderType = "pickup";

const $ = id => document.getElementById(id);
const peso = value => `₱${Number(value).toFixed(2)}`;

function saveCart() {
  localStorage.setItem("chillspotCart", JSON.stringify(cart));
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("chillspotCart")) || [];
  } catch {
    return [];
  }
}

function categoryName(category) {
  return category.replace("-", " ");
}

/* MENU */

function renderMenu() {
  const grid = $("menuGrid");
  const search = ($("menuSearch")?.value || "").trim().toLowerCase();

  const filtered = products.filter(product => {
    const categoryMatch = currentCategory === "all" || product.category === currentCategory;
    const searchMatch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    return categoryMatch && searchMatch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-menu"><h3>No food found 😭</h3><p>Try another search or category.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="menu-card">
      <div class="menu-card-image">${product.emoji}</div>
      <div class="menu-card-body">
        <span class="menu-card-category">${categoryName(product.category)}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="menu-card-bottom">
          <strong class="menu-price">${peso(product.price)}</strong>
          <button class="add-button" data-product="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-product]").forEach(button => {
    button.addEventListener("click", () => openProduct(button.dataset.product));
  });
}

function openProduct(id) {
  selectedProduct = products.find(p => p.id === id);
  selectedQuantity = 1;

  $("modalProductImage").textContent = selectedProduct.emoji;
  $("modalCategory").textContent = categoryName(selectedProduct.category).toUpperCase();
  $("modalName").textContent = selectedProduct.name;
  $("modalDescription").textContent = selectedProduct.description;
  $("modalPrice").textContent = peso(selectedProduct.price);
  $("quantityValue").textContent = "1";
  $("specialInstructions").value = "";

  $("productModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  $("productModal").classList.remove("show");
  document.body.style.overflow = "";
}

/* CART */

function addToCart(product, quantity, note) {
  const existing = cart.find(item => item.id === product.id && item.note === note);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity,
      note
    });
  }

  saveCart();
  renderCart();
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function subtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const items = $("cartItems");
  const delivery = orderType === "delivery" && cart.length ? 50 : 0;
  const total = subtotal() + delivery;

  $("cartCount").textContent = cartCount();
  $("cartSubtotal").textContent = peso(subtotal());
  $("deliveryFee").textContent = peso(delivery);
  $("cartTotal").textContent = peso(total);
  $("checkoutButton").disabled = cart.length === 0;

  if (!cart.length) {
    items.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:50px">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add something delicious from the menu.</p>
      </div>
    `;
    return;
  }

  items.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-image">${item.emoji}</div>
      <div>
        <h4>${item.name}</h4>
        <small>${item.note ? "Note: " + item.note : "No special instructions"}</small>
        <div class="cart-item-controls">
          <button data-action="minus" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-index="${index}">+</button>
          <button data-action="remove" data-index="${index}">×</button>
        </div>
      </div>
      <strong class="cart-item-price">${peso(item.price * item.quantity)}</strong>
    </div>
  `).join("");

  items.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const action = button.dataset.action;

      if (action === "plus") cart[index].quantity++;
      if (action === "minus") cart[index].quantity--;
      if (action === "remove") cart[index].quantity = 0;

      cart = cart.filter(item => item.quantity > 0);
      saveCart();
      renderCart();
    });
  });
}

function openCart() {
  $("cartDrawer").classList.add("open");
  $("cartOverlay").classList.add("show");
}

function closeCart() {
  $("cartDrawer").classList.remove("open");
  $("cartOverlay").classList.remove("show");
}

/* CHECKOUT */

function setOrderType(type) {
  orderType = type;

  document.querySelectorAll(".order-type-button").forEach(button => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  $("addressField").classList.toggle("hidden", type !== "delivery");
  $("customerAddress").required = type === "delivery";
  renderCart();
}

function openCheckout() {
  if (!cart.length) return;
  closeCart();
  $("checkoutModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  $("checkoutModal").classList.remove("show");
  document.body.style.overflow = "";
}

function generateOrderNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

function placeOrder(event) {
  event.preventDefault();

  const order = {
    orderNumber: generateOrderNumber(),
    customerName: $("customerName").value.trim(),
    phone: $("customerPhone").value.trim(),
    address: $("customerAddress").value.trim(),
    payment: $("paymentMethod").value,
    notes: $("orderNotes").value.trim(),
    type: orderType,
    items: cart.map(item => ({ ...item })),
    subtotal: subtotal(),
    deliveryFee: orderType === "delivery" ? 50 : 0,
    total: subtotal() + (orderType === "delivery" ? 50 : 0),
    createdAt: new Date().toISOString()
  };

  // Demo storage. Replace with fetch("/api/orders", ...) when a backend is added.
  localStorage.setItem("chillspotLatestOrder", JSON.stringify(order));

  $("orderNumber").textContent = order.orderNumber;

  cart = [];
  saveCart();
  renderCart();
  $("checkoutForm").reset();
  setOrderType("pickup");

  closeCheckout();
  $("successModal").classList.add("show");
}

function closeSuccess() {
  $("successModal").classList.remove("show");
  document.body.style.overflow = "";
}

/* APP */

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();

  $("menuToggle").addEventListener("click", () => {
    $("mainNav").classList.toggle("open");
  });

  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => $("mainNav").classList.remove("open"));
  });

  document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
      currentCategory = button.dataset.category;

      document.querySelectorAll(".category").forEach(item => {
        item.classList.toggle("active", item === button);
      });

      renderMenu();
      $("menu").scrollIntoView({ behavior: "smooth" });
    });
  });

  $("menuSearch").addEventListener("input", renderMenu);

  $("heroOrderButton").addEventListener("click", () => {
    $("menu").scrollIntoView({ behavior: "smooth" });
  });

  $("cartButton").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  $("cartOverlay").addEventListener("click", closeCart);

  $("closeProduct").addEventListener("click", closeProduct);

  $("quantityMinus").addEventListener("click", () => {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    $("quantityValue").textContent = selectedQuantity;
  });

  $("quantityPlus").addEventListener("click", () => {
    selectedQuantity++;
    $("quantityValue").textContent = selectedQuantity;
  });

  $("addToCartButton").addEventListener("click", () => {
    const note = $("specialInstructions").value.trim();
    addToCart(selectedProduct, selectedQuantity, note);
    closeProduct();
    openCart();
  });

  $("checkoutButton").addEventListener("click", openCheckout);
  $("closeCheckout").addEventListener("click", closeCheckout);
  $("checkoutForm").addEventListener("submit", placeOrder);

  document.querySelectorAll(".order-type-button").forEach(button => {
    button.addEventListener("click", () => setOrderType(button.dataset.type));
  });

  $("doneButton").addEventListener("click", closeSuccess);

  $("locationButton").addEventListener("click", () => {
    alert("Add your real Google Maps link to the location button when you know the store address.");
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target !== modal) return;
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeCart();
    closeProduct();
    closeCheckout();
    closeSuccess();
  });
});
