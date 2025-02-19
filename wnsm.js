const dayjs = require('dayjs')
const Wnsm = require('./wnsm-api')

module.exports = function(RED) {
  function WnsmNode(config) {
    RED.nodes.createNode(this, config)
    var node = this
    
    // Retrieve the config node credentials
    node.config = RED.nodes.getNode(config.config)

    // Initialize
    const wnsm = new Wnsm(node.config.credentials)
    
    node.on('input', async function(msg, send, done) {
      let dateFrom, dateTo
      switch (config.period) {
        case 'current_month':
          dateFrom = dayjs().startOf('month').format('YYYY-MM-DD')
          dateTo = dayjs().add(1, 'month').startOf('month').format('YYYY-MM-DD')
          break
        case 'previous_month':
          dateFrom = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
          dateTo = dayjs().startOf('month').format('YYYY-MM-DD')
          break
        case 'yesterday':
          dateFrom = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
          dateTo = dayjs().format('YYYY-MM-DD')
          break
        case 'last_three_days':
          dateFrom = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
          dateTo = dayjs().format('YYYY-MM-DD')
          break
        case 'custom':
          if (!msg.dateFrom || !msg.dateTo) {
            done('Missing msg properties "dateFrom" and "dateTo"')
            return
          }
          dateFrom = msg.dateFrom
          dateTo = msg.dateTo
          break
        default:
          done('Missing period')
          return
      }

      let endpoint, params = {}
      switch (config.requestType) {
        case 'metering_points_values':
          endpoint = '/zaehlpunkte/messwerte'
          params = {
            'wertetyp': config.valuesType,
            'datumVon': dateFrom,
            'datumBis': dateTo,
            'zaehlpunkt': config.meteringPoint ? config.meteringPoint : msg.meteringPoint,
          }
          break
        case 'metering_points_metadata':
          endpoint = '/zaehlpunkte'
          params = {
            'resultType': config.meterTypes,
            'zaehlpunkt': config.meteringPoint ? config.meteringPoint : msg.meteringPoint,
          }
          break
        default:
          done('Missing request type')
          return
      }

      try {
        node.status({ fill: 'blue', shape: 'dot', text: 'requesting' })
        msg.payload = await wnsm.call(endpoint, params)
        node.status({})
      } catch (err) {
        node.status({ fill: 'red', shape: 'ring', text: err.code ? `${err.code} (${err.status})` : 'error' })
        done(err)
        return
      }
      
      send(msg)
      done()
    })
  }

  RED.nodes.registerType('wnsm', WnsmNode)
}
