const simpleAggregator = require('./simpleAggregator')

test('[isInSameBucket] timestamps with DIFFERENT hours are in different buckets', () => {
    const first = new Date();
    first.setHours(4);
    const second = new Date();
    second.setHours(5);

    expect(simpleAggregator.isInSameBucket(first, second)).toBe(false);
});

test('[isInSameBucket] timestamps with the SAME hour are in the same bucket', () => {
    const first = new Date("2021-03-01T10:00:00Z");
    const second = new Date("2021-03-01T10:55:00Z");

    expect(simpleAggregator.isInSameBucket(first, second)).toBe(true);
});

test('[isInSameBucket] timestamps with the SAME hour but DIFFERENT day/month/year are in different bucket', () => {
    expect(simpleAggregator.isInSameBucket(new Date("2021-03-01T10:00:00Z"), new Date("2021-03-07T10:00:00Z"))).toBe(false);
    expect(simpleAggregator.isInSameBucket(new Date("2021-03-01T10:00:00Z"), new Date("2021-04-01T10:00:00Z"))).toBe(false);
    expect(simpleAggregator.isInSameBucket(new Date("2021-03-01T10:00:00Z"), new Date("2013-03-01T10:00:00Z"))).toBe(false);
});

test('[parseDate] parsing date correctly handles millisecond format variations', () => {
    expect(simpleAggregator.parseDate("2021-03-01 00:01:11.055+00").toUTCString()).toBe("Mon, 01 Mar 2021 00:01:11 GMT");
    expect(simpleAggregator.parseDate("2021-03-01 00:03:21.74+00").toUTCString()).toBe("Mon, 01 Mar 2021 00:03:21 GMT");
    expect(simpleAggregator.parseDate("2021-03-01 00:07:40.3+00").toUTCString()).toBe("Mon, 01 Mar 2021 00:07:40 GMT");
    expect(simpleAggregator.parseDate("2021-03-03 21:43:57.241+00").toUTCString()).toBe("Wed, 03 Mar 2021 21:43:57 GMT");
});

test('[parseDate] parsing date correctly handles timezone variations', () => {
    expect(simpleAggregator.parseDate("2021-03-03 21:00:00.000+00").toUTCString()).toBe("Wed, 03 Mar 2021 21:00:00 GMT");
    expect(simpleAggregator.parseDate("2021-03-03 21:00:00.000+01").toUTCString()).toBe("Wed, 03 Mar 2021 20:00:00 GMT");
});

test('[aggregateIntoBuckets] simple aggregation', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T10:05:00Z"),
        new Date("2021-03-01T11:50:00Z"),
        new Date("2021-03-01T12:00:00Z"),
        new Date("2021-03-01T12:59:00Z"),
        new Date("2021-03-01T12:00:00Z"),
        new Date("2021-03-01T13:10:00Z"),
        new Date("2021-03-01T13:00:03Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 10:00:00 GMT bucket -> 2" + "\n" +
        "Mon, 01 Mar 2021 11:00:00 GMT bucket -> 1" + "\n" +
        "Mon, 01 Mar 2021 12:00:00 GMT bucket -> 3" + "\n" +
        "Mon, 01 Mar 2021 13:00:00 GMT bucket -> 2";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});

test('[aggregateIntoBuckets] edge case - no dates', () => {
    expect(simpleAggregator.aggregateIntoBuckets([])).toMatch("No results matching query parameters");
});

test('[aggregateIntoBuckets] edge case - only one date', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T10:00:00Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 10:00:00 GMT bucket -> 1";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});

test('[aggregateIntoBuckets] edge case - several dates, all same hour', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T10:04:00Z"),
        new Date("2021-03-01T10:02:05Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 10:00:00 GMT bucket -> 4";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});

test('[aggregateIntoBuckets] edge case - last bucket only has one date', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T11:02:05Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 10:00:00 GMT bucket -> 3" + "\n" +
        "Mon, 01 Mar 2021 11:00:00 GMT bucket -> 1";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});

test('[aggregateIntoBuckets] edge case - first bucket only has one date', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T10:00:00Z"),
        new Date("2021-03-01T11:00:00Z"),
        new Date("2021-03-01T11:00:00Z"),
        new Date("2021-03-01T11:02:05Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 10:00:00 GMT bucket -> 1" + "\n" +
        "Mon, 01 Mar 2021 11:00:00 GMT bucket -> 3";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});


test('[aggregateIntoBuckets] correctly handles unsorted data', () => {
    const allDatesForCustomer = [
        new Date("2021-03-01T12:00:00Z"),
        new Date("2021-03-01T11:00:00Z"),
        new Date("2021-03-01T23:00:00Z"),
        new Date("2021-03-01T11:02:05Z"),
    ];

    const expectedOutput = "" +
        "Mon, 01 Mar 2021 11:00:00 GMT bucket -> 2" + "\n" +
        "Mon, 01 Mar 2021 12:00:00 GMT bucket -> 1" + "\n" +
        "Mon, 01 Mar 2021 23:00:00 GMT bucket -> 1";

    expect(simpleAggregator.aggregateIntoBuckets(allDatesForCustomer)).toMatch(expectedOutput);
});



