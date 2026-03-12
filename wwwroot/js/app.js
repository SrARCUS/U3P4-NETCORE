let total = 0;
const LIMITE_PRECIO_MAX = 10000000;
const LIMITE_TOTAL_MAX = 100000000;

const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const carritoVacio = document.getElementById("carrito-vacio");
const contadorBadge = document.getElementById("contador-badge");

// Función para mostrar alerta Bootstrap en lugar de alert()
function mostrarAlerta(mensaje) {
    const alertaGlobal = document.getElementById("alerta-global");
    const alertaMensaje = document.getElementById("alerta-mensaje");
    alertaMensaje.textContent = mensaje;
    alertaGlobal.classList.remove("d-none");
    // Cierra automáticamente después de 4 segundos
    setTimeout(() => {
        alertaGlobal.classList.add("d-none");
    }, 4000);
}

// Actualizar barra de progreso
function actualizarProgreso() {
    const porcentaje = Math.min((total / LIMITE_TOTAL_MAX) * 100, 100);
    const barra = document.getElementById("barra-progreso");
    const texto = document.getElementById("progreso-texto");

    barra.style.width = porcentaje + "%";
    barra.setAttribute("aria-valuenow", porcentaje);

    // Cambiar color según porcentaje
    barra.classList.remove("bg-success", "bg-warning", "bg-danger");
    if (porcentaje >= 80) {
        barra.classList.add("bg-danger");
    } else if (porcentaje >= 50) {
        barra.classList.add("bg-warning");
    } else {
        barra.classList.add("bg-success");
    }

    texto.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} / $100,000,000`;
}

// Actualizar contador del badge
function actualizarContador() {
    const cantidad = lista.querySelectorAll("li").length;
    contadorBadge.textContent = `${cantidad} item${cantidad !== 1 ? 's' : ''}`;
}

// Mostrar u ocultar estado vacío
function actualizarEstadoVacio() {
    const cantidad = lista.querySelectorAll("li").length;
    carritoVacio.style.display = cantidad === 0 ? "block" : "none";
}

boton.addEventListener("click", function () {
    let nombreInput = document.getElementById("nombre");
    let precioInput = document.getElementById("precio");

    let nombre = nombreInput.value.trim();
    let precio = parseFloat(precioInput.value);

    if (nombre === "" || isNaN(precio) || precio <= 0) {
        mostrarAlerta("Por favor, ingresa un nombre y un precio válido.");
        return;
    }

    if (precio > LIMITE_PRECIO_MAX) {
        mostrarAlerta("El precio de un solo producto no puede exceder los 10 millones.");
        return;
    }

    if (total + precio > LIMITE_TOTAL_MAX) {
        mostrarAlerta("El total del carrito no puede exceder los 100 millones.");
        return;
    }

    // Crear ítem de lista (compatible con list-group de Bootstrap)
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "py-3");
    li.innerHTML = `
        <span>
            <i class="bi bi-tag-fill text-success me-2"></i>
            <strong>${nombre}</strong>
        </span>
        <span class="producto-precio d-none">${precio}</span>
        <div class="d-flex align-items-center gap-3">
            <span class="text-success fw-semibold">$${precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <button class="btn btn-outline-danger btn-sm eliminar">
                <i class="bi bi-trash3"></i>
            </button>
        </div>
    `;

    // Botón eliminar
    li.querySelector(".eliminar").onclick = function () {
        lista.removeChild(li);
        recalcularTotal();
        actualizarContador();
        actualizarEstadoVacio();
        actualizarProgreso();
    };

    lista.appendChild(li);
    recalcularTotal();
    actualizarContador();
    actualizarEstadoVacio();
    actualizarProgreso();

    nombreInput.value = "";
    precioInput.value = "";
    nombreInput.focus();
});

function recalcularTotal() {
    let nuevoTotal = 0;
    const precios = lista.querySelectorAll(".producto-precio");
    precios.forEach(p => {
        nuevoTotal += parseFloat(p.textContent);
    });
    total = nuevoTotal;
    totalSpan.textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    actualizarProgreso();
}

// Estado inicial
actualizarEstadoVacio();

//CREADO POR JULIO OLIVER GARCIA QUINTANA - 22340342
