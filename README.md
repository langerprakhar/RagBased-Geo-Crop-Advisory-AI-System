# HackNite

The one AI Solution for all farmers.
Data driven insights with real time data (Satellite data -> NDVI and Weather)
Better informed desicions with interpretable daily sms messages accessible in regional languages
Recommendations based on a custom knowledge base on which outputs are focused

Technologies used
Frontend :  Next.js
Server : Flask
Database : Supabase
Custom RAG on mistral llm with finetuning

Multiple models for Crop Recommendation and Crop Yield Prediction
Easy to use and accessible solution for making better decisions
Daily SMS insights and auxiliary features available on website

# System Architecture

![arch](https://github.com/user-attachments/assets/adeecd9e-e846-4f31-9efc-f3126c93b392)


# Project Setup and Running Instructions

## Introduction
This project provides a simple guide on how to set up and run the application.

## Steps to Run the Project

1. **Clone the Repository**: Clone the project using Git.
git clone https://github.com/fridge32/HackNite.git
2. **Navigate to Project Directory**: Move into the project directory.
cd [z]
3. **Install Dependencies**: Install all required dependencies using npm.
npm install --legacy-peer-deps

## Running the Backend

To start the backend server, execute the following command:
python server.py

## Running the Frontend

To start the frontend server, execute the following command:
npm run build

Supabase :  Create account and get api key and secret
Google earth engine api : Create account providing payement verification and get api key
Open Meteo :  Open public api with no account required
Vanago : Create account, Get api key, secret key
