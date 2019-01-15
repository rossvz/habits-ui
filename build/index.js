var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import './styles.css';
const API = 'http://localhost:6000';
function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const fetchOrCreateUser = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const { data } = yield axios.get(`${API}/users?email=${email}`);
        if (data && data[0])
            setUser(data[0]);
    });
    return (React.createElement("div", { className: "App" },
        !user && (React.createElement("form", { onSubmit: fetchOrCreateUser },
            React.createElement("input", { type: "text", value: email, onChange: e => setEmail(e.target.value) }),
            React.createElement("button", { type: 'submit' }, "Go"))),
        user && React.createElement("div", null,
            "Welcome ",
            user.name)));
}
const rootElement = document.getElementById('root');
render(React.createElement(App, null), rootElement);
//# sourceMappingURL=index.js.map