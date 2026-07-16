// Base de datos local de cafe de especialidad para Quito Coffee Roasters
export const PRODUCTOS = [
    { id: 1, name: "Origen Choco Andino", origin: "Ecuador", notes: "Notas de chocolate negro, frutos rojos y acidez brillante.", price: 12.50 },
    { id: 2, name: "Finca Loja Honey", origin: "Ecuador", notes: "Cuerpo medio, dulzura a miel silvestre y citricos.", price: 14.00 },
    { id: 3, name: "Huila Premium", origin: "Colombia", notes: "Fragancia floral intensa, notas de caramelo suave.", price: 11.00 },
    { id: 4, name: "Santos Bourbon", origin: "Brasil", notes: "Cuerpo denso, acidez baja, notas de nueces tostadas.", price: 9.50 },
    { id: 5, name: "Yirgacheffe Organico", origin: "Etiopia", notes: "Aroma herbal y te de jazmin, perfil sumamente exotico.", price: 16.50 }
];

/**
 * Renderiza los cafes en la cuadricula de productos aplicando filtros dinamicos
 */
export function renderProducts(productsList, container, onAddCallback) {
    container.innerHTML = '';
    
    if (productsList.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">No se encontraron cafes con esos criterios.</p>`;
        return;
    }

    productsList.forEach(({ id, name, origin, notes, price }) => {
        const card = document.createElement('article');
        card.className = 'product-card animate-fade';
        card.setAttribute('aria-label', `Cafe ${name}`);

        card.innerHTML = `
            <div class="product-image-placeholder">
                <i class="fa-solid fa-seedling" aria-hidden="true"></i>
            </div>
            <div class="product-info">
                <p class="product-origin">${origin}</p>
                <h3>${name}</h3>
                <p class="product-notes">${notes}</p>
                <div class="product-price-action">
                    <span class="product-price">$${price.toFixed(2)} USD</span>
                    <button class="btn-primary btn-add" data-id="${id}">
                        <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Agregar
                    </button>
                </div>
            </div>
        `;

        // Vinculacion de eventos con addEventListener
        card.querySelector('.btn-add').addEventListener('click', () => {
            onAddCallback(id);
        });

        container.appendChild(card);
    });
}