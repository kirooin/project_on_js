export class CommonUtils {

   public static createDateInput(id: string): HTMLElement {
        const input: HTMLInputElement = document.createElement('input');
        input.id = id;
        input.type = 'date';
        input.classList.add('form-control', 'w-auto');

        return input;
    }
}