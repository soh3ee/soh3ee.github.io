function openTab(event, tabName) {
    var tabButtons = document.getElementsByClassName("nav-section-entry");
    var tabSpans = document.getElementsByClassName("nav-section-entry-span");
    var tabs = document.getElementsByClassName("home-categories");
    var introductionSection = document.getElementsByClassName("right-container-introduction-section");

    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    for (var i = 0; i < tabSpans.length; i++) {
        tabSpans[i].classList.remove("active");
    }

    event.currentTarget.classList.add("active");

    var tabElement = document.getElementById(tabName);

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    tabElement.classList.add("active");

    for (var i = 0; i < introductionSection.length; i++)
    {
        introductionSection[i].classList.remove("active");
    }

    // Construct the button-count element's ID based on the clicked button's ID
    var buttonCountId = event.currentTarget.id + "-count";
    var buttonCountSpan = document.getElementById(buttonCountId);

    if (buttonCountSpan) {
        buttonCountSpan.classList.add("active");
    }
    // introduction-section-writeups
    var introductionSectionId = "introduction-section-" + tabName;
    var introductionSectionDiv = document.getElementById(introductionSectionId);
    console.log(introductionSectionId);

    if (introductionSectionDiv) {
        introductionSectionDiv.classList.add("active");
    }
}

document.getElementById("writeups-button").addEventListener("click", function (event) {
    openTab(event, 'writeups');
});

document.getElementById("programming-button").addEventListener("click", function (event) {
    openTab(event, 'programming');
});

// Add event listeners for other buttons if needed
