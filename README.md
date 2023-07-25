
# Simple Aggregator

## Project Setup

```sh
// clone repo
cd simple-aggregator 
npm install
```

Run server
```sh
npm run dev
```

Manually test server

From command line:
```sh
curl -X GET "http://localhost:8000?customerId=1abb42414607955dbf6088b99f837d8f&startDate=2021-03-01T10:00:00Z&endDate=2021-03-02T12:00:00Z" 

```
From browser:
http://localhost:8000?customerId=1abb42414607955dbf6088b99f837d8f&startDate=2021-03-01T10:00:00Z&endDate=2021-03-02T12:00:00Z


Run tests
```sh
npm run test
```



### Initial task instructions:

Attached, find the file `events.csv`, which contains a log of events with the
the format customer\_id, event\_type, transaction\_id, timestamp.

Your task is to write a program that answers the following question:

> How many events did customer X send in the one hour buckets between arbitrary timestamps A and B?

So, for example, let's say you have the following usage events (this is just example data -- see the csv file for test data):

- 2022-03-01T03:01:00Z event_1 customer_id_1
- 2022-03-01T04:29:00Z event_2 customer_id_1
- 2022-03-01T04:15:00Z event_3 customer_id_1
- 2022-03-01T05:08:00Z event_4 customer_id_1

If you requested counts for customer_id_1 with start and end timestamps of Mar 1, 2022 at 3:00 am - Mar 1, 2022 at 6:00 am, we’d expect to see these hourly counts (the format of the output is up to you):
- 2022-03-01T03:00:00Z bucket -> 1
- 2022-03-01T04:00:00Z bucket -> 2
- 2022-03-01T05:00:00Z bucket -> 1

As with any software engineering task, there are edge cases and tradeoffs in this program. There may be multiple "right" ways to handle edge cases. From our general perspective, or the perspective of your "users," we primarily care that the program returns accurate timestamp buckets with correct counts. If you find yourself wondering "should I do it this way, or that way?" we recommend thinking through the tradeoffs, making a choice, and documenting your reasoning in your README.

Choice of language, platform, and libraries is left up to you, as long as the
person evaluating your submission doesn't have to think too hard to figure out
how to run it. We all use recent macOS.

We expect this exercise to take 1-3 hours.

*Bonus:* Include an HTTP service that answers the same question, and/or a complete suite of unit tests for the counting function.