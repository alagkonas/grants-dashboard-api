## Grants Dashboard API

A GraphQL API built with [NestJS](https://github.com/nestjs/nest). This API follows a schema-first approach using
GraphQL.

## Tech Stack

- NestJS
- GraphQL
- TypeScript
- Apollo Server

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (optional)

First, install the necessary dependencies using `npm install` and then run the development server either using
`npm run dev`
or with Docker using `npm run docker:build` followed by `npm run docker:up`.

The API will be available at `http://localhost:8000/graphql`

## Application and Implementation Breakdown

- The implementation closely follows the provided `graphql schemas` in the `schema-first` approach.
- The application uses mock data instead of a database implementation.
- For match entries, based on the schemas and my understanding of the provided PDF file, matches are not deleted/removed
  after creating a new application due to the `one-to-many` relationship between `Matches` and `Applications`.