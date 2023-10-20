# Fetch Frontend Takehome Exercise - XanGrab

a simple client-side API frontend for the take-home test for Fetch

## View Deployment At

[fetch-frontend-takehome](https://xangrab.github.io/fetch-frontend-takehome/)

## General Requirements

You first should have users enter their name and email on a login screen. Then, you should use this information to hit our login endpoint to authenticate with our service (see API Reference below).

Once a user is successfully authenticated, they should be brought to a search page where they can browse available dogs. This page must meet the following requirements:

- [x] Users must be able to filter by breed
- [x] Results should be paginated
- [x] Results should be sorted alphabetically by breed by default. 
- [x] All fields of the Dog object (except for id) must be presented in some form
- [ ] Users should be able to modify this sort to be ascending or descending (Issues with API, couldn't find appropriate value for `sort` tried `field:[asc]`, `[asc]`, and `asc`)

- [x] Users should be able to select their favorite dogs from the search results. When finished searching, they should be able to generate a match based on dogs added to the favorites list.
- [x] A single match will be generated by sending all favorited dog IDs to the `/dogs/match` endpoint. You should display this match however you see fit.

As for everything else, you have free rein, so get creative! We strongly encourage you to go beyond the minimum requirements to build something that showcases your strengths.

You may find it helpful to make use of a component library.

### Additional Requirements

- [x] Your app should be hosted on the internet where it can be visited and interacted with
- [x] Your source code should be stored in a git repository and hosted on the internet (i.e. GitHub)
- [x] You should include any necessary documentation to run your site locally

An engineer will review the code you submit. You will be evaluated based on:

* Code Quality
* Use of Best Practices
* Fulfillment of minimum requirements
* Site Usability/UX

## API Reference

We provide our own backend to facilitate searching/fetching dog info. The base URL is https://frontend-take-home-service.fetch.com.

### Data Model

Here is the Typescript interface for the Dog objects returned by our API:

```
interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}
```

We also provide endpoints for fetching location data, which should be useful if you’d like to implement filtering dogs by location. Here is the Typescript interface for the Location objects returned by our API:

```
interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

interface Coordinates {
    lat: number;
    lon: number;
}
```

### Authentication

You will need to hit the login endpoint in order to access other endpoints. A successful request to the login endpoint will return an auth cookie included in the set-cookie response header. It’s an `HttpOnly` cookie, so you will not be able to access this value from any Javascript code (nor should you need to). Your browser will automatically send this cookie with all successive credentialed requests to the API. Note that you will need to pass a config option in order to send credentials (cookies) with each request. Some documentation to help you with this:

* Including credentials with fetch (set credentials: 'include' in request config)
* Including credentials with axios (set withCredentials: true in request config)

Postman will do this for you automatically.

### POST /auth/login
Body Parameters

* `name` - the user’s name
* `email` - the user’s email

Example

```
// API Request Function
body: {
    name: string,
    email: string
}
```

Response

200 OK

An auth cookie, fetch-access-token, will be included in the response headers. This will expire in 1 hour.

### POST /auth/logout

Hit this endpoint to end a user’s session. This will invalidate the auth cookie.

### GET /dogs/breeds
Return Value

Returns an array of all possible breed names.

### GET /dogs/search
Query Parameters

The following query parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all dogs.

* `breeds` - an array of breeds
* `zipCodes` - an array of zip codes
* `ageMin` - a minimum age
* `ageMax` - a maximum age

Additionally, the following query parameters can be used to configure the search:

* `size` - the number of results to return; defaults to 25 if omitted
* `from` - a cursor to be used when paginating results (optional)
* `sort` - the field by which to sort results, and the direction of the sort; in the format sort=field:[asc|desc]

Return Value

Returns an object with the following properties:

* `resultIds` - an array of dog IDs matching your query
* `total` - the total number of results for the query (not just the current page)
* `next` - a query to request the next page of results (if one exists)
* `prev` - a query to request the previous page of results (if one exists)

The maximum total number of dogs that will be matched by a single query is 10,000.

### POST /dogs
Body Parameters

The body should be an array of no more than 100 dog IDs to fetch (no pun intended).

```
// API Request Function
body: string[]
```

Return Value

Returns an array of dog objects

### POST /dogs/match
Body Parameters

The body of this request should be an array of dog IDs.

Example

```
// API Request Function
body: string[]
```

Return Value

This endpoint will select a single ID from the provided list of dog IDs. This ID represents the dog the user has been matched with for adoption.

```
interface Match {
    match: string
}
```

### POST /locations
Body Parameters

The body of this request should be an array of no more than 100 ZIP codes.

Example

```
// API Request Function
body: string[]
```

Return Value

Returns an array of Location objects.

### POST /locations/search
Body Parameters

The following body parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all locations.

* `city` - the full or partial name of a city
* `states` - an array of two-letter state/territory abbreviations
* `geoBoundingBox` - an object defining a geographic bounding box:
This object must contain one of the following combinations of properties:
    * top, left, bottom, right
    * bottom_left, top_right
    * bottom_right, top_left
    Each property should have the following data:
        * lat - latitude
        * lon - longitude

Additionally, the following body parameters can be used to configure the search:

* `size` - the number of results to return; defaults to 25 if omitted
* `from` - a cursor to be used when paginating results (optional)

The maximum total number of ZIP codes that will be matched by a single query is 10,000.

Example

```
// API Request Function
body: {
    city?: string,
    states?: string[],
    geoBoundingBox?: {
        top?: Coordinates,
        left?: Coordinates,
        bottom?: Coordinates,
        right?: Coordinates,
        bottom_left?: Coordinates,
        top_left?: Coordinates
    },
    size?: number,
    from?: number
}
```

Return Value

Returns an object with the following properties:

* `results` - an array of Location objects
* `total` - the total number of results for the query (not just the current page)

```
{
    results: Location[],
    total: number
}
```
