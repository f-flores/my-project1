/* my-financial.js */
const AlphaAPIKEY = "51J2DL5ZC7RQBE6J";
// const AlphaEndPoint = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=";
const AlphaBatch = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=";
const AlphaBatchSuffix = "&apikey=" + AlphaAPIKEY;
// const AlphaTS = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=";
// const AlphaTSSuffix = AlphaBatchSuffix;

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=EPD&apikey=51J2DL5ZC7RQBE6J

// renders stock info
// <!--               <div class="card-body">
// <h5 class="card-title">Special title treatment</h5>
// <p class="card-text" id="financial-text">With supporting text below as a natural lead-in to additional content.</p>
// </div>
//
// --------------------------------------------------------------------------
// renderStockInfo uses the bootstrap 4 'card' functionality to render
// the stocks information
//
function renderStockInfo(data) {
  var stockDiv = $("<div>"),
      cardh5 = $("<h5>").addClass("card-title"),
      cardText = $("<p>").addClass("card-text ticker-paragraph"),
      htmlText;

  // empty out any prior content of #stock-ticker-content
  $("#stock-ticker-content").empty();

  stockDiv.addClass("card-body");
  cardh5.text(data["1. symbol"]);
  cardh5.attr("stock-sym", data["1. symbol"]);
  htmlText = "Price: " + numeral(data["2. price"]).format("$0,0.00") + "<br />";
  htmlText += "Volume: " + data["3. volume"];
  console.log("price: " + numeral(data["2. price"]).format("$0,0.00"));

  cardText.html(htmlText);

  stockDiv.append(cardh5);
  stockDiv.append(cardText);
  $("#stock-ticker-content").append(stockDiv);
}

// renders financial text
// function renderFinancialText(data) {
//  var finDiv = $("<div>");
//  var htmlText;

//  htmlText = "<p>Information: " + data["1. Information"] + "</p>";
//  htmlText += "<p>Symbol: " + data["2. Symbol"] + "</p>";

//  finDiv.append(htmlText);
//  $("#financial-text").append(finDiv);
// }

// --------------------------------------------------------------------------
// buildBatchURL calls the alpha batch function with only one stock symbol
//
function buildBatchURL(sym) {
  var result,
      queryURL;

  console.log("in buildBatchURL()");
  queryURL = AlphaBatch + sym + AlphaBatchSuffix;
  console.log("batch url: " + queryURL);

  $.ajax({
    "method": "GET",
    "url": queryURL
  }).
  done((response) => {
    result = response;
    console.log(result);
    console.log(result["Stock Quotes"][0]);
    renderStockInfo(result["Stock Quotes"][0]);
  }).
  fail(() => {
    console.log("Failure from alpha batch function");
  });
}

// ---------------------------------------------------------------------
// builds watchlist
//
// function buildWatchlist(sym) {
//  var result,

//      queryURL;

//  console.log("in buildWatchlist()");
  // get time-last-refreshed
//  queryURL = AlphaTS + sym + AlphaTSSuffix;
//  console.log("batch url: " + queryURL);

//  $.ajax({
//    "method": "GET",
//    "url": queryURL
//  }).then((response) => {
//    // console.log(response);
//    result = response;
//    console.log(result);
//    console.log(result["Stock Quotes"][0]);
//    renderStockInfo(result["Stock Quotes"][0]);
//  });
// }


// -----------------------------------------------------------------------
// implements "stock-ticker" function
//
$("#stock-ticker").on("click", (event) => {
  var stockSymbol = $("#stock-input").val().
                                      trim();

  console.log("in stock-ticker() ");
  $("#financial-text").empty();

  // clear stock-input field
  $("#stock-input").val("");

  event.preventDefault();
  buildBatchURL(stockSymbol);

});

$("#wlist-button").on("click", (event) => {
 // var stockSymbol = $("#wlist-input").val().
 //                                     trim();

  console.log("in wlist-button() ");
  $("#financial-text").empty();

  event.preventDefault();
  // buildWatchlist(stockSymbol);

});