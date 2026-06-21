document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario-cotizacion");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        // --- CAPTURA DE CAMPOS ---
        const nombre   = document.getElementById("nombre")?.value.trim();
        const email    = document.getElementById("email")?.value.trim();
        const mensaje  = document.getElementById("mensaje")?.value.trim();
        const telefono = document.getElementById("telefono")?.value.trim();
        const privacidad = document.querySelector(
            "input[name='privacidad']"
        )?.checked;

        // --- VALIDACIONES ---
        if (!nombre || !email || !mensaje) {
            mostrarError(
                "Por favor, completa los campos obligatorios: " +
                "Nombre, Email y Mensaje."
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarError("Ingresa un correo electrónico válido.");
            return;
        }

        if (!privacidad) {
            mostrarError(
                "Debes aceptar la Política de Privacidad para continuar."
            );
            return;
        }

        // --- BOTÓN: estado de carga ---
        const boton = formulario.querySelector("button[type='submit']");
        if (boton) {
            boton.textContent = "Enviando...";
            boton.disabled = true;
        }

        // --- ENVÍO A NETLIFY ---
        const datos = new FormData(formulario);

        fetch(window.location.pathname, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(datos).toString()
        })
        .then(function (respuesta) {
            if (respuesta.ok) {
                // Éxito: reemplaza el formulario
                document.querySelector(".formulario-cuerpo").innerHTML = `
                    <div class="alert-exito">
                        <div class="alert-exito-icono">✔</div>
                        <h3>¡Mensaje enviado con éxito!</h3>
                        <p>
                            Gracias por comunicarte con
                            <strong>BIOTANK S.A.C.</strong>
                            Un asesor logístico se pondrá en contacto
                            contigo a la brevedad.
                        </p>
                        <a href="index.html" class="btn-cta">
                            Volver al Inicio
                        </a>
                    </div>
                `;
            } else {
                throw new Error("Respuesta no OK: " + respuesta.status);
            }
        })
        .catch(function (error) {
            console.error("Error al enviar:", error);
            if (boton) {
                boton.textContent = "Enviar Mensaje";
                boton.disabled = false;
            }
            mostrarError(
                "Hubo un error al enviar. Por favor intenta nuevamente " +
                "o escríbenos a informes@biotank.com.pe"
            );
        });
    });

    // --- FUNCIÓN: mostrar error ---
    function mostrarError(mensaje) {
        const errorPrevio = document.getElementById("form-error");
        if (errorPrevio) errorPrevio.remove();

        const divError = document.createElement("div");
        divError.id = "form-error";
        divError.className = "alert-error";
        divError.textContent = mensaje;

        const pie = document.querySelector(".formulario-pie");
        if (pie) {
            formulario.insertBefore(divError, pie);
        }

        setTimeout(() => divError.remove(), 6000);
    }
});