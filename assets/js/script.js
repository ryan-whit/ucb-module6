var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');

// API Key for Open Weather
const API_KEY = "347059e906e71d3d1ebe2a9789b9b79e";

// Open Weather Base API URL
const OPEN_WEATHER_API = "https://api.openweathermap.org/data/2.5/onecall";

const GeocodeAPIs = {
	CityStateCountry: "http://api.openweathermap.org/geo/1.0/direct", // Direct API
	Zip: "http://api.openweathermap.org/geo/1.0/zip",
}
const GeocodeType = {
	CityStateCountry: "CityStateCountry",  // Uses the Direct API
	Zip: "Zip",  // Uses the Zip API
}

// Determine if the user provided a Zip code or city, state, country format
function parseUserInput(query) {
	var parsed = parseInt(query);
	var geocodeInput
	
	if (isNaN(parsed)) {
		
		var directFields = query.split(',');
		var city = directFields[0];
		
		var state
		if (directFields.length > 1) {
			state = directFields[1];
		}
		else {
			state = "";
		};
		
		var country
		if (directFields.length > 2) {
			country = directFields[2];
		}
		else {
			country = "";
		};

		geocodeInput = {
			type: GeocodeType.CityStateCountry,
			city: city,
			state: state,
			country: country,
		};
	}
	else {
		geocodeInput = {
			type: GeocodeType.Zip,
			zip: parsed,
		};
	};

	return geocodeInput;
}

// Zip API Call for geocode
// https://openweathermap.org/api/geocoding-api#direct_zip
function getLatLonFromZip(queryUrl) {
	fetch(queryUrl)
	  .then(function (response) {
		if (!response.ok) {
		  throw response.json();
		}
		return response.json();
	  })
	  .then(function (locRes) {
			console.log(locRes);

			// TODO: handle empty response
			var latLonResults = {
			lattitude: locRes.lat,
			longitude: locRes.long,
		}
		return latLonResults;
  
	  })
	  .catch(function (error) {
			console.error(error);
	  });

}

// Direct API Call for geocode
// https://openweathermap.org/api/geocoding-api#direct_name
function getLatLonFromCityStateCountry(queryUrl) {
	fetch(queryUrl)
	  
		.then(function (response) {
		if (!response.ok) {
		  throw response.json();
		}
		return response.json();
	  })
	  
		.then(function (locRes) {
			console.log(locRes);

		if (!locRes.length) {
		  console.log('No results found!');
			throw locRes 
		} else {
			var latLonResults = {
				lattitude: locRes[0].lat,
				longitude: locRes[0].long,
			}
			return latLonResults;
		}
	  })
	  
		.catch(function (error) {
		console.error(error);
	  });

}


// Use Geocode API to get lat/lon for the data request
function getLatLonFromGeocodeApi(query) {
  
	// Construct the query URL based on the user input style/type
	var geocodeInput = parseUserInput(query);
	var locQueryUrl
	var latLonResults
	if (geocodeInput.type === GeocodeType.Zip) {
		locQueryUrl = GeocodeAPIs.Zip + '?zip=' + geocodeInput.zip.toString() + '&appid=' + API_KEY;
		var latLonResults = getLatLonFromZip(locQueryUrl)
	}
	else {
		locQueryUrl = GeocodeAPIs.CityStateCountry + '?q=' + query + '&limit=1' + '&appid=' + API_KEY;
		var latLonResults = getLatLonFromCityStateCountry(locQueryUrl)
	};

	resultContentEl.textContent = "Lat: " + latLonResults.lattitude.toString() + ". Lon: " + latLonResults.longitude.toString()

	return latLonResults;
	
}


function searchApi(query) {
  
	var locQueryUrl = OPEN_WEATHER_API + '?q=' + query + '&limit=1' + '&appid=' + API_KEY;
  
	fetch(locQueryUrl)
	  .then(function (response) {
		if (!response.ok) {
		  throw response.json();
		}
  
		return response.json();
	  })
	  .then(function (locRes) {
		// write query to page so user knows what they are viewing
		// resultTextEl.textContent = locRes.search.query;
  
		console.log(locRes);
  
		// if (!locRes.results.length) {
		//   console.log('No results found!');
		//   resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
		// } else {
		//   resultContentEl.textContent = '';
		//   for (var i = 0; i < locRes.results.length; i++) {
		//     printResults(locRes.results[i]);
		//   }
		// }
	  })
	  .catch(function (error) {
			console.error(error);
	  });
  }



function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  //   var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
		throw 'You need a search input value!';
  }

  console.log("searchInputVal: ", searchInputVal);

  var latLonResponse = getLatLonFromGeocodeApi(searchInputVal);
//   searchApi(searchInputVal);

}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
