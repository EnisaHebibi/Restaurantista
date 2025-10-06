


async function fetchMenuData(){
    try {
        // const online=await fetch("https://dummyjson.com/c/156c-0e27-4532-8c0f");  online dummy json created by me
const response=await fetch("js/foods.json");
const foodData=await response.json();

        renderCategories(foodData.categories);

        const firstCategory=Object.keys(foodData.categories)[0];
        // console.log(firstCategory)

        renderMenuItems(foodData.categories[firstCategory],firstCategory);

        setupCategorySwitching(foodData.categories);
        // console.log(foodData.categories+"enisa")

        document.querySelector(".menu-category").classList.add("active");
    }

    catch (error){
        console.log(error);
    }
}

function renderCategories(categories){
    const categoriesContainer=document.querySelector(".menu-categories");
    categoriesContainer.innerHTML="";

    Object.keys(categories).forEach((categoryName,index)=>{
        const categoryElement=document.createElement("div");
        categoryElement.classList.add("menu-category");

        if (index===0){
            categoryElement.classList.add("active");
        }

        categoryElement.innerHTML=`
        <img width="200px" src="img/pasta.svg" alt="Breakfast">
        <div class="menu-category-info">
        <h3 class="menu-category-title">${categoryName}</h3>
        <p class="text-gray">${categories[categoryName].length} items</p>
        </div>
        `;

        categoriesContainer.appendChild(categoryElement);
    });
}

function renderMenuItems(items,categoryName){
    const menuItemsContainer=document.querySelector(".menu-items");
    const categoryTitleElement=document.querySelector(".primary-title");

    categoryTitleElement.textContent= `${categoryName} Menu`;
    menuItemsContainer.innerHTML="";

    items.forEach((item)=>{
       const menuItemElement=document.createElement("div");
       menuItemElement.classList.add("menu-item");

       menuItemElement.innerHTML= `
       <div class="menu-item-header">
					<img class="menu-item-img"
					src="${item.image}"
					 alt="${item.name}"/>
				<div class="menu-item-title">
					<h3>${item.name}</h3>
					<p class="text-gray menu-item-desc">
						${item.description}
					</p>
				</div>
				</div>

				<div class="menu-item-footer">
					<h3 class="menu-item-price">
						<span class="text-gray">$</span>${item.price.toFixed(2)}
					</h3>

					<button class="menu-item-button" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
						Add to cart
					</button>
				</div>
       `;

       menuItemsContainer.appendChild(menuItemElement);
    });

    document.querySelectorAll(".menu-item-button").forEach((button)=>{
        button.addEventListener("click",()=>{
            const name=button.getAttribute("data-name");
            const price=parseFloat(button.getAttribute("data-price"));
            const image=button.getAttribute("data-image");
            addToCart({name,price,image});
        })
    })
}

function addToCart(selectedFood){

    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex=cart.findIndex(
        (item)=>item.name===selectedFood.name);
    if (existingItemIndex!==-1){
        cart[existingItemIndex].quantity+=1;
    }else {
        cart.push({
            name:selectedFood.name,
            price:selectedFood.price,
            image:selectedFood.image,
            quantity:1,
        });
    }
localStorage.setItem("cart",JSON.stringify(cart));
    updateCartBadge();
    renderInvoice();
    Toastify({
        text:`${selectedFood.name} added to the cart!`,
        duration:3000,
        close:true,
        gravity:"bottom",
        position:"center",
        backgroundColor:"#ff7a00",
        stopOnFocus:true,
    }).showToast();
}

function updateCartBadge(){
    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    let totalUniqueItems=cart.length;

    document.getElementById("cart-badge").textContent=totalUniqueItems;
}


function setupCategorySwitching(categories) {
    const categoryElements = document.querySelectorAll(".menu-category");

    categoryElements.forEach((categoryElement) => {
        categoryElement.addEventListener("click", () => {
            const selectedCategoryName = categoryElement.querySelector(".menu-category-title").textContent;

            categoryElements.forEach((el) => el.classList.remove("active"));


            categoryElement.classList.add("active");

            renderMenuItems(categories[selectedCategoryName], selectedCategoryName);
        });
    });
}



function renderInvoice(){
    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    const invoiceItemsContainer=document.querySelector(".invoice-items");
    const paymentSummaryContainer=document.querySelector(".payment-summary");


    let subTotal=0;   invoiceItemsContainer.innerHTML="<h2>Invoice</h2>";
    cart.forEach((item,index)=>{
        const itemTotalPrice=item.price*item.quantity;
        subTotal+=itemTotalPrice;

        const invoiceItemElement=document.createElement("div");
        invoiceItemElement.classList.add("invoice-item");
        invoiceItemElement.innerHTML=`
        	<img class="invoice-item-img"
        	 src="${item.image}"
        	 alt="${item.name}">

			<div class="invoice-item-details">
				<h3>"${item.name}"</h3>
				<div class="invoice-item-quantity">
					<button class="quantity-btn decrease" data-index="${index}">-</button>
					<input type="text" class="quantity-input" value="${item.quantity}">
					<button class="quantity-btn increase" data-index="${index}">+</button>
				</div>
			</div>

			<div class="invoice-item-price">
				<h3>$${itemTotalPrice.toFixed(2)}</h3>
			</div>
        `;

        invoiceItemsContainer.appendChild(invoiceItemElement);
    });

    const tax=subTotal * 0.04;
    const totalPayment=subTotal+tax;

    paymentSummaryContainer.innerHTML=`
    		<h3>Payment Summary</h3>
		<div class="summary-detail">
			<p class="text-gray">Sub Total</p>
			<p>$${subTotal.toFixed(2)}</p>
		</div>

		<div class="summary-detail">
			<p class="text-gray">Tax</p>
			<p>$${tax.toFixed(2)}</p>
		</div>
		<div class="summary-total">
			<p class="text-gray">Total Payment</p>
			<p>$${totalPayment.toFixed(2)}</p>
		</div>
		<button class="pay-button">Pay $${totalPayment.toFixed(2)}</button>
	</div>
    `;

    const increaseButton=document.querySelectorAll(".quantity-btn.increase");
    const decreaseButton=document.querySelectorAll(".quantity-btn.decrease");

    increaseButton.forEach((button)=>{
        button.addEventListener("click",(e)=>{
            const index=event.target.dataset.index;
            updateCartQuantity(index,1);
        });
    });

    decreaseButton.forEach((button)=>{
        button.addEventListener("click",(e)=>{
            const index=event.target.dataset.index;
            updateCartQuantity(index,-1);
        })
    });

    document.querySelector(".pay-button").addEventListener("click",function (){
        document.getElementById("payment-modal").style.display="block";
    });
}

function updateCartQuantity(index,change){
    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    const item=cart[index];

    if (item){
        item.quantity+=change;
        if (item.quantity<1){
            cart.splice(index,1);
        }
    }

    localStorage.setItem("cart",JSON.stringify(cart));
    renderInvoice();
    updateCartBadge();
}





document.addEventListener("DOMContentLoaded",()=>{
    fetchMenuData();
    updateCartBadge();
    renderInvoice();
})