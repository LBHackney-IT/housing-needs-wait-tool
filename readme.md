# Housing Needs Wait Tool

Gives residents on the Housing Register a view of how long they might wait to get housing.

## Installation

1\. Run the following in the root directory to install dependencies:

```
$ npm i
```

2\. Add a .env file in the root directory (see .env.sample for file structure).

3\. Set the following in .env (the values can be found in the AWS param store):

```
/hn-single-view-api/production/UHT_DB=
/common/hackney-jwt-secret=
```

## Run the application

```
$ npm run start
```

## Prettier

We recommend installing the Prettier extension in your editor to keep formatting consistent.
