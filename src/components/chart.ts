import Chart from 'chart.js/auto';
import { Chart as ChartJS, TooltipItem } from 'chart.js';

interface ChartData {
    labels: string[];
    values: number[];
}

class ChartsManager {
    private chart1: ChartJS | null = null;
    private chart2: ChartJS | null = null;
    private readonly colorPalette: string[] = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#FFD93D', '#6C5CE7', '#A8E6CF', '#DCEDC1', '#FF8B94',
        '#FFAAA5', '#A8E6CF', '#C7CEE6', '#B5EAD7', '#FFDAC1'
    ];

    public getColorByIndex(index: number): string {
        const color = this.colorPalette[index % this.colorPalette.length];
        return color || '#000000';
    }

    public getColorsArray(count: number): string[] {
        const colors: string[] = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.getColorByIndex(i));
        }
        return colors;
    }

    public init(dataForChart1: ChartData, dataForChart2: ChartData): void {
        if (this.chart1) {
            this.chart1.destroy();
            this.chart1 = null;
        }
        if (this.chart2) {
            this.chart2.destroy();
            this.chart2 = null;
        }

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
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem: TooltipItem<'pie'>) => {
                                const val = tooltipItem.raw as number;
                                const dataset = tooltipItem.dataset;
                                const total = (dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${tooltipItem.label}: ${val} (${percent}%)`;
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
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem: TooltipItem<'pie'>) => {
                                const val = tooltipItem.raw as number;
                                const dataset = tooltipItem.dataset;
                                const total = (dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                                const percent = ((val / total) * 100).toFixed(1);
                                return `${tooltipItem.label}: ${val} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

export const chartsManager = new ChartsManager();