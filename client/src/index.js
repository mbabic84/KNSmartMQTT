import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.querySelector("#App");

import App from './App';
import './App.css';

const root = createRoot(container);
root.render(<App />);