// An object that stores information about the current state of the vim editor 
let vim = {
    "mode": "normal",
    "num": "",
    "currentSequence": ""
};

// An object containing the master list of all key mappings
const KEY_MAPPINGS = {
    // Movement commands
    "j": {
        "modeActive": ["normal", "visual"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowDown", false, false]]
    },
    "k": {
        "modeActive": ["normal", "visual"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowUp", false, false]]
    },
    "h": {
        "modeActive": ["normal", "visual"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowLeft", false, false]]
    },
    "l": {
        "modeActive": ["normal", "visual"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowRight", false, false]]
    },
    "ArrowDown": {
        "modeActive": ["normal", "visual", "insert"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowDown", false, false]]
    },
    "ArrowUp": {
        "modeActive": ["normal", "visual", "insert"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowUp", false, false]]
    },
    "ArrowLeft": {
        "modeActive": ["normal", "visual", "insert"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowLeft", false, false]]
    },
    "ArrowRight": {
        "modeActive": ["normal", "visual", "insert"],
        "modeAfter": ["normal", true],
        "keys": [["ArrowRight", false, false]]
    },

    "Escape": {
        "modeActive": ["insert", "visual"],
        "modeAfter": ["normal", true],
        "keys": [[]]
    },

    // Mode changing commands
    "i": {
        "modeActive": ["insert", "visual"],
        "modeAfter": ["insert", true],
        // To clear selection
        "keys": [["ArrowRight", false, false], ["ArrowLeft", false, false]]
    }
};

// https://stackoverflow.com/questions/951021
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

vim.switchToNormalMode = function (resetSequence = false) {
    vim.currentSequence = resetSequence ? "" : vim.currentSequence;
    vim.mode = "normal";
    vim.num = "";
    updateCursor();
};

vim.switchToVisualMode = function (resetSequence = false) {
    vim.currentSequence = resetSequence ? "" : vim.currentSequence;
    vim.mode = "visual";
    vim.num = "";
    updateCursor();
};

vim.switchToInsertMode = function (resetSequence = false) {
    vim.currentSequence = resetSequence ? "" : vim.currentSequence;
    vim.mode = "insert";
    vim.num = "";
    docs.setCursorWidth("2px");
};

// A function that updates the cursor size based on the selection size of the element to the right of the cursor
async function updateCursor() {
    if (vim.mode !== "insert") {
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
}

function objToString (obj) {
    return Object.entries(obj).reduce((str, [p, val]) => {
        return `${str}${p}::${val}\n`;
    }, '');
}

// A function that, given a list of key presses, executes them
function executeKeyPresses(keys, holdShift=false) {
    for (keyPress of keys) {
        if (keys.length === 0) {
            break;
        }
        // console.log(keyPress)
        docs.pressKey(docs.codeFromKey(keyPress[0]), keyPress[1], keyPress[2] || holdShift)
    }
}

// A function that, given a mode as as string, changes the mode
function switchMode(mode, resetKeys = true) {
    switch (mode) {
        case "normal":
            vim.switchToNormalMode(resetKeys);
            break;
        case "insert":
            vim.switchToInsertMode(resetKeys);
            break;
        case "visual":
            vim.switchToVisualMode(resetKeys);
            break;
    }
}

function checkIfKeyValid(key) {
    if (key in KEY_MAPPINGS) {
        console.log("Key intercepted: " + key + ". Mode: " + vim.mode);
        if (KEY_MAPPINGS[key].modeActive.some(m => m === vim.mode)) {
            // dispatchKeyPress(e, key);
            return true;
        }
    }
}

function handleNormalPress(e, key) {
    e.preventDefault();
    e.stopPropagation();

    if (checkIfKeyValid(key)) {
        executeKeyPresses(KEY_MAPPINGS[key].keys);
        switchMode(...KEY_MAPPINGS[key].modeAfter);
    }
}

function handleInsertPress(e, key) {
    if (checkIfKeyValid(key)) {
        e.preventDefault();
        e.stopPropagation();

        executeKeyPresses(KEY_MAPPINGS[key].keys);
        switchMode(...KEY_MAPPINGS[key].modeAfter);
    }
}

function handleVisualPress(e, key) {
    if (checkIfKeyValid(key)) {
        e.preventDefault();
        e.stopPropagation();

        executeKeyPresses(KEY_MAPPINGS[key].keys, holdShift = true);
        switchMode(...KEY_MAPPINGS[key].modeAfter);
    }
}

function dispatchKeyPress(e, key) {
    switch (vim.mode) {
        case "normal":
            handleNormalPress(e, key);
            break;
        case "visual":
            handleVisualPress(e, key);
            break;
        case "insert":
            handleInsertPress(e, key);
            break;
    }
}

docs.keydown = async function (e) {
    // console.log("Key down event detected: " + objToString(e))
    let key = e.shiftKey && e.key.length === 1 ? e.key.toUpperCase() : e.key
    if (key.length > 1) {
        if (e.shiftKey) {
            key += " + Shift";
        }
        if (e.ctrlKey) {
            key += " + Ctrl";
        }
        if (e.altKey) {
            key += " + Alt";
        }
    }
    console.log("Key detected: " + key);
    dispatchKeyPress(e, key);

    return true;
};

// console.log("Press alt + r to begin the test.");
