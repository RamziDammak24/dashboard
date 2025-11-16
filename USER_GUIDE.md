# Patisserie Dashboard - Quick Start Guide

## Running the Dashboard

### Start the Application
```bash
npm run electron-dev
```

The Electron window will open with your dashboard ready to use.

## Dashboard Overview

### Sidebar Navigation

The left sidebar contains 7 main sections:

1. **Products** 📦 - Manage your product catalog
2. **Stock** 📊 - View inventory status
3. **Transactions** 💰 - Track financial operations
4. **Employees** 👥 - Manage staff
5. **Weekly Templates** 📅 - View production schedules
6. **Reports** 📄 - Access archived reports
7. **Test Data** 🎲 - Generate sample data

---

## Using Each Section

### 1. Products Management

**View Products**
- All products are displayed in a table
- Shows: Name, Price, Pieces per Tray, Target values

**Add Product**
1. Click "Add Product" button
2. Fill in:
   - Name (e.g., "Croissant")
   - Price (in DT)
   - Pieces Per Tray
   - Target Value
   - Target Type (pieces or plateaux)
3. Click "Save"

**Edit Product**
1. Click the blue edit icon ✏️
2. Modify fields
3. Click green checkmark ✓ to save

**Delete Product**
1. Click red trash icon 🗑️
2. Confirm deletion

---

### 2. Stock Management

**View Stock**
- Stock items shown as cards
- Each card displays:
  - Product name
  - Production date
  - Total produced
  - Items in freezer
  - Ready to sell
  - Items in POS
  - Items sold today
  - Number of cashier sessions

**Delete Stock Item**
- Click the trash icon on any card
- Confirm deletion

---

### 3. Transactions

**Dashboard Stats**
- Total Income (green)
- Total Expense (red)
- Net Balance

**Add Transaction**
1. Click "Add Transaction"
2. Select type: Income or Expense
3. Enter amount
4. Enter reason
5. Optional: Cashier name
6. Click "Save"

**View Transactions**
- Table shows all transactions
- Color coded: Green (income), Red (expense)
- Sorted by date (newest first)

**Delete Transaction**
- Click trash icon
- Confirm deletion

---

### 4. Employees

**Two Categories**
- **Cashiers** (purple) - With PIN codes
- **Bakers** (orange) - No PIN needed

**Add Employee**
1. Click "Add Employee"
2. Enter name
3. Select type (Caissier or Boulanger)
4. If cashier: Enter 4-digit PIN
5. Click "Save"

**Edit Employee**
1. Click edit icon
2. Modify details
3. Click save

**Delete Employee**
- Click trash icon
- Confirm deletion

---

### 5. Weekly Templates

**View Only**
- Displays production schedules
- Shows which employee produces what on which days
- Table format with all weekdays

---

### 6. Reports Archive

**View Reports**
- Each report card shows:
  - Date
  - Total sales
  - Total expenses
  - Total income
  - Final balance
  - Number of cashier sessions
  - Local save status

**Download Report**
- Click "Download PDF" button (placeholder)

---

### 7. Test Data Generator

**Generate Individual Collections**

Click any button to generate:
- 5 Products
- 10 Stock Items
- 20 Transactions
- 4 Employees
- 5 Reports

**Generate All Data**
- Click "Generate All Data" to populate everything
- Watch the generation log for progress
- Each entry shows timestamp and status

**Generation Log**
- Black console showing:
  - Start time of each operation
  - Success/failure status
  - Number of items created

---

## Tips & Best Practices

### Data Management
1. **Start Fresh**: Use Test Data Generator for initial setup
2. **Regular Cleanup**: Delete test data before production use
3. **Backup**: Export data periodically through Firebase console

### Performance
- Dashboard loads data in real-time from Firebase
- Changes are immediate
- No need to refresh

### Testing Workflow
1. Generate test data
2. Test CRUD operations
3. Verify in Firebase console
4. Delete test data
5. Add real production data

---

## Keyboard Shortcuts

- **F12** or **Ctrl+Shift+I**: Open Developer Tools
- **Ctrl+R**: Reload the app
- **Ctrl+Q**: Quit application

---

## Common Tasks

### Adding Multiple Products
1. Go to Products tab
2. Click "Add Product"
3. Fill form
4. Save
5. Repeat

### Checking Today's Sales
1. Go to Transactions
2. View top stats for totals
3. Check table for individual transactions

### Managing Staff
1. Go to Employees
2. Add new employees with correct type
3. For cashiers, ensure PIN is set
4. Bakers don't need PINs

---

## Troubleshooting

**Can't see data?**
- Check internet connection
- Verify Firebase credentials
- Check browser console (F12)

**Changes not saving?**
- Check Firebase console for errors
- Verify you have write permissions
- Check network tab in DevTools

**App not starting?**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check if port 3000 is available

---

## Firebase Console

Access your data directly:
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Select project: `patisserie-app-test`
3. Go to Firestore Database
4. View/edit collections manually

---

## Support

For technical issues:
1. Check the console logs (F12)
2. Review Firebase security rules
3. Verify network connectivity
4. Check README.md for detailed setup

Happy managing! 🥐
