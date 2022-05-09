import {combineReducers,createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import SaveProfileReducer from '../reducers/SaveProfileReducer';
import SaveLocationReducer from '../reducers/SaveLocationReducer';
import SaveNotificationReducer from '../reducers/SaveNotificationReducer';
import SaveDynamicUrl from '../reducers/saveDynamicUrl';
const rootReducer = combineReducers({
    SaveProfileReducer,
    SaveLocationReducer,
    SaveDynamicUrl,
    SaveNotificationReducer
});

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
