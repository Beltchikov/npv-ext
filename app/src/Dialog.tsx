import shared from './shared';

const idDialog = 'npvDialog';

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
    <table id='dataTable'>`;

    innerHtml += `</table>
    <hr id="dataEnd" />
    <button id=${idCloseButton} type="reset" onClick=${() => dialog.close()}>Close</button>&nbsp;&nbsp;`

    dialog.innerHTML = innerHtml;
    rootElement.appendChild(dialog);

    // add functions
    var closeButtonElement: HTMLButtonElement = Array.from(document.getElementsByTagName('button')).filter((e) => e.id === idCloseButton)[0];
    closeButtonElement.onclick = closeModal;

    // show
    dialog.showModal();
    return dialog;
}

const investingLogic = (message: any, sender: any, sendResponse: any) => {

    console.log({ info: "Dialog.starter investingLogic", sender: sender });
    if (message.type === 'dataRows') {
        console.log(message.data);
        sendResponse(true);

        // TODO
        //addData(dialogElement, message.data)
    }
    return true;

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

        if (shared.localHostOrInvesting()) {
            investingLogic(message, sender, sendResponse);
        }
        else if (shared.localHostOrSeekingAlpha()) {
            // TODO
        }
        else {
            if (console) console.log('Dialog : starter NOT IMPLEMENTED');
        }
    });

})();


