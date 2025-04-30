// Sample menu data (this will later come from the backend)
const menuItems = [
    { id: 1, name: 'Classic Burger', price: 8.99, description: 'Juicy beef patty with fresh lettuce and tomato', icon: 'fa-burger' },
    { id: 2, name: 'Chicken Sandwich', price: 7.99, description: 'Grilled chicken breast with special sauce', icon: 'fa-drumstick-bite' },
    { id: 3, name: 'French Fries', price: 3.99, description: 'Crispy golden fries', icon: 'fa-french-fries' },
    { id: 4, name: 'Milkshake', price: 4.99, description: 'Creamy vanilla milkshake', icon: 'fa-glass-water' },
    { id: 5, name: 'Salad', price: 6.99, description: 'Fresh garden salad with choice of dressing', icon: 'fa-salad' },
    { id: 6, name: 'Soft Drink', price: 1.99, description: 'Choice of soda or iced tea', icon: 'fa-cup-straw' }
];

// State management
let selectedItems = {};

// DOM Elements
const menuItemsContainer = document.getElementById('menuItems');
const selectedItemsContainer = document.getElementById('selectedItems');
const totalAmountElement = document.getElementById('totalAmount');
const purchaseButton = document.getElementById('purchaseButton');

// Initialize the menu
function initializeMenu() {
    menuItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuItemsContainer.appendChild(menuItemElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <i class="item-icon fas ${item.icon}"></i>
        <div class="item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
        </div>
    `;
    
    div.addEventListener('click', () => addItemToOrder(item));
    return div;
}

// Add item to order
function addItemToOrder(item) {
    if (!selectedItems[item.id]) {
        selectedItems[item.id] = {
            item: item,
            quantity: 0
        };
    }
    selectedItems[item.id].quantity++;
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    // Clear current items
    selectedItemsContainer.innerHTML = '';
    
    // Display items with quantity controls
    Object.values(selectedItems).forEach(({ item, quantity }) => {
        if (quantity > 0) {
            const itemElement = document.createElement('div');
            itemElement.className = 'selected-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <span class="item-price">$${(item.price * quantity).toFixed(2)}</span>
                </div>
            `;
            selectedItemsContainer.appendChild(itemElement);
        }
    });
    
    // Update total
    const total = calculateTotal();
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = selectedItems[itemId];
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 0) {
            item.quantity = newQuantity;
            if (newQuantity === 0) {
                delete selectedItems[itemId];
            }
            updateOrderSummary();
        }
    }
}

// Calculate total
function calculateTotal() {
    return Object.values(selectedItems).reduce((total, { item, quantity }) => {
        return total + (item.price * quantity);
    }, 0);
}

// Handle purchase
purchaseButton.addEventListener('click', () => {
    const itemCount = Object.values(selectedItems).reduce((count, { quantity }) => count + quantity, 0);
    if (itemCount === 0) {
        alert('Please select items before completing your order.');
        return;
    }
    
    // Here we'll later add the API call to submit the order
    alert('Thank you for your order! Total: $' + calculateTotal().toFixed(2));
    selectedItems = {};
    updateOrderSummary();
});

// Initialize the menu when the page loads
document.addEventListener('DOMContentLoaded', initializeMenu); 