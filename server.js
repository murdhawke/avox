const express = require('express')
const axios = require('axios')
const app = express()
const prompt = require('prompt-sync')({sigint: true}); //To pass input from the user into our application.
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const post =  require('./js/post');

const port = process.env.PORT || 4500;
//define variables
var release_date = "";
var songName = "";
var songArtist = "";
var  search_results = [];
var pageViews = 0;
var sorted;



// server your css as static
app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function search(songName) {
    //Configure my variables and options.
    const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
        params: {
        q: songName,
        per_page: '5',
        page: '1'
        },
        headers: {
        'X-RapidAPI-Key': '808ad439a6mshf38bef72b60d4fcp12c6c8jsn7c8ffca6b8bd',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    
    //Pass the song title to a function that calls the Genius API.
    axios.request(options).then(function (response) {
        for (let i = 0; i <5 ; i++) {
            release_date =response.data.hits[i].result.release_date_for_display; //release date
            songName = response.data.hits[i].result.full_title; //name of song
            songArtist = response.data.hits[i].result.artist_names; //name of artist
            pageViews = response.data.hits[i].result.stats.pageviews; //page views

            search_results = [songName, songArtist,release_date, pageViews];
            return search_results;
            
          }
    }).catch(function (error) {
        console.error(error);
    })
}

// A function to sort the best three songs based on their pageviews
function songRank(search_results){
    sorted = search_results.sort((a, b) => b[3] - a[3]);
    console.log(sorted);
}

//define routes
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './html/' });
  });

 //Pass the user input to socket.io
    io.on('connection', (socket) => {
        console.log('A user connected');
    
        // Listen for a submit event from the client
        socket.on('user-input', (data) => {
        // You can process or respond to the data here
            let songName = data;
            search(songName)
        });
    
        socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
  });
 

// start the socket server
server.listen(port, () => {
    console.log('listening on ' + port);
  });

