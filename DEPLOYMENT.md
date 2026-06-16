# Production Deployment Guide - NexShop

This guide explains how to deploy the NexShop full-stack e-commerce application to production.

## Architecture Overview

*   **Database:** MongoDB Atlas (Free Tier)
*   **Backend API:** Render (Web Service)
*   **Frontend Client:** Cloudflare Pages (Static Hosting)

---

## Step 1: Database Setup (MongoDB Atlas)

1.  Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Deploy a new free cluster (Shared Tier).
3.  Navigate to **Database Access** under Security:
    *   Create a new database user.
    *   Select password-based authentication and secure a strong password.
4.  Navigate to **Network Access** under Security:
    *   Click **Add IP Address**.
    *   Add `0.0.0.0/0` (Allow Access from Anywhere) so Render servers can connect to the database.
5.  Go to the **Clusters** dashboard:
    *   Click **Connect** on your cluster.
    *   Choose **Drivers** as your connection method.
    *   Copy the connection string (it looks like `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
    *   Replace `<password>` with the password of the database user you created.

---

## Step 2: Backend Deployment (Render)

1.  Create an account on [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository containing the project.
4.  Configure the service details:
    *   **Name:** `nexshop-api`
    *   **Root Directory:** `server`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node src/index.js`
5.  In the **Environment Variables** section, add the following parameters:
    *   `PORT` = `5000` (or leave empty, Render overrides this)
    *   `NODE_ENV` = `production`
    *   `MONGODB_URI` = *Your MongoDB Atlas Connection String*
    *   `JWT_SECRET` = *A cryptographically secure secret string*
    *   `CLIENT_URL` = *Your Cloudflare Pages frontend URL (obtained in Step 3)*
    *   `SERVER_URL` = *Your Render web service URL (e.g. `https://nexshop-api.onrender.com`)*
    *   `SSLCOMMERZ_STORE_ID` = *Your SSLCommerz Merchant/Sandbox Store ID*
    *   `SSLCOMMERZ_STORE_PASSWORD` = *Your SSLCommerz Merchant/Sandbox Store Password*
    *   `SSLCOMMERZ_IS_SANDBOX` = `false` (set `true` if testing using sandbox sandbox credentials)
6.  Click **Deploy Web Service**.

---

## Step 3: Frontend Deployment (Cloudflare Pages)

1.  Create a free account on [Cloudflare](https://dash.cloudflare.com/).
2.  Navigate to **Workers & Pages** -> **Pages** -> **Connect to Git**.
3.  Select your GitHub repository.
4.  Configure the build settings:
    *   **Project Name:** `nexshop`
    *   **Production Branch:** `main`
    *   **Framework Preset:** `Vite`
    *   **Root Directory:** `client`
    *   **Build Command:** `npm run build`
    *   **Build Output Directory:** `dist`
5.  In the **Environment Variables** section, add:
    *   `VITE_API_URL` = *Your Render backend service API URL (e.g., `https://nexshop-api.onrender.com/api`)*
6.  Click **Save and Deploy**.
7.  Copy your deployed page domain (e.g. `https://nexshop.pages.dev`) and update the `CLIENT_URL` environment variable on your Render Backend settings!

---

## SSLCommerz Verification & Callbacks

SSLCommerz requires valid redirection routes to process successfully. By default, the application is pre-configured to redirect to:
*   Success Callback: `${SERVER_URL}/api/orders/payment/success?tranId=${tranId}`
*   Failure Callback: `${SERVER_URL}/api/orders/payment/fail?tranId=${tranId}`
*   Cancel Callback: `${SERVER_URL}/api/orders/payment/cancel?tranId=${tranId}`

Upon validation, the backend redirects the user's browser back to:
*   Success Frontend Page: `${CLIENT_URL}/checkout/success?tranId=${tranId}`
*   Failure Frontend Page: `${CLIENT_URL}/checkout/fail?tranId=${tranId}`
*   Cancellation Frontend Page: `${CLIENT_URL}/checkout/cancel?tranId=${tranId}`

Ensure `CLIENT_URL` and `SERVER_URL` environment variables are correctly populated on Render so redirects function seamlessly!
