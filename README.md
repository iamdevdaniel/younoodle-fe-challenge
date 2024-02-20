# younooodle-fe-challenge

## Project Overview

This project is a web application that matches investors with startups. The application uses IndexedDB, a low-level API included in the browser's Web API. The presentation layer is built with React.

## Data Structure

The application uses two tables in IndexedDB:

- `investors`: Stores investor data with the following fields:
  - `id`: The unique identifier for the investor.
  - `name`: The name of the investor.
  - `industry`: The industry the investor is interested in.

- `startups`: Stores startup data with the following fields:
  - `id`: The unique identifier for the startup.
  - `name`: The name of the startup.
  - `industry`: The industry the startup operates in.
  - `investorId`: The id of the investor matched with the startup.
  - `status`: The status of the startup.

## Application Architecture

The application is divided into three layers:

1. **Data Access Layer:** This layer provides methods to interact with IndexedDB. It is responsible for all direct data operations like CRUD operations.

2. **Service Layer:** This layer contains the business logic of the application. It knows what data to request from the Data Access Layer and how to shape this data for the Presentation Layer.

3. **Presentation Layer:** This layer is built with React and is responsible for presenting the data assembled by the Service Layer. It contains all the UI components of the application.

## Functionality

### Initialization

- The application begins by loading data from two CSV files (representing startups and investors) located in the public folder, where static assets are stored. The data is loaded into two tables in IndexedDB: `investors` and `startups`.

- Once the data loading is complete, a flag is set in a separate `flags` table in IndexedDB to indicate that both CSV files have been loaded. This is done to optimize CPU usage.

- The application then matches startups with investors. Each investor is assigned 10 unique startups that align with their industry. The industries considered are named `bio`, `environment`, and `internet`. The matching is represented in the `startups` table with the addition of an `investorId` field.

Here is a visual representation of the industries:

<table>
  <tr>
    <th style="text-align:center;">any</th>
    <th style="text-align:center;">bio</th>
    <th style="text-align:center;">internet</th>
    <th style="text-align:center;">environment</th>
  </tr>
  <tr>
    <td style="width:200px; text-align:center;"><img src="./public/assets/any-industry.svg" alt="any-image" width="32"/></td>
    <td style="width:200px; text-align:center;"><img src="./public/assets/bio-industry.svg" alt="bio-image" width="32"/></td>
    <td style="width:200px; text-align:center;"><img src="./public/assets/internet-industry.svg" alt="internet-image" width="32"/></td>
    <td style="width:200px; text-align:center;"><img src="./public/assets/environment-industry.svg" alt="environment-image" width="32"/></td>
  </tr>
</table>

- The matching process is also recorded in the `flags` table to avoid repeating this computationally expensive operation.

### Presentation and Use

- The matched startups and investors are displayed in a responsive grid of cards. Each card represents an investor and the startups they've been matched with.

- Each Investor card is colored according to their industry.

- The application initially displays a certain number of cards (e.g., 12). As the user scrolls down, the infinite scroll feature retrieves the next set of cards. This continues until all investor-startup matches have been displayed.

## Personal Experience

### Most Challenging Part

When I first started this challenge, it seemed quite intimidating. But I knew from experience that breaking it down into smaller tasks was the way to go. The most challenging part was definitely matching investors with startups.

My initial approach was to handle this dynamically, aiming to minimize the number of iterations over both tables. However, this led to a series of unexpected behaviors that were hard to debug.

Realizing I needed a different strategy, I decided to keep the paginated investors in memory and iterate over the startups table to match them. This approach was less CPU-efficient, but it was more reliable and easier to manage.

To maintain some level of efficiency, I used a cursor instead of a regular lookup. I also implemented a callback to stop the iteration once I had matched enough startups. This approach, while not perfect, allowed me to successfully match investors with startups, overcoming the most challenging part of the project.

### Design Patterns and Utilities Used

- #### Dependency Injection

This can be seen in the `loadFromCsv` function in the `csvLoader.ts` file. This function depends on two other functions: `mapRow` and `storeData`.

Instead of hardcoding these dependencies, I pass them as parameters. This makes `loadFromCsv` more flexible and reusable. It can work with any `mapRow` and `storeData` functions that meet the required interface, allowing it to store the data read in different ways.

Other examples of dependency injection can be seen in `iterateDbWithCursor` in the `idbManager.ts` file.

- #### Controlled Components: MatchedStartups

The `MatchedStartups` component uses the Controlled Components pattern. It maintains its own state (`matches` and `startId`), and updates that state based on user interaction. This state directly influences the rendering of the list of `InvestorCard`.

- #### Custom Hooks: useInfiniteScroll

The `useInfiniteScroll` hook in this project provides infinite scrolling functionality. It uses the Intersection Observer API to detect when the user has reached the end of a list, and then triggers a callback to fetch more data. This hook enhances user experience by loading data on demand, providing a seamless browsing experience.

### Unfinished Parts

- #### Investor Creation and Storage

Due to time constraints, the feature to create a new investor and store it in the browser's storage, along with its associated startups,  was not fully implemented. However, the necessary methods are already implemented in the data access layer and have been used in other parts of the application, suggesting that this feature is close to completion.

- #### CSV File Loading Optimization
The current method for loading CSV files into the database could be improved. Utilizing the `storeInDbBulk` method from `dbManager.ts` would allow data to be stored in a single database session, rather than opening and closing the database for each record. This adjustment would reduce overhead.