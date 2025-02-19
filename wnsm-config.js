module.exports = function(RED) {
  function WsnmConfigNode(config) {
    RED.nodes.createNode(this, config)
    var node = this

    node.clientId = config.clientId
    node.clientSecret = config.clientSecret
    node.apiKey = config.apiKey
  }

  RED.nodes.registerType('wnsm-config', WsnmConfigNode, {
    credentials: {
      clientId: { type: 'text' },
      clientSecret: { type: 'text' },
      apiKey: { type: 'text' },
    }
  })
}