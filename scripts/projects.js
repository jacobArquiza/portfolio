var slideInFromLeftTargets = document.querySelectorAll(".slide-in-from-left-target");
var slideInFromRightTargets = document.querySelectorAll(".project-item");
var slideInFromTopTargets = document.querySelectorAll(".slide-in-from-top-target");

function runAnimation(targets, animationName){
    let startTime = null;
    let currentItem = 0;
    const interval = 100; 

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
                        console.log(input);
                        input.checked = !input.checked;
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


runAnimation(slideInFromLeftTargets, "slide-in-from-left");
runAnimation(slideInFromRightTargets, "slide-in-from-right");
runAnimation(slideInFromTopTargets, "slide-in-from-top");