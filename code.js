console.log(this);
console.log(figma.root.children);
// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 600, height: 400 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // array of colors
    let colorList = [];
    // check color
    // check one rgb object against another
    const verifyColor = (colorA, colorB) => colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b;
    // Get Colors from a node object
    const getColors = (node) => node.fills.map((fill) => fill.type === "SOLID" &&
        fill.visible === true &&
        fill.opacity === 1 &&
        fill.color);
    function traverse(node) {
        // 1. build the color list
        // walk the tree
        // if you find a layer,
        // of type rect
        // is this a rect?
        if (node.type === "RECTANGLE") {
            // check the color
            const nodeColors = getColors(node);
            // is the color in the list?
            nodeColors.forEach((nodeColor) => {
                // there are no colors yet,
                if (!colorList.length) {
                    console.warn("there are no colors to test");
                    // add the color
                    colorList.push(nodeColor);
                    return;
                }
                // if there are colors in the colors list
                if (colorList.length) {
                    // colorReducer
                    const colorExistsInList = (x) => verifyColor(x, nodeColor);
                    // check each color in the color list
                    const colorListHasThisColor = colorList.some(colorExistsInList);
                    // if the color is new
                    if (!colorListHasThisColor) {
                        // add it to the list
                        colorList.push(nodeColor);
                        return;
                    }
                }
            });
            // add the color to the list
            // else, keep walking
        }
        // Child + Recursive
        if ("children" in node) {
            if (node.type !== "INSTANCE") {
                for (const child of node.children) {
                    traverse(child);
                }
            }
        }
    }
    if (msg.type === "getColors") {
        const nodes = [];
        // Crawls the tree
        traverse(figma.root); // start the traversal at the root
        console.log("colorList", colorList);
        // 2. build the visul
        // when you are done
        // alert the list
        // build
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
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
