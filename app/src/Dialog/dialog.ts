import { MessageToDialog } from './MessageToDialog';
import shared from '../shared';

const idCollector = 'collector';
var dialog: HTMLDialogElement;
const idDialog = 'npvDialog';
const idHeaderContainer = 'npvHeaderContainer';
const idTableContainer = 'npvTableContainer';
const idNpvHeaderTable = 'npvHeaderTable';
const idNpvTable = 'npvTable';
const idFooterContainer = 'npvFooterContainer';
const idCloseButton = 'npvButtonClose';
const idCopyButton = 'npvButtonCopy';

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'dialog') return;
        shared.logMessageAndObject(`dialog.ts: message with target dialog received:`, message);

        let messageTyped = message as MessageToDialog;
        
        var dialogElement: HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e) => e.id === idDialog)[0];
        if (!dialogElement) {
            dialogElement = attachDialog();
        }

        addData(messageTyped.dataTable)
        addHeader(messageTyped.header)
        addFooter(messageTyped.footer)

        shared.logMessageAndObject(`dialog.ts: addFooter executed. dialogElement:`, dialogElement);
        dialogElement.show();


        sendResponse(true);
    });
})();

function attachDialog() {
    var rootElement: HTMLDivElement = shared.getElementByTagAndId('div', idCollector);

    dialog = document.createElement('dialog');
    dialog.id = idDialog;
    dialog.innerHTML = innerHtmlOfDialog();
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

function addData(dataTable: Array<Array<string>>) {
    const idNpvRow = 'npvRow';
    const idNpvCol = 'npvCol';

    var tableContainer: HTMLDivElement = shared.getElementByTagAndId('div', idTableContainer);
    var npvTable: HTMLTableElement = shared.getElementByTagAndIdOrCreate('table', idNpvTable);

    console.log('shape dataTable:');
    console.log(shared.getShape(dataTable));

    dataTable.forEach((row: Array<string>, ri) => {
        var npvRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + ri);

        row.forEach((col, ci) => {

            let npvCol: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + ci);
            npvCol.innerHTML = col;
            npvRow.appendChild(npvCol);

        });

        npvTable.appendChild(npvRow);
    });

    tableContainer.appendChild(npvTable);
}

function addHeader(headerArray: Array<string>) {
    const idNpvHeader = 'npvHeader';
    const idNpvCol = 'npvCol';

    var headerContainer: HTMLDivElement = shared.getElementByTagAndId('div', idHeaderContainer);
    var npvHeaderTable: HTMLTableElement = shared.getElementByTagAndIdOrCreate('table', idNpvHeaderTable);

    console.log('shape headerArray:');
    console.log(shared.getShape(headerArray));

    var npvHeaderRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvHeader);

    headerArray.forEach((col, ci) => {

        let npvCol: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvHeader + idNpvCol + ci);
        npvCol.innerHTML = col;
        npvHeaderRow.appendChild(npvCol);

    });

    npvHeaderTable.appendChild(npvHeaderRow);
    headerContainer.appendChild(npvHeaderTable);
}

function addFooter(footer: string) {
    const idNpvFooter = 'npvFooter';

    var footerContainer: HTMLDivElement = shared.getElementByTagAndId('div', idFooterContainer);
    var npvFooter: HTMLDivElement = shared.getElementByTagAndIdOrCreate('div', idNpvFooter);
    npvFooter.innerHTML = footer;
    footerContainer.appendChild(npvFooter);
}

const closeModal = () => {
    dialog.close();
}

function copyToClipboard(): void {
    var element = document.getElementById(idNpvTable);
    navigator.clipboard.writeText(element?.outerHTML === undefined
        ? 'undefined'
        : element?.outerHTML);
}

function innerHtmlOfDialog(): string {
    var innerHtml = `<h1>NPV</h1>
    <hr />
    <div id=${idHeaderContainer}></div>
    <hr id="dataStart" />
    <div id=${idTableContainer}>`;

    innerHtml += `</div>
    <hr id="dataEnd" />
    <div id=${idFooterContainer}></div>
    <hr />
    <button id=${idCloseButton} type="reset">Close</button>&nbsp;&nbsp;
    <button id=${idCopyButton}>Copy</button>&nbsp;&nbsp;`

    return innerHtml;
}

