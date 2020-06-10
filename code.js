console.log(this);
console.log(figma.root.children);
// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "create-rectangles") {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // This plugin counts the number of layers, ignoring instance sublayers,
    // in the document
    let count = 0;
    let colorList = [];
    // check color
    // check one rgb object against another
    const verifyColor = (colorA, colorB) => colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b;
    // check color list
    // const checkColorList = colorObject
    //
    const getColors = (node) => node.fills.map((fill) => fill.type === "SOLID" &&
        fill.visible === true &&
        fill.opacity === 1 &&
        fill.color);
    function traverse(node) {
        console.log("inside traverse");
        count++;
        // 1. build the color list
        // walk the tree
        // if you find a layer,
        // of type rect
        // is this a rect?
        if (node.type === "RECTANGLE") {
            console.log("its a recatangle!!!");
            // check the color
            console.log("chekcing the color", node);
            const nodeColors = getColors(node);
            // is the color in the list?
            nodeColors.forEach((nodeColor) => {
                console.log(`insideNodecolors: r:${nodeColor.r} g:${nodeColor.g} b:${nodeColor.b}`);
                if (!colorList.length) {
                    console.log("there are no colors to test");
                    // add the color
                    colorList.push(nodeColor);
                    return;
                }
                // if there are colors in the colors list
                if (colorList.length) {
                    // colorReducer
                    const colorExistsInList = (x) => verifyColor(x, nodeColor);
                    // check each color in the color list
                    const foo = colorList.some(colorExistsInList);
                    console.log("does the colorExistsInList", foo);
                    if (!foo) {
                        colorList.push(nodeColor);
                        return;
                    }
                }
            });
            // add the color to the list
            // else, keep walking
        }
        // check the color
        console.log("add it up");
        if ("children" in node) {
            console.log("children in node");
            console.log("id", node.id);
            if (node.type !== "INSTANCE") {
                console.log("is not instnace");
                for (const child of node.children) {
                    console.log("run recursively");
                    traverse(child);
                }
            }
        }
    }
    traverse(figma.root); // start the traversal at the root
    alert(count);
    console.log("colorList", colorList);
    // 2. build the visul
    // when you are done
    // alert the list
    // build
    console.log("after, colorList before getColors block");
    if (msg.type === "getColors") {
        console.log("inside the getColors block");
        const nodes = [];
        // for (let i = 0; i < msg.count; i++) {
        //   const rect = figma.createRectangle();
        //   rect.x = i * 150;
        //   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
        //   figma.currentPage.appendChild(rect);
        //   nodes.push(rect);
        // }
        colorList.forEach((color, i) => {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: "SOLID", color: color }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        });
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    console.log("closing");
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
