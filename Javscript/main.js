window.onload = init;

// import JSPDF for use from CDN link
const jspdf = window.jspdf;

// image for JSPDF
const img = new Image()
img.src = './resources/pdf/A4.png';

let page1ExtraInfo = false;
let page2OtherCheckboxIncrement = 5;
let page2EmotionIncrement = 1;
let page3UnhelpfulThoughtIncrement = 1;
let page3UnhelpfulBehaviourIncrement = 1;
let page4Index = 0;
let page45State = 0;
let page5TopContainerComplete = false;
let page5LowerContainerComplete = false;
let page5NewFeelingsSliderMoved = false;

let pageContent = {
    "page1": {
        "event": "",
    },
    "page2": {
        // track the index of checkboxes and see how many still remain
        "multipleCheckboxes": [page2OtherCheckboxIncrement],
        "feelings": {},
        "feelings-slider-value": {},
        "physicalFeelings": [],
    },
    "page3": {
        "unhelpfulThoughtDropdown": {},
        "unhelpfulThoughtContent": {},
        "unhelpfulBehaviourDropdown": {},
        "unhelpfulBehaviourContent": {},
    },
    "page4": {
        "alternativeObjects": [],
        "friendlyAdvice": "",
    },
    "page5": {
        "feelings": {},
        "feelings-slider-value-initial": {},
        "feelings-slider-value-new": {},
        "feelings-slider-moved": {},
        "new-feeling": "",
        "new-feeling-value": "",
    },
};

// advice character images

// happy / down / ask / think / anxious
const happyImage = document.createElement('img');
happyImage.src = `./resources/graphics/happy.png`;
happyImage.alt = "friend character";

const downImage = document.createElement('img');
downImage.src = `./resources/graphics/down.png`;
downImage.alt = "friend character";

const askImage = document.createElement('img');
askImage.src = `./resources/graphics/ask.png`;
askImage.alt = "friend character";

const thinkImage = document.createElement('img');
thinkImage.src = `./resources/graphics/think.png`;
thinkImage.alt = "friend character";

const anxiousImage = document.createElement('img');
anxiousImage.src = `./resources/graphics/anxious.png`;
anxiousImage.alt = "friend character";

function init() {

    applyPageListeners();
    setInterval(checkAccessibility, 100);

}

// changes the font color to black or white
function checkAccessibility() {

    let accessibilityMode = sessionStorage.getItem("accessibilityMode");

    if (accessibilityMode === "true") {
        // accessibility mode
        document.body.querySelectorAll('*').forEach(function (node) {
            node.style.color = '#0D0D0D';
        });
    }
}

function applyPageListeners() {

    // Getting DOM Elements

    // Page 1 Content
    const page1Container = document.getElementById('page1Container');
    const page1NextButton = document.getElementById('page1NextButton');
    const page1TextBox = document.getElementById('page1Textbox');
    const page1TextBoxText = document.getElementById('facts-text-input');
    let page1TextBoxContents = "";
    // todo: implement a way to check if contents already exist in the textbox
    let page1Complete = false;
    const page1Error = document.getElementById('page1Error');

    // Page 2 Content
    const page2Container = document.getElementById('page2Container');
    const page2FeelingsAddButton = document.getElementById('page2-unhelpful-thought-button');
    const page2OtherCheckbox = document.getElementById('page2CheckboxOption5');
    const page2CheckboxGrid = document.getElementById('page2CheckboxGrid');
    const page2ErrorEmotion = document.getElementById('page2ErrorEmotion');
    const page2Section = document.getElementById('page2Section');
    let page2OtherCheckboxExtra = [];
    let page2Complete = false;
    const page2BackButton = document.getElementById('page2BackButton');
    const page2NextButton = document.getElementById('page2NextButton');

    // Page 3 Content
    const page3Container = document.getElementById('page3Container');
    const page3UnhelpfulThoughtAddButton = document.getElementById('page3-unhelpful-thought-button');
    const page3UnhelpfulBehaviourAddButton = document.getElementById('page3-unhelpful-behaviour-button');
    const page3UnhelpfulThoughtHelpButton = document.getElementById('page3-unhelpful-thoughts');
    const page3UnhelpfulBehaviourHelpButton = document.getElementById('page3-unhelpful-behaviour');
    const page3UnhelpfulThoughtHelpContainer = document.getElementById('page3-unhelpful-thoughts-container');
    const page3UnhelpfulBehaviourHelpContainer = document.getElementById('page3-unhelpful-behaviours-container');
    let page3Complete = false;
    const page3BackButton = document.getElementById('page3BackButton');
    const page3NextButton = document.getElementById('page3NextButton');

    // Page 4 Content
    const page4Container = document.getElementById('page4Container');
    const page4InsertContainer = document.getElementById('page4-insert-container');
    const page4BackAlternativeButton = document.getElementById('page4-alternative-back-button');
    const page4NextAlternativeButton = document.getElementById('page4-alternative-next-button');
    let page4Complete = false;
    const page4BackButton = document.getElementById('page4BackButton');
    const page4NextButton = document.getElementById('page4NextButton');

    // Page 4.5 Content
    const page45Container = document.getElementById('page45Container');
    const page45BackButton = document.getElementById('page45BackButton');

    // Page 5 Content
    const page5Container = document.getElementById('page5Container');
    const page5BackButton = document.getElementById('page5BackButton');
    const page5NextButton = document.getElementById('page5NextButton');

    // Page 6 Content
    const page6Container = document.getElementById('page6Container');
    const page6PrintButton = document.getElementById('page6PrintButton');
    const page6FinishButton = document.getElementById('page6FinishButton');

    // Applying Listeners

    // Page 1

    page1Setup();

    page1NextButton.addEventListener("click", function (event) {
        if (page1Complete) {
            changePage(page1Container, page2Container, "forward");
        } else {
            addError(page1Error, page1TextBoxText);
        }
    })

    page1TextBox.addEventListener('input', function (event) {
        pageContent["page1"]["event"] = event.target.value;
        if (event.target.value.length > 0) {
            page1Complete = true;
            nextPageReady(page1NextButton);
            addSuccess(page1Error, page1TextBoxText);
        } else {
            removeErrorSuccess(page1Error, page1TextBoxText);
            nextPageNotReady(page1NextButton);
            page1Complete = false;
        }

        // insert positive reinforcement icon 
    })

    // Page 2

    page2AddCheckboxListeners();
    page2Setup();

    page2FeelingsAddButton.addEventListener("click", () => {
        page2CreateEmotion();
        addSuccess(page2ErrorEmotion, page2Section);
        manageNextButtonVerification(page2Complete, verifyPage2(), page2NextButton);
    })

    page2OtherCheckbox.addEventListener('change', function (event) {
        if (this.checked === true) {
            page2CreateNewCheckbox(page2CheckboxGrid);
        }
        else {
            page2DeleteCheckbox(this);
        }
    })

    page2BackButton.addEventListener("click", () => {
        changePage(page2Container, page1Container, "back");
    })

    page2NextButton.addEventListener("click", () => {
        page2Complete = verifyPage2();
        if (page2Complete) {
            changePage(page2Container, page3Container, "forward");
        }
    })

    // Page 3
    page3UnhelpfulThoughtAddButton.addEventListener("click", () => {
        page3CreateUnhelpfulThought();
        //verifyPage3();
    })

    page3UnhelpfulBehaviourAddButton.addEventListener("click", () => {
        page3CreateUnhelpfulBehaviour();
        //verifyPage3();
    })

    page3BackButton.addEventListener("click", () => {
        changePage(page3Container, page2Container, "back");
    })


    // create maximizeOutPage3HelpThought class
    page3UnhelpfulThoughtHelpButton.addEventListener("click", () => {
        if (page3UnhelpfulThoughtHelpContainer.style.display === "none") {
            page3UnhelpfulThoughtHelpContainer.style.display = "block";
            page3UnhelpfulThoughtHelpContainer.classList.remove("minimizeInwards");
            page3UnhelpfulThoughtHelpContainer.classList.add(`maximizeOutPage3HelpThought`);
        } else {
            page3UnhelpfulThoughtHelpContainer.classList.remove(`maximizeOutPage3HelpThought`);
            page3UnhelpfulThoughtHelpContainer.classList.add("minimizeInwards");
        }
    })

    page3UnhelpfulThoughtHelpContainer.addEventListener("animationend", () => {
        if (page3UnhelpfulThoughtHelpContainer.classList.contains("minimizeInwards")) {
            page3UnhelpfulThoughtHelpContainer.style.display = "none";
        } else {
            page3UnhelpfulThoughtHelpButton.scrollIntoView({ behavior: 'smooth' });
        }
    })

    page3UnhelpfulBehaviourHelpButton.addEventListener("click", () => {
        if (page3UnhelpfulBehaviourHelpContainer.style.display === "none") {
            page3UnhelpfulBehaviourHelpContainer.style.display = "block";
            page3UnhelpfulBehaviourHelpContainer.classList.remove("minimizeInwards");
            page3UnhelpfulBehaviourHelpContainer.classList.add(`maximizeOutPage3HelpBehaviour`);
        } else {
            page3UnhelpfulBehaviourHelpContainer.classList.remove(`maximizeOutPage3HelpBehaviour`);
            page3UnhelpfulBehaviourHelpContainer.classList.add("minimizeInwards");
        }
    })

    page3UnhelpfulBehaviourHelpContainer.addEventListener("animationend", () => {
        if (page3UnhelpfulBehaviourHelpContainer.classList.contains("minimizeInwards")) {
            page3UnhelpfulBehaviourHelpContainer.style.display = "none";
        } else {
            page3UnhelpfulBehaviourHelpButton.scrollIntoView({ behavior: 'smooth' });
        }
    })

    page3NextButton.addEventListener("click", () => {
        page3Complete = verifyPage3();
        if (page3Complete) {
            createPage4Objects();
            page4PrepareElements();
            page4CreateAlternativeHTMLElement();
            changePage(page3Container, page4Container, "forward");
        }
    });

    // Page 4
    page4BackButton.addEventListener("click", () => {
        changePage(page4Container, page3Container, "back");
        page4Index = 0;
    });

    page4BackAlternativeButton.addEventListener("click", () => {
        if (page4Index > 0) {
            page4RemoveAlternativeHTMLElement();
            page4Index--;
            page4CreateAlternativeHTMLElement();
            page4InsertContainer.scrollIntoView({ behavior: 'smooth' });

            // preset the success or error styling
            const errorTextNext = document.getElementById(`page4-error-${page4Index}`);
            const errorContainerNext = document.getElementById(`page4-bottom-section-${page4Index}`);
            const errorTextboxNext = document.getElementById(`page4-textbox-${page4Index}`);
            if (pageContent["page4"]["alternativeObjects"][page4Index].answer.length > 0) {
                nextPageReady(page4NextAlternativeButton);
                addSuccess(errorTextNext, errorContainerNext);
                addSuccessSingleContainer(errorTextboxNext);
            }
            else {
                nextPageNotReady(page4NextAlternativeButton);
                removeErrorSuccess(errorTextNext, errorContainerNext);
                removeErrorSuccessSingleContainer(errorTextboxNext);
            }
        } else {
            alert("Can't go back anymore.")
        }
    });

    page4NextAlternativeButton.addEventListener("click", () => {
        const errorText = document.getElementById(`page4-error-${page4Index}`);
        const errorContainer = document.getElementById(`page4-bottom-section-${page4Index}`);
        const errorTextbox = document.getElementById(`page4-textbox-${page4Index}`);


        if (pageContent["page4"]["alternativeObjects"][page4Index].answer.length > 0) {
            if (page4Index < (pageContent["page4"]["alternativeObjects"].length - 1)) {
                page4RemoveAlternativeHTMLElement();
                page4Index++;
                page4CreateAlternativeHTMLElement();
                page4InsertContainer.scrollIntoView({ behavior: 'smooth' });

                // preset the success or error styling
                const errorTextNext = document.getElementById(`page4-error-${page4Index}`);
                const errorContainerNext = document.getElementById(`page4-bottom-section-${page4Index}`);
                const errorTextboxNext = document.getElementById(`page4-textbox-${page4Index}`);
                if (pageContent["page4"]["alternativeObjects"][page4Index].answer.length > 0) {
                    nextPageReady(page4NextAlternativeButton);
                    addSuccess(errorTextNext, errorContainerNext);
                    addSuccessSingleContainer(errorTextboxNext);
                }
                else {
                    nextPageNotReady(page4NextAlternativeButton);
                    removeErrorSuccess(errorTextNext, errorContainerNext);
                    removeErrorSuccessSingleContainer(errorTextboxNext);
                }
            } else {
                page4RemoveAlternativeHTMLElement();
                page45RemoveElements();
                page45StateManager();
                changePage(page4Container, page45Container, "forward");
                //page45Container.scrollIntoView({ behavior: 'smooth'});
            }
        } else {
            addError(errorText, errorContainer);
            addErrorSingleContainer(errorTextbox);

        }
    });

    // Page 45

    page45BackButton.addEventListener("click", () => {
        changePage(page45Container, page3Container, "back");
        page4Index = 0;
        page45State = 0;
    });

    // page 5 

    page5BackButton.addEventListener("click", () => {
        changePage(page5Container, page45Container, "back");
        page45State = 5;
        page45RemoveElements();
        page45StateManager();
        page45Container.scrollIntoView({ behavior: 'smooth' });
    });

    page5NextButton.addEventListener("click", (e) => {
        if (page5Verification()) {
            //console.log("Made it to the next page.")
            page6CreateElements();
            changePage(page5Container, page6Container, "forward");
        } else {
            //alert("Please fill out all information.")
        }
    });

    // page 6

    page6FinishButton.addEventListener("click", (e) => {

        page6Container.classList.add('slideOutLeft');

        page6Container.addEventListener('animationend', () => {
            page6Container.style.display = "none";
            page6Container.classList.add('hidden');
            window.open("https://ohohohobrien.github.io/CBTLog/", "_self");
        })

    });

    checkAccessibility();

}

/*
    HELPER FUNCTIONS
*/

function addSuccess(textElement, containerElement) {
    textElement.style.display = "none";
    containerElement.classList.remove('error-container');
    containerElement.classList.add('success-container');
}

function addSuccessSingleContainer(containerElement) {
    containerElement.classList.remove('error-container');
    containerElement.classList.add('success-container');
}

function addError(textElement, containerElement) {
    textElement.style.display = "block";
    containerElement.classList.remove('success-container');
    containerElement.classList.add('error-container');
    textElement.scrollIntoView({ behavior: 'smooth' });
}

function addErrorSingleContainer(containerElement) {
    containerElement.classList.remove('success-container');
    containerElement.classList.add('error-container');
}

function removeErrorSuccess(textElement, containerElement) {
    textElement.style.display = "none";
    containerElement.classList.remove('error-container');
    containerElement.classList.remove('success-container');
}

function removeErrorSuccessSingleContainer(containerElement) {
    containerElement.classList.remove('error-container');
    containerElement.classList.remove('success-container');
}

function nextPageReady(nextButton) {
    nextButton.classList.remove("incomplete-page");
}

function nextPageNotReady(nextButton) {
    nextButton.classList.add("incomplete-page");
}

function manageNextButtonVerification(pageCompleteBoolean, verifyPageFunction, nextPageButton) {
    pageCompleteBoolean = verifyPageFunction;
    if (pageCompleteBoolean) {
        nextPageReady(nextPageButton);
    } else {
        nextPageNotReady(nextPageButton);
    }
}

// Completed
function changePage(from, to, direction) {

    if (direction === "forward") {
        to.removeEventListener("animationend", to.listener);
        from.removeEventListener("animationend", from.listener);

        from.classList.remove("slideOutLeft");
        from.classList.remove("slideOutRight");
        from.classList.remove("slideInRight");
        from.classList.remove("slideInLeft");
        from.classList.add("slideOutLeft");
        to.classList.remove("slideOutLeft");
        to.classList.remove("slideOutRight");
        to.classList.remove("slideInRight");
        to.classList.remove("slideInLeft");

        from.listener = () => {
            from.style.display = "none";
            to.scrollIntoView({ behavior: 'smooth' });
            to.style.display = "block";
            to.classList.add("slideInRight");
        }
        from.addEventListener("animationend", from.listener);

    }
    else if (direction === "back") {
        to.removeEventListener("animationend", to.listener);
        from.removeEventListener("animationend", from.listener);

        from.classList.remove("slideOutLeft");
        from.classList.remove("slideOutRight");
        from.classList.remove("slideInRight");
        from.classList.remove("slideInLeft");
        from.classList.add("slideOutRight");
        to.classList.remove("slideOutLeft");
        to.classList.remove("slideOutRight");
        to.classList.remove("slideInRight");
        to.classList.remove("slideInLeft");

        from.listener = () => {
            from.style.display = "none";
            to.scrollIntoView({ behavior: 'smooth' });
            to.style.display = "block";
            to.classList.add("slideInLeft");
        }
        from.addEventListener("animationend", from.listener);

    }
    else {
        console.log("You have input an incorrect direction at changePage().")
    }

}

// Completed - helper function
function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/*
    PAGE 1
*/

function page1Setup() {

    const moreInfoButton = document.getElementById('page1-extra-information-button');
    const moreInfoContainer = document.getElementById('page1-container-insert');

    function removeInfoContainer() {
        moreInfoContainer.style.display = "none";
        page1ExtraInfo = false;
    }

    moreInfoButton.addEventListener('click', () => {

        if (page1ExtraInfo === false) {
            moreInfoContainer.style.display = "block";
            moreInfoContainer.classList.remove('minimizeInwards');
            moreInfoContainer.classList.add('maximizeOutwardsPage1');
            moreInfoContainer.removeEventListener('animationend', removeInfoContainer);
            page1ExtraInfo = true;
        } else {
            moreInfoContainer.classList.remove('maximizeOutwardsPage1');
            moreInfoContainer.classList.add('minimizeInwards');
            moreInfoContainer.addEventListener('animationend', removeInfoContainer);
        }

    })
}


/*
    PAGE 2
*/

function page2Setup() {

    const moreInfoButton = document.getElementById('page2-extra-information-button');
    const moreInfoContainer = document.getElementById('page2-info');

    function removeInfoContainer() {
        moreInfoContainer.style.display = "none";
        page1ExtraInfo = false;
    }

    moreInfoButton.addEventListener('click', () => {

        if (page1ExtraInfo === false) {
            moreInfoContainer.style.display = "block";
            moreInfoContainer.classList.remove('minimizeInwards');
            moreInfoContainer.classList.add('maximizeOutwardsPage2');
            moreInfoContainer.removeEventListener('animationend', removeInfoContainer);
            page1ExtraInfo = true;
        } else {
            moreInfoContainer.classList.remove('maximizeOutwardsPage2');
            moreInfoContainer.classList.add('minimizeInwards');
            moreInfoContainer.addEventListener('animationend', removeInfoContainer);
        }

    })
}

// completed
function page2AddCheckboxListeners() {
    // static checkbox options
    const staticCheckboxList = [
        document.getElementById("page2CheckboxOption1"),
        document.getElementById("page2CheckboxOption2"),
        document.getElementById("page2CheckboxOption3"),
        document.getElementById("page2CheckboxOption4"),
    ];

    for (let i = 0; i < staticCheckboxList.length; i++) {
        staticCheckboxList[i].addEventListener('change', function (event) {
            if (staticCheckboxList[i].checked === true) {
                pageContent["page2"]["physicalFeelings"].push(staticCheckboxList[i].value);
                //console.log(`Detected change in the checkbox ${i} that CHECKS the box. ${staticCheckboxList[i].value} recorded into array.`)
            }
            else {
                pageContent["page2"]["physicalFeelings"] = arrayRemove(pageContent["page2"]["physicalFeelings"], staticCheckboxList[i].value);
                //console.log(`Detected change in the checkbox ${i} that UNCHECKS the box. ${staticCheckboxList[i].value} removed from array.`)
            }
        })
    }

}

// Completed
function page2CreateNewCheckbox(page2CheckboxGrid) {

    // Create a textbox for the user to input information
    const newTextbox = document.createElement("input");
    newTextbox.type = "text";
    newTextbox.id = `page2TextboxOption${page2OtherCheckboxIncrement}`;
    newTextbox.classList.add("checkbox-textbox");

    newTextbox.addEventListener('input', function (event) {
        pageContent["page2"][event.target.id] = event.target.value;

        if (this.value.length > 0) {
            addSuccessSingleContainer(this);
        } else {
            removeErrorSuccessSingleContainer(this);
        }

        verifyPage2();
    })

    // Create a new other text div
    const newDivText = document.createElement("div");
    newDivText.classList.toggle("checkbox-option");
    newDivText.id = `${page2OtherCheckboxIncrement}-page2DivText`;

    // Append the new element to the div
    newDivText.append(newTextbox);

    page2OtherCheckboxIncrement++;

    // Create a new other checkbox
    const newDiv = document.createElement("div");
    newDiv.classList.toggle("checkbox-option");
    newDiv.id = `${page2OtherCheckboxIncrement}-page2Div`;

    const newOtherCheckbox = document.createElement("input");
    newOtherCheckbox.type = "checkbox";
    newOtherCheckbox.id = `page2CheckboxOption${page2OtherCheckboxIncrement}`;
    newOtherCheckbox.name = `page2CheckboxOption${page2OtherCheckboxIncrement}`;
    newOtherCheckbox.value = "Other";

    const newLabel = document.createElement("label");
    newLabel.innerHTML = "Other";
    newLabel.for = newOtherCheckbox.id;

    newOtherCheckbox.addEventListener('change', function (event) {
        if (this.checked === true) {
            page2CreateNewCheckbox(page2CheckboxGrid);
        }
        else {
            page2DeleteCheckbox(this);
        }
    })

    // Append the new elements to the div
    newDiv.append(newOtherCheckbox);
    newDiv.append(newLabel);

    pageContent["page2"]["multipleCheckboxes"].push(page2OtherCheckboxIncrement);
    page2CheckboxGrid.append(newDivText);
    page2CheckboxGrid.append(newDiv);

}

// Completed
function page2DeleteCheckbox(checkbox) {

    // regex to get index
    const index = checkbox.id.match(/\d+/g)[1];

    // get the elements to delete
    const divToDeleteText = document.getElementById(`${index}-page2DivText`);
    const divToDelete = document.getElementById(`${index}-page2Div`);
    const textboxElement = document.getElementById(`page2TextboxOption${index}`);

    // delete information from page content object
    delete pageContent["page2"][textboxElement.id];

    // If original "Other" checkbox - don't delete only remove the textbox
    if (pageContent["page2"]["multipleCheckboxes"].length === 1) {
        divToDeleteText.remove();
        return;
    }

    pageContent["page2"]["multipleCheckboxes"] = arrayRemove(pageContent["page2"]["multipleCheckboxes"], index);
    divToDeleteText.remove();
    divToDelete.remove();

    verifyPage2();
}

// Completed
function page2CreateEmotion() {

    const parentElement = document.getElementById("page2-feeling-insert-container");

    // container to append to
    const container = document.createElement("div");
    container.id = `page2-feeling-${page2EmotionIncrement}`;
    container.classList.add('maximizeOutwards');
    parentElement.append(container);

    // dropdown box and container
    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown-box-container");
    container.append(dropdownContainer);

    const dropdownList = document.createElement("select");
    dropdownList.id = `page2EmotionalFeeling-${page2EmotionIncrement}`;
    dropdownList.name = `page2EmotionalFeeling-${page2EmotionIncrement}`;
    dropdownList.dataset.index = page2EmotionIncrement;
    dropdownContainer.append(dropdownList);

    const dropdownOptionValues = [
        "Angry",
        "Anxious",
        "Confused",
        "Jealous",
        "Overwhelmed",
        "Sad",
        "Other",
    ];

    const dropdownOptionInnerHTML = [
        "😤 Angry",
        "😟 Anxious",
        "😕 Confused",
        "😒 Jealous",
        "😵 Overwhelmed",
        "😔 Sad",
        "➕ Other",
    ];

    // append options
    for (let i = 0; i < dropdownOptionValues.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = dropdownOptionValues[i];
        optionElement.innerHTML = dropdownOptionInnerHTML[i];
        dropdownList.append(optionElement);
    }

    pageContent["page2"]["feelings"][dropdownList.dataset.index] = dropdownList.value;
    pageContent["page5"]["feelings"][dropdownList.dataset.index] = dropdownList.value;

    // close button
    const closeButton = document.createElement('button');
    closeButton.classList.add("close-button");
    const buttonIcon = document.createElement('span');
    buttonIcon.innerHTML = "X";
    closeButton.append(buttonIcon);

    dropdownContainer.append(closeButton);

    // hidden text box for Other dropdown option chosen
    const hiddenTextbox = document.createElement('input');
    hiddenTextbox.id = `page2-feelings-hidden-text-${page2EmotionIncrement}`
    hiddenTextbox.classList.add("checkbox-textbox");
    hiddenTextbox.classList.add("hidden");
    const hiddenLabel = document.createElement('label');
    hiddenLabel.innerHTML = "feeling name";
    hiddenLabel.id = `page2-feeling-hidden-label-${page2EmotionIncrement}`
    hiddenLabel.classList.add("hidden-label");
    // error handling
    const hiddenErrorContainer = document.createElement('div');
    hiddenErrorContainer.classList.add('error-message');
    hiddenErrorContainer.classList.add('containerZero');
    hiddenErrorContainer.style.display = 'none';
    hiddenErrorContainer.id = `page2ErrorEmotion-feeling-${page2EmotionIncrement}`;
    const hiddenErrorText = document.createElement('p');
    hiddenErrorText.innerHTML = "Name your feeling.";
    hiddenErrorContainer.append(hiddenErrorText);

    container.append(hiddenErrorContainer);
    container.append(hiddenLabel);
    container.append(hiddenTextbox);

    hiddenTextbox.addEventListener('input', (e) => {
        pageContent["page2"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;
        pageContent["page5"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;

        if (hiddenTextbox.value !== "") {
            addSuccess(hiddenErrorContainer, hiddenTextbox);
            verifyPage2();
        } else {
            removeErrorSuccessSingleContainer(hiddenTextbox);
            nextPageNotReady(document.getElementById('page2NextButton'));
        }
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdownList.addEventListener('change', (e) => {
        pageContent["page2"]["feelings"][dropdownList.dataset.index] = e.target.value;
        pageContent["page5"]["feelings"][dropdownList.dataset.index] = e.target.value;
        //delete pageContent["page2"]["feelings"]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page2"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;
            pageContent["page5"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;

            if (hiddenTextbox.value === "") {
                removeErrorSuccessSingleContainer(document.getElementById('page2Section'));
                nextPageNotReady(document.getElementById('page2NextButton'));
            }
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page2"]["feelings"][dropdownList.dataset.index] = e.target.value;
            pageContent["page5"]["feelings"][dropdownList.dataset.index] = e.target.value;
        }
    })

    // add listener to delete
    closeButton.addEventListener('click', (e) => {
        delete pageContent["page2"]["feelings"][dropdownList.dataset.index];
        delete pageContent["page5"]["feelings"][dropdownList.dataset.index];
        delete pageContent["page2"]["feelings-slider-value"][dropdownList.dataset.index];
        delete pageContent["page5"]["feelings-slider-value-initial"][dropdownList.dataset.index];
        delete pageContent["page5"]["feelings-slider-value-new"][dropdownList.dataset.index];
        container.classList.remove('maximizeOutwards');
        container.classList.add('minimizeInwards');
        container.addEventListener('animationend', () => {
            container.remove();
        })
        verifyPage2();
        if (isEmpty(pageContent["page2"]["feelings"])) {
            removeErrorSuccess(document.getElementById('page2ErrorEmotion'), document.getElementById('page2Section'));
            nextPageNotReady(document.getElementById('page2NextButton'));
        }
    })

    // create the slider and container
    const sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");
    container.append(sliderContainer);

    const headerText = document.createElement("h5");
    headerText.innerHTML = "How intense is this feeling?";
    sliderContainer.append(headerText);

    const slider = document.createElement("input");
    slider.classList.add("slider");
    slider.type = "range";
    slider.name = `Page2EmotionalSlider-${page2EmotionIncrement}`;
    slider.id = `Page2EmotionalSlider-${page2EmotionIncrement}`;
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    sliderContainer.append(slider);

    const sliderNumberValue = document.createElement("p");
    sliderNumberValue.innerHTML = "5";
    pageContent["page2"]["feelings-slider-value"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
    pageContent["page5"]["feelings-slider-value-initial"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
    pageContent["page5"]["feelings-slider-value-new"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
    sliderNumberValue.classList.add("slider-value");
    sliderNumberValue.id = `page2SliderValueDisplay-${dropdownList.dataset.index}`;
    sliderContainer.append(sliderNumberValue);

    // listener to update the number value
    slider.addEventListener('input', function (event) {
        sliderNumberValue.innerHTML = Math.floor(slider.value / 10);
        //console.log(`Updated the page content for slider value ${dropdownList.dataset.index} from ${pageContent["page2"]["feelings-slider-value"][page2EmotionIncrement]} to ${sliderNumberValue.innerHTML}.`);
        pageContent["page2"]["feelings-slider-value"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
        pageContent["page5"]["feelings-slider-value-initial"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
        pageContent["page5"]["feelings-slider-value-new"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
    })

    // page divider
    const pageDivider = document.createElement("hr");
    pageDivider.classList.add("page-divider");
    container.append(pageDivider);

    // increment increase for unique id's
    page2EmotionIncrement++;
}

// Completed
function verifyPage2() {

    let verified = true;
    const valueErrorText = document.getElementById("page2ErrorPhysical");
    // checkbox verification for other input
    for (entries of pageContent["page2"]["multipleCheckboxes"]) {
        try {
            const valueElement = document.getElementById(`page2TextboxOption${entries}`);
            const value = valueElement.value;
            if (value !== 5) {
                if (value.length === 0) {
                    verified = false;
                    addError(valueErrorText, valueElement);
                } else {
                    addSuccess(valueErrorText, valueElement);
                }
            }
        } catch (error) {
            //console.log(`Element with id of page2TextboxOption${entries} not found for page 2 verification.`)
        }
    }

    // textbox verification for other input
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings"])) {
        //console.log(`${key}: ${value}`);
        if (value.length === 0) {
            verified = false;
            const containerElement = document.getElementById(`page2-feelings-hidden-text-${key}`);
            addError(document.getElementById(`page2ErrorEmotion-feeling-${key}`), containerElement);
        }

    }

    // slider value verification
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings-slider-value"])) {
        //console.log(`${key}: ${value}`);
        if (value < 0 || value > 10) verified = false;
    }

    /* -------------------------
    Test that object isn't empty (need to input an emotion)
    ----------------------------*/
    if (Object.keys(pageContent["page2"]["feelings"]).length === 0 && pageContent["page2"]["feelings"].constructor === Object) verified = false;
    if (Object.keys(pageContent["page2"]["feelings-slider-value"]).length === 0 && pageContent["page2"]["feelings-slider-value"].constructor === Object) verified = false;

    page2ErrorOutlineSetter();

    if (verified) return true
    else return false;
}

// determine if red or green outlines can be set on the section or not
function page2ErrorOutlineSetter() {

    const upperContainer = document.getElementById('page2Section');
    const upperErrorText = document.getElementById('page2ErrorEmotion');
    const lowerContainer = document.getElementById('page2SectionPhysical');
    const lowerErrorText = document.getElementById('page2ErrorPhysical');
    const nextPageButton = document.getElementById('page2NextButton');
    let upperComplete = true;
    let lowerComplete = true;

    // check the upper section
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings"])) {
        const hiddenContainer = document.getElementById(`page2ErrorEmotion-feeling-${key}`);
        const hiddenTextbox = document.getElementById(`page2-feelings-hidden-text-${key}`);
        const emotionDropdown = document.getElementById(`page2EmotionalFeeling-${key}`);
        if (emotionDropdown.value === "Other") {
            if (hiddenTextbox.value.length === 0) {
                addError(hiddenContainer, hiddenTextbox);
                upperComplete = false;
            } else {
                addSuccess(hiddenContainer, hiddenTextbox);
            }
        }
    }

    if (upperComplete) addSuccessSingleContainer(upperContainer)
    else addErrorSingleContainer(upperContainer);

    if (Object.keys(pageContent["page2"]["feelings"]).length === 0 && pageContent["page2"]["feelings"].constructor === Object) {
        addError(upperErrorText, upperContainer);
        upperComplete = false;
    }

    // lower container

    const checkboxArrayLength = pageContent["page2"]["multipleCheckboxes"].length;
    if (checkboxArrayLength > 1) {
        for (let i = 0; i < (checkboxArrayLength - 1); i++) {
            const index = pageContent["page2"]["multipleCheckboxes"][i];
            const textbox = document.getElementById(`page2TextboxOption${index}`);

            if (textbox.value.length !== 0) {
                addSuccessSingleContainer(textbox);
            } else {
                addErrorSingleContainer(textbox);
                lowerComplete = false;
            }
        }
    }

    if (lowerComplete) addSuccess(lowerErrorText, lowerContainer)
    else addError(lowerErrorText, lowerContainer);

    if (upperComplete && lowerComplete) nextPageReady(nextPageButton)
    else nextPageNotReady(nextPageButton);

}

/*
    PAGE 3
*/

// Completed
function page3CreateUnhelpfulThought() {
    const parentElement = document.getElementById('page3-insert-thoughts');

    // new test
    const containerForAnimation = document.createElement('div');
    containerForAnimation.classList.add('containerZero');
    containerForAnimation.classList.add('maximizeOutwardsPage3');
    parentElement.append(containerForAnimation);

    const container = document.createElement('div');
    container.id = `page3-unhelpful-thoughts-container-${page3UnhelpfulThoughtIncrement}`;
    container.classList.add("page3-unhelpful-thoughts-container");
    container.dataset.index = String(page3UnhelpfulThoughtIncrement);

    // dropdown box
    const dropdown = document.createElement('select');
    dropdown.id = `page3-thought-dropdown-${page3UnhelpfulThoughtIncrement}`;
    dropdown.classList.add("page3-thought-dropdown");
    container.append(dropdown);

    // insert the options
    const optionValues = [
        "Catastrophising",
        "Compare and despair",
        "Critical self",
        "Emotional Reasoning",
        "Judgements",
        "Memories",
        "Mental Filter",
        "Mind-Reading",
        "Mountains and Molehills",
        "Prediction",
        "Shoulds and musts",
        "Other"
    ];

    const optionInnerHTML = [
        "🤯 Catastrophising",
        "👺 Compare and despair",
        "😔 Critical self",
        "😖 Emotional Reasoning",
        "⚖️ Judgements",
        "📔 Memories",
        "🧠 Mental Filter",
        "🧙‍♂️ Mind-Reading",
        "⛰️ Mountains and Molehills",
        "🔮 Prediction",
        "📜 Shoulds and musts",
        "➕ Other"
    ];

    for (let i = 0; i < optionValues.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = optionValues[i];
        optionElement.innerHTML = optionInnerHTML[i];
        dropdown.append(optionElement);
    }

    pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = dropdown.value;

    // close button
    const closeButton = document.createElement('button');
    closeButton.classList.add("close-button");
    const buttonIcon = document.createElement('span');
    buttonIcon.innerHTML = "X";
    closeButton.append(buttonIcon);

    container.append(closeButton);

    // hidden text box for Other dropdown option chosen
    const hiddenTextbox = document.createElement('input');
    hiddenTextbox.id = `page3-thought-hidden-text-${page3UnhelpfulThoughtIncrement}`
    hiddenTextbox.classList.add("checkbox-textbox");
    hiddenTextbox.classList.add("page3-hidden-textbox");
    const hiddenLabel = document.createElement('label');
    hiddenLabel.innerHTML = "thought style name";
    hiddenLabel.id = `page3-thought-hidden-label-${page3UnhelpfulThoughtIncrement}`
    hiddenLabel.classList.add("page3-hidden-label");

    container.append(hiddenTextbox);
    container.append(hiddenLabel);

    hiddenTextbox.addEventListener('input', (e) => {
        pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = hiddenTextbox.value;
        if (hiddenTextbox.value.length === 0) addErrorSingleContainer(hiddenTextbox)
        else addSuccessSingleContainer(hiddenTextbox);
        verifyPage3();
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdown.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = e.target.value;
        //delete pageContent["page3"]["unhelpfulThoughtDropdown"]["1"];
        //delete pageContent["page3"]["unhelpfulThoughtContent"]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = hiddenTextbox.value;
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = e.target.value;
        }
    })

    // textbox
    const textbox = document.createElement('textarea');
    textbox.classList.add("page3-text-input");
    textbox.id = `page3-thought-text-${page3UnhelpfulThoughtIncrement}`;
    textbox.placeholder = "Write down your thinking...";

    textbox.addEventListener('input', (e) => {
        pageContent["page3"]["unhelpfulThoughtContent"][container.dataset.index] = e.target.value;
        if (textbox.value.length === 0) addErrorSingleContainer(textbox)
        else addSuccessSingleContainer(textbox);
        verifyPage3();
    })
    container.append(textbox);

    // append new div for unhelpful thought to parent
    containerForAnimation.append(container);

    // add horizontal divider
    const divider = document.createElement('hr');
    divider.classList.add("page-divider");
    divider.id = `page3-divider-thoughts-${page3UnhelpfulThoughtIncrement}`;
    containerForAnimation.append(divider);

    // add listener to delete
    closeButton.addEventListener('click', (e) => {
        delete pageContent["page3"]["unhelpfulThoughtContent"][container.dataset.index];
        delete pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index];
        /*
        if (container.dataset.index == 1) {
            delete pageContent["page3"]["unhelpfulThoughtContent"]["2"];
            delete pageContent["page3"]["unhelpfulThoughtDropdown"]["2"];
        }
        */
        containerForAnimation.classList.remove('maximizeOutwardsPage3');
        containerForAnimation.classList.add('minimizeInwards');
        containerForAnimation.addEventListener('animationend', () => {
            containerForAnimation.remove();
        })
        verifyPage3();
    })

    // force that no outline show when first created
    removeErrorSuccessSingleContainer(textbox);
    removeErrorSuccessSingleContainer(hiddenTextbox);

    // increment increase for unique id's
    page3UnhelpfulThoughtIncrement++;
}

// completed
function page3CreateUnhelpfulBehaviour() {
    const parentElement = document.getElementById('page3-insert-behaviour');

    // new test
    const containerForAnimation = document.createElement('div');
    containerForAnimation.classList.add('containerZero');
    containerForAnimation.classList.add('maximizeOutwardsPage3');
    parentElement.append(containerForAnimation);

    const container = document.createElement('div');
    container.id = `page3-unhelpful-behaviour-container-${page3UnhelpfulBehaviourIncrement}`;
    container.classList.add("page3-unhelpful-thoughts-container");
    container.dataset.index = String(page3UnhelpfulBehaviourIncrement);

    // dropdown box
    const dropdown = document.createElement('select');
    dropdown.id = `page3-behaviour-dropdown-${page3UnhelpfulBehaviourIncrement}`;
    dropdown.classList.add("page3-thought-dropdown");
    container.append(dropdown);

    // insert the options
    const optionValues = [
        "Compulsive",
        "Avoiding",
        "Other"
    ];

    const optionInnerHTML = [
        "🔒 Compulsive",
        "🚧 Avoiding",
        "➕ Other"
    ];

    for (let i = 0; i < optionValues.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = optionValues[i];
        optionElement.innerHTML = optionInnerHTML[i];
        dropdown.append(optionElement);
    }

    if (container.dataset.index === 1) {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][2] = dropdown.value;
    } else {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = dropdown.value;
    }

    // close button
    const closeButton = document.createElement('button');
    closeButton.classList.add("close-button");
    const buttonIcon = document.createElement('span');
    buttonIcon.innerHTML = "X";
    closeButton.append(buttonIcon);

    container.append(closeButton);

    // hidden text box for Other dropdown option chosen
    const hiddenTextbox = document.createElement('input');
    hiddenTextbox.id = `page3-behaviour-hidden-text-${page3UnhelpfulBehaviourIncrement}`
    hiddenTextbox.classList.add("checkbox-textbox");
    hiddenTextbox.classList.add("page3-hidden-textbox");
    const hiddenLabel = document.createElement('label');
    hiddenLabel.innerHTML = "behaviour name";
    hiddenLabel.id = `page3-behaviour-hidden-label-${page3UnhelpfulBehaviourIncrement}`
    hiddenLabel.classList.add("page3-hidden-label");

    container.append(hiddenTextbox);
    container.append(hiddenLabel);

    hiddenTextbox.addEventListener('input', (e) => {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = hiddenTextbox.value;
        if (hiddenTextbox.value.length === 0) addErrorSingleContainer(hiddenTextbox)
        else addSuccessSingleContainer(hiddenTextbox);
        verifyPage3();
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdown.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = e.target.value;
        //delete pageContent["page3"]["unhelpfulBehaviourDropdown"]["1"];
        //delete pageContent["page3"]["unhelpfulBehaviourContent"]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = hiddenTextbox.value;
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = e.target.value;
        }
    })

    // textbox
    const textbox = document.createElement('textarea');
    textbox.classList.add("page3-text-input");
    textbox.id = `page3-behaviour-text-${page3UnhelpfulBehaviourIncrement}`;
    textbox.placeholder = "Write down your behaviour..."

    textbox.addEventListener('input', (e) => {
        pageContent["page3"]["unhelpfulBehaviourContent"][container.dataset.index] = e.target.value;
        if (textbox.value.length === 0) addErrorSingleContainer(textbox)
        else addSuccessSingleContainer(textbox);
        verifyPage3();
    })
    container.append(textbox);

    // append new div for unhelpful behaviour to parent
    containerForAnimation.append(container);

    // add horizontal divider
    const divider = document.createElement('hr');
    divider.classList.add("page-divider");
    divider.id = `page3-divider-behaviour-${page3UnhelpfulBehaviourIncrement}`;
    containerForAnimation.append(divider);

    // add listener to delete
    closeButton.addEventListener('click', (e) => {
        delete pageContent["page3"]["unhelpfulBehaviourContent"][container.dataset.index];
        delete pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index];
        /*
        if (container.dataset.index == 1) {
            delete pageContent["page3"]["unhelpfulBehaviourContent"]["2"];
            delete pageContent["page3"]["unhelpfulBehaviourDropdown"]["2"];
        }
        */
        containerForAnimation.classList.remove('maximizeOutwardsPage3');
        containerForAnimation.classList.add('minimizeInwards');
        containerForAnimation.addEventListener('animationend', () => {
            containerForAnimation.remove();
        })
        verifyPage3();
    })

    // force that no outline show when first created
    removeErrorSuccessSingleContainer(textbox);
    removeErrorSuccessSingleContainer(hiddenTextbox);

    // increment increase for unique id's
    page3UnhelpfulBehaviourIncrement++;
}

// completed
function verifyPage3() {

    const upperContainer = document.getElementById('page3SectionThought');
    const lowerContainer = document.getElementById('page3SectionBehaviour');
    const errorText = document.getElementById('page3ErrorTextMain');
    const nextPageButton = document.getElementById('page3NextButton');
    let verified = true;
    let noContent = true;

    // textbox verification for other input
    for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulThoughtDropdown"])) {
        const textContent = document.getElementById(`page3-thought-text-${key}`);
        const hiddenName = document.getElementById(`page3-thought-hidden-text-${key}`);
        if (textContent.value.length === 0) {
            verified = false;
            addErrorSingleContainer(upperContainer);
            addErrorSingleContainer(textContent);
        } else {
            addSuccessSingleContainer(textContent);
        }
        if (pageContent["page3"]["unhelpfulThoughtDropdown"][key].length === 0) {
            verified = false;
            addErrorSingleContainer(hiddenName);
        } else {
            addSuccessSingleContainer(hiddenName);
        }
    }

    // textbox verification for other input
    for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulBehaviourDropdown"])) {
        const textContent = document.getElementById(`page3-behaviour-text-${key}`);
        const hiddenName = document.getElementById(`page3-behaviour-hidden-text-${key}`);
        if (textContent.value.length === 0) {
            verified = false;
            addErrorSingleContainer(upperContainer);
            addErrorSingleContainer(textContent);
        } else {
            addSuccessSingleContainer(textContent);
        }
        if (pageContent["page3"]["unhelpfulBehaviourDropdown"][key].length === 0) {
            verified = false;
            addErrorSingleContainer(hiddenName);
        } else {
            addSuccessSingleContainer(hiddenName);
        }
    }

    /* -------------------------
    Check that objects are the same length for thoughts and behaviours
    ----------------------------*/
    if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length !== Object.keys(pageContent["page3"]["unhelpfulThoughtContent"]).length) verified = false;
    if (Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length !== Object.keys(pageContent["page3"]["unhelpfulBehaviourContent"]).length) verified = false;

    /* -------------------------
    Check that at least one thought or behaviour has been input 
    ----------------------------*/
    if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length === 0 && Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length === 0) {
        verified = false;
        noContent = true;
    } else {
        noContent = false;
    }

    if (noContent) {
        addError(errorText, upperContainer);
        addError(errorText, lowerContainer);
    } else {
        removeErrorSuccess(errorText, upperContainer);
        removeErrorSuccess(errorText, lowerContainer);
    }

    if (verified) {
        if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length !== 0) {
            addSuccessSingleContainer(upperContainer);
            if (Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length === 0) addSuccessSingleContainer(lowerContainer);
        }
        if (Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length !== 0) {
            addSuccessSingleContainer(lowerContainer);
            if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length === 0) addSuccessSingleContainer(upperContainer);
        }
        nextPageReady(nextPageButton);
        return true;
    } else {
        nextPageNotReady(nextPageButton);
        return false;
    }
}

/*
    PAGE 4
*/

// completed (deletion / updating working)
function createPage4Objects() {

    // Thought object creation
    objectCreation("unhelpfulThoughtDropdown", "unhelpfulThoughtContent", "thought");
    // Behaviour object creation
    objectCreation("unhelpfulBehaviourDropdown", "unhelpfulBehaviourContent", "behaviour");

    // Check if objects should be deleted
    objectDeletion();

}

// completed
function objectCreation(dropdownName, contentName, type) {

    for (const [key, value] of Object.entries(pageContent["page3"][dropdownName])) {

        // Check if already exists and update values
        if (pageContent["page4"]["alternativeObjects"].length > 0) {
            const existCheck = (element) => element.id === key && element.type === type;
            if (pageContent["page4"]["alternativeObjects"].some(existCheck)) {
                //console.log(`Identified that ${type} of ${key}:${value} already exists within the object.`);
                //console.log(`To update the name of ${type} to ${pageContent["page3"][dropdownName][key]}.`);
                //console.log(`To update the description of ${type} to ${pageContent["page3"][contentName][key]}.`);
                for (let k = 0; k < pageContent["page4"]["alternativeObjects"].length; k++) {
                    if (pageContent["page4"]["alternativeObjects"][k].type === type) {
                        if (pageContent["page4"]["alternativeObjects"][k].id === key) {
                            pageContent["page4"]["alternativeObjects"][k].name = pageContent["page3"][dropdownName][key];
                            pageContent["page4"]["alternativeObjects"][k].description = pageContent["page3"][contentName][key];
                            //console.log("Successfully updated.");
                        }
                    }
                }
                continue
            }
        }

        // Create new object	
        const newObject = {};
        newObject.id = key;
        newObject.type = type;
        newObject.name = value;
        newObject.description = pageContent["page3"][contentName][key];
        newObject.answer = "";
        newObject.checked = false;

        pageContent["page4"]["alternativeObjects"].push(newObject);
    }
}

// completed
function objectDeletion() {

    const newArray = [];

    for (let i = 0; i < pageContent["page4"]["alternativeObjects"].length; i++) {
        let scheduleForDelete = false;
        if (pageContent["page4"]["alternativeObjects"][i].type === "thought") {
            if (pageContent["page3"]["unhelpfulThoughtDropdown"][pageContent["page4"]["alternativeObjects"][i].id]) scheduleForDelete = false
            else {
                scheduleForDelete = true;
                page4Index--;
                if (page4Index < 0) page4Index = 0;
            }
        }
        if (pageContent["page4"]["alternativeObjects"][i].type === "behaviour") {
            if (pageContent["page3"]["unhelpfulBehaviourDropdown"][pageContent["page4"]["alternativeObjects"][i].id]) scheduleForDelete = false
            else {
                scheduleForDelete = true;
                page4Index--;
                if (page4Index < 0) page4Index = 0;
            }
        }

        if (!scheduleForDelete) newArray.push(pageContent["page4"]["alternativeObjects"][i]);
    }

    pageContent["page4"]["alternativeObjects"] = newArray;
}

// in progress - to add animation
function page4CreateAlternativeHTMLElement() {

    const parentElement = document.getElementById('page4-insert-container');
    const nextButton = document.getElementById('page4-alternative-next-button');

    const fullContainer = document.createElement('div');
    fullContainer.id = `page4-fullContainer-${page4Index}`;
    parentElement.append(fullContainer);

    // create the HTML parts
    // update the HTML / CSS properties

    // upper part
    const topSection = document.createElement('section');
    topSection.classList.add("page4-section")
    parentElement.append(topSection);

    const topContainer = document.createElement('div');
    topContainer.classList.add("page4-container")
    topSection.append(topContainer);

    // thoughts
    if (pageContent["page4"]["alternativeObjects"][page4Index].type === "thought") {
        const topHeader = document.createElement('h3');
        // have an array of nice phrases to appear
        const nicePhrasesThoughts = [
            "Well done! - you realized an unhelpful thought pattern of:",
            "Nice work! - you noticed an unhelpful thought pattern of:",
            "You are doing so well! - you saw through an unhelpful thought pattern of:",
            "Amazing! - you realized an unhelpful thought pattern of:",
            "Keep it up! - you saw through an unhelpful thought pattern of:",
            "Just a little more! - you noticed an unhelpful thought pattern of:",
        ];
        topHeader.innerHTML = nicePhrasesThoughts[Math.floor(Math.random() * nicePhrasesThoughts.length)];
        topContainer.append(topHeader);
        // behaviours
    } else {
        const topHeader = document.createElement('h3');
        // have an array of nice phrases to appear
        const nicePhrasesThoughts = [
            "Well done! - you realized an unhelpful behaviour:",
            "Nice work! - you can stop this behaviour now:",
            "You are doing so well! - you saw you are:",
            "Amazing! - you realized an unhelpful behaviour of:",
            "Keep it up! - you saw through your response of:",
            "Just a little more! - you noticed an unhelpful behaviour of:",
        ];
        topHeader.innerHTML = nicePhrasesThoughts[Math.floor(Math.random() * nicePhrasesThoughts.length)];
        topContainer.append(topHeader);
    }

    const topContainerInner = document.createElement('div');
    topContainerInner.classList.add("page4-container-inner");
    topContainer.append(topContainerInner);

    const topName = document.createElement('h2');
    topName.innerHTML = pageContent["page4"]["alternativeObjects"][page4Index].name;
    topContainerInner.append(topName);

    const topDivider = document.createElement('hr');
    topDivider.classList.add("page-divider");
    topContainerInner.append(topDivider);

    const topDescription = document.createElement('p');
    topDescription.innerHTML = pageContent["page4"]["alternativeObjects"][page4Index].description;
    topContainerInner.append(topDescription);

    // lower part

    const bottomSection = document.createElement('section');
    bottomSection.id = `page4-bottom-section-${page4Index}`;
    bottomSection.classList.add("page4-section");
    parentElement.append(bottomSection);

    const bottomContainer = document.createElement('div');
    bottomContainer.classList.add("page4-container")
    bottomSection.append(bottomContainer);

    // guide section

    const guideContainer = document.createElement("div");
    guideContainer.classList.add("float");
    bottomContainer.append(guideContainer);
    const guideText = document.createElement("p");
    guideText.innerHTML = "how to challenge?";
    guideText.style.textAlign = "right";
    guideText.style.fontWeight = "600";
    const guideButton = document.createElement("button");
    guideButton.innerHTML = "i";
    guideButton.style.color = "#be80db";
    guideButton.style.fontStyle = "italic";
    guideButton.classList.add("help-button");
    guideContainer.append(guideText);
    guideContainer.append(guideButton);
    const guideContentContainer = document.createElement("div");
    guideContentContainer.style.display = "none";
    guideContentContainer.classList.add(`maximizeOutPage3Help-${pageContent["page4"]["alternativeObjects"][page4Index].type}`);

    guideButton.addEventListener("click", () => {
        if (guideContentContainer.style.display === "none") {
            guideContentContainer.style.display = "block";
            guideContentContainer.classList.remove("minimizeInwards");
            guideContentContainer.classList.add(`maximizeOutPage3Help-${pageContent["page4"]["alternativeObjects"][page4Index].type}`);
            //guideButton.scrollIntoView({ behavior: 'smooth'});
        } else {
            guideContentContainer.classList.remove(`maximizeOutPage3Help-${pageContent["page4"]["alternativeObjects"][page4Index].type}`);
            guideContentContainer.classList.add("minimizeInwards");
        }
    });

    guideContentContainer.addEventListener("animationend", () => {
        if (guideContentContainer.classList.contains("minimizeInwards")) {
            guideContentContainer.style.display = "none";
        } else {
            guideButton.scrollIntoView({ behavior: 'smooth' });
        }
    });


    const guideContent = document.createElement("p");
    const guideLink = document.createElement("a");
    guideLink.innerHTML = "more information"
    if (pageContent["page4"]["alternativeObjects"][page4Index].type === "thought") {
        guideContent.innerHTML = "⚔️⚔️ It's important to <b><u>challenge</b></u> unhelpful thoughts once you notice them."
            + "<br /> <br />" +
            "✔️🎯 What <b><u>proof</b></u> do you have that this thought is <b><u>true</b></u>?"
            + "<br /> <br />" +
            "❌🎯 How about against it? Your initial thought <b><u>may not be 100% accurate</b></u>."
            + "<br /> <br />" +
            "🧑‍⚖️ What <b><u>proof</b></u> do you have that this thought is <b><u>not true</b></u>? There are a few ways to try this - why not treat it like a court-trial? What evidence would you present to the judge?"
            + "<br /> <br />" +
            "🙂🥰 Or, if that's not your cup of tea, why not something more empathetic? What would you tell a friend in the same situation?"
            + "<br /> <br />" +
            "💪🦶 This is an important step for your mental health journey, why not read more on this:";
        guideLink.src = "https://www.innermelbpsychology.com.au/thought-challenging/";
    } else {
        guideContent.innerHTML = "⚔️⚔️ It's important to <b><u>challenge</b></u> unhelpful behaviours once you notice them."
            + "<br /> <br />" +
            "✔️👍 Is your behaviour <b><u>positive</b></u> and <b><u>helpful</b></u>?"
            + "<br /> <br />" +
            "❌🙅 Is your behaviour <b><u>negative</b></u> and <b><u>harmful</b></u>? Are you putting something off? Would tackling the situation be more beneficial?"
            + "<br /> <br />" +
            "🔎🌐 Does your behaviour match the <b><u>scale of the situation</b></u>?"
            + "<br /> <br />" +
            "🙂🥰 What would you tell a friend to do in the same situation?"
            + "<br /> <br />" +
            "💪🦶 This is an important step for your mental health journey, why not read more on this:";
        guideLink.src = "https://www.thoughtsonlifeandlove.com/anxiety-and-unhelpful-behaviours/";
    }
    guideLink.addEventListener('click', () => {
        window.open(guideLink.src, '_blank');
    });

    guideContentContainer.append(guideContent);
    guideContentContainer.append(guideLink);
    guideContainer.append(guideContentContainer);

    // thought phrases
    if (pageContent["page4"]["alternativeObjects"][page4Index].type === "thought") {
        const bottomHeader = document.createElement('h3');
        const nicePhrasesThoughtsAlternative = [
            "Try and tell yourself an alernative thought:",
            "A better way to think about this would be:",
            "What would you tell a friend instead:",
            "Is there a different way to think about this:",
            "How else could you think about it:",
        ];
        bottomHeader.innerHTML = nicePhrasesThoughtsAlternative[Math.floor(Math.random() * nicePhrasesThoughtsAlternative.length)];
        bottomContainer.append(bottomHeader);
        // behaviours
    } else {
        const bottomHeader = document.createElement('h3');
        const nicePhrasesThoughtsAlternative = [
            "What's a better way to act:",
            "A better way to behave is:",
            "What would you tell a friend instead:",
            "Is there a different way to behave:",
            "What is a more positive action:",
            "What is a more beneficial action:",
        ];
        bottomHeader.innerHTML = nicePhrasesThoughtsAlternative[Math.floor(Math.random() * nicePhrasesThoughtsAlternative.length)];
        bottomContainer.append(bottomHeader);
    }

    // error handling
    const hiddenErrorContainer = document.createElement('div');
    hiddenErrorContainer.classList.add('error-message');
    hiddenErrorContainer.classList.add('containerZero');
    hiddenErrorContainer.style.display = 'none';
    hiddenErrorContainer.id = `page4-error-${page4Index}`;
    const hiddenErrorText = document.createElement('p');
    hiddenErrorText.innerHTML = "Challenge your unhelpful pattern.";
    hiddenErrorContainer.append(hiddenErrorText);

    bottomContainer.append(hiddenErrorContainer);

    const bottomContainerInner = document.createElement('div');
    bottomContainerInner.classList.add("page4-container-inner");
    bottomContainer.append(bottomContainerInner);

    const bottomTextbox = document.createElement('textarea');
    bottomTextbox.classList.add("alternative-thought-input");
    bottomTextbox.value = pageContent["page4"]["alternativeObjects"][page4Index].answer;
    bottomTextbox.id = `page4-textbox-${page4Index}`;
    bottomTextbox.placeholder = "...";
    bottomContainerInner.append(bottomTextbox);

    // apply listeners

    bottomTextbox.addEventListener('input', (e) => {
        pageContent["page4"]["alternativeObjects"][page4Index].answer = bottomTextbox.value;

        if (bottomTextbox.value.length > 0) {
            // success
            addSuccess(hiddenErrorContainer, bottomSection);
            addSuccessSingleContainer(bottomTextbox);
            nextPageReady(nextButton);
        } else {
            // reset
            removeErrorSuccess(hiddenErrorContainer, bottomSection);
            removeErrorSuccessSingleContainer(bottomTextbox);
            nextPageNotReady(nextButton);
        }
    })

    fullContainer.append(topSection);
    fullContainer.append(bottomSection);

    // add animation class to it

    page4ControlIndex0AlternativeButton();
}

function animationEnd(HTMLElement, removeAnimationClass, classOnAnimationEnd) {
    HTMLElement.addEventListener("animationend", () => {
        HTMLElement.classList.remove(openClass);
        HTMLElement.classList.add(classOnAnimationEnd);
    });
}


// in progress - to add animation
function page4RemoveAlternativeHTMLElement() {

    // add animation class to it
    document.getElementById(`page4-fullContainer-${page4Index}`).remove();

}

// completed
function page4PrepareElements() {

    const node = document.getElementById("page4-insert-container");

    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function page4ControlIndex0AlternativeButton() {
    if (page4Index === 0) {
        document.getElementById('page4-alternative-back-button').classList.add('hidden');
    } else {
        document.getElementById('page4-alternative-back-button').classList.remove('hidden');
    }
}

// Page 4.5

function page45StateManager() {

    // temporary
    let primaryFeeling = "";
    let primaryThought = "";
    let primaryBehaviour = "";

    //unhelpfulFeeling
    let maxFeeling = 0;
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings"])) {
        if (pageContent["page2"]["feelings-slider-value"][key] > maxFeeling) {
            maxFeeling = pageContent["page2"]["feelings-slider-value"][key];
            primaryFeeling = value.toLowerCase();
        }
    };

    //unhelpfulThoughtDropdown
    //console.log("Trying to detect unhelpful thoughts.")
    if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length > 0) {
        //console.log("Detected that length of thoughts is more than 1.")
        let i = 0;
        const index = Math.floor(Math.random() * Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length);
        //console.log(`Generated i of ${i} and index of ${index}`);
        for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulThoughtDropdown"])) {
            //console.log(key, value, i);
            if (i === index) primaryThought = value.toLowerCase();
            i++;
        };
    }

    //unhelpfulBehaviourDropdown
    if (Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length > 0) {
        let i = 0;
        const index = Math.floor(Math.random() * Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length)
        for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulBehaviourDropdown"])) {
            if (i === index) primaryBehaviour = value.toLowerCase();
            i++;
        };
    }

    if (page45State === 0) {
        // do something
        // see "Page 4 - Talk to a friend part 0" on Figma
        const text = `Here is your friend Quokka.`;
        const text2 = `Could you give them some advice?`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        content.classList.add("justify-center");
        page45CreateElements(content, "none", "anxious");
    } else if (page45State === 1) {
        // Page 4 - Talk to a friend part 1 on Figma
        const text = `I'm feeling <b><u>${primaryFeeling}</b></u>.`;
        const text2 = `I think you know what happened...`;
        const text3 = `So, I started to fill out my CBT log.`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + text2 + "<br />" + text3;
        page45CreateElements(content, "under", "down");
    } else if (page45State === 2) {
        // Page 4 - Talk to a friend part 2 on Figma
        let text = ""; // can change based on inputs
        if (primaryThought && primaryBehaviour) {
            text = `I noticed a thought pattern of <b><u>${primaryThought}</b></u> and a behaviour pattern of <b><u>${primaryBehaviour}</b></u>...`;
        } else if (primaryThought) {
            text = `I noticed a thought pattern of <b><u>${primaryThought}</b></u>...`;
        } else { // (primaryBehavriour)
            text = `I noticed a thought pattern of <b><u>${primaryBehaviour}</b></u>...`;
        }
        const content = document.createElement('p');
        content.innerHTML = text;
        page45CreateElements(content, "under", "think");
    } else if (page45State === 3) {
        // Page 4 - Talk to a friend part 3 on Figma
        const text = `Can you help me? I’m not sure what I should do...`;
        const text2 = `What would you do if you were me?`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        page45CreateElements(content, "under", "ask");
    } else if (page45State === 4) {
        // Page 4 - Talk to a friend part 4 on Figma
        const textbox = document.createElement('textarea');
        textbox.placeholder = "Give Quokka some friendly advice...";
        textbox.id = "page45-advice-textbox";
        textbox.value = pageContent["page4"]["friendlyAdvice"];
        textbox.addEventListener('input', (e) => {
            pageContent["page4"]["friendlyAdvice"] = e.target.value;

            // error handling
            const errorContainer = document.getElementById('page45-error-container');
            const nextPageButton = document.getElementById('page4.5-alternative-next-button');
            if (e.target.value.length > 0) {
                // success
                addSuccess(errorContainer, textbox);
                nextPageReady(nextPageButton);
            } else {
                // error
                removeErrorSuccess(errorContainer, textbox);
                nextPageNotReady(nextPageButton);
            }
        })
        page45CreateElements(textbox, "left", "down");
    } else if (page45State === 5) {
        // Page 5 - Talk to a friend part 4 on Figma
        const text = `Thanks! That's some good advice!`;
        const text2 = `I think I needed to hear that. I feel much better now.`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        page45CreateElements(content, "under", "happy");
    }

    //console.log(`Reached page 45 state of ${page45State}.`)
}

function page45CreateElements(content, speechbox, image) {

    const parentElement = document.getElementById('page4.5-insert-container');

    // top row

    // container
    const topRowContainer = document.createElement('div');
    topRowContainer.classList.add("page45-top-row");
    topRowContainer.id = `page45-topRow-${page45State}`;
    parentElement.append(topRowContainer);

    // column 1
    const column1 = document.createElement('div');
    column1.classList.add("column1");
    topRowContainer.append(column1);

    // create the speech bubble
    if (speechbox === "under") {
        const speechBubble = document.createElement('div');
        speechBubble.classList.add("speech-box");
        speechBubble.classList.add("sb-rightside");
        column1.append(speechBubble);
        speechBubble.append(content);
    }
    if (speechbox === "left") {
        const speechBubble = document.createElement('div');
        speechBubble.classList.add("speech-box");
        speechBubble.classList.add("sb-leftside");
        column1.append(speechBubble);
        speechBubble.append(content);
    }
    if (speechbox === "none") {
        const speechBubble = document.createElement('div');
        speechBubble.classList.add("container");
        column1.append(speechBubble);
        speechBubble.append(content);
    }

    // column 2
    const column2 = document.createElement('div');
    column2.classList.add("column2");
    topRowContainer.append(column2);

    // buttons
    const backButtonContainer = document.createElement('button');
    backButtonContainer.classList.add("button-small");
    backButtonContainer.id = "page4.5-alternative-back-button";
    column2.append(backButtonContainer);

    const fwdButtonContainer = document.createElement('button');
    fwdButtonContainer.classList.add("button-small");
    fwdButtonContainer.classList.add('priority-button');
    fwdButtonContainer.id = "page4.5-alternative-next-button";
    column2.append(fwdButtonContainer);

    // fwd
    const buttonIcon = document.createElement('img');
    buttonIcon.classList.add('button-small-icon');
    buttonIcon.src = "./resources/icons/left-arrow.svg";
    buttonIcon.alt = "next page";
    fwdButtonContainer.append(buttonIcon);

    fwdButtonContainer.addEventListener('click', (e) => {
        if (page45State < 5) {
            if (page45State === 4 || page45State === 5) {
                if (pageContent["page4"]["friendlyAdvice"].length === 0) {
                    // error handling
                    const errorContainer = document.getElementById('page45-error-container');
                    const textboxAdvice = document.getElementById('page45-advice-textbox');
                    addError(errorContainer, textboxAdvice);
                } else {
                    //console.log("Something has gone wrong.");
                    page45RemoveElements();
                    page45State++;
                    page45StateManager();
                    document.getElementById('page45Container').scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                page45RemoveElements();
                page45State++;
                page45StateManager();
                document.getElementById('page45Container').scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            //console.log("Go to the final page. PLEASE!")
            const to = document.getElementById('page5Container');
            const from = document.getElementById('page45Container');
            changePage(from, to, "forward");
            //to.scrollIntoView({ behavior: 'smooth'});
            page5CreateFeelingElements();
            page5TopContainerVerification();
        }
    })

    // back
    const buttonIconBack = document.createElement('img');
    buttonIconBack.classList.add('button-small-icon');
    buttonIconBack.classList.add('back');
    buttonIconBack.src = "./resources/icons/left-arrow.svg";
    buttonIconBack.alt = "previous page";
    backButtonContainer.append(buttonIconBack);

    backButtonContainer.addEventListener('click', (e) => {
        const page4Container = document.getElementById('page4Container');
        const page45Container = document.getElementById('page45Container');
        if (page45State > 0) {
            page45RemoveElements();
            page45State--;
            page45StateManager();
            page45Container.scrollIntoView({ behavior: 'smooth' });
        } else {
            //console.log("Go back to alternative patterns")
            page4Index = pageContent["page4"]["alternativeObjects"].length - 1;
            //page4RemoveAlternativeHTMLElement();
            page4CreateAlternativeHTMLElement();
            page45RemoveElements();
            changePage(page45Container, page4Container, "back");
            //page4Container.scrollIntoView({ behavior: 'smooth'});
        }
    })

    // bottom row

    // container
    const bottomRowContainer = document.createElement('div');
    bottomRowContainer.classList.add("page45-bottom-row");
    bottomRowContainer.id = `page45-bottomRow-${page45State}`;
    parentElement.append(bottomRowContainer);

    let adviceCharacter = null;

    if (image === "happy") adviceCharacter = happyImage;
    if (image === "down") adviceCharacter = downImage;
    if (image === "ask") adviceCharacter = askImage;
    if (image === "think") adviceCharacter = thinkImage;
    if (image === "anxious") adviceCharacter = anxiousImage;

    /*
    const penguinPicture = document.createElement('img');
    if (image === "sad") {
        penguinPicture.src = "./resources/graphics/sadPenguin.png"; 
    } else if (image === "happy") {
        penguinPicture.src = "./resources/graphics/happyPenguin.png"; 
    } else {
        console.log("You have typed in the wrong type of Penguin character to generate.")
    }
    penguinPicture.alt = "Penguin Character";
    */

    bottomRowContainer.append(adviceCharacter);

    // set the styling of the completed or not completed

    if (page45State === 4) {
        const errorContainer = document.getElementById('page45-error-container');
        const textboxAdvice = document.getElementById('page45-advice-textbox');

        if (pageContent["page4"]["friendlyAdvice"].length > 0) {
            addSuccess(errorContainer, textboxAdvice);
            nextPageReady(fwdButtonContainer);
        } else {
            removeErrorSuccess(errorContainer, textboxAdvice);
            nextPageNotReady(fwdButtonContainer);
        }
    }

}

function page45RemoveElements() {
    for (let i = 0; i < 6; i++) {
        try {
            document.getElementById(`page45-bottomRow-${i}`).remove();
            document.getElementById(`page45-topRow-${i}`).remove();
        } catch {
            //console.log(`-`);
        }
    }
}

// Page 5

function page5CreateFeelingElements() {

    // delete any previous elements
    try {
        document.getElementById('page5-insert-container').remove();
        //console.log("Deleted the previous old feeling element.")
    } catch {
        //console.log("Page 5 insert feelings element did not exist to delete.")
    }

    // create new elements
    const parentElement = document.getElementById('page5-feelings-section');
    const insertContainer = document.createElement('div');
    insertContainer.id = "page5-insert-container";
    insertContainer.classList.add('page4-insert-container');
    parentElement.append(insertContainer);

    // create for every element in page content objects
    for (const [key, value] of Object.entries(pageContent["page5"]["feelings"])) {
        // create elements
        const feelingsContainer = document.createElement('div');
        feelingsContainer.classList.add('page5-feeling-container');
        insertContainer.append(feelingsContainer);

        const divider = document.createElement('hr');
        divider.classList.add('page-divider');
        feelingsContainer.append(divider);

        // dropdown
        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-box-container');
        feelingsContainer.append(dropdownContainer);

        const selectDropdown = document.createElement('select');
        selectDropdown.disabled = true;
        dropdownContainer.append(selectDropdown);
        const optionDropdown = document.createElement('option');
        optionDropdown.innerHTML = pageContent["page5"]["feelings"][key];
        selectDropdown.append(optionDropdown);

        // slider container - old value
        const sliderContainerOld = document.createElement('div');
        sliderContainerOld.classList.add('slider-container');
        feelingsContainer.append(sliderContainerOld);
        const sliderContainerOldHeader = document.createElement('h5');
        sliderContainerOldHeader.innerHTML = "Before you noticed it was this intense...";
        sliderContainerOld.append(sliderContainerOldHeader);
        const sliderContainerOldSlider = document.createElement('input');
        sliderContainerOldSlider.classList.add('slider');
        sliderContainerOldSlider.type = "range";
        sliderContainerOldSlider.max = 10;
        sliderContainerOldSlider.min = 0;
        sliderContainerOldSlider.value = pageContent["page5"]["feelings-slider-value-initial"][key];
        sliderContainerOldSlider.disabled = true;
        sliderContainerOld.append(sliderContainerOldSlider);
        const sliderContainerOldValueText = document.createElement('p');
        sliderContainerOldValueText.classList.add('slider-value');
        sliderContainerOldValueText.innerHTML = pageContent["page5"]["feelings-slider-value-initial"][key];
        sliderContainerOld.append(sliderContainerOldValueText);

        // slider container - new value
        const sliderContainerNew = document.createElement('div');
        sliderContainerNew.classList.add('slider-container');
        feelingsContainer.append(sliderContainerNew);
        const sliderContainerNewHeader = document.createElement('h5');
        sliderContainerNewHeader.innerHTML = "How intense is this feeling now?";
        sliderContainerNew.append(sliderContainerNewHeader);
        const sliderContainerNewSlider = document.createElement('input');
        sliderContainerNewSlider.classList.add('slider');
        sliderContainerNewSlider.type = "range";
        sliderContainerNewSlider.max = 100;
        sliderContainerNewSlider.min = 0;
        sliderContainerNewSlider.value = pageContent["page5"]["feelings-slider-value-new"][key] * 10;
        sliderContainerNewSlider.id = `page5-new-slider-${key}`;
        sliderContainerNew.append(sliderContainerNewSlider);
        const sliderContainerNewValueText = document.createElement('p');
        sliderContainerNewValueText.classList.add('slider-value');
        sliderContainerNewValueText.classList.add('positive');
        sliderContainerNewValueText.innerHTML = pageContent["page5"]["feelings-slider-value-new"][key];
        pageContent["page5"]["feelings-slider-moved"][key] = false;
        sliderContainerNewValueText.id = `page5-new-value-${key}`;
        sliderContainerNew.append(sliderContainerNewValueText);

        // hidden box
        const sliderContainerNewValueCongrats = document.createElement('h5');
        sliderContainerNewValueCongrats.style.display = "none"; // hide initially
        sliderContainerNew.append(sliderContainerNewValueCongrats);

        // add a listener here to update the new value in pageContent and innerHTML
        let hasTheNewSliderValueChanged = false;
        sliderContainerNewSlider.addEventListener('input', function (event) {

            sliderContainerNewValueText.innerHTML = Math.floor(sliderContainerNewSlider.value / 10);
            pageContent["page5"]["feelings-slider-value-new"][key] = sliderContainerNewValueText.innerHTML;
            hasTheNewSliderValueChanged = true;
            pageContent["page5"]["feelings-slider-moved"][key] = hasTheNewSliderValueChanged;

            if (hasTheNewSliderValueChanged) {
                sliderContainerNewValueCongrats.style.display = "block";
                let newValue = parseInt(sliderContainerNewValueText.innerHTML);
                let oldValue = parseInt(pageContent["page5"]["feelings-slider-value-initial"][key]);
                if (newValue < oldValue) {
                    // BETTER
                    sliderContainerNewValueCongrats.classList.add('positive');
                    sliderContainerNewValueCongrats.innerHTML = "Woohoo! You are feeling better than before!";
                } else if (newValue === oldValue) {
                    // SAME
                    sliderContainerNewValueCongrats.classList.add('positive');
                    sliderContainerNewValueCongrats.innerHTML = "That's okay! You still worked hard to improve yourself!";
                } else {
                    // WORSE
                    sliderContainerNewValueCongrats.classList.add('positive');
                    sliderContainerNewValueCongrats.innerHTML = "It is still a step in the right direction, and I am glad you took it.";
                }
            } else {
                sliderContainerNewValueCongrats.style.display = "none";
            }

            page5TopContainerVerification();
        })
    }

    // create the new positive feeling dropdown listeners
    const newPositiveFeelingsDropdown = document.getElementById('page5-new-positive-feelings-dropdown');
    const newPositiveFeelingSlider = document.getElementById('page5-new-positive-feelings-slider');
    const newPositiveFeelingSliderValue = document.getElementById('page5-new-positive-feelings-slider-value');

    // hidden text box listeners
    const hiddenContainerPage5 = document.getElementById('page5-hidden-textbox-container');
    const hiddenTextboxPage5 = document.getElementById('page5-hidden-textbox');

    hiddenTextboxPage5.addEventListener('input', (e) => {
        pageContent["page5"]["new-feeling"] = hiddenTextboxPage5.value;

        console.log(hiddenTextboxPage5.value);

        if (hiddenTextboxPage5.value.length > 0) {
            showPage5Slider();
        } else {
            removePage5Slider();
        }

    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    newPositiveFeelingsDropdown.addEventListener('change', (e) => {
        pageContent["page5"]["new-feeling"] = e.target.value;

        if (e.target.value === "Other") {
            hiddenContainerPage5.style.display = "flex";
            pageContent["page5"]["new-feeling"] = hiddenTextboxPage5.value;
        }

        if (e.target.value !== "Other") {
            hiddenContainerPage5.style.display = "none";
            pageContent["page5"]["new-feeling"] = e.target.value;
        }

        page5LowerContainerVerification();
        const errorContainerLower = document.getElementById('page5-error-container-lower');
        const lowerContainer = document.getElementById('page5-new-feelings-section');
        removeErrorSuccess(errorContainerLower, lowerContainer);

        if (e.target.value === "notBetter") {
            page5Verification();
        }
    })

    // new positive emotion slider listener
    let hasTheNewPositiveSliderValueChanged = false;
    const newPositiveFeelingSuccessMessage = document.getElementById('page5-new-positive-feeling-success');
    newPositiveFeelingSlider.addEventListener('input', function (event) {
        hasTheNewPositiveSliderValueChanged = true;
        newPositiveFeelingSliderValue.innerHTML = Math.floor(newPositiveFeelingSlider.value / 10);
        //console.log("The new value for the positive emotion slider should be...")
        //console.log(`${Math.floor(newPositiveFeelingSlider.value / 10)}`);
        pageContent["page5"]["new-feeling-value"] = newPositiveFeelingSliderValue.innerHTML;
        if (hasTheNewPositiveSliderValueChanged) {
            newPositiveFeelingSuccessMessage.style.display = "block";
        } else {
            newPositiveFeelingSuccessMessage.style.display = "none";
        }
        page5NewFeelingsSliderMoved = true;
        page5Verification();
    })

    setNewFeelingSliders();
}

function page5Verification() {
    let pageVerified = true;

    // TOP CONTAINER

    // check all relevant page5 items that require changes
    if (pageContent["page5"]["new-feeling-value"].length === 0 && pageContent["page5"]["new-feeling"] !== "notBetter") pageVerified = false;
    if (pageContent["page5"]["new-feeling"].length === 0) pageVerified = false;
    if (pageContent["page5"]["new-feeling"] === "Unselected") pageVerified = false;
    for (const [key, value] of Object.entries(pageContent["page5"]["feelings-slider-moved"])) { if (value === false) pageVerified = value };

    page5TopContainerVerification();

    const errorContainerTop = document.getElementById('page5-error-container');
    const topContainer = document.getElementById('page5-feelings-section');

    if (!page5TopContainerComplete) {
        addError(errorContainerTop, topContainer);
        return page5TopContainerComplete;
    } else {
        addSuccess(errorContainerTop, topContainer);
    }

    // BOTTOM CONTAINER

    page5LowerContainerVerification();

    const errorContainerLower = document.getElementById('page5-error-container-lower');
    const lowerContainer = document.getElementById('page5-new-feelings-section');

    if (!page5LowerContainerComplete) {
        addError(errorContainerLower, lowerContainer);
        return page5LowerContainerComplete;
    } else {
        addSuccess(errorContainerLower, lowerContainer);
    }

    const nextButton = document.getElementById('page5NextButton');
    if (pageVerified) {
        nextButton.classList.remove('incomplete-page');
    } else {
        nextButton.classList.add('incomplete-page');
    }

    return pageVerified;
}

function page5LowerContainerVerification() {
    const value = document.getElementById('page5-new-positive-feelings-dropdown').value;
    if (value === "Unselected") {
        page5LowerContainerComplete = false;
        removePage5Slider();
    } else if (value === "notBetter") {
        page5LowerContainerComplete = true;
        page5NewFeelingsSliderMoved = true;
        document.getElementById('page5-no-change').style.display = "block";
        removePage5Slider();
    } else if (value === "otherFeeling") {
        page5LowerContainerComplete = false;
        showHiddenTextBoxPage5();
    } else {
        page5LowerContainerComplete = false;
        showPage5Slider();
    }

    if (value !== "notBetter") {
        document.getElementById('page5-no-change').style.display = "none";
    }

    if (value !== "otherFeeling") {
        removeHiddenTextBoxPage5();
    }

    if (pageContent["page5"]["new-feeling-value"].length !== 0 && pageContent["page5"]["new-feeling"] !== "Unselected" && pageContent["page5"]["new-feeling"].length !== 0) {
        page5LowerContainerComplete = true;
    }

    if (page5LowerContainerComplete && page5NewFeelingsSliderMoved) {
        page5LowerContainerComplete = true;
    } else {
        page5LowerContainerComplete = false;
    }
}

function showHiddenTextBoxPage5() {
    // hidden text box elements
    const hiddenContainerPage5 = document.getElementById('page5-hidden-textbox-container');
    hiddenContainerPage5.style.display = "flex";
}

function removeHiddenTextBoxPage5() {
    // hidden text box elements
    const hiddenContainerPage5 = document.getElementById('page5-hidden-textbox-container');
    hiddenContainerPage5.style.display = "none";
}

function showPage5Slider() {
    const sliderContainer = document.getElementById('page5SliderContainer');
    sliderContainer.style.display = "block";
}

function removePage5Slider() {
    const sliderContainer = document.getElementById('page5SliderContainer');
    sliderContainer.style.display = "none";
    pageContent["page5"]["new-feeling-value"] = "";

    const sliderMessage = document.getElementById('page5-new-positive-feeling-success');
    sliderMessage.innerHTML = "";
    sliderMessage.style.display = "none";
}

function showPage5LowerContainerMessage(message) {
    const sliderMessage = document.getElementById('page5-new-positive-feeling-success');
    sliderMessage.innerHTML = message;
    sliderMessage.style.display = "block";
}

// listener for page5 lower section

document.getElementById('page5-new-positive-feelings-dropdown').addEventListener("change", (e) => {
    page5LowerContainerVerification();
})

function page5TopContainerVerification() {
    page5TopContainerComplete = true;
    for (const [key, value] of Object.entries(pageContent["page5"]["feelings-slider-moved"])) {
        if (value === false) {
            page5TopContainerComplete = false;
        }
    }
    if (page5TopContainerComplete === true) {
        // success
        const topContainer = document.getElementById('page5-feelings-section');
        const topErrorContainer = document.getElementById('page5-error-container');

        addSuccess(topErrorContainer, topContainer);
    }
}

function setNewFeelingSliders() {
    for (const [key, value] of Object.entries(pageContent["page5"]["feelings-slider-value-new"])) {
        const slider = document.getElementById(`page5-new-slider-${key}`);
        slider.value = parseInt(value) * 10;
    }
}

function page6CreateElements() {

    // run create PDF after the animation to load page 6 is finished to reduce lag
    const page6Container = document.getElementById('page6Container');
    page6Container.addEventListener('animationend', () => {
        createPDF();
    })

    const parentElement = document.getElementById('page6-insert-container');

    const page6SummaryContainer = document.createElement('div');
    page6SummaryContainer.id = 'page6-summary-container';
    page6SummaryContainer.classList.add('page4-container-inner');
    page6SummaryContainer.style.fontStyle = "normal";
    parentElement.append(page6SummaryContainer);

    // summary information

    const numberOfThoughtPatterns = Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length;
    let thoughtPlural = "";
    if (numberOfThoughtPatterns > 1) thoughtPlural = "s";
    const numberOfBehaviourPatterns = Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length;
    let behaviourPlural = "";
    if (numberOfBehaviourPatterns > 1) behaviourPlural = "s";

    // paragraphs

    const point1 = document.createElement('p');
    point1.innerHTML = "Don't forget to save your CBT log with the save icon below!";
    point1.classList.add('unimportant');
    page6SummaryContainer.append(point1);
    page6SummaryContainer.append(document.createElement('br'));

    const point2 = document.createElement('p');
    if (numberOfThoughtPatterns > 0 && numberOfBehaviourPatterns > 0) {
        point2.innerHTML = `You recognised <b><u>${numberOfThoughtPatterns} unhelpful thought pattern${thoughtPlural}</b></u> and <b><u>${numberOfBehaviourPatterns} unhelpful behaviour pattern${behaviourPlural}</b></u>!`;
    } else if (numberOfThoughtPatterns > 0) {
        point2.innerHTML = `You recognised <b><u>${numberOfThoughtPatterns} unhelpful thought pattern${thoughtPlural}</b></u>!`;
    } else {
        point2.innerHTML = `You recognised <b><u>${numberOfBehaviourPatterns} unhelpful behaviour pattern${behaviourPlural}</b></u>!`;
    }
    page6SummaryContainer.append(point2);
    page6SummaryContainer.append(document.createElement('br'));

    const point3 = document.createElement('p');
    point3.innerHTML = "I'm sure you feel a little better now than before you started - nice work helping yourself out!";
    page6SummaryContainer.append(point3);
    page6SummaryContainer.append(document.createElement('br'));

    const point4 = document.createElement('p');
    point4.innerHTML = "Doing this over time will help rewire your brain so you can respond better in the future! Keep it up - like any skill, it takes practice.";
    page6SummaryContainer.append(point4);
}

function createPDF() {

    // testing purposes only

    const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.";
    const name = "mountains and molehills";
    const description = "I feel like the world is going to end. My boss will fire me..."
    const numberValue = "3";

    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jspdf.jsPDF({
        lineHeight: 1.5,
    });

    // add the image template background
    doc.addImage(img, "PNG", 0, 0, 210, 297);

    // font settings
    doc.addFont("./resources/fonts/BalooTammudu2-Regular.ttf", "BalooTammudu2", "normal");
    doc.addFont("./resources/fonts/BalooTammudu2-Bold.ttf", "BalooTammudu2", "bold");
    doc.setFont('BalooTammudu2', 'normal', 'normal')
    doc.setFontSize(30);
    doc.setTextColor(255, 241, 241);

    /*
    THE DATE
    */

    const date = new Date();
    const dateString = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getYear().toString().slice(1)}`;
    doc.text(dateString, x(169), y(43));

    // font settings
    doc.setFontSize(10);
    doc.setTextColor(182, 226, 248);
    doc.setFont('BalooTammudu2', 'bold');

    // add the hyperlink
    doc.textWithLink('Click here to make a new entry', x(410), y(40), { url: 'https://ohohohobrien.github.io/CBTLog/' });

    // font settings
    doc.setTextColor(255, 241, 241);
    doc.setFont('BalooTammudu2', 'normal', 'normal')

    /*
    WHAT HAPPENED?
    */

    const whatHappenedText = pageContent["page1"]["event"];
    const whatHappenedLimit = 12;
    let whatHappenedSplit = doc.splitTextToSize(whatHappenedText, x(270 - 41));

    if (whatHappenedSplit.length > whatHappenedLimit) {
        whatHappenedSplit = whatHappenedSplit.slice(0, whatHappenedLimit);
        whatHappenedSplit[whatHappenedLimit - 1] = whatHappenedSplit[whatHappenedLimit - 1] + "...";
    };

    for (let i = 0; i < whatHappenedLimit; i++) {
        doc.text(whatHappenedSplit, x(41), y(130));
    };

    /*
    INITIAL FEELINGS
    */

    /*
    EMOTIONAL
    */

    const lineDifferenceIncrement = 17;
    let emotionalFeelingIncrement = 0;
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings"])) {
        if (emotionalFeelingIncrement < 4) {
            doc.text(pageContent["page2"]["feelings"][key], x(330), y(147 + lineDifferenceIncrement * emotionalFeelingIncrement));
            doc.text("Intensity level: " + pageContent["page2"]["feelings-slider-value"][key], x(479), y(147 + lineDifferenceIncrement * emotionalFeelingIncrement));
            emotionalFeelingIncrement++;
        }
    }

    /*
        PHYSICAL
    */

    const xIncrementPhys = 120;
    const yIncrementPhys = 17;
    const xMaxPhys = 460;
    const xInitialPosPhys = 330;
    const yInitialPosPhys = 230;
    const limitIncrementerMaxPhys = 8;
    let xPosPhys = xInitialPosPhys;
    let yPosPhys = yInitialPosPhys;

    addPhysicalFeelingsToPageContent();

    for (let i = 0; i < pageContent["page2"]["physicalFeelings"].length; i++) {
        if (i <= limitIncrementerMaxPhys) {

            doc.text(pageContent["page2"]["physicalFeelings"][i], x(xPosPhys), y(yPosPhys));
            xPosPhys += xIncrementPhys;

            // check if odd number (every second [i]th element reset x and increase y)
            if (i % 2 !== 0) {
                xPosPhys = xInitialPosPhys;
                yPosPhys += yIncrementPhys;
            }

        }
    }

    /*
        UNHELPFUL PATTERNS
    */

    /*
        THOUGHT PATTERNS
            &   &
        BEHAVIOUR PATTERNS
    */

    // IMPLEMENT FOR LOOP FOR EACH - MAX 4

    let thoughtCounter = 0;
    let behaviourCounter = 0;
    const unhelpfulPatternLimit = 4;
    const unhelpfulPatternXPos1 = 49;
    const unhelpfulPatternXPos2 = 177;
    const unhelpfulPatternXPos3 = 386;
    const unhelpfulPatternWidth1 = 112;
    const unhelpfulPatternWidth2 = 179;
    const unhelpfulPatternWidth3 = 162;
    const unhelpfulPatternInitialThoughtY = 411;
    const unhelpfulPatternInitialBehaviourY = 497;
    let unhelpfulPatternYPosThought = unhelpfulPatternInitialThoughtY;
    let unhelpfulPatternYPosBehaviour = unhelpfulPatternInitialBehaviourY;

    for (let i = 0; i < pageContent["page4"]["alternativeObjects"].length; i++) {
        const item = pageContent["page4"]["alternativeObjects"][i];

        let yPos = 0;

        // set the y position based on type
        if (item.type === "thought" && thoughtCounter < unhelpfulPatternLimit) {
            yPos = unhelpfulPatternYPosThought;
            thoughtCounter++;
        } else if (item.type === "behaviour" && behaviourCounter < unhelpfulPatternLimit) {
            yPos = unhelpfulPatternYPosBehaviour;
            behaviourCounter++
        } else {
            console.log("Error has occured trying to print the unhelpful patterns to PDF.");
            continue;
        }

        // name
        const nameOfPattern = doc.splitTextToSize(item.name, x(unhelpfulPatternWidth1));
        if (nameOfPattern.length > 1) {
            nameOfPattern[0] = nameOfPattern[0] + "...";
        }
        doc.text(nameOfPattern[0], x(unhelpfulPatternXPos1), y(yPos));

        // description
        const initialThinking = doc.splitTextToSize(item.description, x(unhelpfulPatternWidth2));
        if (initialThinking.length > 1) {
            initialThinking[0] = initialThinking[0] + "...";
        }
        doc.text(initialThinking[0], x(unhelpfulPatternXPos2), y(yPos));

        // alternative
        const alternativeThinking = doc.splitTextToSize(item.answer, x(unhelpfulPatternWidth3));
        if (alternativeThinking.length > 1) {
            alternativeThinking[0] = alternativeThinking[0] + "...";
        }
        doc.text(alternativeThinking[0], x(unhelpfulPatternXPos3), y(yPos));

        // set the y position based on type
        if (item.type === "thought" && thoughtCounter < unhelpfulPatternLimit) {
            unhelpfulPatternYPosThought += yIncrementPhys;
        } else if (item.type === "behaviour" && behaviourCounter < unhelpfulPatternLimit) {
            unhelpfulPatternYPosBehaviour += yIncrementPhys;
        }
    }

    /*
        ADVICE TO A FRIEND
    */

    const adviceToFriend = pageContent["page4"]["friendlyAdvice"];
    let adviceToFriendSplit = doc.splitTextToSize(adviceToFriend, x(270 - 41));

    if (adviceToFriendSplit.length > whatHappenedLimit) {
        adviceToFriendSplit = adviceToFriendSplit.slice(0, whatHappenedLimit);
        adviceToFriendSplit[whatHappenedLimit - 1] = adviceToFriendSplit[whatHappenedLimit - 1] + "...";
    };

    for (let i = 0; i < whatHappenedLimit; i++) {
        doc.text(adviceToFriendSplit, x(41), y(650));
    };

    /*
        FEELINGS AFTERWARDS
    */

    /*
        EMOTIONAL
    */

    let emotionalFeelingAfterwardsIncrement = 0;
    for (const [key, value] of Object.entries(pageContent["page5"]["feelings"])) {
        if (emotionalFeelingAfterwardsIncrement < 4) {
            doc.text(pageContent["page5"]["feelings"][key], x(330), y(671 + lineDifferenceIncrement * emotionalFeelingAfterwardsIncrement));
            doc.text("Now: " + pageContent["page5"]["feelings-slider-value-new"][key] + " (Was: " + pageContent["page5"]["feelings-slider-value-initial"][key] + ")", x(479), y(671 + lineDifferenceIncrement * emotionalFeelingAfterwardsIncrement));
            emotionalFeelingAfterwardsIncrement++;
        }
    }

    /*
        NEW FEELING
    */

    if (pageContent["page5"]["new-feeling"] !== "notBetter") {
        doc.text(pageContent["page5"]["new-feeling"], x(330), y(753));
        doc.text("Intensity level: " + pageContent["page5"]["new-feeling-value"], x(479), y(753));
    }

    /*
        CONGRATULATONS MESSSAGE
    */

    // font settings
    doc.setFontSize(15);
    doc.setTextColor(182, 226, 248);
    doc.setFont('BalooTammudu2', 'bold');

    doc.text("You did an amazing job!", x(350), y(793));

    // add listener to save the document
    document.getElementById('page6PrintButton').addEventListener('click', () => {
        doc.save(`CBT-Log-${date.getDate()}-${date.getMonth() + 1}-${date.getYear().toString().slice(1)}.pdf`);
    })
}

// helper function for creating pdf - translates pixel value to mm
function x(coord) {
    const xPixelMax = 595;
    const xMmMax = 210;

    return coord / xPixelMax * xMmMax;
}

// helper function for creating pdf - translates pixel value to mm
function y(coord) {
    const yPixelMax = 842;
    const yMmMax = 297;

    return coord / yPixelMax * yMmMax;
}

function addPhysicalFeelingsToPageContent() {

    for (let i = 0; i < pageContent["page2"]["multipleCheckboxes"].length; i++) {
        if (pageContent["page2"][`page2TextboxOption${pageContent["page2"]["multipleCheckboxes"][i]}`]) {
            pageContent["page2"]["physicalFeelings"].push(pageContent["page2"][`page2TextboxOption${pageContent["page2"]["multipleCheckboxes"][i]}`]);
        }
    }
}