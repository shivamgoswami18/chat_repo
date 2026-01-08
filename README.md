# Prosjektmarkedet_Customer_FE

## Development Guidelines

All developers must follow these rules and conventions when working on this project.

### Styling & Design System

- **Tailwind Configuration**: Always use values from `tailwind.config.js` for:
  - Font sizes
  - Font weights
  - Colors
  - Responsive breakpoints (use `screens` configuration)
- **External CSS**: If you need to add any external CSS, add it to `src/app/globals.css`

### Project Structure

#### Routes
- **Private Routes**: All private routes must be placed in `app/(private)` folder
- **Public Routes**: All public routes must be placed in `app/(public)` folder

#### Assets
- **SVG Icons**: All SVG icons must be in `src/assets/icons/CommonIcons.tsx`
- **Images**: All images must be in `src/assets/images` folder

#### Components
- **Component Organization**: Make things component-based in `src/components` folder
  - Create separate folders for all modules
  - Keep related components in their respective module folders
- **Base Components**: All base components should be in `src/components/base` folder
- **Common Components**: All components which are reusable at some place should be in `src/components/common` folder

#### Constants
- **Common Text**: All common text should be in `src/components/constants` folder
  - Make separate files for separate modules
- **Validation**: All validation related things should be in `src/components/constants/Validation.ts`
- **Route Paths**: All paths should be in `src/components/constants/RoutePath.ts`
- **Page Titles**: All titles should be in `src/components/constants/PageTitles.ts`
- **Common Utilities**: All common text and functions should be in `src/components/constants/Common.tsx`

#### Internationalization (i18n)
- **Translation Files**: All text which needs to be shown language-based should be in:
  - `src/i18n/en.json` (English)
  - `src/i18n/no.json` (Norwegian)
- **Important**: Same translations need to be added in both translation sheets

#### API & State Management
- **API Calls**: For API calling, follow the structure in the `lib` folder
- **Redux Slices**: Need to create slices for modules where needed

#### Branching Strategy
- All branches should be created from the develop branch and merged back into the develop branch
- Branch names should follow the format: feat/{module-name}
  - Example: feat/project, feat/forgot-password

#### Commit strategy
- Commit messages should follow this format:
  - add: login page added
  - update: login page updated
  - delete: file deleted