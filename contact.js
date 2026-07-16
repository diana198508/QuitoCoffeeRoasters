/**
 * Gestiona la validacion e interactividad del formulario de contacto
 */
export function setupContactValidation(form, feedbackEl) {
    const campos = {
        name: { input: document.getElementById('contact-name'), error: document.getElementById('name-error') },
        email: { input: document.getElementById('contact-email'), error: document.getElementById('email-error') },
        phone: { input: document.getElementById('contact-phone'), error: document.getElementById('phone-error') },
        message: { input: document.getElementById('contact-message'), error: document.getElementById('message-error') }
    };

    // Validar en tiempo real conforme el usuario tipea
    Object.keys(campos).forEach(key => {
        campos[key].input.addEventListener('input', () => validarCampo(key, campos[key]));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let esValido = true;

        Object.keys(campos).forEach(key => {
            if (!validarCampo(key, campos[key])) {
                esValido = false;
            }
        });

        if (esValido) {
            feedbackEl.className = 'form-feedback feedback-success';
            feedbackEl.textContent = '¡Gracias por escribirnos! Tu solicitud ha sido enviada con exito.';
            form.reset();
            setTimeout(() => { feedbackEl.textContent = ''; }, 5000);
        } else {
            feedbackEl.className = 'form-feedback error-msg';
            feedbackEl.textContent = 'Por favor, corrige los errores en el formulario.';
        }
    });
}

function validarCampo(tipo, campo) {
    const valor = campo.input.value.trim();
    campo.error.textContent = '';

    if (!valor) {
        campo.error.textContent = 'Este campo es obligatorio.';
        return false;
    }

    if (tipo === 'email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
            campo.error.textContent = 'Ingresa un formato de correo valido.';
            return false;
        }
    }

    if (tipo === 'phone') {
        const regexTelefono = /^[0-9]{9,10}$/;
        if (!regexTelefono.test(valor)) {
            campo.error.textContent = 'Ingresa un numero valido de 9 o 10 digitos.';
            return false;
        }
    }

    return true;
}