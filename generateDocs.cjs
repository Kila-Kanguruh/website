
const fs = require('fs/promises');
const path = require('path');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const walk = require('acorn-walk');

const Parser = acorn.Parser.extend(jsx());

/**
 * Updates the documentation page with new component imports
 * @param {string} docsPagePath - Path to the documentation page
 * @param {string} componentName - Name of the component to add
 */
async function updateDocumentationPage(docsPagePath, componentName) {
  console.log(`Updating documentation page: ${docsPagePath}`);
  try {
    const content = await fs.readFile(docsPagePath, 'utf-8');
    
    // Add import if it doesn't exist
    const importStatement = `import ${componentName}Documentation from '../../components/${componentName}/${componentName}.documentation.astro';`;
    if (!content.includes(importStatement)) {
      const lines = content.split('\n');
      const lastImportIndex = findLastImportIndex(lines);
      lines.splice(lastImportIndex + 1, 0, importStatement);
      
      // Add to documentationComponents object if not present
      const componentEntry = `  ${componentName}: ${componentName}Documentation,`;
      const docCompStart = lines.findIndex(line => line.includes('const documentationComponents = {'));
      const docCompEnd = lines.findIndex(line => line.includes('};'));
      
      if (!content.includes(componentEntry)) {
        // Find the last component in the object
        let insertIndex = docCompEnd;
        for (let i = docCompStart; i < docCompEnd; i++) {
          if (lines[i].includes('// altri componenti...')) {
            insertIndex = i;
            break;
          }
        }
        lines.splice(insertIndex, 0, componentEntry);
      }
      
      // Update components.json if it doesn't include this component
      await updateComponentsJson('./src/pages/components.json', componentName);
      
      // Write the updated content back to the file
      await fs.writeFile(docsPagePath, lines.join('\n'));
      console.log(`Documentation page updated with ${componentName}`);
    }
  } catch (error) {
    console.error('Error updating documentation page:', error);
    throw error;
  }
}

/**
 * Updates the components.json file with new component
 * @param {string} jsonPath - Path to components.json
 * @param {string} componentName - Name of the component to add
 */
async function updateComponentsJson(jsonPath, componentName) {
  console.log('Updating components.json at path:', jsonPath);
  
  try {
    let components = [];
    try {
      const content = await fs.readFile(jsonPath, 'utf-8');
      console.log('Current components.json content:', content);
      components = JSON.parse(content);
    } catch (e) {
      console.log('Error reading components.json:', e);
      components = [];
    }
    
    console.log('Checking if component exists:', componentName);
    console.log('Current components:', components);
    
    const exists = components.some(comp => comp.name === componentName);
    console.log('Component exists?', exists);
    
    if (!exists) {
      const newComponent = {
        name: componentName,
        docPath: `/documentation/${componentName}`,
        componentDocPath: `../../components/${componentName}/${componentName}.documentation.astro`
      };
      console.log('Adding new component:', newComponent);
      
      components.push(newComponent);
      await fs.writeFile(jsonPath, JSON.stringify(components, null, 2));
      console.log(`components.json updated with ${componentName}`);
    } else {
      console.log(`Component ${componentName} already exists in components.json`);
    }
  } catch (error) {
    console.error('Error updating components.json:', error);
    throw error;
  }
}

/**
 * Finds the index of the last import statement
 * @param {string[]} lines - Array of file lines
 * @returns {number} Index of the last import
 */
function findLastImportIndex(lines) {
  let lastIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import')) {
      lastIndex = i;
    }
  }
  return lastIndex;
}

/**
 * Generates documentation for an Astro component and updates the documentation page
 * @param {string} componentPath - Path to the component file
 * @param {string} docsPagePath - Path to the documentation page
 */
async function generateComponentDocumentation(componentPath, docsPagePath) {
  // Read the component file
  const content = await fs.readFile(componentPath, 'utf-8');
  const fileName = path.basename(componentPath, '.astro');
  
  // Extract frontmatter and component content
  const { frontmatter, componentContent } = extractFrontmatter(content);
  
  // Parse props from frontmatter
  const props = extractPropsFromFrontmatter(frontmatter);
  
  // Generate documentation content
  const documentationContent = `---
import { default as ${fileName}Component } from './${fileName}.astro';
---

<div class="docs">
  <h1>${fileName} Component</h1>

  <section>
    <h2>Basic Usage</h2>
    <div class="example">
      <${fileName}Component>Example Content</${fileName}Component>
    </div>
    <pre><code>{\'<${fileName}>Example Content</${fileName}>\'}</code></pre>
  </section>

  <section>
    <h2>Properties</h2>
    ${generatePropsTable(props)}
  </section>

  <section>
    <h2>Variants</h2>
    ${generateVariantsSection(fileName, props)}
  </section>

  <section>
    <h2>CSS Variables</h2>
    ${extractCSSVariables(componentContent)}
  </section>
</div>

<style>
  .docs {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  section {
    margin: 2rem 0;
  }

  .example {
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin: 1rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th,
  td {
    text-align: left;
    padding: 0.75rem;
    border: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
  }

  code {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }

  h2 {
    margin-top: 2rem;
  }

  h3 {
    margin-top: 1.5rem;
  }
</style>`;

  // Write the documentation file
  const docPath = path.join(path.dirname(componentPath), `${fileName}.documentation.astro`);
  await fs.writeFile(docPath, documentationContent);
  
  console.log(`Documentation generated for ${fileName} at ${docPath}`);

  // Update the documentation page if path is provided
  if (docsPagePath) {
    await updateDocumentationPage(docsPagePath, fileName);
  }
}

/**
 * Extract frontmatter and component content from Astro file
 * @param {string} content - File content
 * @returns {Object} Frontmatter and component content
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', componentContent: content };
  }
  
  return {
    frontmatter: match[1],
    componentContent: content.slice(match[0].length)
  };
}

/**
 * Extract props by parsing the frontmatter code
 * @param {string} frontmatter - Component frontmatter
 * @returns {Array} Array of prop objects
 */
function extractPropsFromFrontmatter(frontmatter) {
  const props = [];
  
  try {
    // Parse the frontmatter code
    const ast = Parser.parse(frontmatter, {
      sourceType: 'module',
      ecmaVersion: 'latest'
    });
    
    // Walk through the AST to find interface/type definitions and JSDoc comments
    walk.full(ast, node => {
      if (node.type === 'TSInterfaceDeclaration' && node.id.name === 'Props') {
        node.body.body.forEach(prop => {
          const propInfo = {
            name: prop.key.name,
            type: extractTypeFromNode(prop.typeAnnotation),
            required: !prop.optional,
            defaultValue: extractDefaultValue(prop),
            description: extractJSDocDescription(prop)
          };
          props.push(propInfo);
        });
      }
      // Handle PropTypes if using the Props type instead of interface
      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(decl => {
          if (decl.id.name === 'Props') {
            const propTypes = extractPropsFromPropTypes(decl.init);
            props.push(...propTypes);
          }
        });
      }
    });
  } catch (error) {
    console.warn('Error parsing frontmatter:', error);
  }
  
  return props;
}

/**
 * Extract type information from AST node
 * @param {Object} typeNode - AST type node
 * @returns {string} Type description
 */
function extractTypeFromNode(typeNode) {
  if (!typeNode) return 'any';
  
  switch (typeNode.type) {
    case 'TSStringKeyword':
      return 'string';
    case 'TSNumberKeyword':
      return 'number';
    case 'TSBooleanKeyword':
      return 'boolean';
    case 'TSUnionType':
      return typeNode.types.map(t => extractTypeFromNode(t)).join(' | ');
    case 'TSLiteralType':
      return `'${typeNode.literal.value}'`;
    default:
      return 'any';
  }
}

/**
 * Extract default value from prop definition
 * @param {Object} prop - AST prop node
 * @returns {string} Default value
 */
function extractDefaultValue(prop) {
  if (!prop.initializer) return 'undefined';
  
  switch (prop.initializer.type) {
    case 'Literal':
      return JSON.stringify(prop.initializer.value);
    case 'ObjectExpression':
      return '{}';
    case 'ArrayExpression':
      return '[]';
    default:
      return 'undefined';
  }
}

/**
 * Extract JSDoc description from prop
 * @param {Object} prop - AST prop node
 * @returns {string} JSDoc description
 */
function extractJSDocDescription(prop) {
  if (!prop.jsDoc || !prop.jsDoc.length) return '';
  return prop.jsDoc[0].description;
}

/**
 * Generate HTML table for props
 * @param {Array} props - Array of prop objects
 * @returns {string} HTML table
 */
function generatePropsTable(props) {
  if (props.length === 0) {
    return '<p>No properties documented.</p>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${props.map(prop => `
        <tr>
          <td>${prop.name}</td>
          <td><code>${prop.type}</code></td>
          <td>${prop.required ? 'Yes' : 'No'}</td>
          <td><code>${prop.defaultValue}</code></td>
          <td>${prop.description || 'No description available'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Generate examples for different component variants
 * @param {string} componentName - Name of the component
 * @param {Array} props - Array of prop objects
 * @returns {string} HTML for variants section
 */
function generateVariantsSection(componentName, props) {
  let variants = `
    <h3>Default ${componentName}</h3>
    <div class="example">
      <${componentName}Component>Default ${componentName}</${componentName}Component>
    </div>
  `;
  
  // Generate examples for boolean props and enum props
  props.forEach(prop => {
    if (prop.type === 'boolean') {
      variants += `
    <h3>With ${prop.name}</h3>
    <div class="example">
      <${componentName}Component ${prop.name}>${prop.name} ${componentName}</${componentName}Component>
    </div>
      `;
    } else if (prop.type.includes('|')) {
      // Handle enum types
      const values = prop.type.split('|').map(v => v.trim().replace(/['"]/g, ''));
      values.forEach(value => {
        variants += `
    <h3>With ${prop.name}="${value}"</h3>
    <div class="example">
      <${componentName}Component ${prop.name}="${value}">${prop.name}=${value} ${componentName}</${componentName}Component>
    </div>
        `;
      });
    }
  });
  
  return variants;
}

/**
 * Extract CSS variables from component content
 * @param {string} content - Component content
 * @returns {string} HTML for CSS variables table
 */
function extractCSSVariables(content) {
  const cssVarRegex = /--[\w-]+/g;
  const matches = content.match(cssVarRegex) || [];
  
  if (matches.length === 0) {
    return '<p>No CSS variables found.</p>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from(new Set(matches)).map(variable => `
        <tr>
          <td><code>${variable}</code></td>
          <td>Purpose of ${variable}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Create a simple CLI
if (require.main === module) {
  const componentPath = process.argv[2];
  const docsPagePath = './src/pages/documentation/[component].astro';
  
  if (!componentPath) {
    console.error('Please provide a component path: node generateDocs.js ./components/Button.astro [docsPagePath]');
    process.exit(1);
  }
  
  generateComponentDocumentation(componentPath, docsPagePath)
    .catch(error => {
      console.error('Error generating documentation:', error);
      process.exit(1);
    });
}

module.exports = generateComponentDocumentation;

