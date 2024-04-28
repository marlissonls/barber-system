import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import api from "../../services/api";
import RodapeCadeira from "../../components/rodapeCadeira";

async function getCadeiraInfo() {
    const response = await api.get(`/cadeira`)
    return response.data.cadeira
}

async function mudarStatusCadeira(status) {
    try {
        const response = await api.put(`/cadeira`, { status: status });
        return response.data;
    } catch (error) {
        console.error("Erro ao desativar cadeira:", error);
        throw error;
    }
}

async function handleHorario(horario) {
    try {
        const response = await api.put(`/cadeira`, { horario })
        return response.data;
    } catch (error) {
        console.error("Erro ao mudar horario:", error);
        throw error;
    }
}

function CadeiraConfigs() {
    const { enqueueSnackbar } = useSnackbar();

    function messageError(message) {
        enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'}, autoHideDuration: 2000});
    }

    function messageSuccess(message) {
        enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'}, autoHideDuration: 1500});
    }

    const [cadeira, setCadeira] = useState({});

    const refLoading = useRef(false)

    async function fetchCadeiraInfo() {
        if (!refLoading.current) {
          refLoading.current = true;
          try {
            const cadeira = await getCadeiraInfo();
            setCadeira(cadeira)
          } catch (error) {
            messageError('Erro ao carregar dados.')
          } finally {
            refLoading.current = false;
          }
        }
    }

    useEffect(() => {
        fetchCadeiraInfo()
    }, []);

    const handleMudarStatus = async () => {
        const novoStatus = cadeira.status === 'livre' ? 'ocupado' : 'livre'
        try {
            const resData = await mudarStatusCadeira(novoStatus);
            if (resData.status) messageSuccess(resData.message)
            else messageError(resData.message)
            fetchCadeiraInfo()
        } catch (error) {
            console.error(error)
        }
    };

    const handleSelecionarHorarios = async (horario) => {
        try {
            const resData = await handleHorario(horario);
            if (resData.status) messageSuccess(resData.message)
            else messageError(resData.message)
            fetchCadeiraInfo()
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="body flex-column gap-20">
            <h4 className='cadeira-title-config'>Habilitar/Desabilitar Cadeira</h4>
            <div className='ativar-cadeira-box flex-row align-center gap-20'>
                <input
                    className='checkbox-cadeira'
                    type="checkbox"
                    checked={cadeira.status === 'livre' ? true : false}
                    onChange={handleMudarStatus}
                />
                <label>{cadeira.status === 'livre' ? "Sua cadeira está disponível." : "Sua cadeira está invisível aos clientes."}</label>
            </div>
            <h4 className='cadeira-title-config'>Selecionar horários de trabalho</h4>
            <div className='selecionar-horarios-box flex-wrap justify-center'>
                {Object.keys(cadeira).filter(hora => hora.includes('hora')).map(hora => (
                    <div key={hora} className='flex-row align-center gap-5'>
                        <input
                            className='checkbox-horario'
                            type="checkbox"
                            checked={cadeira[hora]}
                            onChange={() => handleSelecionarHorarios(hora)}
                        />
                        <label>{hora.length === 6 ? hora.replace('hora', '') + 'h' : '0' + hora.replace('hora', '') + 'h'}</label>
                    </div>
                ))}
            </div>
            <RodapeCadeira />
        </div>
    );
}

export default CadeiraConfigs;
