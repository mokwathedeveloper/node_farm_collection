#!/bin/bash
# Script to update dependencies that might be using deprecated Node.js APIs

# Check for outdated packages
echo "Checking for outdated packages..."
npm outdated

# Ask user if they want to update packages
read -p "Do you want to update outdated packages? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Updating packages..."
  npm update
  echo "Done updating packages."
fi