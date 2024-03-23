import { useEffect, useRef } from 'react';
import shared from './shared';
import * as parser from './Investing/InvestingParser';
import { ITabsInfoResponse } from './Investing/ITabsInfoResponse';

const npvDialogId = 'npvDialog';

const Dialog = () => {
    var dialog = document.createElement('dialog');
    console.log('document.createElement();');
    const modalRef = useRef<HTMLDialogElement>(dialog);

    useEffect(() => {
        if (shared.localHostOrInvesting()) {
            // show modal
            const modalElement = modalRef.current;
            modalElement.showModal();
        }
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



const dialogLogic = () =>
{
    const closeModal = () => {
        const dialog = document.querySelector("dialog");
        dialog?.close();
    }
    
    if (shared.localHostOrInvesting()) {
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            console.log({ info: "Dialog.starter", sender: sender });
            if (message.type === 'dataRows') {
                console.log(message.data);
                sendResponse(true);
                
                //Dialog();

                var collector = document.getElementById('collector');
                console.log(collector);
                
                var dialog = document.createElement('dialog');
                dialog.setAttribute("id", npvDialogId);
                dialog.innerHTML = '<button id="close" type="reset" onClick="closeModal">Close</button>&nbsp;&nbsp;';

                collector?.appendChild(dialog);
                dialog.showModal();
            }
            return true;
        });
    }
    else {
        if (console) console.log('Dialog : starter NOT IMPLEMENTED');
    }
}

(function starter() {
    dialogLogic();

    
})();

export default Dialog;