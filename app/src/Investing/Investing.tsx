import { useEffect, useRef } from 'react';
import shared from '../shared';

const Investing = ()=>{
    var dialog = document.createElement('dialog');
    const modalRef = useRef<HTMLDialogElement>(dialog);

    useEffect(() => {
        if (shared.localHostOrInvesting()) {
            const modalElement = modalRef.current;
            modalElement.showModal();
        }
    });

    const closeModal = () => {
        modalRef.current.close();
    }
    
    return (
        < dialog ref={modalRef} >
            <h1>NPV</h1>
            <hr />
            <hr id="dataStart" />
            <hr id="dataEnd" />
            <button id="close" type="reset" onClick={closeModal}>Close</button>&nbsp;&nbsp;
            
            {/* TODO evtl. move copyToClipboard to shared */}
            {/* <button id="copy" onClick={copyToClipboard}>Copy</button>&nbsp;&nbsp; */}
        </dialog >
    )
}

export default Investing;