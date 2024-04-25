import { useState, useEffect, useRef } from 'react'
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChartColumn, faEye, faEdit, faX} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { get_company_id } from '../../services/auth';
import { validateCardInputs } from "../../services/validateFields";
import api from '../../services/api';
import { useParams, useNavigate } from "react-router-dom";

async function getCadeiraInfo(id) {
  const response = await api.get(`/cadeira/${id}`)
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

function Cadeira(props) {

  const { id } = useParams();
  const navigate = useNavigate()

  const refLoading = useRef(false)
  const [data, setData] = useState({cadeira: {}, servicos: []});

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}});
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'}});
  }

  useEffect(() => {
    async function fetchCadeirasInfo() {
      if (id) {
        if (!refLoading.current) {
          refLoading.current = true;
          try {
            const reqData = await getCadeiraInfo(id);
            setData(reqData);
          } catch (error) {
            messageError('Erro ao carregar dados.')
          } finally {
            refLoading.current = false;
          }
        }
      }
    }

    fetchCadeirasInfo()
  }, [id]);
 
  return <div className='body flex-column gap-30'>
      <div className='cadeira-servicos flex-column gap-20 justify-center align-center'>
        <h2>{data.cadeira.nome}</h2>
        <h3>Serviços:</h3>
      </div>
      <div className='servicos-list flex-column gap-20'>
      {data.servicos.length > 0 ? (
        data.servicos.map(item => <div className='flex-row justify-space-btw' key={item.id}>
            <div style={{width: '70%', paddingLeft: '10px'}}>
              <p>{item.nome}</p>
              <p>{formatMoeda(item.preco)}</p>
            </div>
            <button
              className='selection-btn-2'
              type='button'
              onClick={() => navigate(`/servico/${item.id}`)}
            >
              Agendar
            </button>
          </div>
        )
      ) : (
        <p>Nenhum serviço disponível no momento.</p>
      )}
    </div>
    <div>
      <button className='button w100' type='button' onClick={() => navigate(`/cadeiras`)}>Voltar</button>
    </div>
  </div>
}

export default Cadeira;