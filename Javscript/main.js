window.onload = init;

let page2OtherCheckboxIncrement = 5;
let page2EmotionIncrement = 1;
let page3UnhelpfulThoughtIncrement = 1;
let page3UnhelpfulBehaviourIncrement = 1;


let pageContent = {
    "page1": {},
    "page2": {
        // track the index of checkboxes and see how many still remain
        "multipleCheckboxes": [page2OtherCheckboxIncrement],
        "feelings": {},
    },
    "page3": {
        "unhelpfulThoughtDropdown": {},
        "unhelpfulThoughtContent": {},
        "unhelpfulBehaviourDropdown": {},
        "unhelpfulBehaviourContent": {},
    },
    "page4": {},
    "page5": {},
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
    // need to remove the sliders here and add listeners in the function
    const page2Slider = document.getElementById('Page2EmotionalSlider');
    const page2SliderValueDisplay = document.getElementById('page2SliderValueDisplay');
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

    // Applying Listeners

    // Page 1
    page1NextButton.addEventListener("click", () => {
        if (page1Complete) {
            changePage(page1Container, page2Container, "forward");
        } else {
            alert("fill out the text box");
            // insert message that needs to be filled out for textbox
        }
    })

    page1TextBox.addEventListener('input', function (event) {
        if (event.target.value.length > 0) {
            page1Complete = true;
            pageContent["page1"].whatHappenedTextbox = event.target.value;
            // insert positive reinforcement icon 
        } else {
            page1Complete = false;   
            // insert message that needs to be filled out
        }
    })

    // Page 2

    page2FeelingsAddButton.addEventListener("click", () => {
        page2CreateEmotion();
    })

    page2Slider.addEventListener('change', function (event) {
        page2SliderValueDisplay.innerHTML = Math.floor(page2Slider.value / 10);
    })

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

        //page3Complete = verifyPage3();
        if (page3Complete) {
            changePage(page3Container, page4Container, "forward");
        } else {
            alert("I haven't created a page 4 yet!")
        }
    })


}

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
        
        from.listener = () => from.style.display = "none";
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
        
        from.listener = () => from.style.display = "none";
        from.addEventListener("animationend", from.listener);
    } 
    else {
        console.log("You have input an incorrect direction at changePage().")
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

// Making now - work on the data storage
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

    pageContent["page2"]["feelings"][page2EmotionIncrement] = dropdownList.value;

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
    sliderNumberValue.classList.add("slider-value");
    sliderNumberValue.id = `page2SliderValueDisplay-${page2EmotionIncrement}`;
    sliderContainer.append(sliderNumberValue);

    // listener to update the number value
    slider.addEventListener('change', function (event) {
        sliderNumberValue.innerHTML = Math.floor(slider.value / 10);
    })

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
        pageContent["page2"]["feelings"][page2EmotionIncrement] = hiddenTextbox.value;
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdownList.addEventListener('change', (e) => {
        pageContent["page2"]["feelings"][page2EmotionIncrement] = e.target.value;
        delete pageContent["page2"]["feelings"][page2EmotionIncrement]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page2"]["feelings"][page2EmotionIncrement] = hiddenTextbox.value;
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page2"]["feelings"][page2EmotionIncrement] = e.target.value;
        }
    })

    // add listener to delete
    closeButton.addEventListener('click', (e) => {
        delete pageContent["page2"]["feelings"][page2EmotionIncrement];
        container.remove();
    })

    // page divider
    const pageDivider = document.createElement("hr");
    pageDivider.classList.add("page-divider");
    container.append(pageDivider);

    // increment increase for unique id's
    page2EmotionIncrement ++;
}

// Completed - helper function
function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

// Making now
function verifyPage2() {
    
    let verified = true;
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
    if (verified) return true
    else return false;
}

// Completed
function page3CreateUnhelpfulThought() {
    const parentElement = document.getElementById('page3-insert-thoughts');

    const container = document.createElement('div');
    container.id = `page3-unhelpful-thoughts-container-${page3UnhelpfulThoughtIncrement}`;
    container.classList.add("page3-unhelpful-thoughts-container");

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

    pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement] = dropdown.value;

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
        pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement] = hiddenTextbox.value;
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdown.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement] = e.target.value;
        delete pageContent["page3"]["unhelpfulThoughtDropdown"]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement] = hiddenTextbox.value;
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement] = e.target.value;
        }
    })

    // textbox
    const textbox = document.createElement('textarea');
    textbox.classList.add("page3-text-input");
    textbox.id = `page3-thought-text-${page3UnhelpfulThoughtIncrement}`;
    textbox.placeholder = "Write down your thinking..."
    
    textbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulThoughtContent"][page3UnhelpfulThoughtIncrement] = e.target.value;
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
        delete pageContent["page3"]["unhelpfulThoughtContent"][page3UnhelpfulThoughtIncrement];
        delete pageContent["page3"]["unhelpfulThoughtDropdown"][page3UnhelpfulThoughtIncrement];
        container.remove();
        divider.remove();
    })

    // increment increase for unique id's
    page3UnhelpfulThoughtIncrement ++;
}

// Compelted
function page3CreateUnhelpfulBehaviour() {
    const parentElement = document.getElementById('page3-insert-behaviour');

    const container = document.createElement('div');
    container.id = `page3-unhelpful-behaviour-container-${page3UnhelpfulBehaviourIncrement}`;
    container.classList.add("page3-unhelpful-thoughts-container");

    // dropdown box
    const dropdown = document.createElement('select');
    dropdown.id = `page3-behaviour-dropdown-${page3UnhelpfulBehaviourIncrement}`;
    dropdown.classList.add("page3-thought-dropdown");
    container.append(dropdown);

    // insert the options
    const optionValues = [
        "Compulsive",
        "Avoidance",
        "Other"
    ];

    const optionInnerHTML = [
        "🔒 Compulsive",
        "🚧 Avoidance",
        "➕ Other"
    ];

    for (let i = 0; i < optionValues.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = optionValues[i];
        optionElement.innerHTML = optionInnerHTML[i];
        dropdown.append(optionElement);
    }

    pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement] = dropdown.value;

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
        pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement] = hiddenTextbox.value;
    })

    // allow other to show a textbox, if change to different value, then delete the textbox
    dropdown.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement] = e.target.value;
        delete pageContent["page3"]["unhelpfulBehaviourDropdown"]["1"];

        if (e.target.value === "Other") {
            hiddenTextbox.style.display = "block";
            hiddenLabel.style.display = "block";
            pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement] = hiddenTextbox.value;
        }

        if (e.target.value !== "Other") {
            hiddenTextbox.style.display = "none";
            hiddenLabel.style.display = "none";
            pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement] = e.target.value;
        }
    })

    // textbox
    const textbox = document.createElement('textarea');
    textbox.classList.add("page3-text-input");
    textbox.id = `page3-behaviour-text-${page3UnhelpfulBehaviourIncrement}`;
    textbox.placeholder = "Write down your behaviour..."
    
    textbox.addEventListener('change', (e) => {
        pageContent["page3"]["unhelpfulBehaviourContent"][page3UnhelpfulBehaviourIncrement] = e.target.value;
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
        delete pageContent["page3"]["unhelpfulBehaviourContent"][page3UnhelpfulBehaviourIncrement];
        delete pageContent["page3"]["unhelpfulBehaviourDropdown"][page3UnhelpfulBehaviourIncrement];
        container.remove();
        divider.remove();
    })

    // increment increase for unique id's
    page3UnhelpfulBehaviourIncrement ++;
}