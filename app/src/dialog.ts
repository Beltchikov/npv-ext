import { MessageToDialog } from './Dialog/MessageToDialog';
import shared from './shared';

const idCollector = 'collector';
var dialog: HTMLDialogElement;
const idDialog = 'npvDialog';
const idHeaderContainer = 'npvHeaderContainer';
const idTableContainer = 'npvTableContainer';
const idNpvTable = 'npvTable';
const idFooterContainer = 'npvFooterContainer';
const idCloseButton = 'npvButtonClose';
const idCopyButton = 'npvButtonCopy';

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'dialog') return;

        let messageTyped = message as MessageToDialog;
        doLogging(messageTyped, sender);

        var dialogElement: HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e) => e.id === idDialog)[0];
        if (!dialogElement) {
            dialogElement = attachDialog();
        }

        addData(messageTyped.dataTable)
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

    // // TODO header and footer should come with the message
    // if (shared.localHostOrInvesting()) {
    //     //dataTable.unshift(Array.from(['Symbol', 'TA']));
    //     let headerRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + "H");

    //     let headerCol1: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 1);
    //     headerCol1.innerHTML = "Symbol";
    //     let headerCol2: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 2);
    //     headerCol2.innerHTML = "TA";
    //     headerRow.appendChild(headerCol1);
    //     headerRow.appendChild(headerCol2);

    //     npvTable.appendChild(headerRow);

    // }
    // else if (shared.localHostOrTwitter()) {
    //     //dataTable.unshift(['Message', 'User', 'Date']);

    //     let headerRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + "H");

    //     let headerCol1: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 1);
    //     headerCol1.innerHTML = "Message";
    //     let headerCol2: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 2);
    //     headerCol2.innerHTML = "User";
    //     let headerCol3: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 3);
    //     headerCol3.innerHTML = "Date";

    //     headerRow.appendChild(headerCol1);
    //     headerRow.appendChild(headerCol2);
    //     headerRow.appendChild(headerCol3);

    //     npvTable.appendChild(headerRow);
    // }
    // else {
    //     dataTable.unshift(['EPS', 'DIV', 'ROE', 'Beta']);
    //     dataTable.push([`Dividend Frequency: ${divFrequency()},,,`]);
    // }
    /////////////////////////////////////


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

const closeModal = () => {
    dialog.close();
}

function copyToClipboard(): void {
    var element = document.getElementById(idNpvTable);
    navigator.clipboard.writeText(element?.outerHTML === undefined
        ? 'undefined'
        : element?.outerHTML);
}

function doLogging(message: any, sender: any) {
    console.log(`message with target dialog received:`);
    console.log(message);
    console.log(`sender:`);
    console.log(sender);
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

