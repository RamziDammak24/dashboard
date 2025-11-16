# Patisserie Developer Dashboard

This is an Electron.js desktop application built with Next.js 15, React 19, TypeScript, and Firebase Firestore.

## Project Overview

A comprehensive developer dashboard for managing a Patisserie's Firebase database with full CRUD operations and test data generation capabilities.

## Tech Stack

- Electron 33 - Desktop application framework
- Next.js 15 with App Router
- React 19 with TypeScript
- Firebase (Firestore database)
- Tailwind CSS for styling
- Lucide React for icons

## Key Features

- Products management (CRUD)
- Stock tracking (view/delete)
- Financial transactions (CRUD with analytics)
- Employee management (CRUD with cashier PIN support)
- Weekly production templates (view)
- Reports archive (view)
- Test data generator for development

## Project Structure

- `src/app/` - Next.js app directory with pages and layouts
- `src/components/` - React components
  - `Dashboard.tsx` - Main layout with sidebar navigation
  - `views/` - Individual view components for each collection
  - `TestDataGenerator.tsx` - Random data generation utility
- `src/lib/` - Firebase configuration
- `src/types/` - TypeScript type definitions
- `public/` - Electron main process files

## Development Commands

- `npm run electron-dev` - Run in development mode (Next.js + Electron)
- `npm run build` - Build Next.js
- `npm run electron-build` - Build desktop application

## Firebase Collections

The app manages these Firestore collections:
- products
- stock
- transactions
- employees
- weeklyTemplates
- reports_archive

## Code Style

- Use functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Async/await for Firebase operations
- Error handling with try/catch
