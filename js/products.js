// Variable global para la URL base de la API
const API_BASE_URL = "https://tapiceriafast-backend.onrender.com";

// Variable global para almacenar todos los productos
let allProducts = [];

// Función para filtrar productos
function filterProducts() {
    const searchValue = document.getElementById('searchInput').value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const products = document.getElementsByClassName('product');
    
    Array.from(products).forEach(product => {
        const title = product.querySelector('h4').textContent
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        title.includes(searchValue) 
            ? product.classList.remove('hidden')
            : product.classList.add('hidden');
    });
}

// Función para abrir el modal con la información completa del producto
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = modal.querySelector('.modal-content');

    // Limpiar contenido previo
    modalContent.querySelector('.modal-slider').innerHTML = '';
    modalContent.querySelector('.modal-title').textContent = '';
    modalContent.querySelector('.modal-description').textContent = '';
    modalContent.querySelector('.modal-color-buttons').innerHTML = '';
    modalContent.querySelector('.modal-price').textContent = '';

    // Llenar el modal con la información del producto
    modalContent.querySelector('.modal-title').textContent = product.title;

    if (product.description) {
        modalContent.querySelector('.modal-description').textContent = 
            product.description[0]?.children[0]?.text || '';
    }

    if (product.price) {
        modalContent.querySelector('.modal-price').innerHTML = `<sup>$</sup>${product.price}`;
    }

    // Slider de imágenes
    const sliderContainer = modalContent.querySelector('.modal-slider');
    const sliderImages = document.createElement('div');
    sliderImages.className = 'slider-images';
    sliderContainer.appendChild(sliderImages);

    // Botones de color
    const colorButtons = modalContent.querySelector('.modal-color-buttons')

    let activeImageUrl = `${product.colorImage[0].image.url}`;

    product.colorImage.forEach((colorImage, index) => {
        const img = document.createElement('img');
        img.src = `${colorImage.image.url}`;
        img.alt = `${product.title} - Opción ${index + 1}`;
        img.className = `slider-image${index === 0 ? ' active' : ''}`;
        img.dataset.fancybox = `gallery-${product.id}`;
        sliderImages.appendChild(img);

        const colorBtn = document.createElement('button');
        colorBtn.className = `color-button${index === 0 ? ' active' : ''}`;

        const colors = colorImage.colorPicker.map(c => c.color);
        if (colors.length === 1) {
            colorBtn.style.backgroundColor = colors[0];
        } else {
            colorBtn.style.background = `
                linear-gradient(135deg, 
                    ${colors.map((c, i) => 
                        `${c} ${(i * 100)/colors.length}% ${((i + 1) * 100)/colors.length}%`
                    ).join(', ')}
                )`;
        }

        colorBtn.addEventListener('click', () => {
            sliderImages.querySelectorAll('.slider-image').forEach(img => img.classList.remove('active'));
            colorButtons.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('active'));

            img.classList.add('active');
            colorBtn.classList.add('active');
            sliderImages.style.transform = `translateX(-${index * 100}%)`;

            activeImageUrl = `${colorImage.image.url}`;

            const ctaButton = modalContent.querySelector('#cta-button-modal');
            const whatsappMessage = `Hola, quería consultar por el producto: ${product.title}. ${activeImageUrl}`;
            const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            ctaButton.href = whatsappLink;
        });

        colorButtons.appendChild(colorBtn);
    });

    const ctaButton = modalContent.querySelector('#cta-button-modal');
    const whatsappMessage = `Hola, quería consultar por el producto: ${product.title}. ${activeImageUrl}`;
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    ctaButton.href = whatsappLink;

    // Mostrar el modal
    modal.classList.add('show');

    // Cerrar modal al hacer clic en la X
    modal.querySelector('.close-modal').onclick = () => {
        modal.classList.remove('show');
    };

    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
}


// Función principal para cargar y mostrar productos
function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <div class="slider">
                <div class="slider-images">
                    ${product.colorImage.map((colorImage, index) => `
                        <img src="${colorImage.image.url}"
                            class="slider-image${index === 0 ? ' active' : ''}"
                            alt="${product.title} - Variante ${index + 1}"
                            ${index !== 0 ? 'loading="lazy"' : ''}>
                    `).join('')}
                </div>
            </div>
            <p>$${product.price}</p>
            <h4>${product.title}</h4>
        `;

        productDiv.addEventListener('click', () => openProductModal(product));
        container.appendChild(productDiv);
    });

    Fancybox.bind('[data-fancybox]', {
        Thumbs: { type: 'classic' },
        Toolbar: {
            display: {
                left: ['infobar'],
                middle: ['zoomIn', 'zoomOut', 'toggle1to1'],
                right: ['slideshow', 'thumbs', 'close'],
            },
        },
    });
}

function loadProducts() {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('productsContainer');
    spinner.style.display = 'block';

    // 1. Mostrar productos guardados si existen
    const cached = localStorage.getItem('cachedProducts');
    if (cached) {
        try {
            const cachedProducts = JSON.parse(cached);
            renderProducts(cachedProducts);
            spinner.style.display = 'none';
        } catch (err) {
            console.error('Error al leer localStorage:', err);
        }
    }

    // 2. Mientras tanto, intentar cargar desde la API
    fetch(`${API_BASE_URL}/api/productos?fields[0]=title&fields[1]=description&fields[2]=price&populate[colorImage][populate][image][fields][0]=name&populate[colorImage][populate][image][fields][1]=url&populate[colorImage][populate][colorPicker][fields][0]=color`)
        .then(response => response.json())
        .then(data => {
            allProducts = data.data;
            renderProducts(data.data);
            // 3. Guardar en localStorage para la próxima vez
            localStorage.setItem('cachedProducts', JSON.stringify(data.data));
        })
        .catch(error => console.error('Error al cargar productos:', error))
        .finally(() => {
            spinner.style.display = 'none';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterProducts);
});
