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

function DashboardCards(props) {

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
 
  return <div className='body'>
    <div>
      <button
        type='button'
        onClick={() => navigate(`/cadeiras`)}
      >
        Voltar</button>
    </div>
    <h1>{data.cadeira.nome}</h1>
    <h2>Lista de serviços</h2>
    <div>
      {data.servicos.map(item => {
        return <div key={item.id}>
          <p>{item.nome}</p>
          <p>{item.preco}</p>
          <button
            type='button'
            onClick={() => navigate(`/servico/${item.id}`)}
          >
            Agendar
          </button>
        </div>
      })}
    </div>
  </div>
}

export default DashboardCards;