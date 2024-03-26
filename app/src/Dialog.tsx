import { useEffect, useRef, useState } from 'react';
import shared from './shared';
import * as parser from './Investing/InvestingParser';
import * as index from './index';
import React from 'react';

const Dialog = () => {

    var dialogElement = document.getElementsByTagName('dialog')[0];
    //const [dialog, setDialog] = useState(dialogElement);

    var dialog: HTMLDialogElement = document.getElementsByTagName('dialog')[0];
    //setDialog(dialogElement);

    const modalRef = useRef<HTMLDialogElement>(dialog);

    useEffect(() => {

        // show modal
        const modalElement = modalRef.current;
        console.log('Dialog showModal');
        modalElement.showModal();
    });

    const closeModal = () => {
        modalRef.current.close();
    }

    function formatString(e: string, decimalPlaces: number): React.ReactNode {
        var floatResult = parseFloat(e);
        if (isNaN(floatResult)) {
            return e;
        }
        return floatResult.toLocaleString('de', { minimumFractionDigits: decimalPlaces });
    }

    function currentDate(): React.ReactNode {
        var date = new Date();
        return date.toLocaleDateString('de');
    }

    return (
        <>
            < dialog ref={modalRef} >
                <h1>NPV</h1>
                <hr />
                <hr id="dataStart" />
                <table id='dataTable'><tr>
                    {parser.getDataRow().map((e) => <td>{formatString(e, 2)}</td>)}
                    <td>{currentDate()}</td>
                </tr></table>
                <hr id="dataEnd" />
                <button id="close" type="reset" onClick={closeModal}>Close</button>&nbsp;&nbsp;

                {/* TODO evtl. move copyToClipboard to shared */}
                {/* <button id="copy" onClick={copyToClipboard}>Copy</button>&nbsp;&nbsp; */}
            </dialog >
        </>
    )
}

export default Dialog;

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

    var innerHtml = `<h1>NPV</h1>
    <hr />
    <hr id="dataStart" />
    <table id='dataTable'>`;

    // TODO
    // console.log('message.data');
    // console.log(data);
    // `<tr>
    // {parser.getDataRow().map((e) => <td>{formatString(e, 2)}</td>)}
    // <td>{currentDate()}</td>`

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

        // index.collector.render(
        //     <React.StrictMode>
        //         <Dialog />
        //     </React.StrictMode>);

        //attachDialog(message.data)
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
            dialogElement= attachDialog();
        }

        // TODO
        //addData(dialogElement, message.data)

        if (shared.localHostOrInvesting()) {
            investingLogic(message, sender, sendResponse);
        }
        else {
            if (console) console.log('Dialog : starter NOT IMPLEMENTED');
        }
    });

})();


