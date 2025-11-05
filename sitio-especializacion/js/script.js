// Inicializar Mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'Segoe UI, sans-serif'
});

// Gestión de navegación
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('content-area');

    // Cargar la primera clase por defecto
    loadClase('clase1');

    // Manejar clicks en los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));

            // Agregar clase active al enlace clickeado
            this.classList.add('active');

            // Obtener la clase a cargar
            const claseId = this.getAttribute('data-clase');
            loadClase(claseId);

            // Scroll suave al inicio del contenido
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Función para cargar contenido de la clase
    function loadClase(claseId) {
        contentArea.innerHTML = '<div class="loading">Cargando contenido...</div>';

        fetch(`clases/${claseId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Clase no encontrada');
                }
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;

                // Re-renderizar diagramas Mermaid
                mermaid.run({
                    querySelector: '.mermaid',
                });

                // Agregar animación de entrada
                contentArea.querySelector('.clase-content').style.animation = 'fadeIn 0.5s ease-in';
            })
            .catch(error => {
                contentArea.innerHTML = `
                    <div class="error-message">
                        <h2>Error al cargar el contenido</h2>
                        <p>No se pudo cargar la clase seleccionada. Por favor, intente nuevamente.</p>
                    </div>
                `;
                console.error('Error:', error);
            });
    }

    // Manejo de navegación con botones prev/next
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-next') || e.target.classList.contains('btn-prev')) {
            e.preventDefault();
            const claseId = e.target.getAttribute('data-clase');
            if (claseId) {
                // Actualizar navegación lateral
                navLinks.forEach(link => {
                    if (link.getAttribute('data-clase') === claseId) {
                        link.click();
                    }
                });
            }
        }
    });
});

// Función para copiar código
function copyCode(button) {
    const codeBlock = button.previousElementSibling;
    const code = codeBlock.textContent;

    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copiado!';
        setTimeout(() => {
            button.textContent = 'Copiar código';
        }, 2000);
    });
}

// Agregar smooth scroll a todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
