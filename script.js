
let isRotated = false;

function rotateImage() {
    const hamburgerIcon = document.getElementById('hamburger');
    isRotated = !isRotated

    if (isRotated) {
        hamburgerIcon.style.transform = 'rotate(90deg)';
    } else {
        hamburgerIcon.style.transform = 'rotate(0deg)';
    }
};

function toggleSearchBar() {

};




const q = document.querySelectorAll('.q');
const a = document.querySelectorAll('.a');
const arr = document.querySelectorAll('.arrow');

for (let i = 0; i < q.length; i++) {
    q[i].addEventListener('click', () => {

        a[i].classList.toggle('a-opened');

        arr[i].classList.toggle('arrow-rotaded');
    });
}



$(document).ready(function () {
    addCards(`https://fakestoreapi.com/products`);
    initializeSlider();
    addCategoryHeader("ALLA PRODUKTER");
    initializeTypingHeader();

    /* Detta är nytt och kanske fel */
    $('#cardsRow').on('click', '.order-btn', function(event) {
        event.preventDefault();

        var productId = $(this).data('product-id');
      
    
        console.log("Produkt med ID " + productId + " har lagts till i varukorgen.");
     

        addToCart(productId);
    
    });

});


// Funktion för att skapa ett "card" div-element med slumpmässig personinformation
function createCard(id, image, title, description, price) {
    return `

        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100">
            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title ">${title}</h5>
            </div>
            <div class="card-footer d-flex flex-column align-items-center">

                <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-heading${id}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#flush-collapse${id}" aria-expanded="false"
                                aria-controls="flush-collapse${id}">
                                Mer info
                            </button>
                        </h2>

                        <div id="flush-collapse${id}" class="accordion-collapse collapse"
                            aria-labelledby="flush-heading${id}" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">${description}</div>
                        </div>
                    </div>
                </div>
                <small id="price-text" class="text-muted">$${price}</small> 
                <a class="btn btn-outline-dark my-2 order-btn" href="orderpage/order.html?id=${id}" data-product-id="${id}" role="button">Beställ</a>
        
            </div>
        </div>
    </div>
        `;
};


// Funktion för att lägga till fler "card" divar
function addCards(path) {
    
    const cardsGroup = $("#cardsRow");

    fetch(path)
        .then(response => response.json())
        .then(data => {
            data.forEach(data => {

                const id = data.id;
                const img = data.image;
                const title = data.title;
                const description = data.description;
                const price = data.price;
                // Skapa ett nytt "card" div-element och lägg till det i raden
                const cardHTML = createCard(id, img, title, description, price);
                cardsGroup.append(cardHTML);

            });

        })
        .catch(error => console.error("Error fetching random product:", error));
};

$('#womensCategory').click(function () {

    const womensClothing = encodeURIComponent("women's clothing");
    $("#cardsRow").empty(); // Clear existing cards
    $("#slideshow").empty(); // Clear image
    addCategoryHeader("DAM");
    addCards(`https://fakestoreapi.com/products/category/${womensClothing}`);
});

$('#mensCategory').click(function () {

    const mensClothing = encodeURIComponent("men's clothing");
    $("#cardsRow").empty(); // Clear existing cards
    $("#slideshow").empty(); // Clear image
    addCategoryHeader("HERR");
    addCards(`https://fakestoreapi.com/products/category/${mensClothing}`);
});

$('#jeweleryCategory').click(function () {

    $("#cardsRow").empty(); // Clear existing cards
    $("#slideshow").empty(); // Clear image
    addCategoryHeader("SMYCKEN");
    addCards(`https://fakestoreapi.com/products/category/jewelery`);
});

$('#allCategories').click(function () {

    $("#cardsRow").empty(); // Clear existing cards
    $("#slideshow").empty(); // Clear image
    addCategoryHeader("ALLA PRODUKTER");
    addCards(`https://fakestoreapi.com/products`);
});


$('#salj-icon').click(function () {
    $("#cardsRow").empty(); // Clear existing cards
    $("#slideshow").empty(); // Clear image

    addSlideShow(); //add the slideshow again
    initializeSlider();

    clearTimeout(typingHeaderTimeout)
    $("#typingHeader").empty();
    initializeTypingHeader();

    addCategoryHeader("ALLA PRODUKTER")
    addCards(`https://fakestoreapi.com/products`);


});


function addCategoryHeader(text) {
    const headerDiv = $("#category-header");
    const header = `<h4>${text}</h4>`;
    headerDiv.html(header);
}


function createSlideShow() {
    return `
    <div class="slides">
        <img class="slide" src="images/cat-han-JSGcF7g_67E-unsplash.jpg" alt="">
        <img class="slide" src="images/nimble-made-NS2BZsGxOLE-unsplash.jpg" alt="">
        <img class="slide" src="images/amy-shamblen-F52I5BtDuhY-unsplash.jpg" alt="">
        <img class="slide" src="images/eric-fung-Z0GZrpwcc5Y-unsplash.jpg" alt="">
        <img class="slide" src="images/daniel-storek-JM-qKEd1GMI-unsplash.jpg" alt="">
        <img class="slide" src="images/mostafa-mahmoudi-J4DnKxz_3sA-unsplash.jpg" alt="">
    </div>

    <button class="prev" onclick="prevSlide()">&#10094</button>
    <button class="next" onclick="nextSlide()">&#10095</button>

    <div id="sentence" class="container">
        <span class="typing-header" id="shoppa">Shoppa</span>
        <span class="typing-header" id="typingHeader"></span>
    </div>
        `;
};

function addSlideShow() {
    const slideshow = $("#slideshow");
    console.log("Slideshow element:", slideshow);
    const slideshowHTML = createSlideShow();

    slideshow.html(slideshowHTML);
}



//------------------------ JavaScript SlideShow ------------------------

function initializeSlider() {

    const slides = document.querySelectorAll('.slides img');
    let slideIndex = 0;
    let intervalId = null;


    if (slides.length > 0) {
        slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 5000);
    }


    function showSlide(index) {

        if (index >= slides.length) {
            slideIndex = 0;
        } else if (index < 0) {
            slideIndex = slides.length - 1;
        }

        slides.forEach(slide => {
            slide.classList.remove("displaySlide");
        });

        slides[slideIndex].classList.add("displaySlide");
    }

    function prevSlide() {
        clearInterval(intervalId)
        slideIndex--;
        showSlide(slideIndex);
    }

    function nextSlide() {
        slideIndex++;
        showSlide(slideIndex);
    }

    $('#slideshow').on('click', '.prev', prevSlide);
    $('#slideshow').on('click', '.next', nextSlide);
}


// ------------------ Typing Header --------------------


let typingHeaderTimeout;

function initializeTypingHeader() {

const words = ["Damkläder", "Herrkläder", "Smycken"];
let currentIndex = 0;
let currentWord = words[currentIndex];
let index = 0;
let direction = 1;

function typeWord() {
    const sentence = currentWord.substring(0, index);
    document.getElementById('typingHeader').textContent = sentence;
    index += direction;
    if (index > currentWord.length + 1 || index < 0) {
        direction *= -1;
        if (index < 0) {
            setTimeout(changeWord, 500); 
        } else {
            typingHeaderTimeout = setTimeout(typeWord, 1000); 
        }
    } else {
        typingHeaderTimeout = setTimeout(typeWord, 150);
    }
}

function changeWord() {
    currentWord = words[currentIndex];
    index = direction === 1 ? 0 : currentWord.length;
    currentIndex = (currentIndex + 1) % words.length;
    typingHeaderTimeout = setTimeout(typeWord, 150); 
}

typeWord();
}

