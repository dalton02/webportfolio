class Caret{
    getCaretPosition() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0); // Pega o intervalo da seleção (caret)
        return {start: range.startOffset,end: range.endOffset}
    }
}


const caret = new Caret();
export default caret