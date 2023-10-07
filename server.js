const express = require('express')
const axios = require('axios')
const prompt = require('prompt-sync')({sigint: true}); //To pass input from the user into our application.


function search() {
    //Prompt the user for a song title
    let songTitle = prompt("What song do you want to search for? ");

    //Configure my variables and options.
    const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
        params: {
        q: songTitle,
        per_page: '10',
        page: '1'
        },
        headers: {
        'X-RapidAPI-Key': '808ad439a6mshf38bef72b60d4fcp12c6c8jsn7c8ffca6b8bd',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    
    //Pass the song title to a function that calls the Genius API.
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    })
}

//Run the entry point of the application.
const app = express(
    //run the search function
    search()
)