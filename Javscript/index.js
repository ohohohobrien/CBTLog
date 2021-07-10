window.onload = init;


function init() {
    checkAccessibility();
    randomizeFace();

    //sessionStorage.setItem("accessibilityMode", false);
    
    // calm mode
    document.getElementById('calmButton').addEventListener('click', () => {
        const allElements = document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A") {
                node.style.color = '#fff1f1';
            }
        });
        document.getElementById('accessibilityText').style.color = '#0D0D0D';
        sessionStorage.setItem("accessibilityMode", false);
    })

    // accessibility mode
    document.getElementById('accessibilityButton').addEventListener('click', () => {
        const allElements = document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A") {
                node.style.color = '#0D0D0D';
            }
        });
        document.getElementById('calmText').style.color = '#fff1f1';
        sessionStorage.setItem("accessibilityMode", true);
    })

    document.getElementById('accessibilityText').style.color = '#0D0D0D';
    document.getElementById('calmText').style.color = '#fff1f1';

}

// changes the font color to black or white
function checkAccessibility() {

    let accessibilityMode = sessionStorage.getItem("accessibilityMode");

    if (accessibilityMode === "true") {
        // accessibility mode
        document.body.querySelectorAll('*').forEach(function(node) {
            if (node.nodeName !== "A") {
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

    faceImage.src = `./resources/SvgFaces/Artboards_Diversity_Avatars_by_Netguru-${randomNumber}.svg`;
}