window.onload = init;


function init() {
    checkAccessibility();

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