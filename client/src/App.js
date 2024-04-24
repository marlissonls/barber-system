import React from 'react';
import { SnackbarProvider } from 'notistack';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import Agendamentos from "./pages/agendamentos";
import Cadeira from "./pages/cadeira";
import Cadeiras from "./pages/cadeiras";
import Servico from "./pages/servico";
import Agendamento from "./pages/agendamento";
import { isAdmin, isAuthenticated } from "./services/auth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        loader: async () => {
        if (isAuthenticated() && !isAdmin()) throw new redirect("/cadeiras");
        if (isAuthenticated() && isAdmin()) throw new redirect("/admin");
        return {}
        }
    },
    {
        path: "/cadeiras",
        element: <Cadeiras />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (isAdmin()) throw new redirect("/admin");
        return {}
        }
    },
    {
        path: "/cadeira/:id",
        element: <Cadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        return {}
        }
    },
    {
        path: "/agendamentos",
        element: <Agendamentos />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        return {}
        }
    },
    {
        path: "/agendamentos/:id",
        element: <Agendamento />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        return {}
        }
    },
    {
        path: "/servico/:id",
        element: <Servico />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        return {}
        }
    }
]);

function App() {
  return <div>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </div>
}

export default App;
