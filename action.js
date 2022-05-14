let products = [];

function toShort(str, max = 50) {
    if (str.length > max) {
        return str.substring(0, max) + "...";
    }
    return str;
}
function toShowProducts(x) {
    $("#products").empty();
    x.map(p => {
        $("#products").append(` 
            <div class="card product pt-4">
                <img src="${p.image}" alt="" class="card-img-top">
                <div class="card-body border rounded">
                    <p class="card-title text-primary mt-5 text-nowrap overflow-hidden">${toShort(p.title)}</p>
                    <small class="text-muted">${toShort(p.description, 110)}</small>

                    <div class="d-flex justify-content-between align-items-end mt-4">
                        <span class="">${p.price}</span>
                        <button class="btn btn-sm btn-outline-primary  add-to-cart" data-id="${p.id}">
                            Add <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
            
                </div>
            </div>
        `);
    })
}

function cartTotal() {
    let count = $(".item-in-cart-cost").length;
    $(".item-in-cart-count").html(count);
    if (count > 0) {
        let totalCost = $(".item-in-cart-cost").toArray().map(el => el.innerHTML).reduce((x, y) => Number(x) + Number(y));

        $(".total").html(`
            <div class= "d-flex justify-content-between font-weight-bold px-3" >
                <h4>Total</h4>
                <h4>$ <span class="cart-cost-total">${Number(totalCost).toFixed(2)}</span></h4>
            </div>
        `);
    } else {
        $(".total").html(`<p>There is no empty cart</p>`);
    }
}
$.get("https://fakestoreapi.com/products/", function (data) {
    //console.log(data);
    products = data;
    toShowProducts(products);
});

$.get("https://fakestoreapi.com/products/categories/", function (data) {
    data.map(cat => {
        $("#category").append(`
            <option value="${cat}">${cat}</option>
        `);
    })

});


$("#search").on("keyup", function (e) {
    let keyword = $(this).val().toLowerCase();

    if (keyword.trim().length > 2) {
        let filterProducts = products.filter(product => {
            if (product.title.toLowerCase().indexOf(keyword) > -1 || product.description.toLowerCase().indexOf(keyword) > -1 || product.price == keyword) {
                return product;
            }
        })
        toShowProducts(filterProducts);
    }

    //console.log(filterProducts);

});

$("#category").on("change", function () {
    let selectedCategory = $(this).val();
    console.log(selectedCategory);
    if (selectedCategory != 0) {
        let filterProducts = products.filter(product => {
            if (product.category === selectedCategory) {
                return product;
            }
        })
        toShowProducts(filterProducts);
    } else {
        toShowProducts(products);
    }
})

$("#products").delegate(".add-to-cart", "click", function () {
    let currentItemId = $(this).attr("data-id");
    //console.log(currentItemId);
    let productInfo = products.filter(el => el.id == currentItemId)[0];
    //console.log(productInfo);

    if ($(".item-in-cart").toArray().map(el => el.getAttribute("data-id")).includes(currentItemId)) {
        alert("Already Exit");
    } else {
        $("#cart").append(`
            <div class= "card border-0 item-in-cart" data-id="${productInfo.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-end">
                        <img src=" ${productInfo.image}" class="img-in-cart" alt="">
                        <button class="btn btn-outline-danger remove-from-cart">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <p class="mt-3">
                        ${productInfo.title}
                    </p>
                    <div class="d-flex justify-content-between  align-items-end">
                        <div class="form-row">
                            <button class="btn btn-outline-primary btn-sm quantity-minus">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control w-25 mx-1 quantity"
                                unitPrice="${productInfo.price}" value="1" min="1">
                            <button class="btn btn-outline-primary btn-sm quantity-plus">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <p class="mb-0">$ <span class="item-in-cart-cost"> ${productInfo.price}</span></p>
                    </div>
                    <hr>
                </div>
            </div>
        `);
    }
    cartTotal();
});
$("#cart").delegate(".remove-from-cart", "click", function () {
    $(this).parentsUntil("#cart").remove();
    cartTotal();
})

$("#cart").delegate(".quantity-plus", "click", function () {
    let q = $(this).siblings(".quantity").val();
    let p = $(this).siblings(".quantity").attr("unitPrice");
    let newQ = Number(q) + 1;
    let newCost = p * newQ;
    $(this).siblings(".quantity").val(newQ);
    $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
    cartTotal();
})

$("#cart").delegate(".quantity-minus", "click", function () {
    let q = $(this).siblings(".quantity").val();
    let p = $(this).siblings(".quantity").attr("unitPrice");

    if (q > 1) {
        let newQ = Number(q) - 1;
        let newCost = p * newQ;
        $(this).siblings(".quantity").val(newQ);
        $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
        cartTotal();
    }
})

$("#cart").delegate(".quantity", "keyup change", function () {
    let q = $(this).val();
    let p = $(this).attr("unitPrice");

    if (q > 1) {
        let newQ = Number(q);
        let newCost = p * newQ;
        $(this).val(newQ);
        $(this).parent().siblings("p").find(".item-in-cart-cost").html(newCost.toFixed(2));
        cartTotal();
    } else {
        alert("More than one");
    }
})
