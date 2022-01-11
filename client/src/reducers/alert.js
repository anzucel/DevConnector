import {SET_ALERT, REMOVE_ALERT} from '../actions/types' 
//reducer

// alert
const initialState = [
   /*  {   
        id: 1,
        msg: 'Please Log in',
        alertType: 'success'
    } */
];

export default function(state = initialState, action){
    const {type, payload} = action;

    switch(type){
        case SET_ALERT:
            return [...state, payload]; // add the alert to the state
        case REMOVE_ALERT:
            //remove by id
            return state.filter(alert => alert.id !== payload); //payload in this case is ID 
        default:
            return state;
    }
}