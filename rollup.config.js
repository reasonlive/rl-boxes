
import {terser} from 'rollup-plugin-terser';
import html from "rollup-plugin-html";

export default {
	input: "src/index.js",
	output: [
		{
			file: "bundle.js",
			format: "cjs"
		},
		{
			file: "bundle.min.js",
			format: "iife",
			plugins: [terser()]
		}

	],
}