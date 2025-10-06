const paymentModal=document.getElementById("payment-modal");
const payButton=document.querySelector(".pay-button");
const successModal=document.getElementById("success-modal");


window.onclick=function (event){
    if (event.target===paymentModal){
        paymentModal.style.display="none";
    }
};

const paymentForm=document.getElementById("payment-form");

paymentForm.addEventListener("submit", (event)=>{
    event.preventDefault();

    const cardNumber=document.getElementById("card-number").value;
    const expirationDate=document.getElementById("expiration-date").value;
    const cvv=document.getElementById("cvv").value;

    //card number validation(must have 16 digits)
    const cardNumberValidation=/^[0-9]{16}$/;
    if (!cardNumberValidation.test(cardNumber.replace(/\s+/g, ""))){
        alert("please enter valid 16 digit card number")
        return;
    }

    //format MM/YY
    const expirationDateValidation=/^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expirationDateValidation.test(expirationDate)){
        alert("please enter valid expiration date")
        return;
    }

    //cvv validation must have 3 digits
    const cvvValidation=/^[0-9]{3}$/;
    if (!cvvValidation.test(cvv)){
        alert("Please enter a valid 3-digit cvv");
        return;
    }

    showSuccessModal();
    paymentModal.style.display="none";
})

//value formating
const cardNumberInput=document.getElementById("card-number");
cardNumberInput.addEventListener("input",(event)=>{
    let input=event.target.value.replace(/\D/g,"");  //remove all non digits characters
    input=input.substring(0,16);  //limiting user to write up to 16 characters

    const formattedCardNumber=input.match(/.{1,4}/g)?.join(" ") || input;  //every 4 digits add a space
    event.target.value=formattedCardNumber;
})

//expiration date formatting

const expirationDateInput=document.getElementById("expiration-date");
expirationDateInput.addEventListener("input",(event)=>{
    let input=event.target.value.replace(/\D/g,"");
    input=input.substring(0,4)//limiting user to write up to 4 characters

    if (input.length>=3){
        event.target.value=`${input.substring(0,2)}/${input.substring(2)}`
    }else {
        event.target.value=input;
    }
})

const cvvDateInput=document.getElementById("cvv");
cvvDateInput.addEventListener("input",(event)=>{
    let input=event.target.value.replace(/\D/g,"");
    input=input.substring(0,3)//limiting user to write up to 3 characters
    event.target.value = input;
})

function showSuccessModal(){
successModal.style.display="flex";

clearCartItems();

setTimeout(function (){
    successModal.style.display="none";
},4000);
}

function clearCartItems(){
    localStorage.removeItem("cart");
    updateCartBadge();
    renderInvoice();
}
