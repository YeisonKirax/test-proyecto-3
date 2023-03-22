export async function getCoronavirusData( country, status ) {
  const baseURL = 'https://api.covid19api.com'

  const URI = `country/${ country }/status/${ status }`

  const url = new URL( `${ baseURL }/${ URI }` )

  const username = 'corona'
  const password = 'ZUav4vawzCfMcMXHV8B'
  const headers = {
    "Authorization": `Basic ${ btoa( username + ":" + password ) }`
  }

  const fetchResponse = await fetch( url, { headers } )

  const data = await fetchResponse.json()
  return data
}