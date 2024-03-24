import { useEffect, useRef } from 'react';
import shared from './shared';
import * as parser from './Investing/InvestingParser';
import * as index from './index';
import React from 'react';

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

const investingLogic = () => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        console.log({ info: "Dialog.starter investingLogic", sender: sender });
        if (message.type === 'dataRows') {
            console.log(message.data);
            sendResponse(true);

            index.collector.render(
                <React.StrictMode>
                    <Dialog />
                </React.StrictMode>);
        }
        return true;
    });
}

(function starter() {
    if (shared.localHostOrInvesting()) {
        investingLogic();
    }
    else {
        if (console) console.log('Dialog : starter NOT IMPLEMENTED');
    }
})();

export default Dialog;