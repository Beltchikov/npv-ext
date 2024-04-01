import shared from './shared';

const idDialog = 'npvDialog';
const idTableContainer = 'npvTableContainer';

function attachDialog() {
    const idCollector = 'collector';
    const idCloseButton = 'npvButtonClose';

    var rootElement: HTMLDivElement = Array.from(document.getElementsByTagName('div')).filter((e) => e.id === idCollector)[0];
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
    // TODO refactor getButtonByTagAndId
    //var closeButtonElement: HTMLButtonElement = Array.from(document.getElementsByTagName('button')).filter((e) => e.id === idCloseButton)[0];
    var closeButtonElement: HTMLButtonElement = shared.getElementByIdTyped('button', idCloseButton);
    closeButtonElement.onclick = closeModal;

    // show
    dialog.showModal();
    return dialog;
}

function addData(dialogElement: HTMLDialogElement, data: Array<Array<string>>) {
    const idNpvTable = 'npvTable';
    const idNpvRow = 'npvRow';
    const idNpvCol = 'npvCol';

    var tableContainer: HTMLDivElement = Array.from(dialogElement.getElementsByTagName('div'))
        .filter((e) => e.id === idTableContainer)[0];

    var npvTable = Array.from(document.getElementsByTagName('table')).filter((e) => e.id === idNpvTable)[0];
    if (!npvTable) { // TODO refactor
        npvTable = document.createElement('table');
        npvTable.id = idNpvTable;
    }

    data.forEach((row, ri) => {
        var npvRow = Array.from(document.getElementsByTagName('tr')).filter((e) => e.id === idNpvRow + ri)[0];
        if (!npvRow) { // TODO refactor
            npvRow = document.createElement('tr');
            npvRow.id = idNpvRow + ri;
        }

        row.forEach((col, ci) => {
            var npvCol = Array.from(document.getElementsByTagName('td')).filter((e) => e.id === idNpvCol + ci)[0];
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





