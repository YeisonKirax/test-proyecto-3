export function createChart( labels, datasets, chartNode, chartType ) {
  const data = {
    labels, datasets
  }
  const config = {
    type: chartType,
    data,
    options: {}
  }
  return new Chart( chartNode, config )
}