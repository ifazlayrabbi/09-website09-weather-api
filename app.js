'use strict'

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const https = require('https')
require('dotenv').config()





app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
	const api_key = process.env.API_KEY
	const city = req.body.city
	const url = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+api_key+'&units=metric'
	
	https.get(url, (urlInfo)=>{
		const statusCode = urlInfo.statusCode
		console.log('statusCode    = ' + urlInfo.statusCode)
		console.log('statusMessage = ' + urlInfo.statusMessage)

		if(statusCode == 200){
			urlInfo.on('data', (weatherData) => {
				weatherData = JSON.parse(weatherData)  // hex data
				const temp = weatherData.main.temp + ' &#8451'
				const weather = weatherData.weather[0].description
				res.write('<h1>Temparature of '+city+' is ' + temp + '</h1>')
				res.write('<h1>Weather is - ' + weather + '</h1>')
				
				const icon = weatherData.weather[0].icon
				const iconUrl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
				res.write('<img src='+iconUrl+'>')

				res.send()
			})
		}
		if(statusCode == 404)
			res.send("City Name Error!")
	})
})


	// EXAMPLE OF OBJECT
	// const people1 = {
	// 	name: 'Moin',
	// 	favoriteFood: 'Egg'
	// }
	// console.log(JSON.stringify(people1))





const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server running on port '+port))
	