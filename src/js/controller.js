import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import AddRecipeView from "./views/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipes = async function () {
  try {
    //hash id
    const id = window.location.hash.slice(1);

    if (!id) return;
    //load spinner
    recipeView.renderSpinner();
    // 0. Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //1 . update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2. loading recipe
    await model.loadRecipe(id);
    //3. rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;

    //load spinner
    resultsView.renderSpinner();

    //2 load search results
    await model.loadSearchResults(query);

    //3 render results
    resultsView.render(model.getSearchResultsPage());

    //4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controAddBookmark = function () {
  //1. add remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. update recipe view
  recipeView.update(model.state.recipe);

  //3. render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
