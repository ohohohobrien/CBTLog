window.onload = init;

function init() {
    
    applyPageListeners();

}

function applyPageListeners() {

    const page1Container = document.getElementById('page1Container');
    const page1NextButton = document.getElementById('page1NextButton');
    const page1TextBox = document.getElementById('page1Textbox');
    let page1TextBoxContents = "";
    // todo: implement a way to check if contents already exist in the textbox
    let page1Complete = false;
    const page2Container = document.getElementById('page2Container');
    const page2NextButton = document.getElementById('page2NextButton');
    let page2Complete = false;
    
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
