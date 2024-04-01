import shared from './shared';

const idDialog = 'npvDialog';
const idTableContainer = 'npvTableContainer';

function attachDialog() {
    const idCollector = 'collector';
    const idCloseButton = 'npvButtonClose';

    var rootElement: HTMLDivElement = shared.getElementByTagAndId('div', idCollector);
    const dialog = document.createElement('dialog');
    dialog.id = idDialog;

    const closeModal = () => {
        dialog.close();
    }

    // inner html
    var innerHtml = `<h1>NPV</h1>
    <hr />
    <hr id="dataStart" />
    <div id=${idTableContainer}>`;

    innerHtml += `</div>
    <hr id="dataEnd" /><button id=${idCloseButton} type="reset">Close</button>&nbsp;&nbsp;`

    dialog.innerHTML = innerHtml;
    rootElement.appendChild(dialog);

    // add functions
    var closeButtonElement: HTMLButtonElement = shared.getElementByTagAndId('button', idCloseButton);
    closeButtonElement.onclick = closeModal;

    // show
    dialog.showModal();
    return dialog;
}

function addData(dialogElement: HTMLDialogElement, data: Array<Array<string>>) {
    const idNpvTable = 'npvTable';
    const idNpvRow = 'npvRow';
    const idNpvCol = 'npvCol';

    var tableContainer: HTMLDivElement = shared.getElementByTagAndId('div', idTableContainer);
    var npvTable: HTMLTableElement = shared.getElementByTagAndId('table', idNpvTable);
    if (!npvTable) { // TODO refactor
        npvTable = document.createElement('table');
        npvTable.id = idNpvTable;
    }

    data.forEach((row, ri) => {
        var npvRow: HTMLTableRowElement = shared.getElementByTagAndId('tr', idNpvRow + ri);
        if (!npvRow) { // TODO refactor
            npvRow = document.createElement('tr');
            npvRow.id = idNpvRow + ri;
        }

        row.forEach((col, ci) => {
            //var npvCol = Array.from(document.getElementsByTagName('td')).filter((e) => e.id === idNpvCol + ci)[0];
            var npvCol: HTMLTableCellElement = shared.getElementByTagAndId('td', idNpvCol + ci);
            if (!npvCol) {// TODO refactor
                npvCol = document.createElement('td');
                npvCol.id = idNpvCol + ci;
                npvCol.innerHTML = col;
            }

            npvRow.appendChild(npvCol);
        });

        npvTable.appendChild(npvRow);
    });

    tableContainer.appendChild(npvTable);
}

(function starter() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.target !== 'dialog') return;

        console.log('Dialog. Message received.');
        console.log(message);

        var dialogElement: HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e) => e.id === idDialog)[0];
        if (!dialogElement) {
            dialogElement = attachDialog();
        }
        addData(dialogElement, message.data)
    });
})();





