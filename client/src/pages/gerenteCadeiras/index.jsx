import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import RodapeGerente from "../../components/rodapeGerente";

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
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}, autoHideDuration: 2000 });
  }

  useEffect(() => {
    async function fetchCadeirasInfo() {
      if (!refLoading.current) {
        refLoading.current = true;
        try {
          const resData = await getCadeirasInfo();
          setData(resData);
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
    <div className='flex-column align-center'>
      <h2 className='page-title'>Agendas por cadeira</h2>
    </div>
    <div className='flex-column gap-30 align-center'>
      {data.map(item => <div className='cadeira-box flex-column gap-20 align-center justify-center' key={item.id}>
        <h3>{item.nome}</h3>
        <button
          className='selection-btn'
          type='button'
          onClick={() => navigate(`/gerente/cadeira/${item.id}`)}
        >
          Ver Agenda
        </button>
      </div>)}
    </div>
    <RodapeGerente />
  </div>
}

export default Cadeiras;