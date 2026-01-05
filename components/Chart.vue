<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import numeral from 'numeral'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export interface FeeItem {
  date: number
  primary: number | null
  secondary: number | null
}

interface Props {
  data: FeeItem[]
  primary: string
  secondary?: string | null
  loading?: boolean
  protocols: Record<string, string>
  events?: Array<{ date: string; description: string }>
}

const props = defineProps<Props>()

const toK = (num: number | string) => numeral(num).format('0.[00]a')

const formattedNum = (number: number | string): string => {
  if (isNaN(Number(number)) || number === '' || number === undefined) {
    return '$0'
  }
  const num = parseFloat(String(number))

  if (num > 500000000) {
    return '$' + toK(num.toFixed(0))
  }

  if (num === 0) {
    return '$0'
  }

  if (num < 0.0001 && num > 0) {
    return '< $0.0001'
  }

  return '$' + Number(num.toFixed(0)).toLocaleString()
}

const toNiceDate = (timestamp: number, year?: boolean): string => {
  return new Date(timestamp * 1000).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: year ? 'numeric' : undefined,
    timeZone: 'UTC',
  })
}

const chartData = computed<ChartData<'line'>>(() => {
  const labels = props.data.map((item) => toNiceDate(item.date))

  const datasets: ChartData<'line'>['datasets'] = [
    {
      label: props.protocols[props.primary] || props.primary,
      data: props.data.map((item) => item.primary),
      borderColor: '#f2a900',
      backgroundColor: 'rgba(242, 169, 0, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      fill: true,
    },
  ]

  if (props.secondary) {
    datasets.push({
      label: props.protocols[props.secondary] || props.secondary,
      data: props.data.map((item) => item.secondary),
      borderColor: '#d6d3cc',
      backgroundColor: 'rgba(214, 211, 204, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.1,
      fill: false,
    })
  }

  return {
    labels,
    datasets,
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: !!props.secondary,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: 'black',
      bodyColor: 'black',
      borderColor: '#f2a900',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        title: (items) => {
          if (items.length > 0) {
            const timestamp = props.data[items[0].dataIndex]?.date
            return timestamp ? toNiceDate(timestamp, true) : ''
          }
          return ''
        },
        label: (context) => {
          const value = context.raw as number | null
          return ` ${context.dataset.label}: ${value !== null ? formattedNum(value) : 'N/A'}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 6,
        color: '#666',
      },
    },
    y: {
      position: 'right',
      grid: {
        color: '#f0f0f0',
      },
      ticks: {
        callback: (value) => '$' + toK(value as number),
        color: '#666',
      },
    },
  },
}))
</script>

<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <Line
      :data="chartData"
      :options="chartOptions"
      :style="{ height: '200px' }"
    />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #f2a900;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
