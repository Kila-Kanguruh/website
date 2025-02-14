# Kila Website

## Getting started
```
pnpm i && pnpm run dev
```

# Component Documentation System

This documentation system automatically generates and maintains documentation for your components. It creates, updates, and manages documentation files while keeping the component library page up to date.

## Adding New Components

1. Create a new component under `src/components/` following this structure:
   ```
   src/
   └── components/
       └── ComponentName/
           └── ComponentName.astro
   ```
   Note: By convention, component names should start with a capital letter.

2. Run the documentation generator:
   ```bash
   node ./generateDocs.cjs ./src/components/ComponentName/ComponentName.astro
   ```

   This command will:
   - Generate a documentation file (`ComponentName.documentation.astro`)
   - Update `components.json` with the new component information
   - Update the imports in the documentation page (`[component].astro`)

## Documentation Structure

The generator creates and maintains several files:

- `ComponentName.documentation.astro`: Contains the documentation for your component
- `components.json`: Registry of all documented components
- `[component].astro`: Dynamic documentation page that displays component documentation

## Accessing Documentation

The component library and documentation are accessible through:

- Component Library: `<website-url>/library`
  - Lists all available components
  - Provides quick access to individual component documentation

- Individual Component Documentation: `<website-url>/documentation/ComponentName`
  - Detailed documentation for each component
  - Shows usage examples, props, and variants

## Development Workflow

1. Create your component in its dedicated folder
2. Develop and test your component
3. Run the documentation generator
4. View your component's documentation at `/documentation/ComponentName`
5. Update the component and its documentation as needed

## Component Documentation Format

The `.documentation.astro` files are used for developing and documenting components. They include:

- Basic usage examples
- Property documentation
- Component variants
- CSS variables (if any)
- Interactive examples

Keep these files up to date to ensure accurate documentation for your component library.

## Tips

- Follow the naming convention (PascalCase) for component folders and files
- Check the documentation in the browser after generating to ensure everything renders correctly
- Use the documentation files to showcase different use cases of your components
