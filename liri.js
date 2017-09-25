// grab data from keys and store it into a variable

var inquirer = require('inquirer');
var twitter = require('twitter');

var client = new twitter({
    consumer_key: 'XpwYmcM6kmT4wDRaK7bHzkzkf',
    consumer_secret: 'fbNgKAwUke33mWbC9AEk9NZ823WMpXkVqNqVVHeWcOXGFV35ja',
    access_token_key: '80392403-Rhy2uiDhmuq2Rz5NQ4E9wEM5KV9jGSAFTh0AOFrCx',
    access_token_secret: 'VEZKh2UhfH4mSdYnB9QNAlwPEQwYUcnCfFEq56uSw8GfF'
  });
   
  var params = {screen_name: 'KyleKowalski'};

mainPrompt();

function mainPrompt() {
    inquirer
        .prompt([
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
                console.log("I guess we need spotify now"); // TODO
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
      client.get('statuses/user_timeline', params, function(error, tweetArray, response) {
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
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter your tweet?",
                name: "tweetText"
            }
        ])
        .then(function(response){
            console.log("creating tweet wtih text: >" + response.tweetText + "<")

            client.post('statuses/update', {status: response.tweetText},  function(error, tweet, response) {
                if(error) throw error;
                // console.log(tweet);  // Tweet body. 
                // console.log(response);  // Raw response object. 
                getTwitter();
              });
        });
}

function promptForNewTweet() {
    var textForTweet = ""
    inquirer
        .prompt([
        {
            type: "input",
            message: "Please enter your tweet?",
            name: "tweetText"
        }
        ])
        .then(function(response){
            textForTweet = response.tweetText
        });
    return textForTweet;
}

function afterTwitterPrompt() {
    inquirer
        .prompt([
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
        })
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