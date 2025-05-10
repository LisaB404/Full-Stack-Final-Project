import { useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import { LibraryProvider } from "./hooks/LibraryContext";

// Lazy import of page components
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./pages/Home/Home"));
const Library = lazy(() => import("./pages/Library/Library"));
const Notes = lazy(() => import("./pages/Notes/Notes"));
const Account = lazy(() => import("./pages/Account/Account"));

function App() {
  const [query, setQuery] = useState("");

  return (
    <LibraryProvider>
      {/* Suspense around routes to handlelazy loading */}{" "}
      <Router>
        {" "}
        <Suspense
          fallback={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              ⏳ Loading...
            </div>
          }
        >
          {" "}
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={<Home query={query} onSearch={setQuery} />}
            />
            <Route path="/library" element={<Library />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Suspense>
      </Router>
    </LibraryProvider>
  );
}

export default App;
