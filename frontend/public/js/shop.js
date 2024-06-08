
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
    const description = truncateDescription(product.description, 100);
    const title = truncateTitle(product.productName, 20);
    return `
    <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="card">
                <a style="cursor:pointer;" onclick="displayProduct('${product.id}')"><img style="height:200px; width:100%; object-fit:contain; object-position:center;" data-bs-toggle="modal" data-bs-target="#product-modal" src="${product.imageUrl}" style="max-height: 200px; object-fit: contain;" class="card-img-top img-fluid" alt="${product.productName}"></a>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text description">${description}</p>
                    <p class="card-text"><strong>Rs. ${product.price.toLocaleString('en-IN')}</strong></p>
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

function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.slice(0, maxLength).trim() + '...';
}

function truncateTitle(title, maxLength) {
    if (title.length <= maxLength) {
        return title;
    }
    return title.slice(0, maxLength).trim() + '...';
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
        const response = await axios.post("/user/cart", { productId: productId, quantity: 1 }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.data;
        if (data.success)
            alert("Added To Cart");
        else
            alert(data.message);

    } catch (error) {
        alert("Something went wrong");
        console.log(error);
    }
}

// modal for displaying product 


async function displayProduct(productId) {
    try {
        const response = await axios.get(`/product/${productId}`);
        const data = response.data;

        if (data.success) {
            const product = data.product;
            document.getElementById('product-name').innerText = product.productName;
            document.getElementById('product-price').innerText = 'Rs. ' + product.price.toLocaleString('en-IN');
            document.getElementById('product-quantity').innerText = 'Quantity: ' + (product.quantity || 1);
            document.getElementById('product-description').innerText = product.description;
            document.getElementById('product-image').src = product.imageUrl;
        }

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}

