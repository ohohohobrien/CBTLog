window.onload = init;


function init() {
    checkAccessibility();
    randomizeFace();
    setButtonListener();

    //sessionStorage.setItem("accessibilityMode", false);
    
    // calm mode
    document.getElementById('calmButton').addEventListener('click', () => {
        const allElements = document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A" || node.nodeName !== "H1") {
                node.style.color = '#fff1f1';
            }
        });
        document.getElementById('accessibilityText').style.color = '#0D0D0D';
        document.getElementById('heroHeader').style.color = '#144400';
        sessionStorage.setItem("accessibilityMode", false);
    })

    // accessibility mode
    document.getElementById('accessibilityButton').addEventListener('click', () => {
        const allElements = document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A" || node.nodeName !== "H1") {
                node.style.color = '#0D0D0D';
            }
        });
        document.getElementById('calmText').style.color = '#fff1f1';
        document.getElementById('heroHeader').style.color = '#144400';
        sessionStorage.setItem("accessibilityMode", true);
    })

    document.getElementById('accessibilityText').style.color = '#0D0D0D';
    document.getElementById('calmText').style.color = '#fff1f1';
    document.getElementById('heroHeader').style.color = '#144400';

}

// changes the font color to black or white
function checkAccessibility() {

    let accessibilityMode = sessionStorage.getItem("accessibilityMode");

    if (accessibilityMode === "true") {
        // accessibility mode
        document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A" || node.nodeName !== "H1") {
                node.style.color = '#0D0D0D';
            }
        });
    }
}

function randomizeFace() {
    const faceImage = document.getElementById('indexFace');
    let randomNumber = Math.floor(Math.random() * 59);
    console.log(randomNumber);

    if (randomNumber === 60) randomNumber = 59;
    if (randomNumber === 0) randomNumber = 1; 

    if (randomNumber < 10) {
        randomNumber = `0${randomNumber}`;
    }

    faceImage.src = `./resources/SvgFaces/Artboards_Diversity_Avatars_by_Netguru-${randomNumber}.svg`;
}

function setButtonListener() {
    applyListener(document.getElementById('startButton1'));
    applyListener(document.getElementById('startButton2'));
}

function applyListener(buttonElement) {
    buttonElement.addEventListener('click', () => {
        const indexContainer = document.getElementById('index-container');
        indexContainer.classList.add('slideOutLeft');

        indexContainer.addEventListener('animationend', () => {
            indexContainer.style.display = "none";
            indexContainer.classList.add('hidden');
            window.open("https://ohohohobrien.github.io/CBTLog/cbtlog.html", "_self");
        })

    })
}