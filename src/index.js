import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Greeting () {
    return <div>
    <h1>Este es un componente</h1>;
    <p>Lorem input</p>
    </div>
}

root.render(<div>

    <App />
    </div>
)