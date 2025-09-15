var slideInFromLeftTargets = document.querySelectorAll(".slide-in-from-left-target");
var slideInFromRightTargets = document.querySelectorAll(".project-item");
var slideInFromTopTargets = document.querySelectorAll(".slide-in-from-top-target");
var popTargets = document.querySelectorAll(".pop-target");

function runAnimation(targets, animationName, interval){
    let startTime = null;
    let currentItem = 0;

    function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsedTime = timestamp - startTime;

    if (elapsedTime > currentItem * interval) {
        if (currentItem < targets.length) {
            item = targets[currentItem];
            item.classList.add(animationName);
            item.classList.remove("hidden");

            if(animationName == "slide-in-from-left"){
                if(item instanceof HTMLDivElement){
                    item.addEventListener("animationend", function(){
                        let input = this.querySelector("input");
                        input.checked = !input.checked;
                    })
                }
            }
            else if(animationName == "slide-in-from-right"){
                if(item instanceof HTMLDivElement){
                    item.addEventListener("animationend", function(){
                        this.querySelectorAll(".pop-target").forEach(function(element){
                            let randomNumber = Math.floor(Math.random() * 10) * 50 + 1;
                            
                            setTimeout(() => {
                                element.classList.remove("hidden");
                                element.classList.add("pop");
                            }, randomNumber);
                        });
                    })
                }
            }
        currentItem++;
        }
    }

    if (currentItem < targets.length) {
        requestAnimationFrame(animate);
    }
    }

    requestAnimationFrame(animate);

}


runAnimation(slideInFromLeftTargets, "slide-in-from-left", 100);
runAnimation(slideInFromRightTargets, "slide-in-from-right", 200);
runAnimation(slideInFromTopTargets, "slide-in-from-top", 100);

const byTechnologyButton = document.querySelector("#by-technology").querySelector("span");
const byYearButton= document.querySelector("#by-year").querySelector("span");



function addSortEventListeners(button){
    button.addEventListener('mouseover', function(){
        this.querySelectorAll("h2").forEach((h2)=>{
            h2.classList.add("text-gray-500");
        });
    });
    button.addEventListener('mouseout', function(){
        this.querySelectorAll("h2").forEach((h2)=>{
            if(h2.classList.contains("text-gray-500")){
                h2.classList.remove("text-gray-500");
            }
        });
    });
    button.addEventListener('click', function(){
        document.querySelectorAll(".card-body.webapp-project").forEach((project)=>{
            if(project.classList.contains("slide-out")){
                project.classList.remove("slide-out");
            }
            else{
                project.classList.add("slide-out");
            }
        });
    });
}

addSortEventListeners(byTechnologyButton);
addSortEventListeners(byYearButton);

byYearButton.addEventListener('mouseover', function(){
    this.querySelectorAll("h2").forEach((h2)=>{
        h2.classList.add("text-gray-500");
    });
});
byYearButton.addEventListener('mouseout', function(){
    this.querySelectorAll("h2").forEach((h2)=>{
        if(h2.classList.contains("text-gray-500")){
            h2.classList.remove("text-gray-500");
        }
    });
});