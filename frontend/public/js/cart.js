const getCart = async () => {
    const response = await axios.get('/user/cart/products');
    const data = await response.data;
    return data;
}


const cartItemsContainer = document.getElementById('cart-items');

const setCartItems = (cart) => {
    cart.forEach(item => {
        const itemTotalPrice = item.quantity * item.price;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <a onclick="displayProduct('${item.id}')" style="cursor:pointer;"><img data-bs-toggle="modal" data-bs-target="#product-modal" src="https://cdn-icons-png.flaticon.com/512/3081/3081840.png" alt="${item.productName}"></a>
                    <div>
                        <h5 class="card-title">${item.productName}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Rs. ${item.price}</h6>
                    </div>
                    <div>
                        <p class="card-text">Quantity: ${item.quantity}</p>
                        <p class="card-text">Total Price: Rs. ${itemTotalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

getCart()
    .then((data) => {
        if (data.success) {
            if (data.cart.length > 0)
                setCartItems(data.cart);
            else
                document.getElementById("cart-items").innerHTML = `<h3 class="text-danger">Your Cart Is Empty</h3>`;
            document.getElementById('total-items').innerText = data.totalProducts;
            document.getElementById('total-price').innerText = data.totalPrice;
        }
        else
            alert("Something went wrong");
    })
    .catch((error) => {
        alert("Something went wrong");
        console.log(error);
    });


document.getElementById("place-order").addEventListener("click", async (e) => {
    try {
        const response = await axios.post("/order");
        const data = await response.data;
        if (data.success) {
            alert(data.message);
            document.getElementById('total-items').innerText = 0;
            document.getElementById('total-price').innerText = 0;
            document.getElementById("cart-items").innerHTML = `<h3 class="text-danger">Your Cart Is Empty</h3>`;
        }
        else
            alert("Something went wrong, try again after sometime");
    } catch (error) {
        console.log(error);
        if(error.response.data.error)
            alert(error.response.data.error);
        else
            alert("Something went wrong");
    }
})


async function displayProduct(productId) {
    try {
        const response = await axios.get(`/product/${productId}`);
        const data = response.data;

        if (data.success) {
            const product = data.product;
            document.getElementById('product-name').innerText = product.productName;
            document.getElementById('product-price').innerText = '₹' + product.price.toFixed(2);
            document.getElementById('product-quantity').innerText = 'Quantity: ' + (product.quantity || 1);
            document.getElementById('product-description').innerText = product.description;
            document.getElementById('product-image').src = "https://cdn-icons-png.flaticon.com/512/3081/3081840.png";
        }

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}
