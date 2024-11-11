import React from 'react';
import { createRoot } from 'react-dom/client';
import HelloReact from './components/HelloReact';
import SymbolicInteractions from './SymbolicInteractions/SymbolicInteractions';
createRoot(document.getElementById('hello-react')).render(<HelloReact />);
createRoot(document.getElementById('symbolic-interactions')).render(<SymbolicInteractions />);