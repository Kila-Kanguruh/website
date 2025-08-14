# Kinderladen Känguruh Website

A modern, responsive website for the Kinderladen Känguruh e.V., a parent initiative and free youth welfare provider in Dresden, Germany. This website is built with **Astro** and provides information about the daycare center, job opportunities, and contact details.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kila

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🏗️ Project Structure

```
kila/
├── public/                 # Static assets
│   ├── graphics/          # SVG graphics and images
│   ├── icons/            # UI icons and SVG files
│   ├── images/           # Photo content and logos
│   └── favicon.*         # Website favicons
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layout templates
│   ├── pages/            # Route pages
│   └── styles/           # Global CSS and design tokens
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

### Color Palette

The website uses a consistent color scheme defined in `src/styles/colors.css`:

- **Primary Accent**: `#F9A826` (warm orange)
- **Accent Variants**: Light, dark, and disabled states
- **Gradient**: 45° diagonal gradient from accent to white

### Typography

- **Font Family**: Fredoka (Google Fonts)
- **Base Size**: 20px with 1.6 line height
- **Responsive**: Scales appropriately on mobile devices

### Layout

- **Max Width**: 1280px centered
- **Main Content**: 800px max-width with responsive padding
- **Mobile First**: Responsive design with mobile menu

## 🧩 Component Architecture

Next to the main components for the UI, there are Graphics and Icons built like Astro components, in order to allow an easy import:

### Graphics Components

Located in `src/components/graphics/`:

- **GraphicContact.astro**: Contact page illustration
- **GraphicJump.astro**: Jumping child illustration
- **GraphicTeddy.astro**: Teddy bear illustration
- **GraphicKids.astro**: Children playing illustration
- **GraphicTreff.astro**: Meeting point illustration
  ... etc.

### Icon Components

Located in `src/components/icons/`:

- **IconChat.astro**: Chat/contact icon
- **IconHeart.astro**: Heart icon for promotions
- **IconInsta.astro**: Instagram icon
- **IconNote.astro**: Note/document icon
  ... etc.

## 🖼️ Graphics and Assets

### Graphics Sources

The website uses a mix of graphics from different sources:

#### AI-Generated Graphics

- **Kangaroo Images**: `kangoroo.png`, `baby_kangoroo.png` - AI-generated kangaroo mascots
- **Chef Kangaroo**: `cangchef.png` - AI-generated cooking kangaroo
- **Kindertreff Graphic**: `kindertreff_graphic.png` - AI-generated children's meeting illustration

#### Open Source Graphics ([unDraw Handcrafts](https://handcrafts.undraw.co/) and [unDraw Illustrations](https://undraw.co/))

- **True Friends Illustration**: `True Friends Illustration 1.svg` - Open source friendship illustration
- **Divider Graphics**: `DividerWave.svg`, `DividerCurly.svg` - Custom SVG wave dividers

#### Custom SVG Graphics

- **Vector Graphics**: `Vector.svg` - Custom geometric patterns
- **Divider Elements**: Wave and curly dividers for visual separation

### Image Organization

- **`/public/graphics/`**: SVG illustrations and graphics
- **`/public/images/`**: Photos, logos, and banner images
- **`/public/icons/`**: UI icons and navigation elements

## 📱 Pages and Routing

### Main Pages

- **Home** (`/`): Landing page with hero slider and main content
- **Unser Kinderladen** (`/unser-kinderladen`): About the daycare center
- **Kindertreff** (`/kindertreff`): Children's meeting point information
- **Verein** (`/verein`): Association details
- **Freie Stellen** (`/freie-stellen`): Job opportunities
- **Freie Betreuungsplätze** (`/freie-betreuungsplätze`): Available childcare spots
- **Kontakt** (`/kontakt`): Contact information and form
- **Impressum** (`/impressum`): Legal information

### Navigation Structure

The header automatically generates navigation from page files, excluding `impressum` and `kontakt` from the main menu (they appear in the footer).

## 🛠️ Development Guidelines

### Adding New Pages

1. Create a new `.astro` file in `src/pages/`
2. Use the `Layout.astro` component as the base
3. Add a `title` prop for the page title
4. The navigation will automatically include the new page

### Creating New Components

1. Create a new folder in `src/components/`
2. Include an `.astro` file for the component
3. Use TypeScript interfaces for props when needed
4. Follow the existing naming conventions

### Styling Guidelines

- Use CSS custom properties from `colors.css` for consistency
- Follow mobile-first responsive design
- Use the existing color palette and typography
- Maintain the warm, child-friendly aesthetic

### Adding Graphics

- **SVG Graphics**: Place in `public/graphics/` for illustrations
- **Icons**: Place in `public/icons/` for UI elements
- **Photos**: Place in `public/images/` for content images
- **Optimize**: Compress images and optimize SVGs for web use

## 🔧 Technical Details

### Build System

- **Framework**: Astro 4.11.5
- **Language**: TypeScript with strict configuration
- **Styling**: CSS with CSS custom properties
- **Package Manager**: pnpm (recommended)

### Dependencies

- **Core**: Astro, TypeScript
- **Development**: Prettier with Astro plugin
- **Build Tools**: Astro build system

### Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile-responsive design
- Progressive enhancement approach

## 📝 Content Management

### Text Content

- All text content is hardcoded in the `.astro` files
- German language content for the target audience
- Contact information and legal details in separate pages

### Dynamic Content

- Job openings and available spots are static content
- Contact form functionality would need backend implementation
- Instagram integration for social media updates

## 🚀 Deployment

### Build Process

```bash
# Check for TypeScript errors
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Output

- Static HTML files in `dist/` directory
- Optimized assets and images
- Ready for deployment to any static hosting service

## 🤝 Contributing

### Code Style

- Use Prettier for code formatting
- Follow existing component patterns
- Maintain TypeScript strict mode
- Test responsive design on multiple screen sizes

### Asset Guidelines

- Optimize images for web use
- Use SVG format for graphics when possible
- Maintain consistent visual style
- Document sources for external graphics

## 📞 Support and Contact

For questions about the website development:

- Check the existing component structure
- Review the color and typography system
- Follow the established naming conventions
- Test on mobile and desktop devices

---

**Note**: This website serves a German daycare center, so all user-facing content is in German. The codebase uses English for technical elements and comments.
