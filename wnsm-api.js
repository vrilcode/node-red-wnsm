const { default: axios } = require('axios')
const qs = require('node:querystring')

const config = {
  tokenUrl: 'https://log.wien/auth/realms/logwien/protocol/openid-connect/token',
  baseUrl: 'https://api.wstw.at/gateway/WN_SMART_METER_API/1.0',
}

module.exports = class Wnsm {
  config
  http
  token
  tokenExpiresAt

  constructor(authConfig) {
    if (!authConfig.clientId || !authConfig.clientSecret || !authConfig.apiKey) {
      throw new Error('Authentication configuration must have properties "clientId", "clientSecret" and "apiKey"')
    }

    this.config = {
      ...config,
      ...authConfig
    }

    this.http = axios.create({
      timeout: 60 * 1000,
      validateStatus: status => status < 400
    })
  }

  async #getToken() {
    let res

    try {
      res = await this.http.post(
        this.config.tokenUrl,
        qs.stringify({
          'client_id': this.config.clientId,
          'client_secret': this.config.clientSecret,
          'grant_type': 'client_credentials'
        })
      )
    } catch (err) {
      throw new Error(`Failed to authenticate: ${err.response.status} ${err.response.statusText}`)
    }

    if (res.data?.access_token && res.data?.expires_in) {
      this.token = res.data.access_token
      this.tokenExpiresAt = this.#getEpoch() + res.data.expires_in - 10
    } else {
      throw new Error(`Failed to parse authentication response: ${res.data}`)
    }
  }

  #getEpoch() {
    return Math.floor(Date.now() / 1000)
  }

  async #call2(endpoint, params) {
    return await this.http.get(
      this.config.baseUrl + endpoint,
      {
        headers: {
          'x-Gateway-APIKey': this.config.apiKey,
          'Authorization': `Bearer ${this.token}`,
        },
        params
      }
    )
  }

  async call(endpoint, params) {
    if (!this.token || this.#getEpoch() >= this.tokenExpiresAt) {
      await this.#getToken()
    }

    let res
    try {
      res = await this.#call2(endpoint, params)
    } catch (err) {
      // If call fails with status 401, try again with new token
      if (err.response.status === 401) {
        await this.#getToken()
        res = await this.#call2(endpoint, params)
      } else {
        throw err
      }
    }

    return res.data
  }
}