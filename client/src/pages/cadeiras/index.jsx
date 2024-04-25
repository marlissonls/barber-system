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
    <div className='flex-column align-center'>
      <h3 className='page-title'>Selecione uma cadeira</h3>
      <h3 className='page-title'>e agende um horário</h3>
    </div>
    <div className='flex-column gap-30 align-center' style={{marginTop: '50px'}}>
      {data.map(item => <div className='cadeira-box flex-column gap-20 align-center justify-center' key={item.id}>
        <h3>{item.nome}</h3>
        <button
          className='selection-btn'
          type='button'
          onClick={() => {
            navigate(`/cadeira/${item.id}`)
          }}
        >
          Ver Perfil
        </button>
      </div>)}
    </div>
  </div>
}

export default Cadeiras;