import { createChart } from './charts.js';
import { getCoronavirusData } from './coronavirus-api.js';

// const labels = [ 'Enero', 'Febrero', 'Marzo', 'Abril' ]

// const datasets = [ {
//   label: 'Cantidad de errores por mes',
//   backgroundColor: 'rgb(255, 99, 132)',
//   borderColor: 'rgb(255, 99, 132)',
//   data: [ 40, 66, 33, 98 ]
// } ]

const data = await getCoronavirusData( 'chile', 'deaths' )
console.log( `🚀 ~ data:`, data );

const from = 2 // Enero
const to = 2 // Enero
const currentYear = 2023

const filteredData = data.filter( dataPerDay => {
  const date = new Date( dataPerDay.Date )
  const month = date.getMonth()
  const year = date.getFullYear()
  return from <= month && month <= to && currentYear == year
} )

const labels = filteredData.map( dataPerDay => new Date( dataPerDay.Date ).toLocaleDateString() )

const datasets = [ {
  label: 'Cantidad de casos confirmados',
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: filteredData.map( dataPerDay => dataPerDay.Cases )
} ]

const canvasNode = document.getElementById( 'myChart' )
createChart( labels, datasets, canvasNode, 'line' )
