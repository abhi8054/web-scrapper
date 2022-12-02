const cheerio = require("cheerio")
const axios  = require("axios")
const express = require("express")

const app = express()
app.use(express.json())
app.get("/data_scrap",function (req,res){
    const config = {
        method:"GET",
        url:"https://www.the-numbers.com/box-office-records/worldwide/all-movies/cumulative/all-time",
        headers:{
            'Accept-Encoding' : 'text/html;'
        }
    }

    var movies = []
    axios(config)
    .then((response) =>{
        const $ = cheerio.load(response.data)
        const selector = "#page_filling_chart > center > table > tbody > tr"
        $(selector).each((index,ele) =>{
            let obj = {
                rank : "",
                year : "",
                name : "",
                url:"",
                world_wide: "",
                domestic : "",
                international : ""
            }
            $(ele).children().each((index,e) =>{
                if(index === 3){
                    obj.world_wide = $(e).text()
                } 
                if(index === 4){
                    obj.domestic = $(e).text()
                } 
                if(index === 5){
                    obj.international = $(e).text()
                } 
                if(index === 0){
                    obj.rank = $(e).text()
                } 
                if(index === 2){
                    obj.name = $('a:first-child',$(e).html()).text()
                    obj.url ='https://www.the-numbers.com' + $('a:first-child',$(e).html()).attr('href')
                }
                if(index === 1){
                    obj.year = $('a:first-child',$(e).html()).text()
                }
            })
            movies.push(obj)
        }) 
        res.status(200).json({result : movies})
    }).catch((error) =>{
        res.status(500).json({err:error.toString()})
    })
})

app.listen(5000,() =>{
    console.log("Server is Running at 5000")
})
