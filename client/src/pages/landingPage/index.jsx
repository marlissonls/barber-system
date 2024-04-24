import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { validateName, validateTelefone, validateEmail, validatePassword } from '../../services/validateFields';
import { set_token, set_id, set_username, set_telefone, set_email, } from '../../services/auth';
import api from '../../services/api';

function LandingPage(props) {

  const { enqueueSnackbar } = useSnackbar();

  function messageError(message) {
    enqueueSnackbar(message, { variant: "error", style: {fontFamily: 'Arial'} });
  }

  function messageSuccess(message) {
    enqueueSnackbar(message, { variant: "success", style: {fontFamily: 'Arial'} });
  }

  /////////////////////////////
  // HANDLE MODAL CHANGING

  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  const handleLoginForm = () => {
    if (isLoginFormVisible) {
      setIsLoginFormVisible(false)
    } else {
      setIsLoginFormVisible(true)
    }
  }

  const handleResgiterForm = () => {
    if (isRegisterFormVisible) {
      setIsRegisterFormVisible (false)
    } else {
      setIsRegisterFormVisible (true)
    }
  }

  /////////////////////////////
  // SHOW LOGIN FORM

  const [identificador, setIdenficador] = useState(''); // identificador = email ou telefone
  const [password, setPassword] = useState('');

  function getLoginInputErrors() {
    const errors = []
    // errors[0] = validateEmail(identificador)
    // errors[1] = validatePassword(password)
    errors[0] = validatePassword(password)
    return errors
  }

  const loginErrors = getLoginInputErrors()
  const hasLoginErrors = loginErrors.some((item) => item !== "")

  const navigate = useNavigate();

  async function handleLoginSubmit(e) {
    e.preventDefault();

    const response = await api.post(`/login`, {
      identificador: identificador, senha: password
    })
    console.log(response.data)
    if (response.data.status) {
      messageSuccess(response.data.message)
      set_token(response.data.usuario.token)
      set_id(response.data.usuario.id)
      set_username(response.data.usuario.nome)
      set_telefone(response.data.usuario.telefone)
      set_email(response.data.usuario.email)
      if (response.data.usuario.tipo === 'cliente') {
        navigate('/cadeiras')
      } else {
        navigate('/admin')
      }
    } else {
      messageError(response.data.message)
    }
  }


  /////////////////////////////
  // SHOW REGISTER USER FORM

  const [username, setUsername] = useState('');
  const [registerTelefone, setRegisterTelefone] = useState('')
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  function getRegisterInputErrors() {
    const errors = [];
    errors[0] = validateName(username);
    errors[1] = validateEmail(registerEmail);
    errors[2] = validateTelefone(registerTelefone);
    errors[3] = validatePassword(registerPassword);
    return errors;
  }
  
  const registerErrors = getRegisterInputErrors();
  const hasRegisterErrors = registerErrors.some((item) => item !== '');

  async function handleRegisterSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', username);
    formData.append('telefone', registerTelefone);
    formData.append('email', registerEmail);
    formData.append('password', registerPassword);

    const response = await api.post(`/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.status) {
      messageSuccess(response.data.message);
      handleResgiterForm()
      handleLoginForm();
    } else {
      messageError(response.data.message);
    }
  }

  /////////////////////////////

  return <div className='body'>
    <div className='profile-container-topbar'>
      {isLoginFormVisible && <form className='user-form' onSubmit={handleLoginSubmit}>
        <h3 className='form-title'>Entre</h3>

        <input
          className="input"
          type="text"
          placeholder="Email ou Telefone"
          value={identificador || ""}
          onChange={(e) => setIdenficador(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className='button-container'>
          <button
            className='button submit-button'
            type="submit" 
            disabled={hasLoginErrors || identificador === '' || password === ''}>
            Entrar
          </button>

          <button
            className='button return-button'
            onClick={() => {handleLoginForm(); handleResgiterForm()}}
          >
            Cadastre-se
          </button>
        </div>

        {(loginErrors[0] && <div className="error-message">{loginErrors[0]}</div>) || 
        (loginErrors[1] && <div className="error-message">{loginErrors[1]}</div>) ||
        ((identificador === '' || password === '') && <div className="error-message">Há campos vazios</div>)}
      </form>}

      {isRegisterFormVisible && <form className='user-form' onSubmit={handleRegisterSubmit}>
        <h3 className='form-title'>Cadastre-se</h3>

        <input
          className="input"
          type="text"
          placeholder="Nome"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Telefone"
          value={registerTelefone || ""}
          onChange={(e) => setRegisterTelefone(e.target.value)}
        />
        
        <input
          className="input"
          type="text"
          placeholder="E-mail"
          value={registerEmail || ""}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={registerPassword || ""}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />

        <div className='button-container'>
          <button 
            className='button submit-button' 
            type='submit'
            disabled={hasRegisterErrors || username === '' || registerEmail === '' || registerPassword === ''}
          >
            Registrar
          </button>
          <button
            className='button return-button'
            onClick={() => {handleResgiterForm(); handleLoginForm()}}
          >
            Entre
          </button>
        </div>
        
        {(registerErrors[0] && <div className="error-message">{registerErrors[0]}</div>) || 
        (registerErrors[1] && <div className="error-message">{registerErrors[1]}</div>) ||
        (registerErrors[2] && <div className="error-message">{registerErrors[2]}</div>) ||
        ((username === '' || registerTelefone === '' || registerEmail === '' || registerPassword === '') && <div className="error-message">Há campos vazios</div>)}
      </form>}
    </div>
  </div>
}

export default LandingPage;