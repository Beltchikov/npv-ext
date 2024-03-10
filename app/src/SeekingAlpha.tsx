import React from 'react';
import { useEffect, useRef } from 'react';
import shared from './shared'
import {ISeekingAlphaParser} from './ISeekingAlphaParser';
import {SeekingAlphaParser} from './SeekingAlphaParser';

const SeekingAlpha = () => {
    var dialog = document.createElement('dialog');
    const modalRef = useRef<HTMLDialogElement>(dialog);
    const parser : ISeekingAlphaParser = new SeekingAlphaParser();

    useEffect(() => {
        if (shared.localHostOrSeekingAlpha()) {
            const modalElement = modalRef.current;
            modalElement.showModal();
        }
    });

    const closeModal = () => {
        modalRef.current.close();
    }

    function copyToClipboard(): void {
        var element = document.getElementById("dataTable");
        navigator.clipboard.writeText(element?.outerHTML === undefined
            ? 'undefined'
            : element?.outerHTML);
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

    function divFrequency(): React.ReactNode {
        return 'TODO';
    }

    return (
        < dialog ref={modalRef} >
            <h1>NPV</h1>
            <hr />
            <div>EPS DIV ROE Beta Date</div>
            <hr id="dataStart" />
            <table id='dataTable'><tr>
                {parser.getDataRow()?.toString().split(',').map((e) => <td>{formatString(e, 2)}</td>)}
                <td>{currentDate()}</td>
            </tr></table>
            <div>Dividend Frequency: {divFrequency()}</div>
            <hr id="dataEnd" />
            <button id="close" type="reset" onClick={closeModal}>Close</button>&nbsp;&nbsp;
            <button id="copy" onClick={copyToClipboard}>Copy</button>&nbsp;&nbsp;
        </dialog >
    )
}

export default SeekingAlpha

