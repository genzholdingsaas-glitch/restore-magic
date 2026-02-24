import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestoreFlowProvider } from "@/context/RestoreFlowContext";
import BottomNav from "@/components/BottomNav";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RestoreUpload from "./pages/RestoreUpload";
import RestoreForm from "./pages/RestoreForm";
import DiscountOffer from "./pages/DiscountOffer";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import OrdersHistory from "./pages/OrdersHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RestoreFlowProvider>
        <BrowserRouter>
          <div className="mx-auto max-w-lg min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/restore" element={<RestoreUpload />} />
              <Route path="/restore/form" element={<RestoreForm />} />
              <Route path="/restore/offer" element={<DiscountOffer />} />
              <Route path="/restore/processing" element={<Processing />} />
              <Route path="/restore/result" element={<Result />} />
              <Route path="/history" element={<OrdersHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </RestoreFlowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
