import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { get_id } from "../../services/auth";
import { formatMoeda, formatData, formatHora } from '../../services/formaters';
import api from "../../services/api";

function habilitaConclusaoServico(timestamp) {
  return new Date() > new Date(timestamp)
}

function habilitaCancelarServico(timestamp) {
  return new Date() < new Date(timestamp)
}

async function getAgendamentos(user_id) {
    const response = await api.get(`/agendamento/barbeiro/${user_id}`)
    return response.data
  }

function AgendamentosCadeira(props) {
  const refLoading = useRef(false)
  const [data, setData] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'} });
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'} });
  }

  async function fetchAgendamentosData(user_id) {
    try {
      const response = await getAgendamentos(user_id);
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

  useEffect(() => {
    const user_id = get_id();
    if (user_id === "null") return;

    if (!refLoading.current) {
      refLoading.current = true;
      fetchAgendamentosData(user_id);
    }
  }, []);

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
      <h2 className='agendamentos-title flex-row justify-center align-center'>Agendamentos</h2>
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
            <div className='flex-row justify-center gap-30'>
              {habilitaConclusaoServico(agendamento.data + agendamento.hora * 60 * 60 * 1000) && 
              <button
                type='button'
                className='button2'
                onClick={() => handleConcluirServico(agendamento.id)}
              >
                Concluir
              </button>}
              <button
                type='button'
                className='button2'
                onClick={() => handleCancelarServico(agendamento.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>Carregando...</div>
      )}
      </div>
    </div>
  );
}

export default AgendamentosCadeira;