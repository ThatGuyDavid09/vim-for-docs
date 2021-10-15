const KEY_MAPPINGS = {
    "j": [["ArrowDown", false, false]],
    "k": [["ArrowUp", false, false]],
    "h": [["ArrowLeft", false, false]],
    "l": [["ArrowRight", false, false]]
};

// https://stackoverflow.com/questions/951021
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    console.log(metrics.width)
    return metrics.width;
}
  
function getCssStyle(element, prop) {
    console.log(window.getComputedStyle(element, null).getPropertyValue(prop))
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}
  
function getCanvasFontSize(el = document.body) {
const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
const fontSize = getCssStyle(el, 'font-size') || '16px';
const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

console.log(`${fontWeight} ${fontSize} ${fontFamily}`) 
return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getTextAndSetWidth() {
    docs.getSelection(function (selectionElement) {
        docs.getSelection(function (selectionText) {
            console.log(selectionText);
            let test_width = getTextWidth(selectionText, getCanvasFontSize(selectionElement));

            docs.setCursorWidth(test_width.toString() + "px");
            docs.getUserCursor().find(".kix-cursor-caret").css("opacity", 0.5);
        });
    }, false, true);

    // let test_width = getTextWidth(text, getCanvasFontSize(text_el));
    // console.log(test_width.toString() + "px")
    // docs.setCursorWidth(test_width.toString() + "px");
    // docs.getUserCursor().find(".kix-cursor-caret").css("opacity", 0.5);
}

async function updateCursor() {
    docs.pressKey(docs.codeFromKey("ArrowRight"), false, true);
    // await sleep(10);
    getTextAndSetWidth();
    await sleep(10);
    docs.pressKey(docs.codeFromKey("ArrowLeft"), false, false);
}

docs.keydown = async function (e) {
    console.log("Key down:" + e.key);
    
    // if (e.key == "s" && e.altKey) {
    //     docs.getSelection(function (selection) {
    //         alert("You had selected: \"" + selection + "\"");
    //     });
    // }
    if (e.key == "c" && e.altKey) {
        getTextAndSetWidth();
    }

    if (e.key in KEY_MAPPINGS) {
        e.preventDefault();
        e.stopPropagation();
        // console.log(KEY_MAPPINGS[e.key])
        for (keyPress of KEY_MAPPINGS[e.key]) {
            // console.log(keyPress)
            docs.pressKey(docs.codeFromKey(keyPress[0]), keyPress[1], keyPress[2])
            updateCursor();
        }
    }

    return true;
};

// console.log("Press alt + r to begin the test.");
