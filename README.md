<img alt="Entretien AI" src="public/_static/og.jpg">

<p align="center">
  <img src="https://img.shields.io/github/license/Ashref-dev/entretien-ai" alt="License">
  <img src="https://img.shields.io/github/last-commit/Ashref-dev/entretien-ai" alt="Last Commit">

</p>

<p align="center" style="margin-top: 20px">
  <p align="center">
    Entretien AI - Master Your Interview Game
    <br>
    <a href="https://entretien-ai.com"><strong>Get Started »</strong></a>
    <br />
    <br />
    <a href="https://entretien-ai.com/about">About</a>
    ·
    <a href="https://entretien-ai.com">Website</a>
    ·
    <a href="https://entretien-ai.com/blog">Blog</a>
    ·
    <a href="https://entretien-ai.com/pricing">Pricing</a>
  </p>
</p>

## About Entretien AI

Master the art of interviewing with Entretien AI. Our cutting-edge platform uses advanced AI technology to provide personalized interview preparation, helping you transform interview anxiety into confident performance. Whether you're targeting tech giants or startups, we'll help you showcase your best self.

## Key Features

- **AI-Powered Mock Interviews**: Experience realistic interview simulations with our advanced AI system
- **Real-Time Feedback**: Get instant analysis on your responses, body language, and delivery
- **Technical Interview Prep**: Specialized tracks for software engineering roles across all levels
- **Performance Analytics**: Track your progress with detailed metrics and improvement insights
- **Custom Interview Paths**: Tailored preparation paths based on your target role and company
- **Comprehensive Feedback**: Detailed analysis of technical accuracy, communication skills, and presentation

## Tech Stack

<p align="left">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js%2015-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"></a>
  <a href="https://www.typescriptlang.org"><img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"></a>
</p>

### Frontend
- [Next.js 15](https://nextjs.org/) - React Framework
- [React](https://react.dev/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

### Backend & Database
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [Neon](https://neon.tech/) - Serverless Postgres
- [Auth.js v5](https://authjs.dev/) - Authentication
- [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions) - API Endpoints

### Email & Communications
- [Resend](https://resend.com/) - Email Infrastructure
- [React Email](https://react.email/) - Email Templates

## Getting Started

### Prerequisites

- Deno, bun or node.js 18.x or higher

Important:
This project uses `@t3-oss/env-nextjs` for runtime environment variable validation. The validation schema is defined in `env.mjs` and ensures all required environment variables are present with the correct types.

### Required Environment Variables

The following environment variables must be set in your `.env` file:

#### Authentication
- `AUTH_SECRET`: Secret key for authentication
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `AUTH_GITHUB_ID`: GitHub OAuth app ID
- `AUTH_GITHUB_SECRET`: GitHub OAuth app secret

#### Database
- `DATABASE_URL`: PostgreSQL connection string

#### Email
- `RESEND_API_KEY`: API key for Resend email service
- `EMAIL_FROM`: Sender email address

#### AI Services
- `AI_API_KEY`: API key for AI services
- `GROQ_API_KEY`: Groq API key (optional)
- `GROK_API_KEY`: Grok API key (optional)

#### Stripe Integration
- `STRIPE_API_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID`: Monthly pro plan ID
- `NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID`: Yearly pro plan ID
- `NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID`: Monthly business plan ID
- `NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID`: Yearly business plan ID

#### Application URLs
- `NEXT_PUBLIC_APP_URL`: Public URL of your application
- `NEXTAUTH_URL`: Auth.js URL (optional in production)

### Environment Validation

The project uses strict runtime validation for environment variables:

- Server-side variables are validated before the server starts
- Client-side variables are validated during build time
- Type-safe access to environment variables throughout the application
- Helpful error messages if required variables are missing

For production builds, the application uses `.env.production` with dummy values during build time. The actual runtime values are provided by Azure App Service environment variables.

Do not modify `.env.production` with real values as it's committed to the repository.


### Installation

1. Clone the repository:

```sh
git clone https://github.com/Ashref-dev/entretien-ai
```

2. Install dependencies:

```sh
bun install
```

3. Copy the example environment file:

```sh
cp .env.example .env
```

4. Set up your environment variables:
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- NEXT_PUBLIC_APP_URL
- DATABASE_URL
- Etc.

5. Initialize the database:

```sh
bunx prisma db push
```

6. Run the development server:

```sh
bun dev
```

## Deployment

<div style="display: flex; gap: 4px;">
<img src="https://img.shields.io/badge/microsoft%20azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white" alt="Azure Cloud">
<img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Containers">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon Cloud">
</div>

### This project comes with a ready-to-use Docker configuration and GitHub Actions pipeline for Azure Cloud deployment.

### Docker Support
- Includes a production-ready Dockerfile
- Optimized multi-stage builds for smaller image size
- Configured for Next.js and Bun

### Azure Cloud Deployment
- Pre-configured GitHub Actions workflow for CI/CD
- Automated deployments to Azure App Service
- For detailed deployment commands, see [Deployment Guide](Deployment/commands.md)

To deploy to Azure:
1. Set up an Azure subscription (free with GitHub Student Pack)
2. Install Azure CLI and authenticate
3. Follow the commands in the deployment guide to:
   - Create resource group
   - Set up App Service Plan
   - Configure environment variables
   - Deploy container image

For complete deployment instructions and Azure CLI commands, check our [Deployment Guide](Deployment/commands.md).

## Code of Conduct

We are committed to fostering an open and welcoming environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) for details on our community behavior standards and how to report unacceptable behavior.

## Contributing

We welcome contributions! Please see our contribution guidelines for details.

## Contact

For support or inquiries, contact us at support@entretien-ai.com

## Privacy & Security

We take your privacy seriously. See our [Privacy Policy](https://entretien-ai.com/privacy) for details about:
- Data collection and usage
- Security measures
- Your privacy rights

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

The AGPL-3.0 license ensures that:
- You can use this software freely
- You can modify and distribute this software
- If you modify and share this software, you must:
  - Make your modifications available under the same license
  - Share the source code when you deploy modified versions
  - Preserve copyright notices and license information


## the shader gradients
here's the links to the used gradients:

```

Gradient 1:
https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=5.7&cPolarAngle=115&cameraZoom=1&color1=%23268c9a&color2=%239224b3&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=on&lightType=3d&pixelDensity=1&positionX=-0.5&positionY=0.1&positionZ=-1&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=2.4&uTime=0.2&wireframe=false&zoomOut=false

Gradient 2:
https://shadergradient-web.vercel.app/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.1&cAzimuthAngle=170&cDistance=4.4&cPolarAngle=70&cameraZoom=1&color1=%23b5e1ff&color2=%23f6d1ff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0.9&positionZ=-0.3&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.2&uFrequency=0&uSpeed=0.1&uStrength=3.4&uTime=0&wireframe=false

```

# Entretien AI TO DOs

## Feature 1: Multiple Language Support using i18n Next

### Steps:
1. **Setup i18n Configuration**:
   - Install and configure next-i18next package
   - Create language TypeScript files for supported languages
   - Set up language detection and routing

2. **Implement Language Files**:
   - Create translation files for each supported language
   - Organize translations by feature/component
   - Include metadata like language name and direction

3. **Add Language Switching**:
   - Create language selector component
   - Implement language switching logic
   - Persist language preference

4. **Translate Content**:
   - Update components to use translation keys
   - Add translations for all static text
   - Handle dynamic content translation

5. **Test Localization**:
   - Verify translations in all supported languages
   - Test RTL language support
   - Validate language switching functionality

---

## Notes:
- Follow Next.js i18n best practices and documentation
- Ensure proper fallback handling for missing translations
- Consider cultural differences in UI/UX design
- Test performance impact of language bundles


## Feature 2: Newsletter Subscription System

### Steps:
1. **Database Schema Setup**:
   - Create newsletter subscriber table in Prisma schema
   ```prisma
   model NewsletterSubscriber {
     id        String   @id @default(cuid())
     email     String   @unique
     status    String   @default("active") // active, unsubscribed
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Email Validation & Processing**:
   - Implement Zod schema for email validation
   - Create server action for subscription handling
   - Set up rate limiting for form submissions
   ```typescript
   const newsletterSchema = z.object({
     email: z.string().email("Please enter a valid email address")
   });
   ```

3. **Email Service Integration**:
   - Configure Resend for confirmation emails (it's there but not working)
   - Create React Email template for welcome message
   - Implement double opt-in confirmation

### Technical Requirements:
- Resend API integration
- PostgreSQL database
- Rate limiting middleware
- Email templating system
- Error handling and logging

### Security Considerations:
- Email validation and sanitization
- CSRF protection
- Rate limiting
- GDPR compliance
- Secure storage of subscriber data

---