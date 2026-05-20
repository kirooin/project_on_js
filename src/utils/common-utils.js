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
            console.log('Введено:', spanElement.textContent);
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
}