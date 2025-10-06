let currentIndex=0;
const visibleItemCount=3;
let currentFoodPrice=0;
let currentQuantity=1;

async function fetchFoodData(){
    try {
        const response=await fetch("js/foods.json");
        const foodData=await response.json();
        // console.log(foodData);

        const heroCategory="Lunch";
        const foodsOfCarousel=foodData.categories[heroCategory];
        renderFoodCarousel(foodsOfCarousel);
        updateHeroImage(foodsOfCarousel[0])

        setupArrowNavigation(foodsOfCarousel);
    }

    catch (error){
        console.log(error);
    }
}
function renderFoodCarousel(foodsOfCarousel){
    const foodItemContainer=document.querySelector(".food-items");
    foodItemContainer.innerHTML="";

    foodsOfCarousel.forEach((food,index)=>{
        const foodItem=document.createElement("div");
        foodItem.classList.add("food-item");
        if (index===0){
            foodItem.classList.add("selected");
            const total=document.querySelector(".price");
            total.textContent=`$${food.price.toFixed(2)}`
        }

        foodItem.innerHTML=`
        		<img src="${food.image}" alt="${food.name}"/>
				<p>${food.name}<br>
				<span class="food-price"><span class="valute">$</span>${food.price.toFixed(2)}</span></p>
        `;

        if (index>=3){
            foodItem.style.display="none";
        }

        foodItem.addEventListener("click",()=>{
            selectFoodItem(food,foodItem);
            currentIndex=index;
        })

        foodItemContainer.appendChild(foodItem);

    })
}


function updateTotalPrice(){
    const totalPrice=document.querySelector(".order-info-total .price");
    const total=currentFoodPrice*currentQuantity;
    totalPrice.textContent=`$${total.toFixed(2)}`
}

function updateQuantity(newQuantity)
{
currentQuantity=newQuantity;
const quantityElement=document.querySelector(".quantity");
if (quantityElement){
    quantityElement.textContent=currentQuantity;
}

updateTotalPrice();
}

function updateHeroImage(selectedFood){
    const heroImage=document.querySelector(".hero-image");
    heroImage.innerHTML=`
    <img class="hero-main-image" src="${selectedFood.image}" alt="${selectedFood.name}"/>

	<div class="food-details">
		<div class="food-title">
			<p>${selectedFood.name}</p>
			<p><i class="fa-solid fa-star"></i>${selectedFood.rating.toFixed(1)}</p>
		</div>

		<p class="prepare-time">
			<i class="fa-regular fa-clock"></i>${selectedFood.preparation}
		</p>
	</div>
    `;

}

function selectFoodItem(selectedFood,selectedElement){
    updateHeroImage(selectedFood);
    currentFoodPrice=selectedFood.price;
    updateQuantity(currentQuantity);

    const allFoodItems=document.querySelectorAll(".food-item");
    allFoodItems.forEach((item)=> item.classList.remove("selected"));
    selectedElement.classList.add("selected");
}

const increaseBtn=document.getElementById("increment");
if (increaseBtn){
    increaseBtn.addEventListener("click",()=>{
        updateQuantity(currentQuantity+1);
})
}

const decreaseBtn=document.getElementById("decrement");
if (decreaseBtn){
        decreaseBtn.addEventListener("click",()=>{
            if (currentQuantity>1){
                updateQuantity(currentQuantity-1);
            }
        })
}


function updateVisibleItems(){

    const foodItems=document.querySelectorAll(".food-item");

    foodItems.forEach((item,index)=>{
        if (index>=currentIndex && index<currentIndex+visibleItemCount){
            item.style.display="block";
        }else {
            item.style.display="none";
        }
    })
}

function setupArrowNavigation(foods)
{
    const leftArrow=document.querySelector(".left-arrow");
    const rightArrow=document.querySelector(".right-arrow");

    leftArrow.addEventListener("click",()=>{
        if (currentIndex>0){
            currentIndex--;
        }else {
            currentIndex=foods.length-visibleItemCount;
        }
        updateVisibleItems();
    })



    rightArrow.addEventListener("click",()=>{
        if (currentIndex<foods.length-visibleItemCount){
            currentIndex++;
        }else {
            currentIndex=0;
        }
        updateVisibleItems();
    })



}

document.querySelector(".add-to-cart").addEventListener("click",()=>{
    const selectedFood={
        name:document.querySelector(".food-title p:first-of-type").textContent,
        price:currentFoodPrice,
        image:document.querySelector(".hero-main-image").src,
    }
    addToCart(selectedFood);
});

function addToCart(selectedFood){
    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex=cart.findIndex((item)=>item.name===selectedFood.name);
    if (existingItemIndex!==-1){
        cart[existingItemIndex].quantity+=currentQuantity;
    }else {
        cart.push({
            name:selectedFood.name,
            price:selectedFood.price,
            image:selectedFood.image,
            quantity:currentQuantity,
        })
    }
    localStorage.setItem("cart",JSON.stringify(cart));

    updateCartBadge();

    Toastify({
        text:`${selectedFood.name} is added to the cart!`,
        duration:3000,
        close:true,
        gravity: "bottom",
        position:"center",
        backgroundColor:"var(--primary-color)",
        stopOnFocus: true,
    }).showToast();

}

function updateCartBadge(){
    let cart=JSON.parse(localStorage.getItem("cart")) || [];
    let totalUniqueItems=cart.length;
    document.getElementById("cart-badge").textContent=totalUniqueItems;
}

document.addEventListener("DOMContentLoaded",()=>{
    fetchFoodData();
    updateCartBadge();
})









