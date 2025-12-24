import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import CourseDetails from "./pages/CourseDetails";
import ProfilePage from "./pages/ProfilePage";
import CdaxBusinessDemo from "./pages/CdaxBusinessDemo";
import TechOnCdax from "./pages/techoncdax";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={Home} />
      <Route path="/course/:id" component={CourseDetails} />
      <Route path="/profile" component={ProfilePage} />
      {/* Redirect any unknown route to auth if not logged in (for mockup we can just have separate routes) */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Simple mock auth check - in a real app use a proper context
  // For this prototype, we'll default to showing the auth page if they visit the root
  // But since wouter is simple, let's just redirect / to /auth initially 
  // or let the user navigate. 
  // Actually, the prompt says "First ask to login or register".
  // So let's make / redirect to /auth for the demo flow, 
  // and AuthPage will redirect to /home (which I'll map to a new route or keep as /)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          {/* Default to Auth Page for the "First ask" requirement */}
          <Route path="/auth" component={AuthPage} />
          <Route path="/home" component={Home} />
          <Route path="/course/:id" component={CourseDetails} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/cdax-business-demo" component={CdaxBusinessDemo} />
          <Route path="/tech-on-cdax" component={TechOnCdax} />
          <Route path="/" >
            <Redirect to="/auth" />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
