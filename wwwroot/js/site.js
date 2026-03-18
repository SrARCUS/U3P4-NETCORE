// =============================================
//  Práctica 5 — Lista de Compras con SessionStorage
//  JULIO OLIVER GARCIA QUINTANA — 22340342
// =============================================

// ---------- Claves de SessionStorage ----------
const KEY_CARRITO   = 'carrito';
const KEY_COMPRADOR = 'compradorNombre';

// ---------- Obtener / guardar datos ----------
function obtenerCarrito() {
    const data = sessionStorage.getItem(KEY_CARRITO);
    return data ? JSON.parse(data) : [];
}

function guardarCarrito(items) {
    sessionStorage.setItem(KEY_CARRITO, JSON.stringify(items));
}

function obtenerComprador() {
    return sessionStorage.getItem(KEY_COMPRADOR) || '';
}

function guardarComprador(nombre) {
    sessionStorage.setItem(KEY_COMPRADOR, nombre);
}

// ---------- Renderizar lista ----------
function renderizarCarrito() {
    const carrito   = obtenerCarrito();
    const comprador = obtenerComprador();
    const lista     = document.getElementById('lista-carrito');
    const totalEl   = document.getElementById('total-carrito');
    const countEl   = document.getElementById('count-carrito');
    const nombreEl  = document.getElementById('nombre-comprador-display');

    // Mostrar nombre del comprador
    if (nombreEl) {
        nombreEl.textContent = comprador ? `Comprador: ${comprador}` : '';
    }

    // Contar items
    if (countEl) countEl.textContent = `${carrito.length} items`;

    if (!lista) return;

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-cart-x display-4 d-block mb-2"></i>
                <p class="mb-0">Tu carrito está vacío</p>
            </div>`;
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <li class="list-group-item d-flex justify-content-between align-items-center py-3">
            <span>
                <i class="bi bi-tag-fill text-success me-2"></i>
                <strong>${item.nombre}</strong>
            </span>
            <div class="d-flex align-items-center gap-3">
                <span class="text-success fw-semibold">$${parseFloat(item.precio).toFixed(2)}</span>
                <button onclick="eliminarProducto(${item.id})" class="btn btn-outline-danger btn-sm">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </li>
    `).join('');

    // Calcular total
    const total = carrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ---------- Agregar producto ----------
function agregarProducto() {
    const nombreInput = document.getElementById('input-nombre');
    const precioInput = document.getElementById('input-precio');

    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);

    if (!nombre || isNaN(precio) || precio <= 0) {
        alert('Por favor ingresa un nombre válido y un precio mayor a 0.');
        return;
    }

    const carrito = obtenerCarrito();
    const nuevoId = carrito.length > 0 ? Math.max(...carrito.map(i => i.id)) + 1 : 1;

    carrito.push({ id: nuevoId, nombre, precio });
    guardarCarrito(carrito);

    // Limpiar inputs
    nombreInput.value = '';
    precioInput.value = '';
    nombreInput.focus();

    renderizarCarrito();
}

// ---------- Eliminar producto ----------
function eliminarProducto(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

// ---------- Guardar nombre del comprador ----------
function actualizarComprador() {
    const input = document.getElementById('input-comprador');
    if (input) {
        guardarComprador(input.value.trim());
        renderizarCarrito();
    }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    // Cargar nombre guardado en el input
    const inputComprador = document.getElementById('input-comprador');
    if (inputComprador) {
        inputComprador.value = obtenerComprador();
        inputComprador.addEventListener('input', actualizarComprador);
    }

    // Enter en inputs del formulario
    const inputNombre = document.getElementById('input-nombre');
    const inputPrecio = document.getElementById('input-precio');
    if (inputNombre) inputNombre.addEventListener('keydown', e => { if (e.key === 'Enter') agregarProducto(); });
    if (inputPrecio) inputPrecio.addEventListener('keydown', e => { if (e.key === 'Enter') agregarProducto(); });

    renderizarCarrito();
});
