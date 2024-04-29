import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { get_id } from "../../services/auth";
import { formatMoeda, formatData, formatHora } from '../../services/formaters';
import api from "../../services/api";
import Rodape from "../../components/rodapeCadeira";

function habilitaConclusaoServico(timestamp) {
  return new Date() > new Date(timestamp)
}

async function getAgendamentos(cadeiraId) {
    const response = await api.get(`/agendamento/gerente/${cadeiraId}`)
    return response.data
  }

function GerenteCadeiraAgendamentos(props) {
  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}, autoHideDuration: 2000 });
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'}, autoHideDuration: 2000 });
  }

  const refLoading = useRef(false)
  const [data, setData] = useState([]);

  async function fetchAgendamentosData(cadeiraId) {
    try {
      const response = await getAgendamentos(cadeiraId);
      if (response.status) {
        setData(response.data);
      } else {
        messageError(response.message)
        setData(false)
      }
    } catch (error) {
      messageError('Falha ao buscar dados.')
    } finally {
      refLoading.current = false;
    }
  }

  const { cadeiraId } = useParams();

  useEffect(() => {
    if (!refLoading.current) {
      refLoading.current = true;
      fetchAgendamentosData(cadeiraId);
    }
  }, [cadeiraId]);

  async function handleConcluirServico(id) {
    const response = await api.put(`/agendamento/concluir/${id}`)
    
    if (response.data.status) {
      const user_id = get_id();
      if (user_id === "null") return;

      if (!refLoading.current) {
        refLoading.current = true;
        fetchAgendamentosData(user_id);
      } 
      messageSuccess(response.data.message)
    } else messageError(response.data.message)
  }

  async function handleCancelarServico(id) {
    const response = await api.put(`/agendamento/cancelar/${id}`)
    
    if (response.data.status) {
      const user_id = get_id();
      if (user_id === "null") return;

      if (!refLoading.current) {
        refLoading.current = true;
        fetchAgendamentosData(user_id);
      } 
      messageSuccess(response.data.message)
    } else messageError(response.data.message)
  }

  return (
    <div className='body flex-column justify-left gap-20'>
      <h2 className='agendamentos-title flex-row justify-center align-center'>Agenda {data.length > 0 ? data[0].nome_cadeira : ''}</h2>
      <div className='adendamentos-body flex-column gap-20'>
      {data ? (
        data.map(agendamento => (
          <div 
            className='agendamento-box flex-column gap-10' 
            key={agendamento.id}
          >
            <div className='cadeira-title flex-row justify-center'>{agendamento.nome_usuario}</div>
            <div className='flex-row justify-space-btw'><span>{agendamento.nome_servico}</span><span>{formatMoeda(agendamento.preco_servico)}</span></div>
            <div className='flex-row justify-space-btw'><span>Agendado para: </span><span>{formatData(agendamento.data)} {formatHora(agendamento.hora)}</span></div>
            <div className='flex-row justify-center'>Status: {agendamento.status}</div>
          </div>
        ))
      ) : (
        <div>Carregando...</div>
      )}
      </div>
      <Rodape />
    </div>
  );
}

export default GerenteCadeiraAgendamentos;



// async function handleGetAgenda(cadeiraId) {
//     try{
//         const response = await api.get(`/agendamentos/${cadeiraId}`)
//     } catch (err) {
//         console.error(err)
//     }
//   }
