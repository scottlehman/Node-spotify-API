require("dotenv").config();

const fs = require("fs");
const axios = require("axios");
const keys = require('./key.js');
const moment = require('moment');
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

// var spotify = new spotify(key.spotify);

const selector = process.argv[2];
var name = process.argv.slice(3).join(" ");


switch (selector) {
    case 'concert-this':
        bandsInTown();
        break;

    case 'spotify-this-song':
        spotifySong();
        break;
    case 'movie-this':
        movie();
        break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
    default:
        console.log(`Instructions: Use the following commands to search a certain query\n
        Movie: { movie-this }\n
        Spotify a song: { spotify-this-song }\n
        Bands in Town: { concert-this }
        Do what it says: { leave query blank } `)
}

// BANDS IN TOWN
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")
function bandsInTown() {

    if (!name) {
        name = 'Bob Seger';
    }

    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp").then(
        function (response) {
            // console.log(response.data);
            var concertInfo = response.data;

            console.log("---------------------------------------------------------------------------------------");
            console.log(`Here are the upcoming dates for ${name}:\n`);
            for (i = 0; i < concertInfo.length; i++) {
                var concertDate = moment(concertInfo[i].datetime).format("MM/DD/YYYY");
                var venue = concertInfo[i].venue.name;
                var location = concertInfo[i].venue.city + ',' + ' ' + concertInfo[i].venue.region;
                var tourDates = `City: ${location}\nVenue: ${venue}\nDay of Show: ${concertDate}\n\n`;
                console.log(tourDates);

                fs.appendFile("log.txt", tourDates, function (err) {
                    if (err) {
                        console.log(err);
                    }

                });
            }
            console.log("---------------------------------------------------------------------------------------");
            console.log(`Above are the upcoming dates for ${name}`);


        });
};

// SPOTIFY
function spotifySong() {
    if (!name) {
        name = "The Sign";
    }
    spotify
        .search({
            type: "track",
            query: name
        })
        .then(function (response) {
            console.log(`Searching for: ${name}`);
            for (var i = 0; i < 3; i++) {
                var results =
                    `-----------------------------------
                    \nArtists: ${response.tracks.items[i].artists[0].name}
                    \nSong Name: ${response.tracks.items[i].name}
                    \nAlbum Name: ${response.tracks.items[i].album.name}
                    \nLink To Preview: ${response.tracks.items[i].preview_url}`;

                console.log(results);

                fs.appendFile("log.txt", results, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Songs Added!");
                    }

                });
            }
        })
};


// OMDB
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.

function movie() {

    if (!name) {
        name = "Mr Nobody";
    }

    axios.get("https://www.omdbapi.com/?t=" + name + "&apikey=trilogy").then(
        function (response) {
            // console.log(response.data);
            var movieInfo = response.data;
            var display = `\nTitle: ${movieInfo.Title}\nYear: ${movieInfo.Year}\nIMDB Rating: ${movieInfo.imdbRating}\nRotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}\nCountry: ${movieInfo.Country}\nLanguage: ${movieInfo.Language}\nPlot: ${movieInfo.Plot}\nActors: ${movieInfo.Actors}\n`;

            console.log("---------------------------------------------------------------------------------------");
            console.log(display);
            console.log("---------------------------------------------------------------------------------------")

            fs.appendFile("log.txt", display, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Movie Added!");
                }

            });
        }
    );
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            var dataArr = data.split(",");

            if (dataArr[0] === "spotify-this-song") {
                userInput = dataArr[1];
                spotifySong();
            }
        }

    });

};