export class Sidebar {
    constructor() {
        this.dropDownBtn = document.getElementById('dropdown-btn')
        this.chevronDown = document.getElementById('chevron-down')
        this.chevronRight = document.getElementById('chevron-right')
        this.dropDownMenu = document.getElementById('dropdown-menu')
        this.initSidebar()
        this.testClick()

    }

    initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            return
        }
    }

    testClick() {
        this.dropDownBtn.addEventListener('click', () => {
            if (this.dropDownBtn.getAttribute('aria-expanded') === 'true') {
                this.dropDownBtn.classList.add('bg-primary');
                this.dropDownBtn.classList.add('text-white');
                this.chevronDown.classList.remove('d-none');
                this.chevronRight.classList.add('d-none');
                this.dropDownMenu.style.transform = 'translate(0, 40px)';
                this.dropDownBtn.classList.remove('text-dark-blue');
            } else {
                this.dropDownBtn.classList.remove('bg-primary');
                this.dropDownBtn.classList.remove('text-white');
                this.chevronDown.classList.add('d-none');
                this.chevronRight.classList.remove('d-none');
                this.dropDownBtn.classList.add('text-dark-blue');
            }
        })
    }


}
