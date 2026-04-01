#!/bin/bash
# StudentSite Content Population Script
# This script helps you set up content seeding

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         StudentSite - Content Population Helper               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "📝 Creating .env.local..."
    cat > .env.local << EOF
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/studentsite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Admin Secret (for signup)
ADMIN_SECRET_KEY=admin-secret-for-signup
EOF
    echo "✅ .env.local created. Please update with your actual values!"
    exit 1
fi

echo "📚 StudentSite Content Setup"
echo ""
echo "Choose an option:"
echo ""
echo "1) Seed basic content (4 articles, 4 roadmaps, 5 materials)"
echo "2) Seed extended content (5 more articles, 5 more materials)"
echo "3) Seed everything (1 + 2)"
echo "4) Start development server (npm run dev)"
echo "5) View content guides"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🌱 Seeding basic content..."
        npm run seed
        ;;
    2)
        echo "🌱 Seeding extended content..."
        echo "Note: Basic content should be seeded first!"
        npm run seed:extended
        ;;
    3)
        echo "🌱 Seeding all content..."
        npm run seed
        npm run seed:extended
        echo "✅ All content seeded!"
        ;;
    4)
        echo "🚀 Starting development server..."
        npm run dev
        ;;
    5)
        echo "📖 Available documentation:"
        echo ""
        echo "1. QUICK_START.md - 5-minute setup"
        echo "2. CONTENT_GUIDE.md - Detailed content info"
        echo "3. UI_CONTENT_ENHANCEMENT.md - This guide"
        echo "4. VERCEL_DEPLOYMENT_FIXES.md - Production deployment"
        echo ""
        read -p "Choose file number (1-4) or 0 to exit: " doc_choice
        case $doc_choice in
            1) less QUICK_START.md ;;
            2) less CONTENT_GUIDE.md ;;
            3) less UI_CONTENT_ENHANCEMENT.md ;;
            4) less VERCEL_DEPLOYMENT_FIXES.md ;;
            0) exit 0 ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✨ All Done! ✨                            ║"
echo "║                                                                ║"
echo "║  Next steps:                                                   ║"
echo "║  1. Visit http://localhost:3000                              ║"
echo "║  2. Browse articles, roadmaps, materials                     ║"
echo "║  3. Login to admin panel at /admin                           ║"
echo "║  4. Create more content as needed                            ║"
echo "║                                                                ║"
echo "║  Happy Learning! 🎓                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
