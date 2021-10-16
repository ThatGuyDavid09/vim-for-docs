let vim = {
    "mode": "insert",
    "num": "",
    "currentSequence": ""
};

const KEY_MAPPINGS = {
    "j": [["ArrowDown", false, false]],
    "k": [["ArrowUp", false, false]],
    "h": [["ArrowLeft", false, false]],
    "l": [["ArrowRight", false, false]],
    "ArrowDown": [["ArrowDown", false, false]],
    "ArrowUp": [["ArrowUp", false, false]],
    "ArrowLeft": [["ArrowLeft", false, false]],
    "ArrowRight": [["ArrowRight", false, false]]
};

// https://stackoverflow.com/questions/951021
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

vim.switchToNormalMode = function () {
    vim.currentSequence = "";
    vim.mode = "normal";
    vim.num = "";
    docs.setCursorWidth("7px");
};

vim.switchToVisualMode = function () {
    vim.currentSequence = "";
    vim.mode = "visual";
    vim.num = "";
    docs.setCursorWidth("7px");
};

vim.switchToInsertMode = function () {
    vim.currentSequence = "";
    vim.mode = "insert";
    vim.num = "";
    docs.setCursorWidth("2px");


};

vim.switchToNormalMode = function () {
    vim.currentSequence = "";
    vim.mode = "normal";
    vim.num = "";
    updateCursor()
};

vim.switchToVisualMode = function () {
    vim.currentSequence = "";
    vim.mode = "visual";
    vim.num = "";
    updateCursor()
};

vim.switchToInsertMode = function () {
    vim.currentSequence = "";
    vim.mode = "replace";
    vim.num = "";
    updateCursor();
};

async function updateCursor() {
    docs.pressKey(docs.codeFromKey("ArrowRight"), false, true);
    // await sleep(10);
    let selectionElement = docs.getSelectionEl();
    let cursorWidth = selectionElement.width();
    // console.log(cursorWidth);
    docs.setCursorWidth(cursorWidth.toString());
    docs.getUserCursor().find(".kix-cursor-caret").css("opacity", 0.5);

    await sleep(10);
    docs.pressKey(docs.codeFromKey("ArrowLeft"), false, false);
}

docs.keydown = async function (e) {
    if (e.key in KEY_MAPPINGS) {
        console.log("Key intercepted:" + e.key);
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
