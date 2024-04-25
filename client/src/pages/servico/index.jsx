import { useState, useEffect, useRef, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
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
  const { id } = useParams();
  const navigate = useNavigate()

  const refLoading = useRef(false)
  const [data, setData] = useState({ cadeira: {}, servico: {} });
  const [dia, setDia] = useState(new Date().getDate());
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [horaSelecionada, setHoraSelecionada] = useState(null);

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

  const calendario = calendarioFunction(mes, ano);

  return <div className='body'>
    <div>
      <button
        type='button'
        onClick={() => navigate(`/cadeira/${data.cadeira.id}`)}
      >
        Voltar
      </button>
    </div>
    <h1>{data.cadeira.nome}</h1>
    <div>
      <span>{data.servico.nome}</span>
      <span>{formatMoeda(data.servico.preco)}</span>
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
      {Object.keys(data.cadeira).map(hora => {
        if (data.cadeira[hora] === 1 && (hora !== 'id' && hora !== 'folga')) {
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
  </div>
}

export default Servico;

// barbeiro
//Dia de folga da cadeira Select
//checkbox para marcar a hora que trabalha

//agendamento/:cadeiraID/:dia/:mes/:ano
//servico/:id retornar horas de trabalho e dia de folga