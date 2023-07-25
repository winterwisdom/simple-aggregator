const http = require("http");
const url = require("url");
const fs = require("fs");
const csv = require("csv-parser");
const simpleAggregator = require('./simpleAggregator');

/*
curl -X GET "http://localhost:8000?customerId=1abb42414607955dbf6088b99f837d8f&startDate=2021-03-01T10:00:00Z&endDate=2021-03-02T12:00:00Z" 
*/

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {

  var params = url.parse(req.url, true).query;
  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);
  const customerId = params.customerId;

  if(!customerId || isNaN(startDate) || isNaN(endDate)) {
    res.writeHead(400); // BAD REQUEST
    res.end("Error: malformed input");
  }

  const filepath = "./events.csv";
  const allDatesForCustomer = [];

  fs.createReadStream(filepath)
    .on('error', () => {
      res.writeHead(500); // Internal Server Error
      res.end("Error occured while processing events");
    })
    .pipe(csv({ headers: false }))
    .on('data', (row) => {
      // filter by customerID
      if(customerId === row[0]) {
        const date = simpleAggregator.parseDate(row[3]);
        // filter by within start/end date
        if(date.getTime() >= startDate.getTime() && date.getTime() < endDate.getTime()) {
          allDatesForCustomer.push(date);
        }
      }
    })
    .on('end', () => {
      const output = simpleAggregator.aggregateIntoBuckets(allDatesForCustomer);
      res.writeHead(200);
      res.end(output);
    })
};


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});