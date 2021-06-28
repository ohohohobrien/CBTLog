window.onload = init;

let page2OtherCheckboxIncrement = 5;
let page2EmotionIncrement = 1;
let page3UnhelpfulThoughtIncrement = 1;
let page3UnhelpfulBehaviourIncrement = 1;
let page4Index = 0;
let page45State = 0;

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
        "new-feeling": "",
        "new-feeling-value": "",
    },
};

function init() {
    
    applyPageListeners();

}

function applyPageListeners() {

    // Getting DOM Elements

    // Page 1 Content
    const page1Container = document.getElementById('page1Container');
    const page1NextButton = document.getElementById('page1NextButton');
    const page1TextBox = document.getElementById('page1Textbox');
    let page1TextBoxContents = "";
    // todo: implement a way to check if contents already exist in the textbox
    let page1Complete = false;
    
    // Page 2 Content
    const page2Container = document.getElementById('page2Container');
    const page2FeelingsAddButton = document.getElementById('page2-unhelpful-thought-button');
    const page2OtherCheckbox = document.getElementById('page2CheckboxOption5');
    const page2CheckboxGrid = document.getElementById('page2CheckboxGrid');
    let page2OtherCheckboxExtra = [];
    let page2Complete = false;
    const page2BackButton = document.getElementById('page2BackButton');
    const page2NextButton = document.getElementById('page2NextButton');
    
    // Page 3 Content
    const page3Container = document.getElementById('page3Container');
    const page3UnhelpfulThoughtAddButton = document.getElementById('page3-unhelpful-thought-button');
    const page3UnhelpfulBehaviourAddButton = document.getElementById('page3-unhelpful-behaviour-button');
    let page3Complete = false;
    const page3BackButton = document.getElementById('page3BackButton');
    const page3NextButton = document.getElementById('page3NextButton');

    // Page 4 Content
    const page4Container = document.getElementById('page4Container');
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

    // Applying Listeners

    // Page 1

    page1NextButton.addEventListener("click", function (event) {
        if (page1Complete) {
            changePage(page1Container, page2Container, "forward");
        } else {
            alert("fill out the text box");
            // insert message that needs to be filled out for textbox
        }
    })

    page1TextBox.addEventListener('input', function (event) {
        pageContent["page1"]["event"] = event.target.value;
        if (event.target.value.length > 0) page1Complete = true
        else page1Complete = false;
        
        // insert positive reinforcement icon 
    })

    // Page 2

    page2FeelingsAddButton.addEventListener("click", () => {
        page2CreateEmotion();
    })

    page2AddCheckboxListeners();

    page2OtherCheckbox.addEventListener('change', function (event) {    
        if (this.checked === true){
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
        } else {
            alert("please fill out everything first!")
        }
    })

    // Page 3
    page3UnhelpfulThoughtAddButton.addEventListener("click", () => {
        page3CreateUnhelpfulThought();
    })

    page3UnhelpfulBehaviourAddButton.addEventListener("click", () => {
        page3CreateUnhelpfulBehaviour();
    })

    page3BackButton.addEventListener("click", () => {
        changePage(page3Container, page2Container, "back");
    })

    page3NextButton.addEventListener("click", () => {
        page3Complete = verifyPage3();
        //page3Complete = verifyPage3();
        if (page3Complete) {
            createPage4Objects();
            page4PrepareElements();
            page4CreateAlternativeHTMLElement();
            changePage(page3Container, page4Container, "forward");
        } else {
            alert("Please fill out all information!")
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
            page4Index --;
            page4CreateAlternativeHTMLElement();
            page4Container.scrollIntoView({ behavior: 'smooth'});
        } else {
            alert("Can't go back anymore.")
        }
    });

    page4NextAlternativeButton.addEventListener("click", () => {
        if (pageContent["page4"]["alternativeObjects"][page4Index].answer.length > 0) {
            if (page4Index < (pageContent["page4"]["alternativeObjects"].length - 1)) {
                page4RemoveAlternativeHTMLElement();
                page4Index ++;
                page4CreateAlternativeHTMLElement();
                page4Container.scrollIntoView({ behavior: 'smooth'});
            } else {
                page4RemoveAlternativeHTMLElement();
                page45RemoveElements();
                page45StateManager();
                changePage(page4Container, page45Container, "forward");
                page45Container.scrollIntoView({ behavior: 'smooth'});
                console.log("Made it to the penguin.")
            }
        } else {
            alert("Please enter an alternative thought / behaviour.");
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
        page45Container.scrollIntoView({ behavior: 'smooth'});
    });

    page5NextButton.addEventListener("click", (e) => {
        console.log("Congratulations on making it this far... just a little more.")
    });

}

/*
    HELPER FUNCTIONS
*/

// Completed
function changePage(from, to, direction) {

    if (direction === "forward") {
        to.style.display = "block";
        to.removeEventListener("animationend", to.listener);
        
        from.classList.remove("slideOutLeft");
        from.classList.remove("slideOutRight");
        from.classList.remove("slideInRight");
        from.classList.remove("slideInLeft");
        from.classList.add("slideOutLeft");
        to.classList.remove("slideOutLeft");
        to.classList.remove("slideOutRight");
        to.classList.remove("slideInRight");
        to.classList.remove("slideInLeft");
        to.classList.add("slideInRight");
        
        from.listener = () => {
            from.style.display = "none";
            to.scrollIntoView({ behavior: 'smooth'});
        }
        from.addEventListener("animationend", from.listener);
        
    } 
    else if (direction === "back") {
        to.style.display = "block";
        to.removeEventListener("animationend", to.listener);
        
        from.classList.remove("slideOutLeft");
        from.classList.remove("slideOutRight");
        from.classList.remove("slideInRight");
        from.classList.remove("slideInLeft");
        from.classList.add("slideOutRight");
        to.classList.remove("slideOutLeft");
        to.classList.remove("slideOutRight");
        to.classList.remove("slideInRight");
        to.classList.remove("slideInLeft");
        to.classList.add("slideInLeft");
        
        from.listener = () => {
            from.style.display = "none";
            to.scrollIntoView({ behavior: 'smooth'});
        }
        from.addEventListener("animationend", from.listener);
        
    } 
    else {
        console.log("You have input an incorrect direction at changePage().")
    }

}

// Completed - helper function
function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

/*
    PAGE 1
*/


/*
    PAGE 2
*/

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
            if (staticCheckboxList[i].checked === true){
                pageContent["page2"]["physicalFeelings"].push(staticCheckboxList[i].value);
                console.log(`Detected change in the checkbox ${i} that CHECKS the box. ${staticCheckboxList[i].value} recorded into array.`)
            }    
            else {
                pageContent["page2"]["physicalFeelings"] = arrayRemove(pageContent["page2"]["physicalFeelings"], staticCheckboxList[i].value);
                console.log(`Detected change in the checkbox ${i} that UNCHECKS the box. ${staticCheckboxList[i].value} removed from array.`)
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
    })

    // Create a new other text div
    const newDivText = document.createElement("div");
    newDivText.classList.toggle("checkbox-option");
    newDivText.id = `${page2OtherCheckboxIncrement}-page2DivText`;

    // Append the new element to the div
    newDivText.append(newTextbox);

    page2OtherCheckboxIncrement ++;

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
        if (this.checked === true){
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
}

// Completed
function page2CreateEmotion() {

    const parentElement = document.getElementById("page2-feeling-insert-container");

    // container to append to
    const container = document.createElement("div");
    container.id = `page2-feeling-${page2EmotionIncrement}`;
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
    const closeButton = document.createElement('div');
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

    container.append(hiddenLabel);
    container.append(hiddenTextbox);

    hiddenTextbox.addEventListener('change', (e) => {
        pageContent["page2"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;
        pageContent["page5"]["feelings"][dropdownList.dataset.index] = hiddenTextbox.value;
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
        container.remove();
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
    pageContent["page5"]["feelings-slider-value-new"][dropdownList.dataset.index] = "5";
    sliderNumberValue.classList.add("slider-value");
    sliderNumberValue.id = `page2SliderValueDisplay-${dropdownList.dataset.index}`;
    sliderContainer.append(sliderNumberValue);

    // listener to update the number value
    slider.addEventListener('change', function (event) {
        sliderNumberValue.innerHTML = Math.floor(slider.value / 10);
        //delete pageContent["page2"]["feelings-slider-value"]["1"];
        console.log(`Updated the page content for slider value ${dropdownList.dataset.index} from ${pageContent["page2"]["feelings-slider-value"][page2EmotionIncrement]} to ${sliderNumberValue.innerHTML}.`);
        pageContent["page2"]["feelings-slider-value"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
        pageContent["page5"]["feelings-slider-value-initial"][dropdownList.dataset.index] = sliderNumberValue.innerHTML;
    })

    // page divider
    const pageDivider = document.createElement("hr");
    pageDivider.classList.add("page-divider");
    container.append(pageDivider);

    // increment increase for unique id's
    page2EmotionIncrement ++;
}

// Completed
function verifyPage2() {
    
    let verified = true;
    // checkbox verification for other input
    for (entries of pageContent["page2"]["multipleCheckboxes"]) {
        try {
            const value = document.getElementById(`page2TextboxOption${entries}`).value;
            if (value.length === 0) {
                verified = false;
            }
        } catch(error) {
            //console.log(`Element with id of page2TextboxOption${entries} not found for page 2 verification.`)
        }
    }

    // textbox verification for other input
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings"])) {
        console.log(`${key}: ${value}`);
        if (value.length === 0) verified = false;
    }

    // slider value verification
    for (const [key, value] of Object.entries(pageContent["page2"]["feelings-slider-value"])) {
        console.log(`${key}: ${value}`);
        if (value < 0 || value > 10) verified = false;
    }

    /* -------------------------
    Test that object isn't empty (need to input an emotion)
    ----------------------------*/
    if (Object.keys(pageContent["page2"]["feelings"]).length === 0 && pageContent["page2"]["feelings"].constructor === Object) verified = false;
    if (Object.keys(pageContent["page2"]["feelings-slider-value"]).length === 0 && pageContent["page2"]["feelings-slider-value"].constructor === Object) verified = false;
   
    if (verified) return true
    else return false;
}

/*
    PAGE 3
*/

// Completed
function page3CreateUnhelpfulThought() {
    const parentElement = document.getElementById('page3-insert-thoughts');

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
    const closeButton = document.createElement('div');
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

    hiddenTextbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulThoughtDropdown"][container.dataset.index] = hiddenTextbox.value;
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
    
    textbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulThoughtContent"][container.dataset.index] = e.target.value;
    })
    container.append(textbox);

    // append new div for unhelpful thought to parent
    parentElement.append(container);

    // add horizontal divider
    const divider = document.createElement('hr');
    divider.classList.add("page-divider");
    divider.id = `page3-divider-thoughts-${page3UnhelpfulThoughtIncrement}`;
    parentElement.append(divider);

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
        container.remove();
        divider.remove();
    })

    // increment increase for unique id's
    page3UnhelpfulThoughtIncrement ++;
}

// completed
function page3CreateUnhelpfulBehaviour() {
    const parentElement = document.getElementById('page3-insert-behaviour');

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
    const closeButton = document.createElement('div');
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

    hiddenTextbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][container.dataset.index] = hiddenTextbox.value;
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
    
    textbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulBehaviourContent"][container.dataset.index] = e.target.value;
    })
    container.append(textbox);

    // append new div for unhelpful behaviour to parent
    parentElement.append(container);

    // add horizontal divider
    const divider = document.createElement('hr');
    divider.classList.add("page-divider");
    divider.id = `page3-divider-behaviour-${page3UnhelpfulBehaviourIncrement}`;
    parentElement.append(divider);

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
        container.remove();
        divider.remove();
    })

    // increment increase for unique id's
    page3UnhelpfulBehaviourIncrement ++;
}

// completed
function verifyPage3() {
    
    let verified = true;
    
    // textbox verification for other input
    for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulThoughtContent"])) {
        console.log(`${key}: ${value}`);
        if (value.length === 0) verified = false;
    }

    // slider value verification
    for (const [key, value] of Object.entries(pageContent["page3"]["unhelpfulBehaviourContent"])) {
        console.log(`${key}: ${value}`);
        if (value < 0 || value > 10) verified = false;
    }

    /* -------------------------
    Check that objects are the same length for thoughts and behaviours
    ----------------------------*/
    if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length !== Object.keys(pageContent["page3"]["unhelpfulThoughtContent"]).length) verified = false;
    if (Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length !== Object.keys(pageContent["page3"]["unhelpfulBehaviourContent"]).length) verified = false;

    /* -------------------------
    Check that at least one thought or behaviour has been input 
    ----------------------------*/
    if (Object.keys(pageContent["page3"]["unhelpfulThoughtDropdown"]).length === 0 && Object.keys(pageContent["page3"]["unhelpfulBehaviourDropdown"]).length === 0) verified = false;
   
    if (verified) return true
    else return false;
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
        if (pageContent["page4"]["alternativeObjects"].length > 0){
            const existCheck = (element) => element.id === key && element.type === type;
            if (pageContent["page4"]["alternativeObjects"].some(existCheck)) {
                console.log(`Identified that ${type} of ${key}:${value} already exists within the object.`);
                console.log(`To update the name of ${type} to ${pageContent["page3"][dropdownName][key]}.`);
                console.log(`To update the description of ${type} to ${pageContent["page3"][contentName][key]}.`);
                for (let k = 0; k < pageContent["page4"]["alternativeObjects"].length; k++)  {
                    if (pageContent["page4"]["alternativeObjects"][k].type === type) {
                        if (pageContent["page4"]["alternativeObjects"][k].id === key) {
                            pageContent["page4"]["alternativeObjects"][k].name = pageContent["page3"][dropdownName][key];
                            pageContent["page4"]["alternativeObjects"][k].description = pageContent["page3"][contentName][key];
                            console.log("Successfully updated.");
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
                page4Index --;
                if (page4Index < 0) page4Index = 0;
            }
		}
		if (pageContent["page4"]["alternativeObjects"][i].type === "behaviour") {
			if (pageContent["page3"]["unhelpfulBehaviourDropdown"][pageContent["page4"]["alternativeObjects"][i].id]) scheduleForDelete = false
			else {
                scheduleForDelete = true;
                page4Index --;
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
        const topHeader = document.createElement('h5');
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
        const topHeader = document.createElement('h5');
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
    bottomSection.classList.add("page4-section")
    parentElement.append(bottomSection);

    const bottomContainer = document.createElement('div');
    bottomContainer.classList.add("page4-container")
    bottomSection.append(bottomContainer);

    // thought phrases
    if (pageContent["page4"]["alternativeObjects"][page4Index].type === "thought") {
        const bottomHeader = document.createElement('h5');
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
        const bottomHeader = document.createElement('h5');
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

    const bottomContainerInner = document.createElement('div');
    bottomContainerInner.classList.add("page4-container-inner");
    bottomContainer.append(bottomContainerInner);

    const bottomTextbox = document.createElement('textarea');
    bottomTextbox.classList.add("alternative-thought-input");
    bottomTextbox.value = pageContent["page4"]["alternativeObjects"][page4Index].answer;
    bottomTextbox.placeholder = "...";
    bottomContainerInner.append(bottomTextbox);
    
    // apply listeners

    bottomTextbox.addEventListener('change', (e) => {
        pageContent["page4"]["alternativeObjects"][page4Index].answer = bottomTextbox.value;
    })

    fullContainer.append(topSection);
    fullContainer.append(bottomSection);

    // add animation class to it

    page4ControlIndex0AlternativeButton();
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
    let feeling = "FIX ME";

    if (page45State === 0) {
        // do something
        // see "Page 4 - Talk to a friend part 0" on Figma
        const text = `Here is your friend penguin.`;
        const text2 = `Could you help them out?`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        content.classList.add("justify-center");
        page45CreateElements(content, "none", "sad");
    } else if (page45State === 1) {
        // Page 4 - Talk to a friend part 1 on Figma
        const text = `I'm feeling a bit ${feeling}.`;
        const text2 = `I think you know the story.`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        page45CreateElements(content, "under", "sad");
    } else if (page45State === 2) {
        // Page 4 - Talk to a friend part 2 on Figma
        const text = `I think I am ${feeling} and acting ${feeling}...`; // can change based on inputs
        const content = document.createElement('p');
        content.innerHTML = text;
        page45CreateElements(content, "under", "sad");
    } else if (page45State === 3) {
        // Page 4 - Talk to a friend part 3 on Figma
        const text = `Can you help me?`;
        const text2 = `I’m not sure what to do.....`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + "<br />" + text2;
        page45CreateElements(content, "under", "sad");
    } else if (page45State === 4) {
        // Page 4 - Talk to a friend part 4 on Figma
        const textbox = document.createElement('textarea');
        textbox.placeholder = "Give penguin some friendly advice...";
        textbox.value = pageContent["page4"]["friendlyAdvice"];
        textbox.addEventListener('change', (e) => {
            pageContent["page4"]["friendlyAdvice"] = e.target.value;
        })
        page45CreateElements(textbox, "left", "sad");
    } else if (page45State === 5) {
        // Page 5 - Talk to a friend part 4 on Figma
        const text = `Thanks!`;
        const text2 = `I think I needed to hear that. I feel much better now.`;
        const content = document.createElement('p');
        content.innerHTML = text + "<br />" + text2;
        page45CreateElements(content, "under", "happy");
    }

    console.log(`Reached page 45 state of ${page45State}.`)
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
    const backButtonContainer = document.createElement('div');
    backButtonContainer.classList.add("button-small");
    backButtonContainer.id = "page4.5-alternative-back-button";
    column2.append(backButtonContainer);

    const fwdButtonContainer = document.createElement('div');
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
                    alert("Please fill out advice for your penguin friend.");
                } else {
                    console.log("Something has gone wrong.");
                    page45RemoveElements();
                    page45State ++;
                    page45StateManager();
                    document.getElementById('page45Container').scrollIntoView({ behavior: 'smooth'});
                }
            } else {
                page45RemoveElements();
                page45State ++;
                page45StateManager();
                document.getElementById('page45Container').scrollIntoView({ behavior: 'smooth'});
            }
        } else {
            console.log("Go to the final page. PLEASE!")
            const to = document.getElementById('page5Container');
            const from = document.getElementById('page45Container');
            changePage(from, to, "forward");
            //to.scrollIntoView({ behavior: 'smooth'});
            page5CreateFeelingElements();
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
            page45State --;
            page45StateManager();
            page45Container.scrollIntoView({ behavior: 'smooth'});
        } else {
            console.log("Go back to alternative patterns")
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

    const penguinPicture = document.createElement('img');
    if (image === "sad") {
        penguinPicture.src = "./resources/graphics/sadPenguin.png"; 
    } else if (image === "happy") {
        penguinPicture.src = "./resources/graphics/happyPenguin.png"; 
    } else {
        console.log("You have typed in the wrong type of Penguin character to generate.")
    }
    penguinPicture.alt = "Penguin Character";
    bottomRowContainer.append(penguinPicture);
}

function page45RemoveElements() {
    for (let i = 0; i < 6; i++) {
        try {
            document.getElementById(`page45-bottomRow-${i}`).remove();
            document.getElementById(`page45-topRow-${i}`).remove();
        } catch {
            console.log(`Nothing to remove for ${i}.`)
        }
    }
}

// Page 5

function page5CreateFeelingElements() {

    // delete any previous elements
    try {
        document.getElementById('page5-insert-container').remove();
        console.log("Deleted the previous old feeling element.")
    } catch {
        console.log("Page 5 insert feelings element did not exist to delete.")
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
        sliderContainerNewSlider.value = pageContent["page5"]["feelings-slider-value-initial"][key] * 10;
        sliderContainerNewSlider.id = `page5-new-slider-${key}`;
        sliderContainerNew.append(sliderContainerNewSlider);
        const sliderContainerNewValueText = document.createElement('p');
        sliderContainerNewValueText.classList.add('slider-value');
        sliderContainerNewValueText.classList.add('positive');
        sliderContainerNewValueText.innerHTML = pageContent["page5"]["feelings-slider-value-initial"][key];
        sliderContainerNewValueText.id = `page5-new-value-${key}`;
        sliderContainerNew.append(sliderContainerNewValueText);

        // hidden box
        const sliderContainerNewValueCongrats = document.createElement('h5');
        sliderContainerNewValueCongrats.style.display = "none"; // hide initially
        sliderContainerNew.append(sliderContainerNewValueCongrats);
    
        // add a listener here to update the new value in pageContent and innerHTML
        let hasTheNewSliderValueChanged = false;        
        sliderContainerNewSlider.addEventListener('change', function (event) {
            sliderContainerNewValueText.innerHTML = Math.floor(sliderContainerNewSlider.value / 10);
            pageContent["page5"]["feelings-slider-value-new"][key] = sliderContainerNewValueText.innerHTML;
            hasTheNewSliderValueChanged = true;

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

        })
    }

    // create the new positive feeling dropdown listeners
    const newPositiveFeelingsDropdown = document.getElementById('page5-new-positive-feelings-dropdown');
    const newPositiveFeelingSlider = document.getElementById('page5-new-positive-feelings-slider');
    const newPositiveFeelingSliderValue = document.getElementById('page5-new-positive-feelings-slider-value');

    // hidden text box listeners
    const hiddenContainerPage5 = document.getElementById('page5-hidden-textbox-container');
    const hiddenTextboxPage5 = document.getElementById('page5-hidden-textbox');

    hiddenTextboxPage5.addEventListener('change', (e) => {
        pageContent["page5"]["new-feeling"] = hiddenTextboxPage5.value;
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
    })
    
    // new positive emotion slider listener
    let hasTheNewPositiveSliderValueChanged = false;
    const newPositiveFeelingSuccessMessage = document.getElementById('page5-new-positive-feeling-success');
    newPositiveFeelingSlider.addEventListener('change', function (event) {
        hasTheNewPositiveSliderValueChanged = true;
        newPositiveFeelingSliderValue.innerHTML = Math.floor(newPositiveFeelingSlider.value / 10);
        console.log("The new value for the positive emotion slider should be...")
        console.log(`${Math.floor(newPositiveFeelingSlider.value / 10)}`);
        pageContent["page5"]["new-feeling-value"] = newPositiveFeelingSliderValue.innerHTML;
        if (hasTheNewPositiveSliderValueChanged) {
            newPositiveFeelingSuccessMessage.style.display = "block";
        } else {
            newPositiveFeelingSuccessMessage.style.display = "none";
        }
    })


}
