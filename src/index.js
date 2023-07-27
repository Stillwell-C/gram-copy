import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatContextProvider } from "./context/chatContext";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthContextProvider>
          <ChatContextProvider>
            <Routes>
              <Route path='/*' element={<App />} />
            </Routes>
          </ChatContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
