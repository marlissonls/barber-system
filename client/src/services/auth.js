import api from "./api";

const TOKEN = "@TOKEN";
const ID = "@ID";
const USERNAME = "@USERNAME";
const PHONE = "@PHONE"
const EMAIL = "@EMAIL";
const TIPO = "@TIPO";
const PHOTO = "@PHOTO";
const POSITION = "@POSITION";

function get_token() {
    return localStorage.getItem(TOKEN)
}
function set_token(tk) {
    localStorage.setItem(TOKEN, tk)
}

function get_id() {
    return localStorage.getItem(ID)
}
function set_id(id) {
    localStorage.setItem(ID, id)
}

function get_username() {
    return localStorage.getItem(USERNAME)
}
function set_username(un) {
    localStorage.setItem(USERNAME, un)
}

function get_telefone() {
    return localStorage.getItem(PHONE)
}
function set_telefone(ph) {
    localStorage.setItem(PHONE, ph)
}

function get_email() {
    return localStorage.getItem(EMAIL)
}
function set_email(em) {
    localStorage.setItem(EMAIL, em)
}

function get_tipo() {
    return localStorage.getItem(TIPO)
}
function set_tipo(rl) {
    localStorage.setItem(TIPO, rl)
}

function get_photo_url() {
    return localStorage.getItem(PHOTO)
}
function set_photo_url(pf) {
    localStorage.setItem(PHOTO, pf)
}

function get_position() {
    return localStorage.getItem(POSITION)
}
function set_position(pt) {
    localStorage.setItem(POSITION, pt)
}

function isAuthenticated() {
    if (get_token()) return true;
    return false;
}

async function isCliente() {
    try {
        const response = await api.get(`/verifica-tipo`);
        return response.data.payload.tipo === 'cliente';
    } catch (error) {
        console.error('Erro ao verificar tipo de cliente:', error);
        return false;
    }
}

async function isBarbeiro() {
    try {
        const response = await api.get(`/verifica-tipo`);
        return response.data.payload.tipo === 'barbeiro';
    } catch (error) {
        console.error('Erro ao verificar tipo de barbeiro:', error);
        return false;
    }
}

async function isAdmin() {
    try {
        const response = await api.get(`/verifica-tipo`);
        return response.data.payload.tipo === 'gerente';
    } catch (error) {
        console.error('Erro ao verificar tipo de admin:', error);
        return false;
    }
}


function logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ID);
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(PHONE);
    localStorage.removeItem(EMAIL);
    localStorage.removeItem(TIPO);
}

export {
    get_token, 
    set_token, 
    get_email, 
    set_email,
    get_username,
    set_username,
    get_telefone,
    set_telefone,
    get_id,
    set_id,
    get_tipo,
    set_tipo,
    get_photo_url,
    set_photo_url,
    get_position,
    set_position,
    isAuthenticated,
    isCliente,
    isBarbeiro,
    isAdmin,
    logout,
}