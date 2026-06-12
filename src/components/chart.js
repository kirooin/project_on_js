import Chart from 'chart.js/auto';

class ChartsManager {
    constructor() {
        this.chart1 = null;
        this.chart2 = null;
        this.colorPalette = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
            '#FFD93D', '#6C5CE7', '#A8E6CF', '#DCEDC1', '#FF8B94',
            '#FFAAA5', '#A8E6CF', '#C7CEE6', '#B5EAD7', '#FFDAC1'
        ];
    }

    getColorByIndex(index) {
        return this.colorPalette[index % this.colorPalette.length];
    }

    getColorsArray(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.getColorByIndex(i));
        }
        return colors;
    }

    init(dataForChart1, dataForChart2) {
        if (this.chart1) this.chart1.destroy();
        if (this.chart2) this.chart2.destroy();

        const colors1 = this.getColorsArray(dataForChart1.values.length);

        this.chart1 = new Chart('chart1', {
            type: 'pie',
            data: {
                labels: dataForChart1.labels,
                datasets: [{
                    data: dataForChart1.values,
                    backgroundColor: colors1,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${ctx.label}: ${val} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });

        const colors2 = this.getColorsArray(dataForChart2.values.length);

        this.chart2 = new Chart('chart2', {
            type: 'pie',
            data: {
                labels: dataForChart2.labels,
                datasets: [{
                    data: dataForChart2.values,
                    backgroundColor: colors2,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${ctx.label}: ${val} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

export const chartsManager = new ChartsManager();