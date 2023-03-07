/**
 * 
 * @param {{method: string, route: string, body: obj}} data
 * @returns {{result: any, error: any, fail: any}} status field can be result, fail or error
 */
export default async function myfetch(data) {
  try {
    const options = {
      method: data.method,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('usertoken'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    }
    if(data.body) options.body = JSON.stringify(data.body)

    const result = await fetch('http://localhost:3000' + data.route, options)
    if(result.status >= 400) return {fail: 'fetch result status ' + result.status}
    const resultjson = await result.json()
    console.log(resultjson)
    return resultjson
  } catch (error) {
    console.log('---------------fetch_config.jsx error')
    console.log(error)
    return {error: error.message}
  }
}
