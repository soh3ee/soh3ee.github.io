// Function to open the tab content
function openTab(evt, tabName) {
    console.log("opentab");
    // Get all tab content and hide it
    var categoryContent = document.getElementsByClassName("home-categories");
    for (var i = 0; i < categoryContent.length; i++) {
        categoryContent[i].style.display = "none";
    categoryContent[i].style.display = "none";
    }
    console.log(categoryContent);

    // Get all tab links and remove the active class
    var categoryButton = document.getElementsByClassName("home-categories-button");
    for (var i = 0; i < categoryButton.length; i++) {
        categoryButton[i].className = categoryButton[i].className.replace(" active", "");
    }

    // Show the current tab and add the "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    
}

    const writeupButton = document.getElementById("writeup-button");
    const writeupButtonSize = writeupButton.querySelector(".home-categories-button-size");
    const programmingButton = document.getElementById("programming-button");
    const programmingButtonSize = programmingButton.querySelector(".home-categories-button-size");
    const hackingButton = document.getElementById("hacking-button");
    const hackingButtonSize = hackingButton.querySelector(".home-categories-button-size");

    writeupButton.addEventListener("click", function() {
        clearActiveClasses();
        writeupButtonSize.classList.add("active");
    });

    programmingButton.addEventListener("click", function() {
        clearActiveClasses();
        programmingButtonSize.classList.add("active");
    });

    hackingButton.addEventListener("click", function() {
        clearActiveClasses();
        hackingButtonSize.classList.add("active");
    });

    function clearActiveClasses() {
        const activeButtons = document.querySelectorAll(".home-categories-button-size.active");
        activeButtons.forEach(function(button) {
        button.classList.remove("active");
        });
    }

window.onload = function() {
    // Show the writeups content by default when the page loads
    document.getElementById("writeups").style.display = "block";
}
