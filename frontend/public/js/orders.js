
function displayOrders(data) {
    if (data.success) {
        const ordersContainer = document.getElementById('orders-container');

        data.orders.forEach(order => {
            const date = (()=>{
                const d = new Date(order.createdAt);
                return d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
            })();
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-container');
            orderDiv.innerHTML = `
                <h5 class="text-success">Ordered On: ${date}</h5>
                <p class="text-primary">Order ID: ${order.id}</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="row mb-3 border border-1">
                            <div class="col-md-2">
                                <img src="${item.product.imageUrl}" class="img-fluid product-img" alt="${item.product.productName}">
                            </div>
                            <div class="col-md-10">
                                <h6>${item.product.productName}</h6>
                                <p>${item.product.description}</p>
                                <p>Rs. ${item.product.price.toLocaleString('en-IN')}</p>
                                <p>Quantity: ${item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h5>Total:</h5>
                    <h2>Rs. ${order.totalPrice.toLocaleString('en-IN')}</h2>
                </div>
            `;
            ordersContainer.appendChild(orderDiv);
        });
    } else {
        ordersContainer.innerHTML = `<p class="text-danger">Failed to fetch orders</p>`;
    }
}

const getOrders = async()=>{
    try {
        const response = await axios.get("/order/orders");
        const data = await response.data;
        if(data.orders.length>0)
            displayOrders(data);
        else
            document.getElementById("msg-order").innerText = "No Orders To Display";
    } catch (error) {
        console.log(error);
        document.getElementById("msg-order").innerText = "No Orders To Display";
        alert("Something went wrong");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getOrders();
});