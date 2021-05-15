// import commonjs from "@rollup/plugin-commonjs";
// import resolve from "@rollup/plugin-node-resolve";
// import cleanup from 'rollup-plugin-cleanup'
// import typescript from "rollup-plugin-typescript2";
// import stripBanner from 'rollup-plugin-strip-banner'
// import pkg from "./package.json";
// import babel from "rollup-plugin-babel";
// import nodeResolve from "rollup-plugin-node-resolve";
// import lernaGetPackages from "lerna-get-packages";
// import path from "path";
// import fs from 'fs'


// const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']

// const externals = [
//   'prop-types',
// ]

// const mapGlobal = name => {
//   if (name.indexOf('d3') === 0) return 'd3'
//   if (name === 'react') return 'React'
//   return name
// }

// const input = `./packages/${pkg}/src/index.ts`

// const common = {
//   input,
//   external: id => externals.includes(id)
//     || id.indexOf('react') === 0
//     || id.indexOf('d3') === 0
// }

// const babelConfig = {
//   extensions,
//   exclude: 'node_modules/**',
//   babelHelpers: 'runtime',
//   comments: false,
// }

// const plugins = [
//   resolve({
//     module: true,
//       jsnext: true,
//       main: true,
//       browser: true,
//       extensions,
//       modulesOnly: true,
//   }), 
//   stripBanner({
//     include: `./packages/${pkg}/**/*.tsx`,
//     exclude: `./packages/${pkg}/__test__/**/*.test.tsx`,
//   }),
//   babel(babelConfig),
//   commonjs(), 
//   typescript(),
//   cleanup()
// ]

// const input = `./packages/${pkg}/index.ts`;

// export default [
//   {
//     input,
//     output: {
//       file: `./packages/${pkg}/dist/data-eureka-${pkg}.es.js`,
//       format: 'es',
//       name: `@data-eureka/${pkg}`,
//       sourcemap: true,
//     },
//     plugins,
//   },
//   {
//     input,
//     output: {
//       file: `./packages/${pkg}/dist/data-eureka-${pkg}.cjs.js`,
//       format: 'cjs',
//       name: `@data-eureka/${pkg}`,
//       sourcemap: true,
//     },
//     plugins,
//   },
//   {
//     input,
//     output: {
//       file: `./packages/${pkg}/dist/data-eureka-${pkg}.umd.js`,
//       format: 'umd',
//       extend: true,
//       name: 'data-eureka',
//       globals: mapGlobal,
//       sourcemap: true,
//     },
//     plugins,
//   },
// ];





// const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
// const PACKAGE_ROOT_PATH = process.cwd();
// const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.ts");
// const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "dist");
// const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));
// const IS_BROWSER_BUNDLE = !!PKG_JSON.browser;

// const ALL_MODULES = lernaGetPackages(LERNA_ROOT_PATH).map(
//   ({ package: { name } }) => name
// );

// console.log("ALL_MODULES", ALL_MODULES)

// const LOCAL_GLOBALS = {
//   'react': 'React',
//   'react-dom': 'ReactDOM',
//   'd3': 'd3',
// };

// const LOCAL_EXTERNALS = [
//   'react',
//   'react-dom',
//   'd3',
// ];

// const mirror = array => array.reduce((acc, val) => ({ ...acc, [val]: val }), {});

// const formats = IS_BROWSER_BUNDLE ? ["umd"] : ["es", "cjs"];

// export default formats.map(format => ({
//   ...common,
//   plugins: [
//     resolve({
//       extensions,
//       module: true,
//       jsnext: true,
//       main: true,
//       browser: true,
//       modulesOnly: true,
//     }), 
//     commonjs({
//       include: /node_modules/,
//     }),
//     stripBanner({
//       // include: `./packages/${pkg}/src/*.tsx`,
//       exclude: `./packages/${pkg}/src/__test__/**/*.test.tsx`,
//     }),
//     babel(babelConfig),
//     // typescript(),
//     cleanup()
//   ],
//   input: INPUT_FILE,
  
//   external: IS_BROWSER_BUNDLE ? LOCAL_EXTERNALS : ALL_MODULES,
  
//   output: {
//     file: path.join(OUTPUT_DIR, `index.${format}.js`),
//     format, 
//     sourcemap: true,
//     name: LERNA_PACKAGE_NAME,
//     globals: IS_BROWSER_BUNDLE ? mirror(ALL_MODULES) : LOCAL_GLOBALS,
//     amd: {
//       id: LERNA_PACKAGE_NAME
//     },
//     globals: LOCAL_GLOBALS
//   },
// }));

import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import lernaGetPackages from "lerna-get-packages";
import path from "path";
import cleanup from 'rollup-plugin-cleanup'
import typescript from "rollup-plugin-typescript2";

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.ts");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "dist");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));
const IS_BROWSER_BUNDLE = !!PKG_JSON.browser;
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const ALL_MODULES = lernaGetPackages(LERNA_ROOT_PATH).map(
  ({ package: { name } }) => name
);

console.log("ALL_MODULES", ALL_MODULES)

const LOCAL_GLOBALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'd3': 'd3',
};

const LOCAL_EXTERNALS = [
  'react',
  'react-dom',
  'd3',
];

const mirror = array =>
  array.reduce((acc, val) => ({ ...acc, [val]: val }), {});

const formats = IS_BROWSER_BUNDLE ? ["umd"] : ["es", "cjs"];

export default formats.map(format => ({
  plugins: [
    resolve({
      extensions,
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      modulesOnly: true,
    }), 
    commonjs({
      include: /node_modules/,
    }),
    babel({
      exclude: ["node_modules/**"],
      presets: [['@babel/preset-env', {'modules': false}], '@babel/react', "@babel/preset-typescript"],
      plugins: [['@babel/plugin-proposal-class-properties', { 'loose': true }]],
      extensions,
    }),
    // typescript(),
    cleanup()
  ],
  input: INPUT_FILE,
  
  external: IS_BROWSER_BUNDLE ? LOCAL_EXTERNALS : ALL_MODULES,
  
  output: {
    file: path.join(OUTPUT_DIR, `index.${format}.js`),
    format, 
    sourcemap: true,
    name: LERNA_PACKAGE_NAME,
    globals: IS_BROWSER_BUNDLE ? mirror(ALL_MODULES) : LOCAL_GLOBALS,
    amd: {
      id: LERNA_PACKAGE_NAME
    },
    globals: LOCAL_GLOBALS
  },
}));