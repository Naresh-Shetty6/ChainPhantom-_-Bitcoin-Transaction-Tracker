# ChainPhantom - Bitcoin Transaction Explorer

ChainPhantom is a sophisticated Bitcoin blockchain explorer that allows users to trace transaction flows, detect suspicious patterns, and visualize transaction chains. The application uses the BlockCypher API for real-time blockchain data.

> **Note:** This project is **still under active development**. Features and APIs may change. Contributions are welcome!

## Features

- **Search by Address or Transaction Hash**: Easily find transactions by using a Bitcoin address or transaction hash
- **Transaction Details**: View comprehensive information about transactions including inputs, outputs, amounts, and fees
- **Transaction Chain Tracing**: Visualize the flow of funds through multiple transactions
- **Suspicious Pattern Detection**: Automatically identify potentially suspicious transaction patterns such as:
  - Round-trip transactions
  - Multiple rapid-succession transactions
  - Unusually precise transaction amounts
- **Interactive UI**: Modern dark-themed interface inspired by Blockstream.info

## Project Structure

```
chainphantom/
├── backend/                # Node.js backend
│   ├── index.js            # Express server with API endpoints
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   └── src/                # React components
│       ├── components/     # UI components
│       └── App.js          # Main application component
├── database/               # SQLite database (for local dev)
├── README.md               # This file
├── LICENSE                 # License file
├── requirements.txt        # Top-level requirements (see below)
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup(HOW TO RUN)

```bash
cd backend
npm install
npm start
```

The backend server will run on http://localhost:5000.

### Frontend Setup(HOW TO RUNS)

```bash
cd frontend
npm install
npm start
```

The frontend application will run on http://localhost:3000.

### Requirements

See [requirements.txt](./requirements.txt) for a summary of key dependencies for both backend and frontend.

#### How to Install Requirements

- **Backend:**
  1. Open a terminal and navigate to the `backend` directory:
     ```bash
     cd backend
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```

- **Frontend:**
  1. Open a terminal and navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```

> **Note:** The `requirements.txt` file is for reference only. All dependencies are managed via `npm` in their respective directories.

## API Endpoints

- `GET /api/search/:query` - Search for transactions by address or hash
- `POST /api/analyze` - Analyze transactions for an address
- `POST /api/trace` - Trace a transaction chain through multiple hops
- `POST /api/detect-suspicious` - Detect suspicious patterns in transaction history



## Technologies Used

- **Frontend**: React, Bootstrap, Custom CSS, D3.js, jsPDF, html2canvas
- **Backend**: Node.js, Express, node-fetch, axios, cors
- **API**: BlockCypher
- **Dev Tools**: Visual Studio Code, Git

## Features in Development

- **Export and Reporting**: Generate PDF reports and export data in CSV/JSON formats
- **Advanced Analysis**: Improved pattern detection algorithms and machine learning integration
- **Multi-Currency Support**: Expand beyond Bitcoin to other cryptocurrencies
- **User Accounts**: Save search history and receive alerts

## API Token

This application uses the BlockCypher API 
Copy backend/.env.example to backend/.env and add your own BlockCypher API token.

In a production environment, this should be stored as an environment variable for better security.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details. 