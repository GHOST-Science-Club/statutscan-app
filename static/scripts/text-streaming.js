const body = document.getElementById('body');
const submit_btn = document.getElementById('send-btn');
const input = document.getElementById('input');

function addElement(jsonData, output, textDiv, sourcesDiv) {
    if ("chunk" in jsonData) {
        output += jsonData["chunk"];
        textDiv.innerHTML = marked.parse(output);
    }
    else if ("sources" in jsonData) {
        console.log("sources works");

        const sources = jsonData["sources"];
        for (let src of sources) {
            const sourceItem = document.createElement("div");
            sourceItem.classList = "sources-item";
            const sourceLink = document.createElement("a");
            const sourceLinkTextContainer = document.createElement("div");

            let imgLink = document.createElement("img");
            imgLink.src = "/static/images/icons/link-light.svg";
            imgLink.alt = "LinkImg"
            sourceLinkTextContainer.appendChild(imgLink);

            if ("title" in src) {
                let textNode = document.createTextNode(src["title"]);
                sourceLinkTextContainer.appendChild(textNode);
            }
            else {
                let textNode = document.createTextNode(src["source"]);
                sourceLinkTextContainer.appendChild(textNode);
            }
            sourceLink.href = src["source"];
            sourceLink.target = "_blank";

            sourceLink.appendChild(sourceLinkTextContainer);
            sourceItem.appendChild(sourceLink)
            sourcesDiv.appendChild(sourceItem);
        }
    }

    return output;
}


function splitJsonStrings(input) {
    const result = [];
    let bracketCount = 0;
    let tempStr = '';

    for (let char of input) {
        tempStr += char;
        if (char === '{') {
            bracketCount++;
        } else if (char === '}') {
            bracketCount--;
        }
        
        if (bracketCount === 0 && tempStr.trim()) {
            result.push(tempStr.trim());
            tempStr = '';
        }
    }
    
    return result;
}


function detectAdjacentDictionaries(str) {
    const regex = /{.*?}/g;
    const matches = [...str.matchAll(regex)];
  
    for (let i = 0; i < matches.length - 1; i++) {
        const firstMatch = matches[i];
        const secondMatch = matches[i + 1];
        const endOfFirst = firstMatch.index + firstMatch[0].length;
        const startOfSecond = secondMatch.index;
    
        if (endOfFirst === startOfSecond) {
            return true;
        }
    }

    return false;
}


submit_btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const response = await fetch("/answer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.value })
    });

    input.value = "";
    let output = "";

    const reader = response.body.getReader();
    let textDiv = document.createElement("div");
    textDiv.className = "text-response";
    body.appendChild(textDiv);

    let sourcesDiv = document.createElement("div");
    sourcesDiv.className = "sources-response";
    body.appendChild(sourcesDiv);

    while (true) {
        const { done, value } = await reader.read();
        const chunk = new TextDecoder('utf-8', { fatal: true }).decode(value).replace(/^\uFEFF/, '');

        console.log(chunk);

        if (detectAdjacentDictionaries(chunk)) {
            const chunks = splitJsonStrings(chunk);
            chunks.forEach((obj) => {
                const jsonData = JSON.parse(obj);
                output = addElement(jsonData, output, textDiv, sourcesDiv);
            })
        }
        else {
            const jsonData = JSON.parse(chunk);
            output = addElement(jsonData, output, textDiv, sourcesDiv);
        }

        if (done) break;
    }
});
