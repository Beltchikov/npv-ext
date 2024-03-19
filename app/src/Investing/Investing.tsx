import { useEffect, useRef } from 'react';
import shared from '../shared';
import * as parser from './InvestingParser';
import { ITabsInfoResponse } from './ITabsInfoResponse';

const Investing = () => {
    var dialog = document.createElement('dialog');
    const modalRef = useRef<HTMLDialogElement>(dialog);

    useEffect(() => {
        if (shared.localHostOrInvesting()) {
            // messages to other tabs
            chrome.runtime.sendMessage('get-tabs-info', async (response: ITabsInfoResponse) => {
                console.log('received response: ', response);
                for (var i = 0; i < response.data.length; i++) {
                    {
                        const tab: chrome.tabs.Tab = response.data[i];
                        console.log('tabId: ', tab.id);
                    }
                }
            });
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

export default Investing;