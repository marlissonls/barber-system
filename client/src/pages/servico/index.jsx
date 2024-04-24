import { useState, useEffect, useRef, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import api from '../../services/api';

async function getServicoInfo(id) {
  const response = await api.get(`/servico/${id}`)
  console.log(response.data)
  return response.data
}

function formatMoeda(valor) {
  return valor !== null && valor !== undefined
    ? valor.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      })
    : '';
}

function Servico(props) {
  const { id } = useParams();
  const navigate = useNavigate()

  const refLoading = useRef(false)
  const [data, setData] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}});
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'}});
  }

  useEffect(() => {
    async function fetchServicoInfo() {
      if (id) {
        if (!refLoading.current) {
          refLoading.current = true;
          try {
            const reqData = await getServicoInfo(id);
            setData(reqData);
          } catch (error) {
            messageError('Erro ao carregar dados.')
          } finally {
            refLoading.current = false;
          }
        }
      }
    }

    fetchServicoInfo()
  }, [id]);
 
  return <div className='body'>
    <div>
      <button
        type='button'
        onClick={() => navigate(`/cadeira/${data.cadeira_id}`)}
      >
        Voltar
      </button>
    </div>
    <h1>{data.nome_cadeira}</h1>
    <div>
      <span>{data.nome}</span>
      <span>{formatMoeda(data.preco)}</span>
    </div>
  </div>
  
}

export default Servico;