#!/bin/bash

# ============================================
# AlgoForge - Development Run Script
# ============================================
# This script handles all setup and running tasks
# so you don't need to burn Claude tokens on basics
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"
WASP_OUT="$APP_DIR/.wasp/out"

# Database credentials (from Docker container)
DB_USER="postgresWaspDevUser"
DB_PASS="postgresWaspDevPass"
DB_NAME="AlgoForge-ebd83a2445"
DB_HOST="localhost"
DB_PORT="5432"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

print_header() {
    echo -e "\n${PURPLE}============================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}============================================${NC}\n"
}

print_step() {
    echo -e "${CYAN}=> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}! $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if database container is running
check_db() {
    if docker ps | grep -q "wasp-dev-db-AlgoForge"; then
        print_success "Database container is running"
        return 0
    else
        print_warning "Database container is not running"
        return 1
    fi
}

# Start database
start_db() {
    print_step "Starting database..."
    cd "$APP_DIR"

    if check_db; then
        print_success "Database already running"
    else
        wasp start db &
        sleep 5
        print_success "Database started"
    fi
}

# Stop database
stop_db() {
    print_step "Stopping database..."
    if docker ps | grep -q "wasp-dev-db-AlgoForge"; then
        docker stop wasp-dev-db-AlgoForge-ebd83a2445 2>/dev/null || true
        print_success "Database stopped"
    else
        print_warning "Database was not running"
    fi
}

# Run migrations
run_migrations() {
    print_step "Running database migrations..."
    cd "$APP_DIR"
    wasp db migrate-dev --name init 2>/dev/null || wasp db migrate-dev
    print_success "Migrations complete"
}

# Seed lesson content
seed_lessons() {
    print_step "Seeding lesson content..."
    cd "$WASP_OUT/server"

    DATABASE_URL="$DATABASE_URL" npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // Create Topic: Fundamentals
  const fundamentalsTopic = await prisma.topic.upsert({
    where: { slug: 'fundamentals' },
    update: {},
    create: {
      slug: 'fundamentals',
      title: 'Fundamentals',
      description: 'Master the core building blocks of data structures and algorithms.',
      order: 1,
      iconName: 'BookOpen',
      theoryContent: '# Fundamentals\n\nWelcome to the Fundamentals module!',
      estimatedHours: 10,
      difficulty: 'beginner',
      isPublished: true,
      isPremium: false,
    },
  });
  console.log('  Created topic:', fundamentalsTopic.title);

  // Create Pattern
  const pattern = await prisma.pattern.upsert({
    where: { slug: 'arrays-hashing' },
    update: {},
    create: {
      slug: 'arrays-hashing',
      title: 'Arrays & Hashing',
      description: 'Foundation of all DSA. Hash maps for O(1) lookups.',
      order: 1,
      topicId: fundamentalsTopic.id,
      explanation: '# Arrays & Hashing Pattern',
      template: 'def solve(nums): pass',
      isPremium: false,
    },
  });
  console.log('  Created pattern:', pattern.title);

  // Create Problem: Two Sum
  const problem = await prisma.problem.upsert({
    where: { slug: 'two-sum' },
    update: {},
    create: {
      slug: 'two-sum',
      title: 'Two Sum',
      difficulty: 'easy',
      patternId: pattern.id,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: '2 <= nums.length <= 10^4',
      examples: JSON.stringify([{input: 'nums = [2,7,11,15], target = 9', output: '[0,1]'}]),
      hints: JSON.stringify(['Think about complements', 'Use a hash map']),
      solutions: JSON.stringify([{approach: 'Hash Map', complexity: {time: 'O(n)', space: 'O(n)'}}]),
      starterCode: JSON.stringify({python: 'def twoSum(nums, target): pass'}),
      testCases: JSON.stringify([{input: '[2,7,11,15]\n9', output: '[0,1]', isHidden: false}]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });
  console.log('  Created problem:', problem.title);

  // Add company tags
  const companies = ['Google', 'Amazon', 'Meta', 'Microsoft'];
  for (const name of companies) {
    await prisma.problemCompany.upsert({
      where: {problemId_companyName: {problemId: problem.id, companyName: name}},
      update: {},
      create: {problemId: problem.id, companyName: name, frequency: 5}
    });
  }
  console.log('  Added company tags');

  await prisma.\$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
" 2>&1

    print_success "Lesson content seeded"
}

# Start the app
start_app() {
    print_step "Starting AlgoForge app..."
    cd "$APP_DIR"
    wasp start
}

# Full setup (first time)
full_setup() {
    print_header "AlgoForge - Full Setup"

    check_docker

    print_step "Installing dependencies..."
    cd "$APP_DIR"
    npm install 2>/dev/null || true

    start_db
    sleep 3

    run_migrations
    seed_lessons

    print_header "Setup Complete!"
    echo -e "${GREEN}Run './run.sh start' to start the app${NC}\n"
}

# Show help
show_help() {
    echo -e "${CYAN}AlgoForge Run Script${NC}"
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  ${GREEN}setup${NC}      - Full first-time setup (install, migrate, seed)"
    echo "  ${GREEN}start${NC}      - Start the app (assumes db is running)"
    echo "  ${GREEN}dev${NC}        - Start db + app together"
    echo "  ${GREEN}db${NC}         - Start only the database"
    echo "  ${GREEN}db:stop${NC}    - Stop the database"
    echo "  ${GREEN}migrate${NC}    - Run database migrations"
    echo "  ${GREEN}seed${NC}       - Seed lesson content"
    echo "  ${GREEN}reset${NC}      - Reset db and re-seed everything"
    echo "  ${GREEN}clean${NC}      - Clean wasp build + reinstall deps (fixes 404s)"
    echo "  ${GREEN}status${NC}     - Check status of services"
    echo "  ${GREEN}help${NC}       - Show this help message"
    echo ""
    echo "Quick Start:"
    echo "  1. First time: ./run.sh setup"
    echo "  2. Then: ./run.sh dev"
    echo ""
}

# Check status
check_status() {
    print_header "Service Status"

    echo -n "Docker: "
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}Running${NC}"
    else
        echo -e "${RED}Not running${NC}"
    fi

    echo -n "Database: "
    if docker ps | grep -q "wasp-dev-db-AlgoForge"; then
        echo -e "${GREEN}Running${NC}"
    else
        echo -e "${RED}Not running${NC}"
    fi

    echo ""
}

# Reset database
reset_db() {
    print_header "Resetting Database"

    stop_db
    sleep 2

    print_step "Removing old container..."
    docker rm wasp-dev-db-AlgoForge-ebd83a2445 2>/dev/null || true

    start_db
    sleep 5

    run_migrations
    seed_lessons

    print_success "Database reset complete"
}

# Clean wasp build
clean_build() {
    print_header "Cleaning Wasp Build"
    cd "$APP_DIR"

    print_step "Removing node_modules (force)..."
    rm -rf node_modules .wasp/out/server/node_modules .wasp/out/web-app/node_modules 2>/dev/null || true

    print_step "Removing .wasp directory..."
    rm -rf .wasp

    print_step "Clearing npm cache..."
    npm cache clean --force 2>/dev/null || true

    print_success "Clean complete! Run './run.sh dev' to start fresh"
}

# Main command handler
case "${1:-help}" in
    setup)
        full_setup
        ;;
    start)
        start_app
        ;;
    dev)
        start_db
        sleep 2
        start_app
        ;;
    db)
        start_db
        ;;
    db:stop)
        stop_db
        ;;
    migrate)
        run_migrations
        ;;
    seed)
        seed_lessons
        ;;
    reset)
        reset_db
        ;;
    clean)
        clean_build
        ;;
    status)
        check_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
