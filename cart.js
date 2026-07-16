import { fetchTasaConversionEuro } from './api.js';

let carrito = [];
let tasaEuro = 0.92;

// Iniciar tasa de euro
fetchTasaConversionEuro().then(tasa => { tasaEuro = tasa; });

/**
 * Añade un producto o incrementa su cantidad
 */
export function agregarAlCarrito(producto, callbackActualizar) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    callbackActualizar();
}

/**
 * Actualiza la UI del carrito y del resumen
 */
export function renderCarrito(cartContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect) {
    cartContainer.innerHTML = '';

    if (carrito.length === 0) {
        cartContainer.innerHTML = `<p class="empty-cart-msg">Aun no has agregado cafes a tu pedido.</p>`;
        subtotalSpan.textContent = '$0.00';
        shippingSpan.textContent = '$0.00';
        totalSpan.textContent = '$0.00';
        return;
    }

    // Renderizar elementos del carrito en el DOM
    carrito.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} USD x ${item.cantidad}</p>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty btn-decrease" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty btn-increase" data-id="${item.id}">+</button>
            </div>
        `;

        // Eventos para cambiar cantidades
        itemEl.querySelector('.btn-decrease').addEventListener('click', () => cambiarCantidad(item.id, -1, () => {
            renderCarrito(cartContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
        }));

        itemEl.querySelector('.btn-increase').addEventListener('click', () => cambiarCantidad(item.id, 1, () => {
            renderCarrito(cartContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
        }));

        cartContainer.appendChild(itemEl);
    });

    calcularResultados(subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
}

function cambiarCantidad(id, cambio, callback) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.id !== id);
        }
    }
    callback();
}

/**
 * Calcula dinamicamente subtotales, envio y cambio de moneda en tiempo real
 */
function calcularResultados(subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect) {
    const subtotal = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    const costoEnvio = parseFloat(shippingSelect.value) || 0;
    const totalUSD = subtotal + costoEnvio;
    const utilizarEuro = currencySelect.value === 'EUR';

    if (utilizarEuro) {
        const subtotalEUR = subtotal * tasaEuro;
        const envioEUR = costoEnvio * tasaEuro;
        const totalEUR = totalUSD * tasaEuro;

        subtotalSpan.textContent = `€${subtotalEUR.toFixed(2)} EUR`;
        shippingSpan.textContent = `€${envioEUR.toFixed(2)} EUR`;
        totalSpan.textContent = `€${totalEUR.toFixed(2)} EUR`;
    } else {
        subtotalSpan.textContent = `$${subtotal.toFixed(2)} USD`;
        shippingSpan.textContent = `$${costoEnvio.toFixed(2)} USD`;
        totalSpan.textContent = `$${totalUSD.toFixed(2)} USD`;
    }
}