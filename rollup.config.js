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

const LOCAL_GLOBALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
};

const LOCAL_EXTERNALS = [
  'react',
  'react-dom',
  'd3',
];

const common = {
  input: INPUT_FILE,
  external: LOCAL_EXTERNALS,
}


const mirror = array =>
  array.reduce((acc, val) => ({ ...acc, [val]: val }), {});

const formats = ["es", "cjs", "umd"]

export default formats.map(format => ({
  ...common,
  plugins: [
    resolve({
      extensions,
      // module: true,
      // jsnext: true,
      // main: true,
      // browser: true,
      // modulesOnly: true,
    }), 
    commonjs({
      include: /node_modules/,
    }),
    typescript(),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-require',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-proposal-object-rest-spread', {
          useBuiltIns: true,
        }],
        ['@babel/plugin-transform-runtime', {
          corejs: 3,
          helpers: true,
          regenerator: true,
          useESModules: false,
        }],
      ],
    }),
    cleanup()
  ],
  output: {
    file: path.join(OUTPUT_DIR, `index.${format}.js`),
    format, 
    sourcemap: true,
    name: LERNA_PACKAGE_NAME,
    globals: IS_BROWSER_BUNDLE ? mirror(ALL_MODULES) : LOCAL_GLOBALS,
    amd: {
      id: LERNA_PACKAGE_NAME
    },
  },
}));