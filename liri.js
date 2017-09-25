// grab data from keys and store it into a variable

var inquirer = require('inquirer');
var twitter = require('twitter');

mainPrompt();

function mainPrompt() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "\n\n\n=====\nWelcome to Liri-Bot - please make a selection:\n=====",
                choices: ["Twitter", "Spotify", "OMDB"],
                name: "mainPromptChoice"
            }
        ]).then(function(response) {
            if (response.mainPromptChoice === 'Twitter') {
                console.log("I guess we need twitter now...");
                getTwitter();
            }
            else if (response.mainPromptChoice === 'Spotify') {
                console.log("I guess we need spotify now");
            }
            else if (response.mainPromptChoice === 'OMDB') {
                console.log("I guess we need OMDB now...");
            }
            else {
                console.log("We've escaped the main prompt choice somehow - log an error")
            }
        })
}

function getTwitter() {
    console.log("annnd we have twitter... what to do with it?");
    var client = new twitter({
        consumer_key: 'XpwYmcM6kmT4wDRaK7bHzkzkf',
        consumer_secret: 'fbNgKAwUke33mWbC9AEk9NZ823WMpXkVqNqVVHeWcOXGFV35ja',
        access_token_key: '80392403-Rhy2uiDhmuq2Rz5NQ4E9wEM5KV9jGSAFTh0AOFrCx',
        access_token_secret: 'VEZKh2UhfH4mSdYnB9QNAlwPEQwYUcnCfFEq56uSw8GfF'
      });
       
      var params = {screen_name: 'KyleKowalski'};
      client.get('statuses/user_timeline', params, function(error, tweetsArray, response) {
        if (!error) {
            console.log("List of tweets in descending order:");
            var tweetCount = 1;
            tweetsArray.forEach(function (tweet){
                console.log(tweetCount + ". (" + tweet.created_at + ") : " + tweet.text);
                tweetCount++;
            });
        }
      });
}
// TODO create these:
//    * `my-tweets`

// function my-tweets () {
    // TODO use the 'request' npm package (it does the ajax stuffs)

// }
// * This will show your last 20 tweets and when they were created at in your terminal/bash window.

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