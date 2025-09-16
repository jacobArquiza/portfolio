var slideInFromLeftTargets = document.querySelectorAll(".slide-in-from-left-target");
var slideInFromRightTargets = document.querySelectorAll(".project-item");
var slideInFromTopTargets = document.querySelectorAll(".slide-in-from-top-target");
var popTargets = document.querySelectorAll(".pop-target");

// This function can now be used for any animation and correctly manages the onEndCallback.
function runAnimation(targets, animationName, interval, onEndCallback) {
    let startTime = null;
    let currentItem = 0;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let elapsedTime = timestamp - startTime;

        if (elapsedTime > currentItem * interval) {
            if (currentItem < targets.length) {
                const item = targets[currentItem];
                item.classList.add(animationName);
                item.classList.remove("hidden");

                // Attach a listener to the last item in the sequence to call the final callback.
                if (currentItem === targets.length - 1 && typeof onEndCallback === 'function') {
                    item.addEventListener("animationend", function handleAnimationEnd() {
                        onEndCallback();
                        this.removeEventListener("animationend", handleAnimationEnd);
                    }, { once: true });
                }

                // Call a dedicated function to handle specific animation-end logic.
                // This keeps runAnimation clean.
                handleSpecificAnimationEnd(item, animationName);

                currentItem++;
            }
        }
        
        if (currentItem < targets.length) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

// A new, separate function to handle specific animation-end logic for different cases.
function handleSpecificAnimationEnd(item, animationName) {
    if (animationName === "slide-in-from-left" && item instanceof HTMLDivElement) {
        item.addEventListener("animationend", function() {
            const input = this.querySelector("input");
            if (input) {
                input.checked = !input.checked;
            }
        }, { once: true });
    } else if (animationName === "slide-in-from-right" && item instanceof HTMLDivElement) {
        item.addEventListener("animationend", function() {
            this.querySelectorAll(".pop-target").forEach(function(element) {
                const randomNumber = Math.floor(Math.random() * 10) * 50 + 1;
                setTimeout(() => {
                    element.classList.remove("hidden");
                    element.classList.add("pop");
                }, randomNumber);
            });
        }, { once: true });
    }
}
runAnimation(slideInFromLeftTargets, "slide-in-from-left", 100);
runAnimation(slideInFromRightTargets, "slide-in-from-right", 200);
runAnimation(slideInFromTopTargets, "slide-in-from-top", 100);

const byTechnologyButton = document.querySelector("#by-technology").querySelector("span");
const byYearButton= document.querySelector("#by-year").querySelector("span");

let isAnimating = false;

// The onEndCallback function should be declared outside to be accessible
const onEndCallback = () => {
    isAnimating = false;
};

function handleSort(targetClass) {
    if (isAnimating) {
        console.log("Locked sorry buddy");
        return; // Exit the function if an animation is already running.
    }

    const visibleProjects = document.querySelectorAll(".project-item:not(.hidden)");
    const allProjects = document.querySelectorAll(".project-item");
    const projectsToShow = document.querySelectorAll("." + targetClass);

    isAnimating = true; // Lock the function once, at the start.

    if (visibleProjects.length > 0) {
        visibleProjects.forEach(project => {
            project.classList.add("slide-out");
            project.classList.remove("slide-in-from-right");
        });

        const lastVisibleProject = visibleProjects[visibleProjects.length - 1];
        lastVisibleProject.addEventListener("animationend", function handleAnimationEnd(event) {
            if (event.animationName === "slide-out") {
                allProjects.forEach(project => {
                    project.classList.remove("slide-out");
                    project.classList.add("hidden");
                });
                
                // --- THIS IS THE CRUCIAL CHANGE ---
                // We are now passing the onEndCallback to this runAnimation call.
                runAnimation(projectsToShow, "slide-in-from-right", 200, onEndCallback);
            }
            this.removeEventListener("animationend", handleAnimationEnd);
        }, { once: true });
    } else {
        // If no projects are visible, slide in the new ones and pass the callback.
        runAnimation(projectsToShow, "slide-in-from-right", 200, onEndCallback);
    }
}

// A simpler function to add hover effects
function addHoverEffects(element) {
    element.addEventListener('mouseover', function() {
        this.classList.add("text-gray-500", "cursor-pointer");
    });
    element.addEventListener('mouseout', function() {
        this.classList.remove("text-gray-500", "cursor-pointer");
    });
}

// Data structure linking prefixes to project classes
const prefixMappings = {
    webapp: { list: document.querySelectorAll('.webapp-prefix'), type: 'webapp-project' },
    robocv: { list: document.querySelectorAll('.robocv-prefix'), type: 'robocv-project' },
    mlai: { list: document.querySelectorAll('.mlai-prefix'), type: 'mlai-project' },
    gamedev: { list: document.querySelectorAll('.gamedev-prefix'), type: 'gamedev-project' },
    uiux: { list: document.querySelectorAll('.uiux-prefix'), type: 'uiux-project' },
    y2025: { list: document.querySelectorAll('.y2025-prefix'), type: 'y2025-project' },
    y2024: { list: document.querySelectorAll('.y2024-prefix'), type: 'y2024-project' }
};

// ---
// Event Listeners for the individual prefixes
// ---
Object.values(prefixMappings).forEach(mapping => {
    mapping.list.forEach(prefix => {
        addHoverEffects(prefix);
        prefix.addEventListener('click', () => handleSort(mapping.type));
    });
});

function setupTypewriter() {
    const element = document.querySelector('.typewriter');
    const textLength = element.textContent.length;
    
    // Temporarily set the width to auto to get its real width.
    element.style.width = 'auto';
    const textWidth = element.offsetWidth + 'px';
    
    // Set the CSS variables
    element.style.setProperty('--steps', textLength);
    element.style.setProperty('--width', textWidth);
    element.style.setProperty('--duration', '3.5s'); // Set the duration here

    // Reset the width to 0 to prepare for the animation
    element.style.width = '0';
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', setupTypewriter);