export class CommonUtils {
    static makeEditable(spanElement) {

        if (spanElement.textContent === 'Дата') {
            spanElement.textContent = '';
        }

        spanElement.contentEditable = true;
        spanElement.focus();

        function onBlur() {
            spanElement.contentEditable = false;
            if (!spanElement.textContent.trim()) {
                spanElement.textContent = 'Дата';
            }
            spanElement.removeEventListener('blur', onBlur);
            spanElement.removeEventListener('keypress', onKeyPress);
        }

        function onKeyPress(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                spanElement.blur();
            }
        }

        spanElement.addEventListener('blur', onBlur, {once: true});
        spanElement.addEventListener('keypress', onKeyPress);
    }

    static createDateInput(id) {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'date';
        input.classList.add('form-control', 'w-auto');

        return input;
    }
}