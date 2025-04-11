import path from "path";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "style-loader", "css-loader"],
      },
    ],
  },
};

// If you suspect the issue is related to tree-shaking, minification, or bundling, here are some steps to investigate and resolve it:

// ### 1. **Verify `populatedmap.geojson` is Included in the Build**
// Tree-shaking or bundling optimizations might exclude the `populatedmap.geojson` file if it's not explicitly referenced. Since you're fetching it dynamically, Webpack might not recognize it as a required asset.

// #### Solution:
// Use the `CopyWebpackPlugin` to ensure the file is included in the build output.

// Install the plugin:
// ```bash
// npm install copy-webpack-plugin --save-dev
// ```

// Update your webpack.config.js:
// ```javascript
// import path from "path";
// import CopyWebpackPlugin from "copy-webpack-plugin";

// export default {
//   mode: "production",
//   entry: "./src/index.js",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "bundle.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: ["babel-loader", "style-loader", "css-loader"],
//       },
//     ],
//   },
//   plugins: [
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: "public/data", to: "data" }, // Copy the data folder to the build output
//       ],
//     }),
//   ],
// };
// ```

// This ensures that the `data` folder (and `populatedmap.geojson`) is copied to the `dist` folder during the build process.

// ---

// ### 2. **Disable Minification for Debugging**
// Minification might be stripping out necessary code or causing unexpected behavior. Temporarily disable minification to see if it resolves the issue.

// Update your webpack.config.js:
// ```javascript
// export default {
//   mode: "production",
//   entry: "./src/index.js",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "bundle.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: ["babel-loader", "style-loader", "css-loader"],
//       },
//     ],
//   },
//   optimization: {
//     minimize: false, // Disable minification
//   },
// };
// ```

// Rebuild and redeploy the app. If the issue is resolved, the problem lies in the minification process.

// ---

// ### 3. **Check for Dead Code Elimination**
// Tree-shaking might be removing code that is dynamically used. Webpack relies on static analysis to determine which code is used, so dynamic imports or references might be incorrectly removed.

// #### Solution:
// Mark the `populatedmap.geojson` file as a side effect to prevent it from being removed.

// Update your package.json:
// ```json
// {
//   "sideEffects": ["public/data/populatedmap.geojson"]
// }
// ```

// This tells Webpack not to tree-shake the specified file.

// ---

// ### 4. **Log the `places` Data**
// If the above steps don't resolve the issue, log the `places` data in the deployed version to ensure it is being loaded correctly.

// Update your `globe.js`:
// ```javascript
// useEffect(() => {
//   fetch(`../data/populatedmap.geojson`)
//     .then((res) => res.json())
//     .then(({ features }) => {
//       const filteredPlaces = features.filter(
//         (feature) => feature.properties.featurecla === "Admin-0 capital"
//       );
//       console.log("Filtered Places:", filteredPlaces); // Log the data
//       setPlaces(filteredPlaces);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// }, []);
// ```

// Check the browser console in the deployed version to see if the `places` data is being loaded correctly.

// ---

// ### 5. **Verify Production Build**
// Ensure the production build is correctly configured to handle dynamic imports and external assets. Run the following commands to clean and rebuild the project:
// ```bash
// npm run clean
// npm run build
// ```

// Then redeploy the app and test again.

// ---

// ### Summary
// The most likely issue is that the `populatedmap.geojson` file is not being included in the build output or is being stripped out by tree-shaking. Using the `CopyWebpackPlugin` and marking the file as a side effect should resolve the issue. If not, disabling minification temporarily can help identify if the problem lies in the optimization process.

// Similar code found with 1 license type
