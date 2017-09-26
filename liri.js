// grab data from keys and store it into a variable
var keysFile = require('./keys.js')
var inquirer = require('inquirer');
var twitter = require('twitter');
var twitterClient = new twitter(keysFile.twitterKeys);
var Spotify = require('node-spotify-api');
var spotifyClient = new Spotify(keysFile.spotifyKeys);
var request = require("request") // for OMDB
var fs = require("fs");

   
var params = {screen_name: 'KyleKowalski'};

mainPrompt();

function mainPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "\n\n=====\nWelcome to Liri-Bot - please make a selection:\n=====",
            choices: ["Twitter", "Spotify", "OMDB", "Do What The Random File Says", "Quit"],
            name: "mainPromptChoice"
        }
    ]).then(function(response) { // TODO replace with case
        if (response.mainPromptChoice === 'Twitter') {
            getTwitter();
        }
        else if (response.mainPromptChoice === 'Spotify') {
            getSpotify();
        }
        else if (response.mainPromptChoice === 'OMDB') {
            getOMDB();
        }
        else if (response.mainPromptChoice === 'Do What The Random File Says') {
            doWhatTheRandomFileSays();
        }
        else if (response.mainPromptChoice === 'Quit') {
            quit();
        }
        else {
            console.log("We've escaped the main prompt choice somehow - log an error")
        }
    })
}

function getTwitter() {
    twitterClient.get('statuses/user_timeline', params, function(error, tweetArray, response) {
        if (!error) {
            console.log("Recent Tweets:");
            var tweetCount = 1;
            tweetArray.forEach(function (tweet){
                if (tweetCount > 20) {
                    // TODO
                }
                console.log(tweetCount + ". (" + tweet.created_at + ") : " + tweet.text);
                tweetCount++;
            });
        }
        afterTwitterPrompt();
    });
}

function createTweet() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter your tweet:",
            name: "tweetText"
        }
    ]).then(function(response){
        if (response.tweetText === "") {
            console.log("Unable to create empty tweets - returning you to twitter main menu");
            getTwitter();
            return;
        }

        twitterClient.post('statuses/update', {status: response.tweetText},  function(error, tweet, response) {
            if(error) throw error;
            getTwitter();
        });
    });
}

function afterTwitterPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "\n=====\nAbove are recent tweets - next selection?\n=====",
            choices: ["Main Menu", "New Tweet", "Quit"],
            name: "mainPromptChoice"
        }
    ]).then(function(response) {
        if (response.mainPromptChoice === 'Main Menu') {
            mainPrompt();
        }
        else if (response.mainPromptChoice === 'New Tweet') {
            createTweet();
        }
        else if (response.mainPromptChoice === 'Quit') {
            quit();
        }
        else {
            console.log("We've escaped the main prompt choice somehow - log an error")
        }
    });
}

function getSpotify() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song (track) would you like to look up?",
            name: "spotifyRequest"
        },
        {
            type: "input",
            message: "Results you want to see?  Max returned up to this number.  (default 1 - max 20)",
            name: "numberOfResults"
        }
    ]).then(function(response){
        if (response.spotifyRequest === ""){
            response.spotifyRequest = "All That She Wants" // TODO verify this gives ace of base
            console.log('Since you gave no search term, you get "All That She Wants" by Ace of Base - enjoy!');
        }
        if (response.numberOfResults === "") {
            response.numberOfResults = 1
            console.log('Since you entered no number of results we are defaulting to 1.')
        }
        searchSpotify(response.spotifyRequest, response.numberOfResults);
    });
}

function searchSpotify(thisSong, numberOfResults) {
    spotifyClient.search({ type: 'track', query: thisSong }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songCount = 1;
        data.tracks.items.forEach(function(songListing){
            if (songCount > numberOfResults) {
                return false;
            }
            let artist = songListing.album.artists[0].name;
            let song = songListing.name;
            let songUrl = songListing.album.artists[0].external_urls.spotify;
            let album = songListing.album.name;
            console.log("\n=====")
            console.log(songCount + ". Artist: " + artist);
            console.log(songCount + ". Song: " + song);
            console.log(songCount + ". Song URL: " + songUrl);
            console.log(songCount + ". Album: " + album);
            songCount++;
            console.log("=====")
        });
    mainPrompt();
    });
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
}

function getOMDB() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to look up?",
            name: "movieRequest"
        }
    ]).then(function(response){

        if (response.movieRequest === ""){
            response.movieRequest = "Mr Nobody"
            console.log('Since you gave no search term, you get "Mr Nobody" - enjoy!');
        }
        
        request("http://www.omdbapi.com/?t=" + response.movieRequest + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
        
          if (!error && response.statusCode === 200) {
        
            console.log("Movie title: " + JSON.parse(body).Title); 
            console.log("Year released: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Country released: " + JSON.parse(body).Country);
            console.log("Language of movie: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
          }
          mainPrompt();
        });
    });
}

function doWhatTheRandomFileSays() {
    console.log("wooo - crazy us - going with the random file?!");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArray = data.split(",");
        
        if (dataArray[0] === "searchSpotify") {
            searchSpotify(dataArray[1], dataArray[2])
        }

    });
}
// TODO - log out each command as it is input into log.txt