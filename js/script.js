import { fetchClimaQuito, fetchInspirationalQuote } from './api.js';
import { PRODUCTOS, renderProducts } from './catalog.js';
import { agregarAlCarrito, renderCarrito } from './cart.js';
import { setupContactValidation } from './contact.js';

// Elementos del DOM
const gridProductos = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.btn-filter');
const weatherWidget = document.getElementById('weather-widget');
const quoteWidget = document.getElementById('quote-widget');

// Elementos del Carrito
const cartItemsContainer = document.getElementById('cart-items');
const subtotalSpan = document.getElementById('summary-subtotal');
const shippingSpan = document.getElementById('summary-shipping');
const totalSpan = document.getElementById('summary-total');
const shippingSelect = document.getElementById('shipping-zone');
const currencySelect = document.getElementById('currency-select');

// Elementos de Contacto
const contactForm = document.getElementById('contact-form');
const contactFeedback = document.getElementById('form-feedback');

// Estado local de filtros
let filtroOrigen = 'all';

/**
 * Inicializacion asincrona de las APIs
 */
async function inicializarAPIs() {
    // Carga de Clima
    const climaTexto = await fetchClimaQuito();
    weatherWidget.innerHTML = `
        <i class="fa-solid fa-cloud-sun" aria-hidden="true" style="color: var(--color-accent)"></i>
        <span>${climaTexto}</span>
    `;

    // Carga de Frase Inspiradora
    const fraseTexto = await fetchInspirationalQuote();
    quoteWidget.innerHTML = `
        <i class="fa-solid fa-quote-left" aria-hidden="true" style="color: var(--color-accent)"></i>
        <span>${fraseTexto}</span>
    `;
}

/**
 * Filtra y ejecuta el renderizado en tiempo real
 */
function filtrarYRenderizar() {
    const query = searchInput.value.toLowerCase().trim();
    const filtrados = PRODUCTOS.filter(p => {
        const coincideNombre = p.name.toLowerCase().includes(query);
        const coincideOrigen = (filtroOrigen === 'all' || p.origin === filtroOrigen);
        return coincideNombre && coincideOrigen;
    });
    
    renderProducts(filtrados, gridProductos, (idProducto) => {
        const prod = PRODUCTOS.find(p => p.id === idProducto);
        agregarAlCarrito(prod, () => {
            renderCarrito(cartItemsContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
        });
    });
}

// Escuchar cambios de Zona de Envio y Seleccion de Moneda
shippingSelect.addEventListener('change', () => {
    renderCarrito(cartItemsContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
});

currencySelect.addEventListener('change', () => {
    renderCarrito(cartItemsContainer, subtotalSpan, shippingSpan, totalSpan, shippingSelect, currencySelect);
});

// Configurar barra de busqueda
searchInput.addEventListener('input', filtrarYRenderizar);

// Configurar botones de filtros
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filtroOrigen = e.target.getAttribute('data-origin');
        filtrarYRenderizar();
    });
});

// Arranque del sistema
document.addEventListener('DOMContentLoaded', () => {
    inicializarAPIs();
    filtrarYRenderizar();
    setupContactValidation(contactForm, contactFeedback);
});