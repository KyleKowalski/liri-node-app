// grab data from keys and store it into a variable
var keysFile = require('./keys.js')
var inquirer = require('inquirer');
var twitter = require('twitter');
var twitterClient = new twitter(keysFile.twitterKeys);
var Spotify = require('node-spotify-api');
var spotifyClient = new Spotify(keysFile.spotifyKeys);

   
var params = {screen_name: 'KyleKowalski'};

mainPrompt();

function mainPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "\n\n\n=====\nWelcome to Liri-Bot - please make a selection:\n=====",
            choices: ["Twitter", "Spotify", "OMDB", "Quit"],
            name: "mainPromptChoice"
        }
    ]).then(function(response) {
        if (response.mainPromptChoice === 'Twitter') {
            getTwitter();
        }
        else if (response.mainPromptChoice === 'Spotify') {
            getSpotify();
        }
        else if (response.mainPromptChoice === 'OMDB') {
            console.log("I guess we need OMDB now..."); // TODO
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
            message: "Please enter your tweet?",
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
        }
    ]).then(function(response){
        console.log("Spotify Request With : >" + response.spotifyRequest + "<")

        if (response.spotifyRequest === ""){
            response.spotifyRequest = "The Sign" // TODO verify this gives ace of base
            console.log('Since you gave no search term, you get "The Sign" by Ace of Base - enjoy!');
        }

        spotifyClient.search({ type: 'track', query: response.spotifyRequest }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
        console.log(data); 
        });
    });
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
}

//    * `spotify-this-song`
// * This will show the following information about the song in your terminal/bash window

// * Artist(s)

// * The song's name

// * A preview link of the song from Spotify

// * The album that the song is from

// * If no song is provided then your program will default to "The Sign" by Ace of Base.
//    * `movie-this`

//    * `do-what-it-says`

// TODO - log out each command as it is input into log.txt