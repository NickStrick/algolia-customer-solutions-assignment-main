import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import {
  searchBox,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';

import resultHit from '../templates/result-hit';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page.
 */
class ResultPage {
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * Creates the Algolia search client and InstantSearch instance.
   *
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @returns {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY
    );

    this._searchInstance = instantsearch({
      indexName: process.env.ALGOLIA_INDEX,
      searchClient: this._searchClient,
      insights: true,
    });
  }

  /**
   * Registers all widgets with the InstantSearch instance.
   *
   * @private
   * Adds widgets to the Algolia instant search instance
   * @returns {void}
   */
  _registerWidgets() {
    this._searchInstance.addWidgets([
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#hits',
        templates: {
          item: resultHit,
        },
        transformItems(items, { sendEvent }) {
          const hitsContainer = document.querySelector('#hits');

          if (hitsContainer && !hitsContainer.dataset.insightsInitialized) {
            hitsContainer.dataset.insightsInitialized = 'true';

            hitsContainer.addEventListener('click', (event) => {
              const target = event.target;
              const objectId = target.getAttribute('data-object-id');

              if (!objectId) {
                return;
              }

              const clickedItem = items.find(
                (item) => item.objectID === objectId
              );
              if (!clickedItem) {
                return;
              }

              if (target.id === 'view-item') {
                sendEvent('click', clickedItem, 'Product Clicked');
              }

              if (target.id === 'add-to-cart') {
                sendEvent('conversion', clickedItem, 'Product Added To Cart');
              }
            });
          }

          return items;
        },
      }),
      pagination({
        container: '#pagination',
      }),
      refinementList({
        container: '#brand-facet',
        attribute: 'brand',
      }),
      refinementList({
        container: '#categories-facet',
        attribute: 'categories',
      }),
    ]);
  }

  /**
   * Starts InstantSearch after widgets are registered.
   *
   * @private
   * Starts instant search after widgets are registered
   * @returns {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default ResultPage;
