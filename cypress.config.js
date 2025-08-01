import { defineConfig } from "cypress";

export default defineConfig({
   video: true,              // record videos
  videoUploadOnPasses: true, // keep videos even on passing tests
  e2e: {

  // your app’s URL
    baseUrl: 'http://localhost:3000',

    // if you need to hook into events, do it here
    setupNodeEvents(on, config) {
      // e.g. return config or register plugins
      return config;
    },

    // where your specs live
    specPattern: 'cypress/e2e/**/*.spec.js',
    specPattern: 'cypress/e2e/**/*.cy.js',

    // support file (optional)
    supportFile: 'cypress/support/e2e.js',
      

  },
});
