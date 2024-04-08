import shared from './shared';

// TODO remove later
import {divFrequency} from "./Parsers/SeekingAlphaParser"

const idDialog = 'npvDialog';
const idTableContainer = 'npvTableContainer';
const idNpvTable = 'npvTable';

function attachDialog() {
    const idCollector = 'collector';
    const idCloseButton = 'npvButtonClose';
    const idCopyButton = 'npvButtonCopy';

    var rootElement: HTMLDivElement = shared.getElementByTagAndId('div', idCollector);
    const dialog = document.createElement('dialog');
    dialog.id = idDialog;

    const closeModal = () => {
        dialog.close();
    }

    function copyToClipboard(): void {
        var element = document.getElementById(idNpvTable);
        navigator.clipboard.writeText(element?.outerHTML === undefined
            ? 'undefined'
            : element?.outerHTML);
    }

    // inner html
    var innerHtml = `<h1>NPV</h1>
    <hr />
    <hr id="dataStart" />
    <div id=${idTableContainer}>`;

    innerHtml += `</div>
    <hr id="dataEnd" />
    <button id=${idCloseButton} type="reset">Close</button>&nbsp;&nbsp;
    <button id=${idCopyButton}>Copy</button>&nbsp;&nbsp;`

    dialog.innerHTML = innerHtml;
    rootElement.appendChild(dialog);

    // add functions
    var closeButtonElement: HTMLButtonElement = shared.getElementByTagAndId('button', idCloseButton);
    closeButtonElement.onclick = closeModal;
    var copyButtonElement: HTMLButtonElement = shared.getElementByTagAndId('button', idCopyButton);
    copyButtonElement.onclick = copyToClipboard;

    // show
    dialog.showModal();
    return dialog;
}

function addData(data: Array<Array<string>>) {
    const idNpvRow = 'npvRow';
    const idNpvCol = 'npvCol';

    var tableContainer: HTMLDivElement = shared.getElementByTagAndId('div', idTableContainer);
    var npvTable: HTMLTableElement = shared.getElementByTagAndIdOrCreate('table', idNpvTable);

    // TODO header and footer should come with the message
    if (shared.localHostOrInvesting()) {
        data.unshift(['Symbol', 'TA'])
    }
    else {
        data.unshift(['EPS', 'DIV', 'ROE', 'Beta'])
        data.push([`Dividend Frequency: ${divFrequency()}`, '', '', ''])
    }

    data.forEach((row, ri) => {
        var npvRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + ri);
        row.forEach((col, ci) => {
            var npvCol: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + ci);
            npvCol.innerHTML = col;
            npvRow.appendChild(npvCol);
        });

        npvTable.appendChild(npvRow);
    });

    tableContainer.appendChild(npvTable);
}

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'dialog') return;

        console.log(`dialog.ts: message:${message} sender:${sender}`);

        var dialogElement: HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e) => e.id === idDialog)[0];
        if (!dialogElement) {
            dialogElement = attachDialog();
        }
        addData(message.data)
        sendResponse(true);
    });
})();





