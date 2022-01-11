//import uuid from 'uuid';
import {v4 as uuidv4} from 'uuid'

import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType) => dispatch => { //action
    const id = uuidv4();

    dispatch({ //envía el tipo de alerta:
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000);
}