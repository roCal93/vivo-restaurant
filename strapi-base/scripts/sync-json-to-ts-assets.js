/**
 * Ensure Strapi schemas/components are available in dist/ for TS projects.
 *
 * Strapi loads schemas/components from distDir
 * (e.g. dist/src/api/<api>/content-types/<content-type>/schema.(js|json)).
 *
 * The TypeScript compilation step does not copy JSON files, so we generate TS
 * files next to the JSON sources so that they compile to JS inside dist/.
 */

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

function readJsonFile(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function stableStringify(obj) {
  return JSON.stringify(obj, null, 2);
}

function tsModuleForJsonObject(obj) {
  // Using `as const` keeps literal unions for generated types, but still emits plain JS.
  return `export default ${stableStringify(obj)} as const;\n`;
}

function writeFileIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, 'utf8');
    if (current === content) return false;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function walk(dirPath, predicate, results = []) {
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, results);
      continue;
    }

    if (entry.isFile() && predicate(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

function syncContentTypeSchemas() {
  const apiDir = path.join(SRC_DIR, 'api');
  const schemaJsonFiles = walk(
    apiDir,
    (p) => p.endsWith(`${path.sep}schema.json`) && p.includes(`${path.sep}content-types${path.sep}`)
  );

  let changed = 0;
  for (const schemaJsonPath of schemaJsonFiles) {
    const schemaObject = readJsonFile(schemaJsonPath);
    const schemaTsPath = schemaJsonPath.replace(/schema\.json$/, 'schema.ts');
    const content = tsModuleForJsonObject(schemaObject);
    if (writeFileIfChanged(schemaTsPath, content)) changed += 1;
  }

  return { total: schemaJsonFiles.length, changed };
}

function syncComponents() {
  const componentsDir = path.join(SRC_DIR, 'components');
  const componentJsonFiles = walk(componentsDir, (p) => p.endsWith('.json'));

  let changed = 0;
  for (const componentJsonPath of componentJsonFiles) {
    const schemaObject = readJsonFile(componentJsonPath);
    const componentTsPath = componentJsonPath.replace(/\.json$/, '.ts');
    const content = tsModuleForJsonObject(schemaObject);
    if (writeFileIfChanged(componentTsPath, content)) changed += 1;
  }

  return { total: componentJsonFiles.length, changed };
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.log('[sync-json-to-ts-assets] No src/ directory, skipping.');
    return;
  }

  const ct = syncContentTypeSchemas();
  const comps = syncComponents();

  const totalChanged = ct.changed + comps.changed;
  console.log(
    `[sync-json-to-ts-assets] content-types: ${ct.changed}/${ct.total} updated, components: ${comps.changed}/${comps.total} updated`
  );

  if (totalChanged === 0) return;
}

main();
