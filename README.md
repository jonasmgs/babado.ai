# 📱 Babado.ai - Viral Story Creator

A React Native mobile application that uses AI to create, transform, and maximize stories for social media virality. Create compelling narratives in seconds and export them optimized for TikTok, Reels, Shorts, and X.

## ✨ Features

### Core Functionality

- **Story Creation** - Write real or fictional stories with AI-powered assistance
- **Emotional Tone Customization** - Dramatic, Humorous, Inspirational, Sarcastic, Mysterious, Nostalgic
- **Anonymous Posting** - Create stories without revealing your identity
- **Viral Score Analysis** - AI evaluates each story and provides a 0-100 viral potential score
- **Smart Hooks** - Auto-generates attention-grabbing opening lines optimized for each platform
- **Multi-Platform Export** - Transform stories into platform-specific formats

### User Features

- **Authentication** - Secure email/password registration and login
- **User Profiles** - Customize avatar, bio, and personal information
- **Story Dashboard** - Manage, edit, and track all your stories
- **Real-time Analytics** - Monitor viral scores and engagement metrics
- **Push Notifications** - Receive updates on story performance and milestones
- **Subscription Plans** - Free, Pro, and Unlimited tiers

### Admin Features

- **Dashboard** - Overview of platform statistics
- **User Management** - Monitor active users and subscriptions
- **Content Moderation** - Review and manage published stories
- **Analytics** - Track platform growth and revenue

### Technical Features

- **Multi-Language Support** - English and Portuguese (i18n)
- **Responsive Design** - Optimized for all mobile devices
- **Offline Support** - Partial functionality without internet
- **Performance Optimized** - Fast loading and smooth interactions
- **Secure Data** - Row Level Security with Supabase

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/jonasmgs/babado.ai.git
cd babado-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://your-api.com
```

4. **Set up Supabase database**

- Create a Supabase project
- Run database migrations from `DATABASE_SCHEMA.md`
- Enable authentication in Supabase dashboard

5. **Start the development server**

```bash
npm run dev
```

6. **Run on simulator/device**

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/
│   ├── auth/           # Login and registration
│   ├── home/           # Main dashboard
│   ├── story/          # Story creation and editing
│   ├── profile/        # User profile
│   ├── subscription/   # Billing and plans
│   ├── analytics/      # Stats and insights
│   ├── settings/       # App settings
│   ├── notifications/  # Notification center
│   └── admin/          # Admin dashboard
├── services/           # API and Supabase calls
├── store/              # Zustand state management
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── constants/          # Colors, spacing, etc.
├── i18n/               # Language translations
└── types/              # TypeScript definitions
```

## 🎨 Design System

### Colors

- **Primary**: Purple gradient (`#7c3aed` to `#6d28d9`)
- **Secondary**: Green (`#22c55e`)
- **Accent**: Orange (`#f97316`)
- **Neutral**: Grayscale palette

### Typography

- **Headings**: Bold, 18-32px
- **Body**: Regular, 14-16px
- **Small**: Regular, 12px
- **Line Height**: 150% body, 120% headings

### Spacing

- Based on 8px grid system
- `xs: 4px`, `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`, `xxl: 32px`

## 🔐 Authentication

Uses Supabase email/password authentication with:

- Secure password hashing
- Session management
- Token refresh
- Automatic sign-out on token expiry

### Auth Screens

1. **Login** - Email and password authentication
2. **Register** - Create new account with username
3. **Password Recovery** - Email-based password reset

## 💰 Subscription Plans

| Feature       | Free | Pro   | Unlimited |
| ------------- | ---- | ----- | --------- |
| Stories/month | 5    | 50    | Unlimited |
| Exports/month | 10   | 100   | Unlimited |
| AI Voice      | ✗    | ✓     | ✓         |
| Multi-format  | ✗    | ✓     | ✓         |
| Price         | Free | $9.99 | $19.99    |

## 📊 Viral Score Algorithm

The algorithm evaluates:

- **Word count** (optimal: 50-150 words)
- **Viral keywords** presence
- **Emotional tone** alignment
- **Questions & exclamations** (engagement drivers)
- **Readability** (line breaks, formatting)
- **Hook quality** (opening impact)

Scores range from 0-100, with recommendations for improvement.

## 🔄 State Management

Uses **Zustand** for global state:

- `useAuthStore` - User authentication
- `useStoryStore` - Story CRUD operations
- `useLanguageStore` - Language preferences (i18n)

## 🌐 API Integration

### Supabase Services

- **Database** - PostgreSQL with RLS
- **Auth** - Email/password authentication
- **Storage** - File uploads (images, videos)
- **Real-time** - Live updates

### External APIs

- **AI Processing** - Story rewriting and hooks (Edge Functions)
- **Payment Processing** - Stripe integration (optional)
- **Voice Generation** - ElevenLabs (optional)

## 📱 Push Notifications

Using Expo Notifications:

- Story published confirmations
- Milestone achievements
- Payment receipts
- System alerts

## 🧪 Testing

Run tests with:

```bash
npm test
```

Tests cover:

- Component rendering
- User interactions
- API calls
- State management

## 📈 Performance Metrics

Target metrics:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Touch-friendly targets (min 44x44px)

## 🔒 Security

- Row Level Security (RLS) on all database tables
- Secure password hashing
- HTTPS for all communications
- API key protection
- User input validation
- CSRF protection

## 📝 Environment Variables

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=          # Your Supabase URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=     # Anonymous key
EXPO_PUBLIC_API_URL=                # API base URL

# Optional: AI & Payment Services
OPENAI_API_KEY=                     # For story rewriting
STRIPE_PUBLIC_KEY=                  # For payments
ELEVENLABS_API_KEY=                # For voice generation
```

## 🚀 Deployment

### iOS

```bash
npm run build:ios
```

### Android

```bash
npm run build:android
```

### Web

```bash
npm run build:web
```

## 📚 Documentation

- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API.md) (if applicable)
- [Deployment Guide](./DEPLOYMENT.md) (if applicable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support

For issues and questions:

- Create an issue on GitHub
- Check existing documentation
- Review FAQ section

## 🎯 Roadmap

### Phase 1

- ✅ Core story creation
- ✅ Basic viral scoring
- ✅ Authentication
- ✅ Subscription system

### Phase 2 (Completed 🚀)

- ✅ AI voice narration (ElevenLabs)
- ✅ Video editing
- ✅ Social media integration
- ✅ Trend analysis
- ✅ Onboarding & UX Polish

### Phase 3

- 📅 Marketplace for templates
- 📅 Collaboration features
- 📅 Advanced analytics
- 📅 White-label solution

## 💡 Key Features Implemented

✅ Multi-screen navigation
✅ User authentication
✅ Story CRUD operations
✅ Viral score calculation
✅ Multi-language support
✅ Responsive design
✅ Push notifications
✅ Admin dashboard
✅ Subscription management
✅ File uploads
✅ Analytics dashboard
✅ Settings management

---

Built with ❤️ using React Native, Expo, TypeScript, and Supabase
