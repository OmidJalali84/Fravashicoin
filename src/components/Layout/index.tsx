import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3Provider } from "../../modules/web3";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  const queryClient = new QueryClient();

  return (
    <Web3Provider>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col h-screen justify-between">
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </div>

        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </QueryClientProvider>
    </Web3Provider>
  );
}
