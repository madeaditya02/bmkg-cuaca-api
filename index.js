const express = require('express')
const axios = require('axios')
const cors = require('cors')
const cheerio = require('cheerio');
const allData = require('./data/extract.js')
const provinces = require('./data/provinces.js')
const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/provinces', async (req, res) => {
  res.json(provinces)
})

app.get('/districts', async (req, res) => {
  const province = provinces.find(prov => prov.id == req.query.provinceId)
  if (province) {
    try {
      const { data: xmlData } = (await axios.get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${province.name.replace(/ /g, '')}.xml`))
      const $ = cheerio.load(xmlData, { xmlMode: true })
      const districts = []
      $('area').each((i, d) => {
        districts.push({
          id: d.attribs.id,
          name: $(d).find('[xml\\:lang="id_ID"]').text(),
          area: d.attribs.description,
          lat: d.attribs.latitude,
          lng: d.attribs.longitude
        })
      })
      const data = {
        districts: districts
      }
      return res.json(data)
    } catch (error) {
      return res.json({
        status: 200,
        error
      })
    }
  }
  return res.json({
    status: 200,
    districts: [],
    error: 'Province id not found'
  })
})

app.get('/cuaca', async (req, res) => {
  const province = provinces.find(prov => prov.id == req.query.provinceId)
  if (province) {
    try {
      const xmlData = (await axios.get(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${province.name.replace(/ /g, '')}.xml`)).data
      const $ = cheerio.load(xmlData, { xmlMode: true })
      const district = $(`area[id="${req.query.districtId}"]`)

      if (district.length) {
        const times = {}
        const data = {}
        $('issue').children().toArray().forEach(el => times[el.tagName] = el.firstChild.data)
        if (req.query.receive) {
          if (req.query.receive == 'timestamp') {
            return res.json({ times })
          } else {
            if (allData[req.query.receive]) {
              data[req.query.receive] = allData[req.query.receive]($, district)
            }
          }
        } else {
          for (const dataKey in allData) {
            data[dataKey] = allData[dataKey]($, district)
          }
        }
        return res.json({ times, data })
      } else {
        return res.json({
          status: 200,
          data: {},
          error: 'District id not found'
        })
      }
    } catch (error) {
      console.log(error)
      return res.json({
        status: 200,
        error
      })
    }
  }
  return res.json({
    status: 200,
    data: {},
    error: 'Province id not found'
  })
})

app.use('/', (req, res) => {
  res.status(404)
  res.send('404')
})

const server = app.listen(3000, async () => {
  console.log('Express is listening on port 3000..')
})

module.exports = app