import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatContextProvider } from "./context/chatContext";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <AuthContextProvider>
            <ChatContextProvider>
              <Routes>
                <Route path='/*' element={<App />} />
              </Routes>
              <ReactQueryDevtools />
            </ChatContextProvider>
          </AuthContextProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
