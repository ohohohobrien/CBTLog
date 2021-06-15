window.onload = init;

let page2OtherCheckboxIncrement = 5;

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
    const page2Container = document.getElementById('page2Container');
    
    // Page 2 Content
    const page2Slider = document.getElementById('Page2EmotionalSlider');
    const page2SliderValueDisplay = document.getElementById('page2SliderValueDisplay');
    const page2OtherCheckbox = document.getElementById('page2CheckboxOption5');
    const page2CheckboxGrid = document.getElementById('page2CheckboxGrid');
    let page2OtherCheckboxExtra = [];
    let page2Complete = false;
    const page2BackButton = document.getElementById('page2BackButton');
    const page2NextButton = document.getElementById('page2NextButton');

    // Applying Listeners

    // Page 1
    page1NextButton.addEventListener("click", () => {
        if (page1Complete) {
            changePage(page1Container, page2Container);
        } else {
            alert("fill out the text box");
            // insert message that needs to be filled out for textbox
        }
    })

    page1TextBox.addEventListener('input', function (event) {
        if (event.target.value.length > 0) {
            page1Complete = true;
            // insert positive reinforcement icon 
        } else {
            page1Complete = false;   
            // insert message that needs to be filled out
        }
    })

    // Page 2

    page2Slider.addEventListener('change', function (event) {
        page2SliderValueDisplay.innerHTML = Math.floor(page2Slider.value / 10);
    })

    page2OtherCheckbox.addEventListener('change', function (event) {        
        page2CreateNewCheckbox(page2CheckboxGrid);
    })

    page2BackButton.addEventListener("click", () => {
        changePage(page2Container, page1Container);
    })

}

function changePage(from, to) {
    to.style.display = "block";
    
    from.classList.remove("slideIn");
    from.classList.add("slideOut");
    to.classList.remove("slideOut");
    to.classList.add("slideIn");

    from.addEventListener("animationend", () => {
        from.style.display = "none";
    })
}

function page2CreateNewCheckbox(page2CheckboxGrid) {

    // Create a textbox for the user to input information
    const newTextbox = document.createElement("input");
    newTextbox.type = "text";
    newTextbox.id = `page2TextboxOption${page2OtherCheckboxIncrement}`;

    // Create a new other textbox
    const newDiv = document.createElement("div");
    newDiv.classList.toggle("checkbox-option");

    const newOtherCheckbox = document.createElement("input");
    page2OtherCheckboxIncrement ++;
    newOtherCheckbox.type = "checkbox";
    newOtherCheckbox.id = `page2CheckboxOption${page2OtherCheckboxIncrement}`;
    newOtherCheckbox.name = `page2CheckboxOption${page2OtherCheckboxIncrement}`;
    newOtherCheckbox.value = "Other";

    const newLabel = document.createElement("label");
    newLabel.innerHTML = "Other";
    newLabel.for = newOtherCheckbox.id;

    newOtherCheckbox.addEventListener('change', function (event) {
        page2CreateNewCheckbox(page2CheckboxGrid);
    })

    // Append the new elements to the div
    newDiv.append(newOtherCheckbox);
    newDiv.append(newLabel);

    page2CheckboxGrid.append(newTextbox);
    page2CheckboxGrid.append(newDiv);

}
