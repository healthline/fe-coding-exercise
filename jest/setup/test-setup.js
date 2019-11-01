if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia
    || function matchMedia() {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
}
