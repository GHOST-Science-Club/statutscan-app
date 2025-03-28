const body = document.getElementById('body');
const submitBtn = document.getElementById('send-btn');
const input = document.getElementById('input');
const postContainer = document.getSelection('.post-container');


function addElement(jsonData, output, textResponse, sourcesResponse) {
    if ("chunk" in jsonData) {
        output += jsonData["chunk"];
        textResponse.innerHTML = marked.parse(output);
    }
    else if ("sources" in jsonData) {
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
            sourcesResponse.appendChild(sourceItem);
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


document.addEventListener("DOMContentLoaded", () => {    
    document.querySelectorAll(".text-response").forEach(div => {
        div.innerHTML = marked.parse(div.innerHTML);
    });
});


submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const pathname = window.location.pathname;
    const match = pathname.match(/^\/chat\/([^\/]+)\/?$/);
    let chatId = match ? match[1] : null;
    const question = input.value.trim();
    input.value = "";

    // add question to body
    let userMessage = document.createElement("div");
    let userQuestion = document.createElement("div");
    userMessage.className = "user-message";
    userQuestion.className = "user-question";
    userQuestion.innerHTML = question;
    userMessage.appendChild(userQuestion);
    body.appendChild(userMessage);

    // get answer
    const response = await fetch("/answer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question: question,
            chat_id: chatId
        })
    });

    let output = "";

    // add answer to body
    const reader = response.body.getReader();
    let assistantMessage = document.createElement("div");
    let textResponse = document.createElement("div");
    let sourcesResponse = document.createElement("div");
    assistantMessage.className = "assistant-message"
    textResponse.className = "text-response";
    sourcesResponse.className = "sources-response";
    assistantMessage.appendChild(textResponse);
    assistantMessage.appendChild(sourcesResponse);
    body.appendChild(assistantMessage);

    while (true) {
        const { done, value } = await reader.read();
        const chunk = new TextDecoder('utf-8', { fatal: true }).decode(value).replace(/^\uFEFF/, '');

        if (detectAdjacentDictionaries(chunk)) {
            const chunks = splitJsonStrings(chunk);
            chunks.forEach((obj) => {
                const jsonData = JSON.parse(obj);
                output = addElement(jsonData, output, textResponse, sourcesResponse);
            })
        }
        else {
            const jsonData = JSON.parse(chunk);
            output = addElement(jsonData, output, textResponse, sourcesResponse);
        }

        if (done) break;
    }
});


input.addEventListener('input', function () {
    this.style.height = 'auto';
    let post_height = this.scrollHeight;
    post_height = Math.min(post_height, 200);
    this.style.height = post_height + 'px';
    postContainer.style.height = post_height + 'px';
});
