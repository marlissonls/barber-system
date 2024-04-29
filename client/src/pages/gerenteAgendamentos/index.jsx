import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { formatMoeda, formatData, formatHora } from '../../services/formaters';
import api from "../../services/api";
import RodapeGerente from "../../components/rodapeGerente";

async function getAgendamentos(cadeiraId, dia) {
    const response = await api.get(`/agendamento/gerente/${cadeiraId}/${dia}`)
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
  const [diaSelecionadoInicio, setDiaSelecionado] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

  async function fetchAgendamentosData(cadeiraId, dia) {
    try {
      const response = await getAgendamentos(cadeiraId, dia);
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
      if (diaSelecionadoInicio) {
        fetchAgendamentosData(cadeiraId, diaSelecionadoInicio.getTime());
      } else return;
    }
  }, [cadeiraId, diaSelecionadoInicio]);

  return (
    <div className='body flex-column justify-left gap-20'>
      <h2 className='agendamentos-title flex-row justify-center align-center'>Agenda {data.length > 0 ? data[0].nome_cadeira : ''}</h2>
      <div className='input-date-box flex-column align-center gap-10'>
        <label htmlFor="data">Selecione a data:</label>
        <input 
          className='input-date'
          type="date" 
          id="data" 
          name="data" 
          value={diaSelecionadoInicio.toISOString().substr(0, 10)} 
          onChange={(event) => {setDiaSelecionado(new Date(`${event.target.value} `))}} />
      </div>
      <div className='adendamentos-body flex-column gap-20 adendamentos-body'>
      {data.length > 0 ? (
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
        <div className='agendamento-box flex-column gap-10'>Carregando...</div>
      )}
      </div>
      <RodapeGerente />
    </div>
  );
}

export default GerenteCadeiraAgendamentos;