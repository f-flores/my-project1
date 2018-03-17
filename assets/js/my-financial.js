/* my-financial.js */
const AlphaAPIKEY = "51J2DL5ZC7RQBE6J";
const AlphaEndPoint = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=";
const AlphaBatch = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=";
const AlphaBatchSuffix = "&apikey=" + AlphaAPIKEY;
const AlphaTS = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=";
const AlphaTSSuffix= AlphaBatchSuffix;

var alphaQueryURL;

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=EPD&apikey=51J2DL5ZC7RQBE6J

// renders stock info
function renderStockInfo(data) {
  var stockDiv = $("<div>");
  var htmlText;

  htmlText = "<p>Symbol: " + data["1. symbol"] + "</p>";
  htmlText += "<p>Price: " + data["2. price"] + "</p>";
  htmlText += "<p>Volume: " + data["3. volume"] + "</p>";

  stockDiv.append(htmlText);
  $("#financial-text").append(stockDiv);
}

// renders financial text
function renderFinancialText(data) {
  var finDiv = $("<div>");
  var htmlText;

  htmlText = "<p>Information: " + data["1. Information"] + "</p>";
  htmlText += "<p>Symbol: " + data["2. Symbol"] + "</p>";

  finDiv.append(htmlText);
  $("#financial-text").append(finDiv);
}

function buildBatchURL(sym) {
  var result,
      queryURL;

  console.log("in buildBatchURL()");
  queryURL = AlphaBatch + sym + AlphaBatchSuffix;
  console.log("batch url: " + queryURL);

  $.ajax({
    "method": "GET",
    "url": queryURL
  }).then((response) => {
    // console.log(response);
    result = response;
    console.log(result);
    console.log(result["Stock Quotes"][0]);
    renderStockInfo(result["Stock Quotes"][0]);
  });
}

//---------------------------------------------------------------------
// builds watchlist
//
function buildWlist(sym) {
  var result,
      queryURL;

  console.log("in buildWlist()");
  // get time-last-refreshed
  queryURL = AlphaTS + sym + AlphaTSSuffix;
  console.log("batch url: " + queryURL);

  $.ajax({
    "method": "GET",
    "url": queryURL
  }).then((response) => {
    // console.log(response);
    result = response;
    console.log(result);
    console.log(result["Stock Quotes"][0]);
    renderStockInfo(result["Stock Quotes"][0]);
  });
}


function buildQueryURL() {
  var result;

  alphaQueryURL = AlphaEndPoint + AlphaAPIKEY;

  $.ajax({
    "method": "GET",
    "url": alphaQueryURL
  }).then((response) => {
    // console.log(response);
    result = response;
    console.log(result);
    console.log(result['Meta Data']);
    renderFinancialText(result['Meta Data']);
  });
}

// .on("click") function associated with the find-stock button
$("#find-stock").on("click", (event) => {
  // build the query URL for the ajax request to the Alpha API
  var queryURL = buildQueryURL();

  event.preventDefault();

  // empty the region associated with the articles
  $("#financial-text").empty();

});

$("#stock-ticker").on("click", (event) => {
  var stockSymbol = $("#stock-input").val().
                                      trim();

  console.log("in stock-ticker() ");
  $("#financial-text").empty();

  event.preventDefault();
  buildBatchURL(stockSymbol);

});

$("#wlist-button").on("click", (event) => {
  var stockSymbol = $("#wlist-input").val().
                                      trim();

  console.log("in wlist-button() ");
  $("#financial-text").empty();

  event.preventDefault();
  // buildWlist(stockSymbol);

});