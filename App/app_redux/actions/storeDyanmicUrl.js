export function storeDynamicUrl(data) {
    //console.warn('data', data)
    return dispatch=>{
        dispatch({ type: 'DYNAMIC_URL', data })
    }
               
}