// Place this in a separate file in order to mock this call when testing
/*
NOTE: require.context() can only support string literals
(see https://github.com/webpack/webpack/issues/4772)

This will load all modules' index.js not including the file where this is called
(hence "{2,}" regex)
*/
export const requireContext = () => require.context('./', true, /\.(\/[^/]*){2,}(.)*.module\.js$/);
