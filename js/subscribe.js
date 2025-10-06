function subscribeUser(event){
    event.preventDefault();

    const email=document.getElementById("subscriberEmail").value;
    const isSubscribe=document.getElementById("checkbox").checked;

    if (!email || !email.includes("@")){
        Toastify({
            text:"Please enter a valid email address.",
            duration:3000,
            position:"center",
            gravity:"top",
            backgroundColor:"red"
        }).showToast();
        return;
    }

    const subscribeUser={
        email:email,
        subscribed:isSubscribe,
    }
    localStorage.setItem("subscriber",JSON.stringify(subscribeUser));

    Toastify({
        text:"Subscription successful. You are now subscribed.",
        duration:3000,
        position:"center",
        gravity:"top",
        backgroundColor:"var(--primary-color)"
    }).showToast();
}

function checkSubscriptionStatus(){
    const subscriber=JSON.parse(localStorage.getItem("subscriber"));
    if (subscriber&& subscriber.subscribed){
        document.getElementById("subscriberEmail").value=subscriber.email;

        Toastify({
            text:"Welcome back "+subscriber.email,
            duration:3000,
            position:"center",
            gravity:"top",
            backgroundColor:"var(--primary-color)"
        }).showToast();

    }
}

document.getElementById("subscribeForm").addEventListener("submit",subscribeUser);
document.addEventListener("DOMContentLoaded",checkSubscriptionStatus);