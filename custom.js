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
    const blocksTree = page ? logseq.api.get_page_blocks_tree(page) : logseq.api.get_current_page_blocks_tree()
    await kv.set(page, blocksTree)
}

async function download(page) {
    // page can be undefined, in which case it will download the current page
    if (page === undefined) {
        page = logseq.api.get_current_page().name
    }
    const remoteBlocksTree = await kv.get(page)
    const currentBlocksTree = logseq.api.get_page_blocks_tree(page)

    return applyDiff(page, currentBlocksTree, remoteBlocksTree)
}

function isSameBlock(block1, block2) {
    return block1.content === block2.content
}

function accumulateDiff(diff, block1, block2) {
    if (isSameBlock(block1, block2)) {
        diff.u++
    } else {
        diff.c++
    }
    return diff
}

function applyDiff(parent, later, older) {
    let count = { "c": 0, "d": 0, "u": 0 }
    let olderUuids = new Set(getUuids(older))
    let olderContents = new Map(getContents(older))
    for (const laterBlock of later) {
        if (olderUuids.delete(laterBlock.uuid)) {
            const olderBlock = olderContents.filter(([content, uuid]) => uuid === laterBlock.uuid)[0]
            olderContents.delete(olderBlock.content)
            if (laterBlock.content !== olderBlock.content) {
                logseq.api.update_block(laterBlock.uuid, laterBlock.content)
                count.u++
            }
            count = accumulateDiff(count,
                applyDiff(laterBlock.uuid, laterBlock.children, olderBlock.children))
        } else if (olderContents.delete(laterBlock.content)) {
            count = accumulateDiff(count,
                applyDiff(laterBlock.uuid, laterBlock.children, olderBlock.children))
        } else {
            logseq.api.insert_block(parent, laterBlock.content)
            count.c++
        }
    }
    for (const uuid of olderUuids) {
        logseq.api.remove_block(uuid)
        count.d++
    }
    return count
}

function getUuids(blocksTree) {
    if (!blocksTree) return []
    const uuids = []
    for (const block of blocksTree) {
        uuids.push(block.uuid)
        // uuids.push(...getUuids(block.children))
    }
    return uuids
}

function getContents(blocksTree) {
    if (!blocksTree) return []
    const contents = []
    for (const block of blocksTree) {
        contents.push([block.content, block.uuid])
        // contents.push(...getContents(block.children))
    }
    return contents
}

const TEST_PAGE_INFO = {
    createdAt: 1685378026667,
    file: { id: 13888 },
    format: "markdown",
    id: 13883,
    "journal?": false,
    name: "test",
    originalName: "test",
    updatedAt: 1685378100310,
    uuid: "6474d3ea-79ef-44c1-8d78-c0f5d69f4779"
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
        const count = await download()
        alert(`下载成功, 更新了${count.c}个块, 删除了${count.d}个块, 更新了${count.u}个块`)
    }
}

function mountUI() {
    // Create the buttons
    const uploadButton = document.createElement("button");
    uploadButton.innerHTML = "&#8593;"; // Up arrow
    uploadButton.style.fontSize = "18px";
    uploadButton.onclick = uploadCurrentPage;

    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = "&#8595;"; // Down arrow
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
