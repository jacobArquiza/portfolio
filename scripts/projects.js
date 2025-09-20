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

let isAnimating = false;

// The onEndCallback function should be declared outside to be accessible
const onEndCallback = () => {
    isAnimating = false;
};

const projectToModifierMapping = {
    "project-item" : "All",
    "webapp-project" : "WebDev",
    "robocv-project" : "Robotics & CV",
    "mlai-project" : "ML & AI",
    "gamedev-project" : "GameDev",
    "uiux-project" : "UI/UX",
    "y2025-project" : "2025",
    "y2024-project" : "2024"
}

function handleSort(targetClass) {
    if (isAnimating) {
        console.log("Locked sorry buddy");
        return; // Exit the function if an animation is already running.
    }
    
    let modifierInitial = document.querySelector("#modifier-initial");
    let modifierNext = document.querySelector("#modifier-next");
    
    if(modifierInitial.textContent == projectToModifierMapping[targetClass]){//check if a new page was requested
        targetClass = "project-item"
    }
    
    const visibleProjects = document.querySelectorAll(".project-item:not(.hidden)");
    const allProjects = document.querySelectorAll(".project-item");
    const projectsToShow = document.querySelectorAll("." + targetClass);
    

    modifierNext.textContent = projectToModifierMapping[targetClass];

    //clear classes
    modifierInitial.classList.remove("slide-in-and-fade");
    modifierNext.classList.remove("slide-out-and-fade");

    //add classes
    modifierNext.classList.add("slide-in-and-fade");
    modifierInitial.classList.add("slide-out-and-fade");

    modifierInitial.id = "modifier-next";
    modifierNext.id = "modifier-initial";


    setTimeout(() => {
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
    }, 10); 
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

// ---
// Event Listeners for the individual prefixes
// ---
function applyPrefixOnClicks(){
    const prefixMappings = {
        webapp: { list: document.querySelectorAll('.webapp-prefix'), type: 'webapp-project' },
        robocv: { list: document.querySelectorAll('.robocv-prefix'), type: 'robocv-project' },
        mlai: { list: document.querySelectorAll('.mlai-prefix'), type: 'mlai-project' },
        gamedev: { list: document.querySelectorAll('.gamedev-prefix'), type: 'gamedev-project' },
        uiux: { list: document.querySelectorAll('.uiux-prefix'), type: 'uiux-project' },
        y2025: { list: document.querySelectorAll('.y2025-prefix'), type: 'y2025-project' },
        y2024: { list: document.querySelectorAll('.y2024-prefix'), type: 'y2024-project' }
    };

    Object.values(prefixMappings).forEach(mapping => {
        mapping.list.forEach(prefix => {
            addHoverEffects(prefix);
            prefix.addEventListener('click', () => handleSort(mapping.type));
        });
    });
}

function constructIndexItem(categoryObj, i, projects){
    const category = categoryObj.title;
    const prefix = categoryObj.prefix;
    const directoryString= categoryObj.directoryString;
    const projectClass = categoryObj.projectClass;

    let projectsListHTMLStrings = []

    for(project of projects){
        if(project.cardClasses.includes(projectClass)){
            projectsListHTMLStrings.push(
                `
                    <h2 class="${prefix}-prefix font-semibold text-md text-gray">${directoryString}</h2>
                    <h3 class="underline text-md" ><a href="#${project.projectID}">${project.projectName}</a></h3>
                `
            );
        }
    }
    
    const projectsListHTMLString = projectsListHTMLStrings.join('');

    let indexHTML = `
        <div class="collapse collapse-plus bg-base-100 slide-in-from-left-target hidden">
            <input type="checkbox" name="my-accordion-${i}"/>
            <div class="px-0 collapse-title font-semibold">${category}</div>
            <div class="px-0 collapse-content text-sm">
                <div class="grid grid-cols-[20%_1fr] gap-3 ml-2">
                    ${projectsListHTMLString}
                </div>
            </div>
        </div>
    `
    return indexHTML;
}

let globalCarouselItemIndex = 1;
let globalCarouselButtonIndex = 1;

function constructProjectImageDisplay(project){
    let projectImageDisplayHTML = "";
    
    if(project.hasImage){
        if(project.imageURLS.length == 1){
            projectImageDisplayHTML = `
                <div class="rounded-md project-image-preview">
                    <img class="w-[95%] h-auto mx-auto bg-cover bg-center ${project.hasImage && project.imageURLS.length == 1 ? "py-[2.5%]" : ""} "
                        src="${project.hasImage ? project.imageURLS[0] : ""}">
                    </img>
                </div>
            `;
        }
        else {
            projectImageDisplayHTML = `
                <div class="relative w-[95%] mx-auto aspect-video">
                    <div class="carousel absolute top-0 left-0 w-full h-full overflow-hidden project-image-preview">
            `;
            for(let i = 0; i < project.imageURLS.length; i++){
                projectImageDisplayHTML += 
                `<div id="item${globalCarouselItemIndex}" class="carousel-item w-full h-full">
                    <img
                    src="${project.imageURLS[i]}"
                    class="w-full h-full object-cover" />
                </div>`;
                globalCarouselItemIndex++;
            }

            projectImageDisplayHTML += `</div></div>`;
            projectImageDisplayHTML += `<div class="flex w-full justify-center gap-2 py-2">`;
            
            for(let i = 0; i < project.imageURLS.length; i++){
                projectImageDisplayHTML += `<a href="#item${globalCarouselButtonIndex}" class="btn btn-xs">${i+1}</a>`;
                globalCarouselButtonIndex ++;
            }
            
            projectImageDisplayHTML += `</div>`;
        }
    }
    console.log(project.projectName)
    console.log(projectImageDisplayHTML)
    console.log("PENIS PENIS PENIS")
    return projectImageDisplayHTML
}

function constructProject(project){
    cardClassesString = "";
    categoryBadgesString = "";
    toolsBadgesString = "";

    for(cardClass of project.cardClasses){
        cardClassesString += cardClass + " ";
    }
    for(badge of project.categoryBadges){
        categoryBadgesString += `
            <div class="whitespace-nowrap badge badge-secondary h-auto bg-[${badge.color}] border-[${badge.color}] pop-target hidden">${badge.label}</div> 
        `
    }
    for(badge of project.toolsBadges){
        toolsBadgesString += `
            <div class="badge badge-outline">${badge}</div>
        `
    }

    if(project.hasImage){
        console.log(project.imageURL);
    }
    else{
        console.log(project.hasImage);
    }

    projectHTML = 
        `<div class="card-body ${cardClassesString} py-0 mb-[5vw] flex-none project-item hidden">
            <h2 id="${project.projectID}" class="card-title">
                ${project.projectName}
                ${categoryBadgesString}
            </h2>
            <h3 class="text-sm text-gray-400 font-semibold">${project.yearPrefix}</h3>
            ${constructProjectImageDisplay(project)}
            <p class="flex-none">
                ${project.description}
            </p>
            <div class="card-actions justify-end">
                ${toolsBadgesString}
            </div>
        </div>`

    return projectHTML;
}



async function fetchJSON(filename){
    try {
        const response = await fetch(`../data/${filename}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)

        return data; 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null; 
    }
}

var popTargets = document.querySelectorAll(".pop-target");
var byTechnologyButton = document.querySelector("#by-technology").querySelector("span");
var byYearButton= document.querySelector("#by-year").querySelector("span");
const projectsDisplayHTMLStub = `
    <div id="project-display-title-div" class="flex justify-end mr-8 mb-8 space-x-4 slide-in-from-top-target hidden">
        <h1 id="modifier-initial" class="text-5xl font-bold">All</h1>
        <h1 id="modifier-next" class="text-5xl font-bold slide-out-and-fade"></h1>
        <h1 class="text-5xl font-bold">Projects</h1>
    </div>
    `
const byTechnologyProjectIndexHTMLStub = `
    <span class="flex items-end justify-start slide-in-from-left-target hidden hover:opacity-50 ">
        <h2 class="text-3xl font-semibold p-0">B</h2>
        <h2 class="text-2xl font-semibold p-0">Y</h2>
        <div class="px-1"></div>
        <h2 class="text-3xl font-semibold p-0">T</h2>
        <h2 class="text-2xl font-semibold p-0">ECHNOLOGY</h2>
    </span>
`
const byYearProjectIndexHTMLStub = `
    <span class="flex items-end justify-start slide-in-from-left-target hidden hover:opacity-50 ">
        <h2 class="text-3xl font-semibold p-0">B</h2>
        <h2 class="text-2xl font-semibold p-0">Y</h2>
        <div class="px-1"></div>
        <h2 class="text-3xl font-semibold p-0">Y</h2>
        <h2 class="text-2xl font-semibold p-0">EAR</h2>
    </span>
`

async function loadPage() {
    const dataJSON = await fetchJSON('data');

    if (dataJSON && dataJSON.projects && dataJSON.technologyCategories && dataJSON.yearCategories) {       
        const projectDisplayDiv = document.querySelector("#project-display");
        const byTechnologyProjectIndexSection = document.querySelector("#by-technology");
        const byYearProjectIndexSection = document.querySelector("#by-year");
        let projectsHTMLStrings = [];
        let byTechnologyIndexHTMLStrings = [];
        let byYearIndexHTMLStrings = [];

        dataJSON.projects.forEach((project)=>{
            projectsHTMLStrings.push(constructProject(project));
        });

        technologyCategories = dataJSON.technologyCategories
        technologyCategoryKeys = Object.keys(technologyCategories);
        
        yearCategories = dataJSON.yearCategories
        yearCategoryKeys = Object.keys(yearCategories);

        let i = 1;

        technologyCategoryKeys.forEach((key)=>{
            byTechnologyIndexHTMLStrings.push(constructIndexItem(technologyCategories[key], i, dataJSON.projects));
            i++;
        })
        
        yearCategoryKeys.forEach((key)=>{
            byYearIndexHTMLStrings.push(constructIndexItem(yearCategories[key], i, dataJSON.projects));
            i++;
        })


        projectDisplayDiv.innerHTML = projectsDisplayHTMLStub + projectsHTMLStrings.join('');
        byTechnologyProjectIndexSection.innerHTML = byTechnologyProjectIndexHTMLStub + byTechnologyIndexHTMLStrings.join('');
        byYearProjectIndexSection.innerHTML = byYearProjectIndexHTMLStub + byYearIndexHTMLStrings.join('');

        
        setTimeout(() => {
            const slideInFromLeftTargets = document.querySelectorAll(".slide-in-from-left-target");
            const slideInFromRightTargets = document.querySelectorAll(".project-item");
            const slideInFromTopTargets = document.querySelectorAll(".slide-in-from-top-target");
            
            popTargets = document.querySelectorAll(".pop-target");
            byTechnologyButton = document.querySelector("#by-technology").querySelector("span");
            byYearButton = document.querySelector("#by-year").querySelector("span");
            
            runAnimation(slideInFromLeftTargets, "slide-in-from-left", 100);
            runAnimation(slideInFromRightTargets, "slide-in-from-right", 200);
            runAnimation(slideInFromTopTargets, "slide-in-from-top", 100);
            applyPrefixOnClicks();
        }, 0);

    } 
    else{
        console.error("Data is missing or invalid.");
    }
}


loadPage();