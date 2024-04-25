import { useState, useEffect, useRef, } from 'react';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { get_id } from '../../services/auth';
import api from '../../services/api';

async function getServicoInfo(id) {
  const response = await api.get(`/servico/${id}`)
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

function diasNoMes (mes, ano) {
  const data = new Date(ano, mes, 0)
  return data.getDate()
}

function calendarioFunction(mes, ano) {
  const numDiasMes = diasNoMes(mes+1, ano)
  const primeiroDiaMes = new Date()

  primeiroDiaMes.setDate(1)
  primeiroDiaMes.setMonth(mes)
  primeiroDiaMes.setFullYear(ano)

  const diaSemana = primeiroDiaMes.getDay()
  const numDias = numDiasMes - (7 - diaSemana)
  const numLinhas = parseInt(numDias/7, 10)

  let diaAtual = 0;
  let dias = [];

  let provisorio = [];

  for (let i = 0; i < 7; i++) {
    if (i < diaSemana) {
      provisorio.push(0)
    } else {
      diaAtual++
      provisorio.push(diaAtual)
    }
  }

  dias.push(provisorio)

  for (let i = 0; i < numLinhas; i++) {
    const provisorio = []
    for (let j = 0; j < 7; j++) {
      diaAtual++
      provisorio.push(diaAtual)
    }
    dias.push(provisorio)
  }

  provisorio = []
  for (let i = 0; i < 7; i++) {
    if (diaAtual > numDiasMes-1) {
      provisorio.push(0)
    } else {
      diaAtual++
      provisorio.push(diaAtual)
    }
  }

  dias.push(provisorio)

  return dias
}

const meses = {
  0: 'Jan',
  1: 'Fev',
  2: 'Mar',
  3: 'Abr',
  4: 'Mai',
  5: 'Jun',
  6: 'Jul',
  7: 'Ago',
  8: 'Set',
  9: 'Out',
  10: 'Nov',
  11: 'Dez'
};

function Servico(props) {
  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}});
  }
  
  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'}});
  }

  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();
  const navigate = useNavigate();

  const refLoading = useRef(false)
  const [resData, setResData] = useState({ cadeira: {}, servico: {} });
  const [dia, setDia] = useState(new Date().getDate());
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  const calendario = calendarioFunction(mes, ano);

  useEffect(() => {
    async function fetchServicoInfo() {
      if (id) {
        if (!refLoading.current) {
          refLoading.current = true;
          try {
            const reqData = await getServicoInfo(id);
            setResData(reqData);
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

  async function handleFinalizarAgendamento() {
    if (horaSelecionada === null) return messageError('Selecione um dia e horário.');

    const dataSelecionada = new Date(ano, mes, dia);
    const dataTimestamp = dataSelecionada.getTime();

    const agendamento = {
      usuario_id: parseInt(get_id()),
      cadeira_id: resData.cadeira.id,
      servico_id: resData.servico.id,
      data: dataTimestamp,
      hora: parseInt(horaSelecionada.target.innerText.replace('h',''), 10)
    }

    const response = await api.post(`/agendamento`, agendamento)

    if (response.data.status) {
      messageSuccess(response.data.message);
      // redirect('/agendamentos')
    } else {
      messageError(response.data.message);
    }
  }

  return <div className='body'>
    <h1>{resData.cadeira.nome}</h1>
    <div>
      <span>{resData.servico.nome}</span>
      <span>{formatMoeda(resData.servico.preco)}</span>
    </div>
    <div class='mes-slider'>
      <button
        type='button'
        onClick={() => {
          if(mes <= 0) {
            setMes(11)
            setAno(ano-1)
          } else {
            setMes(mes-1)
          }
          setDia(1)
        }}
      >
        anterior
      </button>
      <span>{`${meses[mes]} ${ano}`}</span>
      <button
        type='button'
        onClick={() => {
          let mes2 = mes+1;
          if(mes2 >= 12) {
            setMes(0)
            setAno(ano+1)
          } else {
            setMes(mes+1)
          }
          setDia(1)
        }}
      >
        próximo
      </button>
    </div>
    <div className='calendario-box'>
      <table>
        <tr>
          <th>Dom</th>
          <th>Seg</th>
          <th>Ter</th>
          <th>Qua</th>
          <th>Qui</th>
          <th>Sex</th>
          <th>Sáb</th>
        </tr>
        {calendario.map(item => <tr>{item.map(item2 => {
          if (item2 === 0) return <td></td>
          else return <td className={dia === item2 ? 'dia-selecionado' : 'dia-normal'} onClick={() => {setDia(item2)}}>{item2}</td>
        })}</tr>)}
      </table>
    </div>
    <div className='horas-box'>
      {Object.keys(resData.cadeira).map(hora => {
        if (resData.cadeira[hora] === 1 && (hora !== 'id' && hora !== 'folga')) {
          const horaFormatada = hora.length === 6 ? hora.replace('hora', '')+'h' : '0'+hora.replace('hora', '')+'h';
          return (
            <div 
              key={hora}
              className={`vha-center ${horaSelecionada !== null && horaFormatada === horaSelecionada.target.innerText ? 'hora-selecionada hora-normal' : 'hora-normal'}`}
              onClick={(hora) => setHoraSelecionada(hora)}
            >
              {horaFormatada}
            </div>
          );
        }
        return null;
      })}
    </div>
    <div>
      <button
        type='button'
        className='button w100'
        onClick={() => handleFinalizarAgendamento(`/cadeira/${resData.cadeira.id}`)}
      >
        Finalizar agendamento
      </button>
    </div>
    <div>
      <button
        type='button'
        className='button w100'
        onClick={() => navigate(`/cadeira/${resData.cadeira.id}`)}
      >
        Voltar
      </button>
    </div>
  </div>
}

export default Servico;

// barbeiro
//Dia de folga da cadeira Select
//checkbox para marcar a hora que trabalha

//agendamento/:cadeiraID/:dia/:mes/:ano
//servico/:id retornar horas de trabalho e dia de folga