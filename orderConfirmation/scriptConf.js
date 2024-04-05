$(document).ready(function () {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cardInput = $('#cardInput');
    cardInput.empty();
    let totalAmount = 0;

    // Loopar igenom varje objekt i varukorgen
    cartItems.forEach(item => {
        fetch(`https://fakestoreapi.com/products/${item.id}`)
            .then(response => response.json())
            .then(data => {
                const img = data.image;
                const title = data.title;
                const price = data.price;
                const quantity = item.quantity;

                totalAmount += price * quantity;

                // Uppdaterad för att inkludera 'quantity' i parameterlistan
                const cardHTML = createCard(img, title, price, quantity);
                cardInput.append(cardHTML);

                $('#totalpay').text(`Totalbelopp: $${totalAmount.toFixed(2)}`);
            })
            .catch(error => console.error("Error fetching product:", error));
    });

    getEmail(); // Hämtar och visar e-postadressen
});

function createCard(image, title, price, quantity) {
    return `
        <div class="row product-card">
            <div class="col-4 d-flex justify-content-center align-items-center">
                <img src="${image}" alt="product image" class="img-fluid" style="height: 100px;">
            </div>
            <div class="col-8 d-flex flex-column justify-content-center">
                <h3>${title}</h3>
                <p>Antal: ${quantity}</p>
                <h5>$${price}</h5>
            </div>
        </div>
    `;
}


function getEmail() {
    const email = localStorage.getItem('email');
    if (email) {
        const sendTo = document.getElementById('send');
        sendTo.textContent = `En bekräftelse kommer att skickas till: ${email}`;
    }
}
