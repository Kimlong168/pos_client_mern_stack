function navigateToPage(path) {
  window.history.pushState({}, "", path);
  // Manually trigger a popstate event if needed to notify the app of the change
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default navigateToPage;
