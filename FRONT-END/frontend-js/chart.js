<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

const ctx = document.getElementById('moodChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Mood Level',
      data: [4, 6, 5, 7, 8],
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 10
      }
    }
  }
});
