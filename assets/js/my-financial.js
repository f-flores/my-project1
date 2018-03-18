/* my-financial.js */
// **************************************************************************
// GLOBALS
//
// **************************************************************************
// CONSTANTS
const AlphaAPIKEY = "51J2DL5ZC7RQBE6J";
// const AlphaEndPoint = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=";
const AlphaBatch = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=";
const AlphaBatchSuffix = "&apikey=" + AlphaAPIKEY;
// const AlphaTS = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=";
// const AlphaTSSuffix = AlphaBatchSuffix;

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&outputsize=full&apikey=demo
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=EPD&apikey=51J2DL5ZC7RQBE6J
// VARIABLES
  // Initialize Firebase
  var config = {
    "apiKey": "AIzaSyBAFhIsrnS798a2VSRGcvbuzSb-woD6z6E",
    "authDomain": "stocks-info-36826.firebaseapp.com",
    "databaseURL": "https://stocks-info-36826.firebaseio.com",
    "projectId": "stocks-info-36826",
    "storageBucket": "stocks-info-36826.appspot.com",
    "messagingSenderId": "799807828291"
  };

  var database;
  var currentWatchRow = {
    "symbol": "",
    "currentPrice": 0,
    "change": 0,
    "pctChange": 0
  };

  firebase.initializeApp(config);

  database = firebase.database();

$(document).ready(() => {
  // -----------------------------------------------------------------------------------------
  // initialize database parent objects
  function initdb() {
    console.log("in initdb()");
    //
  }


  // --------------------------------------------------------------------------
  // buildWatchBtn uses adds watch button
  // the stocks information
  function buildWatchBtn(stockSym) {
    var watchBtn = $("<button>");

    watchBtn.addClass("ml-2 btn btn-success btn-sm watch-button").
            attr("stock-id", stockSym).
            html("Add to &#x2605;");

    return watchBtn;
  }

  // --------------------------------------------------------------------------
  // renderWatchTable adds the current price
  //
  function renderWatchTable(sym) {
    var tRow = $("<tr>"),
        tCellSym = $("<td>"),
        tCellPrice = $("<td>"),
        dbPath = "watchlist/" + sym,
        cprice,
        dbVal;

    // ref
    database.ref(dbPath).once("value").
      then((snapshot) => {
        dbVal = snapshot.val();
        console.log("dbVal: " + JSON.stringify(dbVal));
        console.log(dbVal.stockPrice);
    });
   // console.log(dbVal.change, dbVal.pctChange, dbVal.stockPrice);

    // console.log("in renderWatchTable: " + cprice);
    // console.log("converted price: " + numeral(cprice).format("$0,0.00"));
    tCellSym.text(sym);
    tCellPrice.html(numeral(cprice).format("$0,0.00"));
    tRow.attr("stock-sym", sym).
         attr("id", sym);
    tRow.append(tCellSym, tCellPrice);
    $("#watch-table").append(tRow);
  }

  // --------------------------------------------------------------------------
  // addToWatchDb adds symbol and price to the database, symbol is the parent
  // and price is the child
  //
  function addToWatchDb(sym, price) {
    var dbPath = "watchlist/" + sym;

    database.ref(dbPath).set({
      "stockPrice": price,
      "change": 0,
      "pctChange": 0
     // "dateAdded": firebase.database.ServerValue.TIMESTAMP
    });
  }

  // --------------------------------------------------------------------------
  // renderStockInfo uses the bootstrap 4 'card' functionality to render
  // the stocks information
  //
  function renderStockInfo(data) {
    var stockDiv = $("<div>").addClass("card-body").
                              attr("id","stock-info"),
        cardh5 = $("<h5>").addClass("card-title"),
        cardBody = $("<p>").addClass("card-text ticker-paragraph"),
        addToWatchBtn = buildWatchBtn(data["1. symbol"]),
        htmlText;

    // empty out any prior content of #stock-ticker-content
    $("#stock-ticker-content").empty();

    cardh5.text(data["1. symbol"]).
           attr("stock-sym", data["1. symbol"]);
    htmlText = "Price: " + numeral(data["2. price"]).format("$0,0.00") + "<br />";
    htmlText += "Volume: " + data["3. volume"];

    cardBody.html(htmlText).
            append(addToWatchBtn);

    stockDiv.append(cardh5, cardBody);
    $("#stock-ticker-content").append(stockDiv);
  }


  // --------------------------------------------------------------------------
  // buildBatchURL calls the alpha batch function with only one stock symbol
  //
  function buildBatchURL(sym, fn) {
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
      if (result["Stock Quotes"].length === 0) {
        console.log("Stock does not exist");
      } else {
        switch (fn) {
          case "ticker":
            renderStockInfo(result["Stock Quotes"][0]);
            break;
          case "watch":
            console.log("coming from watchlist");
            console.log("Price: " + numeral(result["Stock Quotes"][0]["2. price"]).format("$0,0.00"));
            currentWatchRow.symbol = sym;
            currentWatchRow.currentPrice = result["Stock Quotes"][0]["2. price"];
            addToWatchDb(sym, result["Stock Quotes"][0]["2. price"]);
            break;
            // renderWatchTable(result["Stock Quotes"][0]);
          default:
            break;
        }
      }
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
    buildBatchURL(stockSymbol, "ticker");

  });

  $("#wlist-button").on("click", (event) => {
  // var stockSymbol = $("#wlist-input").val().
  //                                     trim();

    console.log("in wlist-button() ");
    $("#financial-text").empty();

    event.preventDefault();
    // buildWatchlist(stockSymbol);

  });

  // -----------------------------------------------------------------------
  // addToWatchList adds selected stock to watch list
  //
  function addToWatchList() {
    var stockSymbol = $(this).attr("stock-id");

      console.log("in addToWatchList() ");
      console.log("stock symbol: " + stockSymbol);
      // $("#financial-text").empty();
      // get current price of stock symbol
      buildBatchURL(stockSymbol, "watch");

      // get yesterday's close price of stock symbol


      // calculate change

      // calculate percentage change

      // add row to watchListTable
      renderWatchTable(stockSymbol);

      // event.preventDefault();
      // buildWatchlist(stockSymbol);

  }

  initdb();

  // displays the selected topic's giphy images
  $(document).on("click", ".watch-button", addToWatchList);
// End of document.ready()
});