#!/bin/bash
# Seed products into database via API
# Run this script after starting your server (vercel dev or production)

echo "🌱 Seeding products..."

# Check if API is available
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ API is running on localhost:3000"
    curl -X POST http://localhost:3000/api/seed \
        -H "Content-Type: application/json" \
        -w "\n"
elif curl -s https://your-production-url.vercel.app/api/health > /dev/null 2>&1; then
    echo "✅ API is running on production"
    curl -X POST https://your-production-url.vercel.app/api/seed \
        -H "Content-Type: application/json" \
        -w "\n"
else
    echo "❌ API not available. Please start your server first:"
    echo "   npx vercel dev"
    echo ""
    echo "Or if using Supabase, run the SQL seed file directly:"
    echo "   Open supabase-seed.sql in Supabase SQL Editor and run it"
    exit 1
fi

