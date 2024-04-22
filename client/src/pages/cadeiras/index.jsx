import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../services/api";

async function getCadeirasInfo() {
  const response = await api.get(`/cadeiras`)
  return response.data
}

function Cadeiras(props) {
  const refLoading = useRef(false)
  const [data, setData] = useState([]);
  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'} });
  }

  useEffect(() => {
    async function fetchCadeirasInfo() {
      if (!refLoading.current) {
        refLoading.current = true;
        try {
          const reqData = await getCadeirasInfo();
          setData(reqData);
        } catch (error) {
          messageError('Erro ao carregar dados.')
        } finally {
          refLoading.current = false;
        }
      }
    }

    fetchCadeirasInfo()
  }, []);

  return <div className='body'>
    <h1>Cadeiras Disponíveis</h1>
    <div>
      {data.map(item => <div>
        <h3>{item.nome}</h3>
        <button
          type='button'
          onClick={() => {
            navigate(`/cadeira/${item.id}`)
          }}
        >
          Ver perfil
        </button>
      </div>)}
    </div>
  </div>
}

export default Cadeiras;