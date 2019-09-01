import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventPage from "./pages/Event";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };
  return (
    <BrowserRouter className="App">
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/auth" to="/events" exact />}
            {token && <Redirect from="/" to="/events" exact />}
            {!token && <Route path="/auth" component={AuthPage} />}
            {token && <Route path="/events" component={EventPage} />}
            {token && <Route path="/bookings" component={BookingPage} />}
            {!token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
