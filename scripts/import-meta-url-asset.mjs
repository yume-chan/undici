// Based on https://www.npmjs.com/package/@web/rollup-plugin-import-meta-assets
// But rewrite import to be relative so other bundlers can consume it

import { promises } from 'fs';
import { sep, dirname, resolve, basename } from 'path';
import { createFilter } from '@rollup/pluginutils';
import { asyncWalk } from 'estree-walker';
import MagicString from 'magic-string';

/**
 * Extract the relative path from an AST node representing this kind of expression `new URL('./path/to/asset.ext', import.meta.url)`.
 *
 * @param {import('estree').Node} node - The AST node
 * @returns {string} The relative path
 */
function getRelativeAssetPath(node) {
  const browserPath = node.arguments[0].value;
  return browserPath.split('/').join(sep);
}

/**
 * Checks if a AST node represents this kind of expression: `new URL('./path/to/asset.ext', import.meta.url)`.
 *
 * @param {import('estree').Node} node - The AST node
 * @returns {boolean}
 */
function isNewUrlImportMetaUrl(node) {
  return (
    node.type === 'NewExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'URL' &&
    node.arguments.length === 2 &&
    node.arguments[0].type === 'Literal' &&
    typeof getRelativeAssetPath(node) === 'string' &&
    node.arguments[1].type === 'MemberExpression' &&
    node.arguments[1].object.type === 'MetaProperty' &&
    node.arguments[1].property.type === 'Identifier' &&
    node.arguments[1].property.name === 'url'
  );
}

/**
 * Detects assets references relative to modules using patterns such as `new URL('./path/to/asset.ext', import.meta.url)`.
 * The assets are added to the rollup pipeline, allowing them to be transformed and hash the filenames.
 *
 * @param {object} options
 * @param {string|string[]} [options.include] A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted.
 * @param {string|string[]} [options.exclude] A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.
 * @param {boolean} [options.warnOnError] By default, the plugin quits the build process when it encounters an error. If you set this option to true, it will throw a warning instead and leave the code untouched.
 * @param {function} [options.transform] A function to transform assets.
 * @return {import('rollup').Plugin} A Rollup Plugin
 */
export function importMetaUrlAssets({ include, exclude, warnOnError, transform } = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'rollup-plugin-import-meta-url-assets',

    resolveFileUrl({ relativePath }) {
      return `new URL("./${relativePath}", import.meta.url)`
    },

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const ast = this.parse(code);
      const magicString = new MagicString(code);
      let modifiedCode = false;

      await asyncWalk(ast, {
        enter: async node => {
          if (isNewUrlImportMetaUrl(node)) {
            const absoluteScriptDir = dirname(id);
            const relativeAssetPath = getRelativeAssetPath(node);
            const absoluteAssetPath = resolve(absoluteScriptDir, relativeAssetPath);
            const assetName = basename(absoluteAssetPath);

            try {
              const assetContents = await promises.readFile(absoluteAssetPath);
              const transformedAssetContents =
                transform != null
                  ? await transform(assetContents, absoluteAssetPath)
                  : assetContents;
              if (transformedAssetContents === null) {
                return;
              }
              const ref = this.emitFile({
                type: 'asset',
                name: assetName,
                source: transformedAssetContents,
              });
              magicString.overwrite(
                node.start,
                node.end,
                `import.meta.ROLLUP_FILE_URL_${ref}`,
              );
              modifiedCode = true;
            } catch (error) {
              if (warnOnError) {
                this.warn(error, node.arguments[0].start);
              } else {
                this.error(error, node.arguments[0].start);
              }
            }
          }
        },
      });

      return {
        code: magicString.toString(),
        map: modifiedCode ? magicString.generateMap({ hires: true }) : null,
      };
    },
  };
}
