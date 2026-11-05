const numberFormat = new Intl.NumberFormat('en-ZA');
let dataset, trendChart, dailyChart, selectedCountry;
let visibleRows = [];

async function loadData() {
  try {
    const response = await fetch('data/covid-19.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dataset = await response.json();
    populateCountries();
    document.getElementById('dataStatus').textContent = 'Dataset loaded successfully';
    renderDashboard();
  } catch (error) {
    document.getElementById('dataStatus').textContent = 'Could not load JSON data';
    console.error('Data loading error:', error);
    alert('Could not load data/covid-19.json. Run this project with a local web server (see README).');
  }
}

function populateCountries() {
  const select = document.getElementById('countrySelect');
  select.innerHTML = '';
  dataset.countries.forEach(item => {
    const option = document.createElement('option');
    option.value = item.country;
    option.textContent = item.country;
    select.appendChild(option);
  });
  select.value = 'China';
  selectedCountry = 'China';
}

function renderDashboard() {
  selectedCountry = document.getElementById('countrySelect').value;
  const country = dataset.countries.find(c => c.country === selectedCountry);
  const rows = [...country.data].sort((a,b) => a.date.localeCompare(b.date));
  const slider = document.getElementById('dateRange');
  slider.min = 0;
  slider.max = Math.max(0, rows.length - 1);
  if (Number(slider.value) > Number(slider.max)) slider.value = slider.max;
  const endIndex = Number(slider.value);
  visibleRows = rows.slice(0, endIndex + 1);
  if (!visibleRows.length) return;

  const latest = visibleRows[visibleRows.length - 1];
  document.getElementById('confirmed').textContent = numberFormat.format(latest.confirmed);
  document.getElementById('deaths').textContent = numberFormat.format(latest.deaths);
  document.getElementById('recovered').textContent = numberFormat.format(latest.recovered);
  document.getElementById('active').textContent = numberFormat.format(latest.confirmed - latest.deaths - latest.recovered);
  document.getElementById('countryLabel').textContent = selectedCountry;
  document.getElementById('dateValue').textContent = formatDate(latest.date);

  renderTrendChart(visibleRows);
  renderDailyChart(visibleRows);
}

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

function renderTrendChart(rows) {
  const labels = rows.map(r => formatDate(r.date));
  const config = {
    type:'line',
    data:{labels,datasets:[
      {label:'Confirmed',data:rows.map(r=>r.confirmed),borderColor:'#4268c5',backgroundColor:'rgba(66,104,197,.10)',tension:.28,fill:true},
      {label:'Deaths',data:rows.map(r=>r.deaths),borderColor:'#e35d6a',backgroundColor:'transparent',tension:.28},
      {label:'Recoveries',data:rows.map(r=>r.recovered),borderColor:'#25a77a',backgroundColor:'transparent',tension:.28}
    ]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:7,padding:20}}},
      scales:{y:{beginAtZero:true,ticks:{callback:v=>numberFormat.format(v)},grid:{color:'#edf1f6'}},x:{grid:{display:false}}}}
  };
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(document.getElementById('trendChart'),config);
}

function renderDailyChart(rows) {
  const labels = rows.map(r=>formatDate(r.date));
  const increases = rows.map((r,i)=>i===0 ? 0 : r.confirmed-rows[i-1].confirmed);
  const config = {type:'bar',data:{labels,datasets:[{label:'Increase since previous observation',data:increases,
    backgroundColor:'rgba(66,104,197,.78)',borderRadius:6,maxBarThickness:42}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true,ticks:{callback:v=>numberFormat.format(v)},grid:{color:'#edf1f6'}},x:{grid:{display:false}}}}};
  if(dailyChart) dailyChart.destroy();
  dailyChart = new Chart(document.getElementById('dailyChart'),config);
}

document.getElementById('countrySelect').addEventListener('change',()=>{
  document.getElementById('dateRange').value = document.getElementById('dateRange').max;
  renderDashboard();
});
document.getElementById('dateRange').addEventListener('input',renderDashboard);
document.getElementById('resetButton').addEventListener('click',()=>{
  document.getElementById('dateRange').value = document.getElementById('dateRange').max;
  renderDashboard();
});
loadData();
