# Babado.ai - Quick Start Guide

Get Babado.ai up and running in 5 minutes!

## 1️⃣ Prerequisites
- Node.js 16+ installed
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- A Supabase account (free tier available)

## 2️⃣ Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## 3️⃣ Configure Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API credentials:
   - Project URL
   - Anon Public Key
4. Update `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 4️⃣ Start Development Server

```bash
npm run dev
```

This will start Expo and show a QR code.

## 5️⃣ Run on Device

### Option A: Expo Go (Easiest)
- Install "Expo Go" app on your phone
- Scan the QR code from terminal
- App loads in seconds

### Option B: iOS Simulator
```bash
npm run ios
```

### Option C: Android Emulator
```bash
npm run android
```

### Option D: Web Browser
```bash
npm run web
```

## 🎯 Test the App

### Test Account (Create your own)
1. Click "Register" on the login screen
2. Enter: email, username, password
3. Login with your credentials

### Features to Try
1. **Create Story**
   - Press "✨ Create Story" button
   - Enter title and content
   - Choose emotional tone
   - Toggle anonymous
   - Press "Publish"

2. **Check Viral Score**
   - See the score on story card (0-100)
   - Higher score = more viral potential

3. **View Analytics**
   - Go to Profile → Analytics
   - See your story statistics
   - Find best performing story

4. **Change Language**
   - Go to Settings
   - Click "EN" or "PT"
   - UI changes instantly

5. **Subscribe**
   - Go to Profile → Subscription
   - View pricing plans
   - Click "Subscribe"

6. **Notifications**
   - Go to Notifications
   - See your activity alerts

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Configuration credentials |
| `src/App.tsx` | Main app with navigation |
| `src/screens/` | All user-facing screens |
| `src/services/supabase.ts` | Database connection |
| `src/store/` | State management |

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Connection Issues
- Check `.env` file has correct Supabase URL
- Ensure Supabase project is active
- Check internet connection

### Expo App Won't Load
- Make sure phone is on same WiFi as computer
- Try restarting Expo dev server
- Clear Expo app cache

## 📚 Documentation

- **[README.md](./README.md)** - Full documentation
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-reload in Expo Go
2. **Console Logs**: Check terminal for debug messages
3. **Error Messages**: Watch terminal for helpful error info
4. **Performance**: Use Chrome DevTools for debugging

## 🚀 What's Next?

### After Testing
1. Try all features thoroughly
2. Test on different devices
3. Provide feedback
4. Report bugs

### To Add Features
1. Create new screens in `src/screens/`
2. Add state to stores if needed
3. Update navigation in `App.tsx`
4. Add to `.env` for new config

### To Deploy
```bash
# Check build is ready
npm run build

# Then build for store
eas build -p ios    # For App Store
eas build -p android # For Play Store
```

## 🎓 Learning Paths

### If You're New to React Native
1. Check `src/screens/auth/LoginScreen.tsx` - Simple component
2. Look at `src/components/` for UI patterns
3. Read React Native docs: reactnative.dev

### If You Want to Add Features
1. Check similar screens for patterns
2. Copy and modify existing code
3. Reference `src/types/index.ts` for data structures
4. Test in Expo Go frequently

## ❓ Common Questions

**Q: Can I use this on web?**
A: Yes! Run `npm run web` and open in browser

**Q: How do I publish to app stores?**
A: See README.md → Deployment section

**Q: Can I change the design?**
A: Yes! Colors and spacing in `src/constants/colors.ts`

**Q: How do I add more languages?**
A: Edit `src/i18n/translations.ts` and add new locale

**Q: Can I run on a real device?**
A: Yes! Scan the Expo QR code with your phone

## 📞 Need Help?

1. Check the [README.md](./README.md)
2. Look for similar features in existing screens
3. Check TypeScript errors in terminal
4. Inspect Network tab for API issues

## ✨ You're All Set!

Your Babado.ai app is ready to use! Start creating viral stories.

Happy coding! 🚀
