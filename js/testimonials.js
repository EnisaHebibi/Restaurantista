document.addEventListener("DOMContentLoaded",()=>{
    const leftArrow=document.querySelector(".left-arrow-testimonial");
    const rightArrow=document.querySelector(".right-arrow-testimonial");
    const dotsContainer=document.querySelector(".carousel-indicators");

    let currentIndex=0;
    let testimonialsData=[];

    fetch("js/testimonials.json")
        .then((response)=>response.json())
        .then((data)=>{
        testimonialsData=data;
        createDots(testimonialsData.length);
        updateTestimonials(testimonialsData,currentIndex);
    });

    function createDots(testimonialsDataLength){
        dotsContainer.innerHTML="";

        for (let i=0;i<testimonialsDataLength;i++){
            const dot=document.createElement("span");
            dot.classList.add("dot");
            if (i===0){
                dot.classList.add("active");
            }

            dotsContainer.appendChild(dot);
        }
        const dots=document.querySelectorAll(".dot")
        dots.forEach((dot,index)=>{
            dot.addEventListener("click",()=>{
                currentIndex=index;
                updateTestimonials(testimonialsData,currentIndex);
                updateDots(currentIndex);
            })
        })
    }


    function updateTestimonials(testimonial,index){
const cardElements=[

    {
        container:document.querySelector(".testimonial-card-first"),
        data:testimonial[index % testimonial.length],
    },

    {
        container:document.querySelector(".testimonial-card-middle"),
        data:testimonial[(index+1) % testimonial.length],
    },

    {
        container:document.querySelector(".testimonial-card-third"),
        data:testimonial[(index+2) % testimonial.length],
    }
        ];
cardElements.forEach((card)=>{
    const {container,data}=card;

    container.querySelector(".testimonial-image img").src=data.image;
    container.querySelector(".testimonial-name").textContent=data.name;
    container.querySelector(".testimonial-role").textContent=data.role;
    container.querySelector(".testimonial-text").textContent=data.text;
})
    }

    leftArrow.addEventListener("click",()=>{
        currentIndex=currentIndex>0?currentIndex-1:testimonialsData.length-1;
        updateTestimonials(testimonialsData,currentIndex);
        updateDots(currentIndex);
    })

    rightArrow.addEventListener("click",()=>{
        currentIndex=currentIndex < testimonialsData.length-1 ? currentIndex + 1 : 0;
        updateTestimonials(testimonialsData,currentIndex);
        updateDots(currentIndex);
    })

    function updateDots(index){
        const dots=document.querySelectorAll(".dot");
        dots.forEach((dot,position)=>{
            if (position===index){
                dot.classList.add("active");
            }else {
                dot.classList.remove("active");
            }
        })
    }

})