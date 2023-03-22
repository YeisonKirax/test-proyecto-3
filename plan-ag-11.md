# ASESORÍA GRUPAL 11: Construcción de Gráficos

## 1. Introducción

En el mundo del desarrollo es común la construcción de dashboards para poder analizar la información generada o recaudada durante el tiiempo, por lo cual es necesario saber las nociones básicas para poder generar distintos tipos de gráficos, como integrar la data y el como mostrarla.

## 2. Charts.js

Charts.js es una librería de JavaScript que utiliza el canvas de HTML5 para mostrar impresionantes gráficos para tu web. Puedes descargarlo desde: [http://www.chartjs.org](http://www.chartjs.org/) y empezar a utilizarlo inmediatamente. Todo lo que tienes que hacer es añadir el script de Chart.js en tu documento y podrás aprovecharte de su funcionalidad. Si necesitas documentación, puedes encontrarla en [Chart.js | Documentation](http://www.chartjs.org/docs/).

## 3. Integración simple de Charts.js

Para integrar charts.js, de forma rápida basta con seguir los siguientes pasos.

- [ ] Iniciar el proyecto creando un archivo `index.html`, `styles.css` y `index.js`.

- [ ] Dentro del `index.html` agregar el siguiente código.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejemplo CHARTS.JS</title>

  <!-- Importamos los estilos locales -->
  <link rel='stylesheet' href='./styles.css'>
</head>

<body>
  <h1>Mi primer gráfico</h1>

  <!-- Generamos el espacio donde se mostrará el gráfico. (Si se tendrá más de un gráfico, se debe generar más veces, pero con distinto id) -->
  <div>
    <canvas id="myChart"></canvas>
  </div>
</body>

<!-- Importamos el script que nos permitirá utilizar charts.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Importamos los scripts locales -->
<script src='./index.js'></script>

</html>
```

- [ ] Luego en `index.js` agregar lo siguiente

```javascript
const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const data = {
  labels: labels,
  datasets: [ {
    label: 'Cantidad de errores por mes',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [ 0, 10, 5, 2, 20, 30, 45 ],
  } ]
};

const config = {
  type: 'line',
  data: data,
  options: {}
};

const myChart = new Chart(
  document.getElementById( 'myChart' ),
  config
);
```

## 4. Implementando modularización

Para implementar la modularización de los scripts, deberemos de hacer lo siguiente

- [ ] Primero, deberemos de actualizar `index.html` y actualizar la importación del script `index.js` a lo siguiente.

```html
<script src='./index.js' type='module'></script>
```

- [ ] Luego generaremos un nuevo archivo llamado `charts.js` y dentro agregaremos lo siguiente:

```javascript
export function createChart( labels, datasets, chartNode, chartType ) {
  const data = {
    labels,
    datasets
  }

  const config = {
    type: chartType,
    data,
    options: {}
  }

  return new Chart( chartNode, config )
}
```

- [ ] Y en `index.js` actualizaremos el código a lo siguiente:

```javascript
import { createChart } from "./charts.js";

const chartNode = document.getElementById( 'myChart' )

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const dataSets = [ {
  label: 'Cantidad de errores por mes',
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: [ 0, 10, 5, 2, 20, 30, 45 ],
} ]

createChart( labels, dataSets, chartNode, 'line' )
```

## 5. Integración de APIS

Ahora vamos a mejorar lo desarrollado para poder obtener data de una API y mostrar la información en un gráfico.

- [ ] En primer lugar se debe de buscar una API de interés, en este caso se trabajará con una API que entregará información del coronavirus. La documentación de encuentra en el siguiente [enlace](https://documenter.getpostman.com/view/10808728/SzS8rjbc#intro)

- [ ] Luego es importante hacer un acercamiento a esta API para saber que ofrece, como devuelve la información y como se llama. Para estos casos es útil utilizar herramientas como postman.

- [ ] Una vez estudiada la API, pasaremos a implementarla, para llamarla usaremos la api de **fetch** , vista en asesorías anteriores. En primer lugar crearemos un archivo nuevo llamado `coronavitus.js` con lo siguiente:

```javascript
export async function getCoronavirusData( country, status ) {
  const baseUrl = 'https://api.covid19api.com'

  const uri = `country/${ country }/status/${ status }`

  const url = new URL( `${ baseUrl }/${ uri }` )

  const username = "corona"
  const password = "ZUav4vawzCfMcMXHV8B"
  const headers = {
    "Authorization": `Basic ${ btoa( username + ":" + password ) }`
  }
  const fetchResponse = await fetch( url, { headers } )

  const data = await fetchResponse.json()
  return data
}
```

- [ ] Finalmente actualizaremos `index.js` para llamar a este método y obtener la data, filtrarla y generar los datos necesarios para poder mostrarla en un gráfico.

```javascript
import { createChart } from "./charts.js";

import { getCoronavirusData } from './coronavirus.js';

const chartNode = document.getElementById( 'myChart' )

// Obtenemos la data desde una API
// Los posibles estados son: confirmed, recovered, deaths

const data = await getCoronavirusData( 'chile', 'confirmed' )
console.log( `🚀 ~ data:`, data );

// Preparamos la data

// Filtros para buscar los casos  de enero (0) de este año (2023)
const from = 0
const to = 0
const currentYear = 2023

// Filtramos la data
const filteredData = data.filter( dataPerDay => {
  const date = new Date( dataPerDay.Date )
  const month = date.getMonth()
  const year = date.getFullYear()
  return from <= month && month <= to && year === currentYear

} )

// Preparamos los labels 
const labels = filteredData.map( dataPerDay => new Date( dataPerDay.Date ).toLocaleDateString() )

// Preparamos el datasets
const dataSets = [ {
  label: 'Cantidad de confirmados por coronavirus por día',
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: filteredData.map( dataPerDay => dataPerDay.Cases ),
} ]

// Generamos el gráfico
createChart( labels, dataSets, chartNode, 'line' )
```
