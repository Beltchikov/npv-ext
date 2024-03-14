import { useEffect, useRef } from 'react';
import shared from '../shared';
import { IInvestingParser } from './IInvestingParser';
import { InvestingParser } from './InvestingParser';

const Investing = () => {
    var dialog = document.createElement('dialog');
    const modalRef = useRef<HTMLDialogElement>(dialog);
    const parser: IInvestingParser = new InvestingParser();

    useEffect(() => {
        if (shared.localHostOrInvesting()) {
            
        //     // 1. Send a message to the service worker requesting the user's data
        // chrome.runtime.sendMessage('get-user-data', (response) => {
        //     // 3. Got an asynchronous response with the data from the service worker
        //     console.log('received user data', response);
        //     //initializeUI(response);
        // });
            
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
                    {parser.getDataRow()?.toString().split(',').map((e) => <td>{formatString(e, 2)}</td>)}
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

export default Investing;