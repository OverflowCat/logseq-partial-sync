const ENDPOINT = "https://xxxxxxxxxxxxxxxxx.kv.vercel-storage.com/"

const BEARER = "Bearer XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"


class VercelKV {
    // constructor
    constructor(endpoint, bearer) {
        this.endpoint = new URL(endpoint);
        this.bearer = BEARER;
        this.headers = {
            Authorization: this.bearer
        };
    }

    // methods
    async get(key) {
        key = encodeURIComponent(key);
        const response = await fetch(`${this.endpoint}get/${key}`, {
            headers: this.headers
        });
        const data = await response.json();
        return data.result;
    }

    /**
     * Asynchronously sets a key-value pair on the server.
     *
     * @param {string} key - the key to set
     * @param {any} value - the value to set the key to
     *      If the value is an object, it will be stringified.
     * @return {Promise<any>} - a Promise that resolves to the response JSON object
     */
    async set(key, value) {
        key = encodeURIComponent(key);
        // if value is an object, stringify it
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        const response = await fetch(`${this.endpoint}set/${key}`, {
            method: "POST",
            headers: this.headers,
            body: value
        });
        const data = await response.json();
        return data;
    }
}

const kv = new VercelKV(ENDPOINT, BEARER);

async function upload(page) {
    // page can be undefined, in which case it will upload the current page
    if (page === undefined)
        page = logseq.api.get_current_page().name
    const blocksTree = logseq.api.get_page_blocks_tree(page)
    await kv.set(page, blocksTree)
}

async function download(page) {
    // page can be undefined, in which case it will download the current page
    if (page === undefined) {
        page = logseq.api.get_current_page().name
    }
    console.info(`Downloading ${page}`)
    const remoteBlocksTree = JSON.parse(await kv.get(page))
    console.log(remoteBlocksTree)
    clearPage(page)
    console.info(`Cleared ${page}`)
    appendBlocksTree(page, remoteBlocksTree)
}

function isSameBlock(block1, block2) {
    return block1.content === block2.content
}

function clearPage(page) {
    const blocksTree = logseq.api.get_page_blocks_tree(page)
    const uuids = getUuids(blocksTree)
    uuids.forEach(logseq.api.remove_block)
}

function getUuids(blocksTree) {
    if (!blocksTree) return []
    const uuids = []
    for (const block of blocksTree) {
        uuids.push(block.uuid)
        if (block.children) {
            uuids.push(...getUuids(block.children))
        }
    }
    return uuids
}

function appendBlocksTree(parent, blocksTree) {
    if (!blocksTree) return
    for (const block of blocksTree) {
        try {
            logseq.api.insert_block(parent, block.content, {
                customUUID: block.uuid
            })
        } catch (e) {
            console.log(e) // custom uuid already exists
            logseq.api.insert_block(parent, block.content)
        }
        appendBlocksTree(block.uuid, block.children)
    }
}

async function uploadCurrentPage() {
    // ask user to confirm
    const i18n = {
        zh: "你确认要用本地的文件覆盖远程的文件吗？",
        en: "Are you sure you want to overwrite the remote file with the local file?"
    }
    if (window.confirm(i18n["zh"])) {
        await upload()
        alert("上传成功")
    }
}

async function downloadCurrentPage() {
    // ask user to confirm
    const i18n = {
        zh: "你确认要用远程的文件覆盖本地的文件吗？",
        en: "Are you sure you want to overwrite the local file with the remote file?"
    }
    if (window.confirm(i18n["zh"])) {
        await download()
        alert(`下载成功`)
    }
}

function mountUI() {
    // Create the buttons
    const uploadButton = document.createElement("button");
    uploadButton.innerHTML = "&#8593; 上传"; // Up arrow
    uploadButton.style.fontSize = "18px";
    uploadButton.onclick = uploadCurrentPage;

    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = "&#8595; 下载"; // Down arrow
    downloadButton.style.fontSize = "18px";
    downloadButton.onclick = downloadCurrentPage;

    // Create the div to contain the buttons
    const divContainer = document.createElement("div");
    divContainer.appendChild(uploadButton);
    divContainer.appendChild(downloadButton);

    // Append the div after the first child of the existing div with ID "head"
    const targetDiv = document.querySelector("div#head").firstElementChild.firstElementChild;
    const firstChild = targetDiv.firstElementChild;
    targetDiv.insertBefore(divContainer, firstChild);
}

function main() {
    mountUI();
    console.info("Custom.js loaded")
}

console.log("Running custom.js")
setTimeout(main, 2000);
