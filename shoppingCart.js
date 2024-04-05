

/*FÖRST eventlyssnare till shoppingCartIcon. DÅ loadCartContent. 
    SEN  prepareModalForUpdate OCH displayProductInModal ->
            DÅ  fetchProduct SEN createProductCard  */


document.getElementById('shoppingCartIcon').addEventListener('click', loadCartContent);


document.getElementById('clearCartButton').addEventListener('click', clearCart);




function loadCartContent() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    prepareModalForUpdate()
    cart.forEach(item => {
     
        displayProductInModal(item.id, item.quantity);
    });
    updateTotalAmount();
}


function prepareModalForUpdate() {
    const cartContent = document.getElementById('cartContent'); 
    cartContent.innerHTML = ''; // Tömmer innehållet.
}


function displayProductInModal(productId, quantity){

    fetchProduct(productId).then(product => {
        const productCard = createProductCard(product, quantity);
        const modalContent = document.getElementById('cartContent');
        modalContent.innerHTML += productCard;
       
    })
}


function fetchProduct(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Hämtad produkt:", data);
            return {
                id: data.id,
                image: data.image,
                title: data.title,
                price: data.price,
            };
        });
}
 


function createProductCard(product, quantity) {
    console.log("Produkt ID när kort skapas:", product.id);
    return `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${product.image}" class="img-fluid" alt="${product.title}">
                </div>
                <div class="col-md-5">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <div class="d-flex align-items-center" id=quantityButtons>
                            <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity('${product.id}')">-</button>
                            <span class="mx-2">${quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity('${product.id}')">+</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card-body">
                    <button class="btn mb-2" onclick="removeFromCart('${product.id}')"><i class="bi bi-trash"></i></button>
                        <p class="card-text"><small class="text-muted">$${product.price}</small></p>
                    </div>
                </div>
            </div>
        </div>
       
    `;
}



async function addToCart(productId){
    let price;

    const productData = await fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .catch(error => console.error('Error:', error));

    if (productData) {
        price = productData.price; 
    }

    //försöker hämta varukorg fr ls, om tom skapas tom array
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    //jämför productId, dvs tillagd produkt, med id:n i localstorage
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        // om produkten finns, öka antal i ls
        cart[productIndex].quantity += 1;
    } else {
        // om inte, lägg till den
        cart.push({ id: productId, quantity: 1, price: price });
    }
    //spara uppdaterad vk i ls
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotalAmount();

    alert('Produkten har lagts till i varukorgen.');

}



function removeFromCart(productId) {
    console.log("Försöker ta bort produkt med ID:", productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = cart.filter(item => item.id !== Number(productId));

    localStorage.setItem('cart', JSON.stringify(filteredCart));

    loadCartContent();
}


function updateTotalAmount() {
    let totalSum = calculateTotal();
    let totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = `Totalt: $${totalSum}`;

    localStorage.setItem('totalSum', totalSum);
}


function calculateTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalSum = 0;
  
    cart.forEach(item => {
        console.log(`Produkt ID: ${item.id}, Pris: ${item.price}, Kvantitet: ${item.quantity}`); // Debugging
        totalSum += item.price * item.quantity;
    });

    return totalSum.toFixed(2);
}


function increaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.id === Number(productId));
    if (product) {
        product.quantity += 1;
    } else {
        console.error("Produkten hittades inte i varukorgen.");
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartContent(); 
    updateTotalAmount();
}

function decreaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.id === Number(productId));
    if (product && product.quantity > 1) {
        product.quantity -= 1;
    } else if (product && product.quantity === 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        console.error("Produkten hittades inte i varukorgen.");
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartContent(); // Uppdatera varukorgens innehåll
    updateTotalAmount(); // Uppdatera den totala summan
}


function clearCart(){
    localStorage.setItem('cart', JSON.stringify([]));
    document.getElementById('cartContent').innerHTML = '<p>Varukorgen är tom.</p>';
    updateTotalAmount();
   
}
