// Keys for Twiter and Spotify - these will be redacted later.  
var keysFile = require('./keys.js')
// General use - cleaner user input
var inquirer = require('inquirer');
// Twitter
var params = {screen_name: 'KyleKowalski'};
var twitter = require('twitter');
var twitterClient = new twitter(keysFile.twitterKeys);
// Spotify
var Spotify = require('node-spotify-api');
var spotifyClient = new Spotify(keysFile.spotifyKeys);
// OMDB (uses a general item, not a specific one for OMDB)
var request = require("request") 
// File system interaction
var fs = require("fs");

logThis("\n\n=====\nStarting new session\n=====\n");

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
            logThis("Main prompt selection:  Twitter\n");
            getTwitter();
        }
        else if (response.mainPromptChoice === 'Spotify') {
            logThis("Main prompt selection:  Spotify\n");
            getSpotify();
        }
        else if (response.mainPromptChoice === 'OMDB') {
            logThis("Main prompt selection:  OMDB\n");
            getOMDB();
        }
        else if (response.mainPromptChoice === 'Do What The Random File Says') {
            logThis("Main prompt selection:  Random File ooooOOOoooohhh\n");
            doWhatTheRandomFileSays();
        }
        else if (response.mainPromptChoice === 'Quit') {
            logThis("Main prompt selection:  Quit\n");
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
    logThis("Selected create new Tweet.\n");
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter your tweet:",
            name: "tweetText"
        }
    ]).then(function(response){
        if (response.tweetText === "") {
            logThis("Tweet was empty - returned user to main menu\n");
            console.log("Unable to create empty tweets - returning you to twitter main menu");
            getTwitter();
            return;
        }

        twitterClient.post('statuses/update', {status: response.tweetText},  function(error, tweet, response) {
            if(error) throw error;
            logThis("New Tweet created with text: '" + response.tweetText + "'\n")
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
            logThis("After listing Twitter chose main menu.\n");
            mainPrompt();
        }
        else if (response.mainPromptChoice === 'New Tweet') {
            logThis("After listing Twitter chose to create new Tweet.\n")
            createTweet();
        }
        else if (response.mainPromptChoice === 'Quit') {
            logThis("After listing Twitter chose quit.\n")
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
            logThis("Spotify requested song was empty - using default song.\n")
            response.spotifyRequest = "All That She Wants" // TODO verify this gives ace of base
            console.log('Since you gave no search term, you get "All That She Wants" by Ace of Base - enjoy!');
        }
        if (response.numberOfResults === "") {
            logThis("Spotify requested number of results was empty - using default number of results.\n")
            response.numberOfResults = 1
            console.log('Since you entered no number of results we are defaulting to 1.')
        }
        logThis("Spotify listing for '" + response.spotifyRequest + "' using number of results '" + response.numberOfResults + "'.\n")
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
    logThis("Finished Spotify search returning user to main menu.\n")
    mainPrompt();
    });
}

function quit() {
    logThis("Shutting down.\n")
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
            logThis("OMDB movie request was empty - using default.\n")
            response.movieRequest = "Mr Nobody"
            console.log('Since you gave no search term, you get "Mr Nobody" - enjoy!');
        }
        
        logThis("OMDB requested movie is: '" + response.movieRequest + "'\n")
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
          logThis("Completed OMDB movie request, returning user to main menu.\n")
          mainPrompt();
        });
    });
}

function doWhatTheRandomFileSays() {
    console.log("wooo - crazy you - going with the random file?!");
    logThis("Random File!  OoooOooOOOOoohhhh - it's nothing too fancy.\n")
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArray = data.split(",");
        
        if (dataArray[0] === "searchSpotify") {
            [dataArray[0]](dataArray[1], dataArray[2]);
        }
    });
}

function logThis(optionChosenOrValueEntered) {
    var now = new Date();
    fs.appendFile('log.txt', now + ": " + optionChosenOrValueEntered, function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
  });
}