import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { get_id } from "../../services/auth";
import { formatMoeda, formatData, formatHora } from '../../services/formaters';
import api from "../../services/api";

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

  useEffect(() => {
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

    const user_id = get_id();
    if (user_id === "null") return;

    if (!refLoading.current) {
      refLoading.current = true;
      fetchAgendamentosData(user_id);
    }
  }, []);

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
          </div>
        ))
      ) : (
        <div>Carregando...</div>
      )}
      </div>
      {/* <div>
        <button
            type='button'
            className='button w100'
            onClick={() => navigate(`/cadeiras`)}
        >
          Voltar
        </button>
      </div> */}
    </div>
  );
}

export default AgendamentosCadeira;