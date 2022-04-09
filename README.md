# App Quiz

This program is based on Angular 13, Typescript 4 and mainly bootstrap.

## Homepage

https://myquizapp.tiiny.site/

Navigate to "Instructions" for the quiz game instructions.

## Prerequisites

- [Node JS](https://www.nodejs.org/) version: 12.20.2+ OR 14.15.5+ OR 16.10.0+
## Running Locally

Install Angular client globally `npm install -g @angular/cli` (optional)

Run `npm install`

Run `npm run start-dev` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build --configuration=env` to build the project. The build artifacts will be stored in the `dist/` directory.

## Adding Google Image Search API

In order to use the [Google Image Search API](https://developers.google.com/custom-search/v1/overview) it is required to enter your own API credentials to the Angular [environment](/src/environments/).

The environment variables that are needed can be viewed here [environment.ts](/src/environments/environment.ts)

The app caches images links queried by the API into the browser's [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in order to reduce the number of API calls (also due to Rate Limitations)

## Quiz Storage

The application data longevity is based on the browsers [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) such as: 

- Latest player name
- Leaderboards Table
- Sidebar State
- Google Images Search API queries links (as mentioned earlier)
