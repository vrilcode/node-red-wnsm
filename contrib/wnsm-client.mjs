import Wnsm from '../wnsm-api.js'

const wnsm = new Wnsm({
  clientId: process.env.WNSM_CLIENT_ID,
  clientSecret: process.env.WNSM_CLIENT_SECRET,
  apiKey: process.env.WNSM_API_KEY
})

try {
  let data

  data = await wnsm.call('/zaehlpunkte/messwerte', {
    datumVon: '2025-02-01',
    datumBis: '2025-02-15',
    wertetyp: 'METER_READ',
  })

  console.log(JSON.stringify(data, null, 2))
} catch (err) {
  console.error('Got an error', err)
}
