// Variable global para el número de WhatsApp
const WHATSAPP_NUMBER = "3854031564";

const navToggler = document.querySelector(".nav-toggler");
const navMenu = document.querySelector(".nav");

navToggler.addEventListener("click", mobileMenu);

function mobileMenu() {
  navToggler.classList.toggle("active");
  navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");
navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  navToggler.classList.remove("active");
  navMenu.classList.remove("active");
}

// toggleTheme
const toggleDos = document.getElementById("checkbox-input");
const logo = document.querySelector("#logo");

// Verificar el modo al cargar la página
const darkModeEnabled = localStorage.getItem("dark-mode") === "true";
toggleDos.checked = darkModeEnabled;
document.body.classList.toggle("dark-mode", darkModeEnabled);
// logo.src = darkModeEnabled ? "images/logo-claro.png" : "images/logo-oscuro.png";

toggleDos.addEventListener("change", function () {
  const isChecked = this.checked;
  document.body.classList.toggle("dark-mode", isChecked);
  localStorage.setItem("dark-mode", isChecked);

  // Cambiar la imagen según el modo
  logo.src = isChecked ? "images/logo-claro.png" : "images/logo-oscuro.png";
});

// Obtener el botón
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Mostrar el botón cuando se desplaza hacia abajo
window.onscroll = function () {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

// Función para subir a la parte superior
scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Enviar consulta personalizada
document
  .getElementById("ctaMessage")
  .addEventListener("click", function (event) {
    // Prevenir el comportamiento predeterminado del enlace
    event.preventDefault();

    // Obtener el valor del textarea, eliminamos espacios en blanco a los extremos
    const textarea = document.getElementById("textarea").value.trim();

    // Validar que el textarea no esté vacío
    if (textarea === "") {
      alert("Por favor, escribe tu consulta antes de enviar.");
      return;
    }

    // Crear el enlace de WhatsApp con el mensaje personalizado
    const msgPersonalizado = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      textarea
    )}`;

    // Asignar el enlace al href del botón
    this.href = msgPersonalizado;

    // Abrir el enlace en una nueva pestaña
    window.open(msgPersonalizado, "_blank");
  });

// Crear un observer para detectar cuando la sección entra en el viewport
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Aquí puedes cargar el contenido o mostrar la sección
      const section = entry.target;
      section.classList.add("cargada");
      // Puedes hacer que se cargue contenido dinámicamente si es necesario
      observer.unobserve(section);
    }
  });
});

// detectad scroll
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");

  // Verifica si el desplazamiento vertical es mayor que 0
  if (window.scrollY > 5) {
    header.classList.add("scrolled"); // Agrega la clase 'scrolled'
  } else {
    header.classList.remove("scrolled"); // Remueve la clase 'scrolled'
  }
});

// Selecciona las secciones que quieres cargar de manera diferida
const lazySections = document.querySelectorAll(".contenido-lento");
// Observa cada sección
lazySections.forEach((section) => observer.observe(section));


const contactBtn = document.getElementById("contactBtnMain");
contactBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me gustaría realizar una consulta.')}`


document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');

      if (targetId === "#") {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      } else {
          document.querySelector(targetId).scrollIntoView({
              behavior: 'smooth'
          });
      }
  });
});