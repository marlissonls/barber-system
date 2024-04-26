import React from 'react';
import { SnackbarProvider } from 'notistack';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import Cadeiras from "./pages/cadeiras";
import Cadeira from "./pages/cadeira";
import Servico from "./pages/servico";
import Agendamentos from "./pages/agendamentos";
import AgendamentosCadeira from "./pages/agendamentosCadeira";
import { isBarbeiro, isAuthenticated } from "./services/auth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        loader: async () => {
        if (isAuthenticated() && !isBarbeiro()) throw new redirect("/cadeiras");
        if (isAuthenticated() && isBarbeiro()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/cadeiras",
        element: <Cadeiras />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (isBarbeiro()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/cadeira/:id",
        element: <Cadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (isBarbeiro()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/servico/:id",
        element: <Servico />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (isBarbeiro()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/agendamentos",
        element: <Agendamentos />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (isBarbeiro()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/barbeiro",
        element: <AgendamentosCadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (!isBarbeiro()) throw new redirect("/cadeiras");
        return {}
        }
    },
]);

function App() {
  return <div>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </div>
}

export default App;
