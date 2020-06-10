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
    function traverse(node) {
        console.log("inside traverse");
        count++;
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
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
