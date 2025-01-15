# Finance Tracker Web Application

This is a project we have built for FBLA Competition, below is an overview of what the application does.

The application was built so that the user could create an account and submit sources of income / expenses with categories and dates (haven't implemented submitting dates quite yet), and monitor how much they're spending or gaining over periods of time.



# Design Process

We were unsure if we should have made up a brand for this application, so we just refrained from doing so.

Neither of us are exactly "designers" per se, so we decided to go with a minimalistic layout & style for the page.

We used a dark blue color as our primary color as people associate the color blue with a feeling of trust.

All the images were taken from [Pexels](https://www.pexels.com/).
The prompt indicated that the application was built for students, so we used an image of students on the home page.

We switched up the tools we were using to build the UI last second so we used basic HTML, CSS, JavaScript to build out the page because it's what we're familiar with.

In the future, we might change to the use of a UI framework like React, or Astro.


# Functionality

We used a few libraries in this project such as:

- Chart.js (for generating graphs from the information submitted by the user).

- ExpressJS framework (for server-side management).

- JSDOM (used to essentially take a template page with the navbar and footer attached to it & change the content based on the page you're viewing).

- crypto (for generating UUIDs).

But aside from those, everything else was built in vanilla JavaScript.

The application takes data submitted by users and generates graphs or summaries for the user to view and analyze how they're gaining or spending their money.

### Features

Some of the current features we've implemented are:

- Graphs of total income & expense sources.

- Total balance summary with a table showing income & expense sources.

- Submitting income & expense sources (from the account settings page).

Due to time constraints some features we might be lacking are:

- Search filters / options.

- Graphs showing specificed periods selected by the user.

- Updating or deleting sources of income / expenses.

- Updating account details like the username, email, password