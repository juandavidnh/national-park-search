'use strict';

const apiKey = 'p1h0nwEOJjuM36l0mFOmTajPJSBZSQiYkheg9WC4';

const baseURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getNationalParks(query, maxResults=10){
    const params={
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,
    };
    const queryString = formatQueryParams(params);
    console.log(queryString);
    const url = baseURL + '?' + queryString;
    console.log(url);
    
    fetchURL(url);
}

function fetchURL(url){
    fetch(url)
    .then(response => {
        console.log(response);
        if(response.ok){
           return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        if(responseJson.data.length===0){
            throw new Error('Incorrect Input');
        }
        displayResults(responseJson)
    })
    .catch(err => {
        $('#js-search-error').text(`Something went wrong: ${err.message}`);
    }); 
}

function displayResults(responseJson){
    console.log(responseJson);
    
    $('#results-list').empty();
    $('#js-search-error').text("");
  

    for(let i=0; i<responseJson.data.length; i++){
        $('#results-list').append(`
        <li>
            <p class="park-name">${responseJson.data[i].fullName}</p>
            <p>${responseJson.data[i].description}</p>
            <p><a href="${responseJson.data[i].url}" target="_blank">Go to Website</a></p>
        </li>`);
    }

    $('#results').removeClass('hidden');
    
    
}

function watchForm(){
    $('form').submit(event =>{
        event.preventDefault();
        console.log('form submitted');
        const nationalPark = $('#search-terms').val();
        console.log(nationalPark);
        const maxResults = $('#max-results').val();
        console.log(maxResults);
        if(maxResults<=50 && maxResults>=1){
         getNationalParks(nationalPark, maxResults);
        }else{
            throw alert('Input a number between 1 and 50');
        }
    } )
   
}

$(watchForm);