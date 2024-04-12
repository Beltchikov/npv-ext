import shared from './shared';

// TODO remove later
import { divFrequency } from "./Parsers/SeekingAlphaParser"

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

function addData(dataTable: Array<Array<string>>) {
    const idNpvRow = 'npvRow';
    const idNpvCol = 'npvCol';

    var tableContainer: HTMLDivElement = shared.getElementByTagAndId('div', idTableContainer);
    var npvTable: HTMLTableElement = shared.getElementByTagAndIdOrCreate('table', idNpvTable);

    // TODO header and footer should come with the message
    if (shared.localHostOrInvesting()) {
        //dataTable.unshift(Array.from(['Symbol', 'TA']));
        let headerRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + "H");

        let headerCol1: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 1);
        headerCol1.innerHTML = "Symbol";
        let headerCol2: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 2);
        headerCol2.innerHTML = "TA";
        headerRow.appendChild(headerCol1);
        headerRow.appendChild(headerCol2);

        npvTable.appendChild(headerRow);

    }
    else if (shared.localHostOrTwitter()) {
        //dataTable.unshift(['Message', 'User', 'Date']);

        let headerRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + "H");

        let headerCol1: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 1);
        headerCol1.innerHTML = "Message";
        let headerCol2: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 2);
        headerCol2.innerHTML = "User";
        let headerCol3: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + "H" + 3);
        headerCol3.innerHTML = "Date";

        headerRow.appendChild(headerCol1);
        headerRow.appendChild(headerCol2);
        headerRow.appendChild(headerCol3);

        npvTable.appendChild(headerRow);
    }
    else {
        dataTable.unshift(['EPS', 'DIV', 'ROE', 'Beta']);
        dataTable.push([`Dividend Frequency: ${divFrequency()},,,`]);
    }
    /////////////////////////////////////


    console.log('shape dataTable');
    console.log(shared.getShape(dataTable));
    
    dataTable.forEach((row: Array<string>, ri) => {
        console.log('shape row');
        console.log(shared.getShape(row));
        
        var npvRow: HTMLTableRowElement = shared.getElementByTagAndIdOrCreate('tr', idNpvRow + ri);

        row.forEach((col) => {
            
            let colOfUnknownType = col as unknown;
            let colAsArray = colOfUnknownType as Array<string>;

            console.log('shape colAsArray');
            console.log(shared.getShape(colAsArray));
    
            colAsArray.forEach((innerCol, ici) => {
                var npvCol: HTMLTableCellElement = shared.getElementByTagAndIdOrCreate('td', idNpvRow + idNpvCol + ici);
                npvCol.innerHTML = innerCol;
                npvRow.appendChild(npvCol);
            });

        });

        npvTable.appendChild(npvRow);
    });

    tableContainer.appendChild(npvTable);
}

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'dialog') return;

        console.log(`dialog.ts: message:${message} sender:${sender}`);
        console.log(message);

        var dialogElement: HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e) => e.id === idDialog)[0];
        if (!dialogElement) {
            dialogElement = attachDialog();
        }

        addData(message.dataTable)
        sendResponse(true);
    });
})();