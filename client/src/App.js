import { SnackbarProvider } from 'notistack';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import Cadeiras from "./pages/cadeiras";
import Cadeira from "./pages/cadeira";
import Servico from "./pages/servico";
import Agendamentos from "./pages/agendamentos";
import AgendamentosCadeira from "./pages/agendamentosCadeira";
import CadeiraConfigs from "./pages/CadeiraConfigs";
import { isAuthenticated, isCliente, isBarbeiro, isAdmin } from "./services/auth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        loader: async () => {
        if (isAuthenticated() && await isCliente()) throw new redirect("/cadeiras");
        if (isAuthenticated() && await isBarbeiro()) throw new redirect("/barbeiro");
        if (isAuthenticated() && await isAdmin()) throw new redirect("/barbeiro");
        return {}
        }
    },
    {
        path: "/cadeiras",
        element: <Cadeiras />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isBarbeiro()) throw new redirect("/barbeiro");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/cadeira/:id",
        element: <Cadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isBarbeiro()) throw new redirect("/barbeiro");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/servico/:id",
        element: <Servico />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isBarbeiro()) throw new redirect("/barbeiro");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/agendamentos",
        element: <Agendamentos />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isBarbeiro()) throw new redirect("/barbeiro");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/barbeiro",
        element: <AgendamentosCadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isCliente()) throw new redirect("/cadeiras");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/barbeiro/configs",
        element: <CadeiraConfigs />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isCliente()) throw new redirect("/cadeiras");
        if (await isAdmin()) throw new redirect("/gerente");
        return {}
        }
    },
    {
        path: "/gerente",
        element: <AgendamentosCadeira />,
        loader: async () => {
        if (!isAuthenticated()) throw new redirect("/");
        if (await isCliente()) throw new redirect("/cadeiras");
        if (await isBarbeiro()) throw new redirect("/barbeiro");
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
