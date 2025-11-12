# REMA Risk Assessment Calculator

A modern web application for calculating non-carcinogenic risk quotients for environmental contaminants using EPA methodology. This tool helps environmental professionals assess potential health risks from exposure to various contaminants.

## What It Does

The REMA Risk Assessment Calculator calculates non-carcinogenic risk quotients for environmental contaminants using EPA methodology. It helps environmental professionals assess potential health risks from contaminant exposure.

### Key Features

- Interactive form with real-time validation
- Built-in contaminant database with RfD values
- Input validation and error handling
- Accessible design with keyboard navigation

## Calculation Methodology

### Daily Intake Formula
```
I = (C × IR × EF × ED) / (BW × AT)
```

Where:
- **I**: Daily intake [mg/(kg·day)]
- **C**: Contaminant concentration [mg/L or mg/kg]
- **IR**: Intake rate [L/day or kg/day]
- **EF**: Exposure frequency [day/year]
- **ED**: Exposure duration [year]
- **BW**: Body weight [kg]
- **AT**: Averaging time [day]

### Risk Quotient
```
QR = I / RfD
```

Where:
- **QR**: Risk quotient (unitless)
- **I**: Daily intake [mg/(kg·day)]
- **RfD**: Reference dose [mg/(kg·day)]

### Risk Interpretation
- **QR > 1**: Potential health risk
- **QR ≤ 1**: Low or no potential health risks

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd desafio-rema/desafio-rema
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.module.css    # Page-specific styles
│   └── page.tsx           # Main application page
├── components/            # Reusable UI components
│   └── FormField.tsx      # Form input component
├── constants/             # Application constants
│   └── index.ts           # Configuration and constants
├── hooks/                 # Custom React hooks
│   └── useRiskCalculator.ts # Main calculator logic
├── types/                 # TypeScript type definitions
│   └── index.ts           # Interface definitions
└── utils/                 # Utility functions
    ├── main.ts            # General utilities
    ├── math_utils.ts      # Mathematical calculations
    ├── parse_xlsx.ts      # Excel file parsing
    └── validation.ts      # Input validation
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Data Sources

The application uses contaminant data from the `RSLs_summaryTable.xlsx` file, which contains:
- Contaminant names
- Reference Dose (RfD) values
- Additional contaminant-specific information

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with custom dark theme
- **Data Processing**: XLSX library for Excel file parsing
- **State Management**: React hooks with custom logic
- **Accessibility**: ARIA labels and keyboard navigation

## Configuration

### Input Validation Limits

The application includes built-in validation limits to ensure realistic input values:

- **Concentration**: 0 - 10,000 mg/L or mg/kg
- **Intake Rate**: 0 - 100 L/day or kg/day
- **Exposure Frequency**: 0 - 365 days/year
- **Exposure Duration**: 0 - 100 years
- **Body Weight**: 0 - 500 kg
- **Averaging Time**: 0 - 36,500 days (~100 years)

### Display Settings

- **Precision**: Results displayed to 3 significant figures
- **Risk Threshold**: QR = 1 (above indicates potential risk)

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions or support, please open an issue in the GitHub repository.

---

**Note**: This tool is designed for environmental risk assessment professionals. Always consult with qualified experts when interpreting results for regulatory or decision-making purposes.