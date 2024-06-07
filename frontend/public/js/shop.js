
const fetchProducts = async () => {
    try {
        const response = await axios.get('/products');
        const data = await response.data;
        if (data.success)
            return data.product;
        else
            alert("Something went wrong");
    } catch (error) {
        console.log(error);
        alert("Something went wrong...");
    }
}

function createProductCard(product) {
    return `
    <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="card">
                <img src="https://cdn-icons-png.flaticon.com/512/3081/3081840.png" style="max-height: 200px; object-fit: contain;" class="card-img-top img-fluid" alt="${product.productName}">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Rs. ${product.price}</strong></p>
                    <div class="d-flex justify-content-around align-content-center">
                    <p class="btn btn-primary btn-sm" style="pointer-events: none; cursor: default;">
                    In Stock <span class="badge text-bg-danger">${product.quantity}</span>
                    </p>
                    <p class="btn btn-warning btn-sm" id=${product.id} onclick="addToCart('${product.id}')">Add to Cart</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayProducts(products) {
    const productCardsContainer = document.getElementById('product-cards');
    products.forEach(product => {
        productCardsContainer.innerHTML += createProductCard(product);
    });
}

fetchProducts()
    .then((products) => {
        displayProducts(products);
    })
    .catch((error) => {
        alert("Something went wrong");
        console.log(error);
    });


const addToCart = async (productId) => {
    try {
        const response = await axios.post("/user/cart", {productId : productId, quantity : 1}, {
            headers : {
                "Content-Type" : "application/json"
            }
        });

        const data = await response.data;
        if(data.success)
            alert("Added To Cart");
        else
            alert(data.message);

    } catch (error) {
        alert("Something went wrong");
        console.log(error);
    }
}
