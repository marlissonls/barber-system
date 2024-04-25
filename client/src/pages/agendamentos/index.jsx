import { useState, useEffect, useRef } from "react";
import { useNavigate} from 'react-router-dom';
import { useSnackbar } from "notistack";
import { get_id } from "../../services/auth";
import api from "../../services/api";

async function getAgendamentos(user_id) {
  const response = await api.get(`/agendamento/${user_id}`)
  return response.data
}

const formatMoeda = (valor) => {
  return valor !== null && valor !== undefined
    ? valor.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      })
    : '';
}

const formatData = (times) => {
  const data = new Date(times)
  return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`
}

const formatHora = (hora) => {
  return `Às ${hora}:00`
}

function Agendamentos() {
  const refLoading = useRef(false)
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'} });
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'} });
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
    console.log(user_id)
    if (!refLoading.current) {
      refLoading.current = true;
      fetchAgendamentosData(user_id);
    }
  }, []);

  return (
    <div className='body'>
      <h2>Agendamentos</h2>
      <div className='adendamentos-body flex-column  gap-20'>
      {data ? (
        data.map(agendamento => (
          <div className='agendamento-box flex-column align-center gap-10' key={agendamento.id}>
            <div>{agendamento.nome_cadeira}</div>
            <div>{agendamento.nome_servico} {formatMoeda(agendamento.preco_servico)}</div>
            <div>{formatData(agendamento.data)} {formatHora(agendamento.hora)}</div>
          </div>
        ))
      ) : (
        <div>Carregando...</div>
      )}
      </div>
      <div>
        <button
            type='button'
            className='button w100'
            onClick={() => navigate(`/cadeiras`)}
        >
          Voltar
        </button>
    </div>
    </div>
  );
}

export default Agendamentos;